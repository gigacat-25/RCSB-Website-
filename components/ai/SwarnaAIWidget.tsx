"use client";

/**
 * Swarna AI – Main Floating Chat Widget
 *
 * A premium, glassmorphism floating chat interface integrated into the RCSB website.
 * Features:
 *  - Floating action button (bottom-right) with Rotaract branding
 *  - Slide-in glassmorphism dark chat panel
 *  - Welcome message with suggested prompts
 *  - Streaming AI responses (SSE)
 *  - Conversation history (client-side, clearable)
 *  - Typing indicator
 *  - Copy response
 *  - Regenerate last response
 *  - Auto-scroll to bottom
 *  - Mobile responsive
 *  - Keyboard accessible (Escape to close, Enter to send)
 *  - z-index above everything except modals
 */

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useId,
} from "react";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import SuggestedPrompts, { NoScrollbarStyle } from "./SuggestedPrompts";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// ---------------------------------------------------------------------------
// Welcome Message
// ---------------------------------------------------------------------------

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: `👋 Hello! I'm **Swarna AI**, the official digital assistant of the **Rotaract Club of Swarna Bengaluru**.

I can help you with:

• Events & upcoming activities
• Projects & initiatives  
• Membership & joining process
• Board Members & leadership
• Club history & background
• Contact information
• FAQs & announcements

Ask me anything about the club!`,
  timestamp: new Date(),
};

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

function generateId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function SwarnaAIWidget() {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUnread, setHasUnread] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatPanelRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const widgetId = useId();

  // Delay widget rendering until loading screen has finished fading out
  useEffect(() => {
    const handleReady = () => {
      setTimeout(() => setIsPageLoaded(true), 600);
    };

    if (document.readyState === "complete") {
      handleReady();
    } else {
      window.addEventListener("load", handleReady);
      return () => window.removeEventListener("load", handleReady);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Auto-scroll
  // ---------------------------------------------------------------------------

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior, block: "end" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom("instant");
    }
  }, [isOpen, scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // ---------------------------------------------------------------------------
  // Focus input when panel opens
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // ---------------------------------------------------------------------------
  // Keyboard: Escape to close
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // ---------------------------------------------------------------------------
  // Stop generation on unmount
  // ---------------------------------------------------------------------------

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Panel open/close
  // ---------------------------------------------------------------------------

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) setHasUnread(false);
      return !prev;
    });
  }, []);

  // ---------------------------------------------------------------------------
  // Send Message
  // ---------------------------------------------------------------------------

  const sendMessage = useCallback(
    async (messageText: string) => {
      const text = messageText.trim();
      if (!text || isLoading) return;

      setError(null);
      setIsLoading(true);
      setIsStreaming(false);

      // Abort any ongoing generation
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      // Add user message
      const userMessage: Message = {
        id: generateId(),
        role: "user",
        content: text,
        timestamp: new Date(),
      };

      // Add placeholder AI message for streaming
      const aiMessageId = generateId();
      const aiMessage: Message = {
        id: aiMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage, aiMessage]);
      setInput("");

      // Build messages array for API (exclude welcome message and empty streaming placeholder)
      const apiMessages = [...messages, userMessage]
        .filter((m) => m.id !== "welcome" && m.content)
        .map((m) => ({ role: m.role, content: m.content }));

      try {
        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(
            data.message || `Request failed with status ${response.status}`
          );
        }

        if (!response.body) throw new Error("No response body");

        // Stream the response
        setIsStreaming(true);
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = "";
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed === "data: [DONE]") continue;
            if (!trimmed.startsWith("data: ")) continue;

            try {
              const jsonStr = trimmed.slice(6);
              const parsed = JSON.parse(jsonStr);
              const delta = parsed?.choices?.[0]?.delta?.content;

              if (delta) {
                fullContent += delta;
                // Update streaming message
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === aiMessageId ? { ...m, content: fullContent } : m
                  )
                );
              }
            } catch {
              // Skip malformed chunks
            }
          }
        }

        // Notify if panel is closed
        if (!isOpen) {
          setHasUnread(true);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          // User cancelled — remove empty AI message
          setMessages((prev) => prev.filter((m) => m.id !== aiMessageId));
          return;
        }

        const errorMsg =
          err instanceof Error
            ? err.message
            : "An unexpected error occurred. Please try again.";

        // Update AI message with error
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMessageId
              ? {
                  ...m,
                  content:
                    "I'm sorry, I encountered an issue processing your request. Please try again in a moment.",
                }
              : m
          )
        );
        setError(errorMsg);
        console.error("[SwarnaAI Widget] Error:", err);
      } finally {
        setIsLoading(false);
        setIsStreaming(false);
      }
    },
    [isLoading, messages, isOpen]
  );

  // ---------------------------------------------------------------------------
  // Regenerate last response
  // ---------------------------------------------------------------------------

  const handleRegenerate = useCallback(() => {
    // Find the last user message
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUserMessage) return;

    // Remove the last AI message
    setMessages((prev) => {
      const lastAiIdx = [...prev].reverse().findIndex((m) => m.role === "assistant");
      if (lastAiIdx === -1) return prev;
      const actualIdx = prev.length - 1 - lastAiIdx;
      return prev.filter((_, i) => i !== actualIdx);
    });

    sendMessage(lastUserMessage.content);
  }, [messages, sendMessage]);

  // ---------------------------------------------------------------------------
  // Submit handler
  // ---------------------------------------------------------------------------

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      sendMessage(input);
    },
    [input, sendMessage]
  );

  // ---------------------------------------------------------------------------
  // Textarea: Enter to send, Shift+Enter for newline
  // ---------------------------------------------------------------------------

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  // Auto-resize textarea
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
      // Reset height then set to scrollHeight
      e.target.style.height = "auto";
      e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
    },
    []
  );

  // ---------------------------------------------------------------------------
  // Clear conversation
  // ---------------------------------------------------------------------------

  const handleClear = useCallback(() => {
    abortControllerRef.current?.abort();
    setMessages([WELCOME_MESSAGE]);
    setError(null);
    setIsLoading(false);
    setIsStreaming(false);
  }, []);

  // ---------------------------------------------------------------------------
  // Stop generation
  // ---------------------------------------------------------------------------

  const handleStop = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsLoading(false);
    setIsStreaming(false);
  }, []);

  // ---------------------------------------------------------------------------
  // Check if can regenerate
  // ---------------------------------------------------------------------------

  const lastMessage = messages[messages.length - 1];
  const canRegenerate =
    !isLoading &&
    lastMessage?.role === "assistant" &&
    lastMessage.id !== "welcome" &&
    messages.some((m) => m.role === "user");

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  if (!isPageLoaded) return null;

  return (
    <>
      <NoScrollbarStyle />

      {/* ============================================================
          FLOATING ACTION BUTTON
      ============================================================ */}
      <div
        className="fixed bottom-6 right-6 z-[9998]"
        style={{ isolation: "isolate" }}
      >
        {/* Unread badge */}
        {hasUnread && !isOpen && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900 z-10" />
        )}

        {/* Pulse ring animation */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-amber-400/20 animate-ping" />
        )}

        <button
          onClick={handleToggle}
          aria-expanded={isOpen}
          aria-controls={`${widgetId}-panel`}
          aria-label={isOpen ? "Close Swarna AI" : "Open Swarna AI"}
          className={`
            relative w-14 h-14 rounded-full
            bg-gradient-to-br from-[#800020] via-[#a0002a] to-[#5a0015]
            shadow-xl shadow-red-900/50
            flex items-center justify-center
            transition-all duration-300 ease-out
            hover:scale-110 hover:shadow-2xl hover:shadow-red-900/60
            focus:outline-none focus:ring-2 focus:ring-amber-400/70 focus:ring-offset-2 focus:ring-offset-transparent
            active:scale-95
            ${isOpen ? "rotate-[360deg]" : ""}
          `}
          style={{
            boxShadow: isOpen
              ? "0 0 0 0 rgba(251, 191, 36, 0)"
              : "0 8px 32px rgba(128, 0, 32, 0.5), 0 0 0 0 rgba(251, 191, 36, 0.3)",
          }}
        >
          {isOpen ? (
            // Close icon (X)
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Sparkle / AI icon
            <svg className="w-6 h-6 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
          )}
        </button>

        {/* Tooltip */}
        {!isOpen && (
          <div
            className="
              absolute bottom-full right-0 mb-3 
              bg-slate-900/95 text-white text-xs 
              px-3 py-1.5 rounded-lg whitespace-nowrap
              shadow-xl border border-white/10
              opacity-0 pointer-events-none
              group-hover:opacity-100
              transition-opacity duration-200
            "
            role="tooltip"
          >
            <span className="font-semibold text-amber-300">Swarna AI</span>
            <span className="text-slate-400 ml-1">– Ask anything</span>
          </div>
        )}
      </div>

      {/* ============================================================
          CHAT PANEL
      ============================================================ */}
      <div
        id={`${widgetId}-panel`}
        ref={chatPanelRef}
        role="dialog"
        aria-label="Swarna AI Chat"
        aria-modal="false"
        className={`
          fixed bottom-24 right-6 z-[9997]
          w-[min(92vw,420px)] h-[min(85vh,620px)]
          flex flex-col
          rounded-2xl overflow-hidden
          shadow-[0_20px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.06)]
          transition-all duration-300 ease-out origin-bottom-right
          ${
            isOpen
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-95 translate-y-4 pointer-events-none"
          }
        `}
        style={{
          background: "linear-gradient(135deg, rgba(8,8,20,0.97) 0%, rgba(15,10,30,0.97) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {/* ── HEADER ── */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-4 py-3.5"
          style={{
            background:
              "linear-gradient(135deg, rgba(128,0,32,0.9) 0%, rgba(100,0,25,0.9) 100%)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Branding */}
          <div className="flex items-center gap-3">
            {/* Logo mark */}
            <div className="relative flex-shrink-0">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shadow-inner overflow-hidden bg-white/10"
                style={{
                  boxShadow: "0 2px 8px rgba(247,168,27,0.4)",
                }}
              >
                <img
                  src="/images/swarna-ai-icon.png"
                  alt="Swarna AI Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Online indicator */}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-[#800020]" />
            </div>

            <div>
              <h2 className="text-white font-semibold text-sm leading-tight">Swarna AI</h2>
              <p className="text-amber-300/80 text-[10px] leading-tight">
                Official Digital Assistant · RCSB
              </p>
            </div>
          </div>

          {/* Header actions */}
          <div className="flex items-center gap-1.5">
            {/* Clear conversation */}
            <button
              onClick={handleClear}
              title="Clear conversation"
              aria-label="Clear conversation"
              className="
                p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10
                transition-colors duration-150
                focus:outline-none focus:ring-1 focus:ring-amber-400/50
              "
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>

            {/* Close */}
            <button
              onClick={() => setIsOpen(false)}
              title="Close"
              aria-label="Close Swarna AI"
              className="
                p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10
                transition-colors duration-150
                focus:outline-none focus:ring-1 focus:ring-amber-400/50
              "
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── MESSAGES AREA ── */}
        <div
          className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar space-y-1"
          style={{
            overscrollBehavior: "contain",
          }}
          data-lenis-prevent
        >
          {messages.map((msg, idx) => (
            <ChatMessage
              key={msg.id}
              role={msg.role}
              content={msg.content}
              isStreaming={isStreaming && idx === messages.length - 1 && msg.role === "assistant"}
            />
          ))}

          {/* Typing indicator — shown when loading but not yet streaming */}
          {isLoading && !isStreaming && (
            <div className="flex justify-start mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                  <img
                    src="/images/swarna-ai-icon.png"
                    alt="Swarna AI"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm shadow-md">
                  <TypingIndicator />
                </div>
              </div>
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div className="mx-1 mb-2 p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-xs leading-relaxed">
              ⚠️ {error}
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>

        {/* ── SUGGESTED PROMPTS (shown only when conversation is minimal) ── */}
        {messages.length <= 2 && !isLoading && (
          <div className="flex-shrink-0 px-3 pb-2" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <p className="text-slate-500 text-[10px] mb-1.5 pt-2">Try asking:</p>
            <SuggestedPrompts onSelect={sendMessage} disabled={isLoading} />
          </div>
        )}

        {/* ── ACTION BAR (regenerate / stop) ── */}
        {(canRegenerate || isLoading) && (
          <div className="flex-shrink-0 flex justify-center px-3 pb-1 gap-2">
            {isLoading ? (
              <button
                onClick={handleStop}
                className="
                  flex items-center gap-1.5 text-xs text-slate-400
                  hover:text-white px-3 py-1 rounded-full border border-white/10
                  hover:bg-white/10 transition-colors duration-150
                  focus:outline-none focus:ring-1 focus:ring-amber-400/40
                "
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" rx="1" />
                </svg>
                Stop generating
              </button>
            ) : (
              <button
                onClick={handleRegenerate}
                className="
                  flex items-center gap-1.5 text-xs text-slate-400
                  hover:text-amber-300 px-3 py-1 rounded-full border border-white/10
                  hover:bg-amber-400/10 hover:border-amber-400/30 transition-all duration-150
                  focus:outline-none focus:ring-1 focus:ring-amber-400/40
                "
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Regenerate
              </button>
            )}
          </div>
        )}

        {/* ── INPUT AREA ── */}
        <div
          className="flex-shrink-0"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <form onSubmit={handleSubmit} className="flex items-end gap-2 px-3 py-3">
            {/* Textarea */}
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask about the club..."
                disabled={isLoading}
                rows={1}
                aria-label="Message input"
                className={`
                  w-full resize-none rounded-xl px-4 py-2.5
                  bg-white/5 border border-white/10
                  text-white text-sm placeholder-slate-500
                  focus:outline-none focus:border-amber-400/50 focus:bg-white/8
                  transition-colors duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  leading-relaxed
                  max-h-[120px] overflow-y-auto custom-scrollbar
                `}
                style={{ minHeight: "40px" }}
              />
            </div>

            {/* Send button */}
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              className={`
                flex-shrink-0 w-10 h-10 rounded-xl
                flex items-center justify-center
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:ring-offset-1 focus:ring-offset-transparent
                ${
                  input.trim() && !isLoading
                    ? "bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-900/40 hover:from-amber-400 hover:to-amber-500 hover:scale-105 active:scale-95"
                    : "bg-white/5 text-slate-500 cursor-not-allowed"
                }
              `}
            >
              {isLoading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-center px-4 pb-2.5">
            <p className="text-slate-600 text-[10px]">
              Shift+Enter for new line · Enter to send
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
