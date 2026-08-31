import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
    try {
        const { originalMessage, senderName, brief } = await req.json();

        if (!brief || typeof brief !== 'string') {
            return NextResponse.json({ error: 'Brief is required' }, { status: 400 });
        }

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'GROQ_API_KEY not configured' }, { status: 500 });
        }

        const systemPrompt = `You are an AI assistant helping a Rotaract Club administrator reply to contact inquiries.
You will receive the original message, the sender's name, and a short brief of what the administrator wants to say.
Your job is to generate a professional, friendly, and complete email reply.
Maintain a warm, community-driven tone.

CRITICAL INSTRUCTIONS FOR LINKS:
If you include ANY links (like Google Forms, website URLs, etc.), you MUST NOT output them as raw text or standard anchor tags. 
You MUST format them as a prominent button using exactly this HTML structure:
<div style="margin: 32px 0; text-align: center;">
    <a href="URL_HERE" style="background-color: #C9982A; color: #0a0f1e; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 900; font-size: 15px; display: inline-block; letter-spacing: 1px; text-transform: uppercase;">BUTTON_TEXT_HERE</a>
</div>

Return ONLY a JSON object with two keys: "subject" (string) and "body" (string, containing semantic HTML like <p> tags and the button div).`;

        const userPrompt = `Sender Name: ${senderName || "User"}
Original Message: ${originalMessage}

Administrator's Brief: ${brief}

Please generate the reply.`;

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
                            { role: 'user', content: userPrompt }
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
                    console.warn(`[AI Reply] Model ${model} failed:`, lastErrorData);
                }
            } catch (err: any) {
                lastErrorData = err?.message || "Network error";
                console.warn(`[AI Reply] Model ${model} error:`, lastErrorData);
            }
        }

        if (!data) {
            return NextResponse.json({ error: 'Failed to generate reply', details: lastErrorData }, { status: 502 });
        }

        const generatedText = data.choices[0]?.message?.content;

        if (!generatedText) {
            return NextResponse.json({ error: 'No content returned from AI' }, { status: 500 });
        }

        const result = JSON.parse(generatedText);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error('AI Reply Generation error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
