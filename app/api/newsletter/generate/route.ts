import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!prompt || typeof prompt !== 'string') {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'GROQ_API_KEY not configured' }, { status: 500 });
        }

        const systemPrompt = `You are a professional copywriter for the Rotaract Club of Swarna Bengaluru (RCSB). 
The user will provide project details and any necessary media links.

STRICT GUIDELINES:
1. **NO Hallucinations**: Do NOT use placeholder URLs (like via.placeholder.com). If a cover image URL is provided in the prompt, use it EXACTLY.
2. **Proper Buttons**: Primary Call-To-Actions (e.g. Feedback forms, RSVP, "Read More") MUST be a styled button. 
   Use this HTML: <div style="margin: 24px 0; text-align: center;"><a href="URL" style="background-color: #C9982A; color: #0a0f1e; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">BUTTON TEXT</a></div>
3. **Minimal HTML**: Do NOT include <style>, <head>, or <html> tags. Write only the inner content for a container.
4. **Branding**: Maintain a warm, community-driven tone. No headers (handled by wrapper).

Return ONLY a JSON object with "subject" and "body".`;

        console.log("[AI Generate] Incoming Prompt:", prompt);

        const GROQ_MODELS = [
            'openai/gpt-oss-120b',
            'qwen/qwen3.8-27b',
            'openai/gpt-oss-20b',
            'qwen/qwen3.6-27b',
        ];

        let data: any = null;
        let lastErrorData = "";

        for (const model of GROQ_MODELS) {
            try {
                const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model,
                        messages: [
                            { role: 'system', content: systemPrompt },
                            { role: 'user', content: prompt }
                        ],
                        temperature: 0.7,
                        response_format: { type: "json_object" }
                    }),
                });

                if (response.ok) {
                    data = await response.json();
                    break;
                } else {
                    lastErrorData = await response.text();
                    console.warn(`[AI Generate] Model ${model} failed:`, lastErrorData);
                }
            } catch (err: any) {
                lastErrorData = err?.message || "Network error";
                console.warn(`[AI Generate] Model ${model} error:`, lastErrorData);
            }
        }

        if (!data) {
            return NextResponse.json({ error: 'Failed to generate draft', details: lastErrorData }, { status: 502 });
        }

        const generatedText = data.choices[0]?.message?.content;

        if (!generatedText) {
            return NextResponse.json({ error: 'No content returned from AI' }, { status: 500 });
        }

        const result = JSON.parse(generatedText);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error('AI Generation error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
