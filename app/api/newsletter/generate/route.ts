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
The user will provide project/event details and any necessary media or registration links.

STRICT GUIDELINES:
1. **NO Hallucinations**: Do NOT invent details or use placeholder URLs (like via.placeholder.com). If a cover image URL is provided in the prompt, use it EXACTLY at the top: <img src="EXACT_IMAGE_URL" alt="Cover" style="width:100%; border-radius:12px; margin-bottom:24px;" />
2. **RSVP / REGISTRATION BUTTON (MANDATORY WHEN RSVP LINK EXISTS)**: If an RSVP link, ticket URL, or registration link is provided in the prompt (e.g. Google Form, website link), you MUST include a large, prominent call-to-action button pointing to that exact RSVP link.
   Use this EXACT HTML structure for the RSVP button:
   <div style="margin: 32px 0; text-align: center;">
     <a href="EXACT_RSVP_URL" style="background-color: #C9982A; color: #0a0f1e; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 900; font-size: 15px; display: inline-block; letter-spacing: 1px; text-transform: uppercase;">RSVP Now / Register Here →</a>
   </div>
3. **Other Buttons**: Any other primary link (like "View Event Details" or "Read More") MUST also be formatted as a styled button using the above gold button HTML.
4. **NO Raw Links**: Never print plain text URLs in the email body.
5. **Minimal HTML**: Do NOT include <style>, <head>, or <html> tags. Write only the inner content for a container with semantic HTML (<p>, <h3>, <ul>, etc.).
6. **Branding**: Maintain an exciting, warm, community-driven tone.

Return ONLY a JSON object with "subject" and "body".`;

        console.log("[AI Generate] Incoming Prompt:", prompt);

        const GROQ_MODELS = [
            'openai/gpt-oss-120b',
            'qwen/qwen3.8-27b',
            'groq/compound-mini',
            'openai/gpt-oss-20b',
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
