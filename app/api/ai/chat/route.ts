/**
 * Swarna AI – Streaming Chat API Route
 * POST /api/ai/chat
 *
 * Architecture:
 *  1. Parse + validate request
 *  2. Rate limit check (per IP)
 *  3. Input security firewall (injection/jailbreak detection)
 *  4. Intent classification
 *  5. RAG context building (fetch only relevant data)
 *  6. Groq API call with streaming
 *  7. Output firewall (scan stream for leaks)
 *  8. Stream response to client
 */

import { NextRequest } from "next/server";
import { checkInput, checkRateLimit, checkOutput, logSecurityEvent } from "@/lib/ai/security";
import { classifyIntent } from "@/lib/ai/intent";
import { buildContext } from "@/lib/ai/context-builder";
import { buildSystemMessage } from "@/lib/ai/system-prompt";

export const runtime = "edge";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

const MAX_HISTORY_MESSAGES = 8; // Keep last 8 turns for context
const MAX_USER_MESSAGE_LENGTH = 1000;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatRequestBody {
  messages: ChatMessage[];
  sessionId?: string;
}

// ---------------------------------------------------------------------------
// IP Extraction Helper
// ---------------------------------------------------------------------------

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") || // Cloudflare
    "unknown"
  );
}

// ---------------------------------------------------------------------------
// Route Handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // --- 1. Rate limiting ---
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    logSecurityEvent({
      timestamp: new Date().toISOString(),
      ip,
      type: "rate_limit",
      details: `Rate limit exceeded. Retry after ${rateCheck.retryAfterSeconds}s`,
    });
    return new Response(
      JSON.stringify({
        error: "rate_limited",
        message: `Too many requests. Please wait ${rateCheck.retryAfterSeconds} seconds before trying again.`,
        retryAfterSeconds: rateCheck.retryAfterSeconds,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(rateCheck.retryAfterSeconds ?? 60),
        },
      }
    );
  }

  // --- 2. Parse request body ---
  let body: ChatRequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { messages = [] } = body;

  // Validate messages array
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(
      JSON.stringify({ error: "messages array is required and must not be empty" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Get the latest user message
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUserMessage) {
    return new Response(
      JSON.stringify({ error: "No user message found in messages array" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const userInput = String(lastUserMessage.content).trim();

  // Validate message length
  if (userInput.length > MAX_USER_MESSAGE_LENGTH) {
    return new Response(
      JSON.stringify({
        error: "message_too_long",
        message: "Your message is too long. Please keep questions under 1000 characters.",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // --- 3. Input Security Firewall ---
  const securityCheck = checkInput(userInput);
  if (securityCheck.blocked) {
    logSecurityEvent({
      timestamp: new Date().toISOString(),
      ip,
      type: "injection_attempt",
      input: userInput.slice(0, 200),
      details: securityCheck.reason,
    });

    // Return a streaming-compatible rejection so the UI handles it uniformly
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        const chunk = `data: ${JSON.stringify({ choices: [{ delta: { content: securityCheck.response }, finish_reason: null }] })}\n\n`;
        controller.enqueue(encoder.encode(chunk));
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  // --- 4. Check Groq API Key ---
  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    console.error("[SwarnaAI] GROQ_API_KEY is not configured");
    return new Response(
      JSON.stringify({ error: "AI service is temporarily unavailable." }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  // --- 5. Intent Classification & RAG Context Building ---
  let systemMessageContent: string;
  try {
    const { intents, searchQuery } = classifyIntent(userInput);
    const { context, toolsUsed } = await buildContext(intents, searchQuery);

    console.log(
      `[SwarnaAI] Query: "${userInput.slice(0, 50)}..." | Intents: ${intents.join(", ")} | Tools: ${toolsUsed.join(", ")}`
    );

    systemMessageContent = buildSystemMessage(context);
  } catch (err) {
    console.error("[SwarnaAI] Context building failed:", err);
    // Fall back to system prompt without context on tool failure
    systemMessageContent = buildSystemMessage(
      "Database temporarily unavailable. Answer based on general Rotaract knowledge if possible, or ask the user to try again."
    );
  }

  // --- 6. Build conversation for Groq ---
  // Trim history to prevent token overflow
  const historyMessages = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .slice(-MAX_HISTORY_MESSAGES)
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: String(m.content).slice(0, 1500), // Truncate very long history messages
    }));

  const groqMessages: ChatMessage[] = [
    { role: "system", content: systemMessageContent },
    ...historyMessages,
  ];

  // --- 7. Call Groq API with streaming ---
  let groqResponse: Response;
  try {
    groqResponse = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: groqMessages,
        stream: true,
        temperature: 0.3, // Lower = more factual, less creative
        max_tokens: 1024,
        top_p: 0.9,
      }),
    });
  } catch (err) {
    console.error("[SwarnaAI] Groq API network error:", err);
    return new Response(
      JSON.stringify({ error: "AI service connection failed. Please try again." }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!groqResponse.ok) {
    const errorText = await groqResponse.text().catch(() => "Unknown error");
    console.error(`[SwarnaAI] Groq API error ${groqResponse.status}: ${errorText}`);
    return new Response(
      JSON.stringify({ error: "AI service returned an error. Please try again." }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  // --- 8. Stream the response with output firewall ---
  const encoder = new TextEncoder();
  let fullResponse = "";

  const transformedStream = new ReadableStream({
    async start(controller) {
      const reader = groqResponse.body?.getReader();
      if (!reader) {
        controller.close();
        return;
      }

      const textDecoder = new TextDecoder();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += textDecoder.decode(value, { stream: true });

          // Process SSE lines
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? ""; // Keep incomplete line in buffer

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed === "data: [DONE]") {
              // Pass [DONE] through
              if (trimmed === "data: [DONE]") {
                // Final output firewall check on complete response
                const outputCheck = checkOutput(fullResponse);
                if (!outputCheck.safe) {
                  logSecurityEvent({
                    timestamp: new Date().toISOString(),
                    ip,
                    type: "output_blocked",
                    details: "Output firewall triggered — potential data leakage detected",
                  });
                  // Replace entire stream with safe message
                  const safeChunk = `data: ${JSON.stringify({
                    choices: [{ delta: { content: outputCheck.sanitized }, finish_reason: "stop" }],
                  })}\n\n`;
                  controller.enqueue(encoder.encode(safeChunk));
                }
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
              }
              continue;
            }

            if (!trimmed.startsWith("data: ")) continue;

            const jsonStr = trimmed.slice(6);
            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed?.choices?.[0]?.delta?.content;

              if (content) {
                fullResponse += content;
              }

              // Forward the chunk as-is
              controller.enqueue(encoder.encode(`${trimmed}\n\n`));
            } catch {
              // Malformed SSE chunk — skip
            }
          }
        }
      } catch (err) {
        console.error("[SwarnaAI] Stream processing error:", err);
        controller.error(err);
      } finally {
        reader.releaseLock();
        controller.close();
      }
    },
  });

  return new Response(transformedStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // Prevent Nginx from buffering SSE
    },
  });
}

// Only allow POST
export async function GET() {
  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
}
