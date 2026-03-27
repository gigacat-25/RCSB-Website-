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

        const systemPrompt = `You are a professional copywriter for a Rotaract/Rotary club (RCSB). 
The user will provide a short prompt for an email newsletter or event invitation.
Write a professional, engaging subject line and a beautifully formatted HTML email body.
Do NOT use basic default CSS. Use semantic HTML tags with inline styles occasionally if needed, but mostly rely on standard tags (<b>, <i>, <p>, <a>, <h2>, <ul>). Make it look professional.

Return ONLY a JSON object with the following structure, nothing else:
{
  "subject": "The email subject line here",
  "body": "The HTML formatted body here..."
}
`;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
                response_format: { type: "json_object" }
            }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Groq API Error:', errorData);
            return NextResponse.json({ error: 'Failed to generate draft' }, { status: response.status });
        }

        const data = await response.json();
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
