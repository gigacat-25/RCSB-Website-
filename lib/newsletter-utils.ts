export async function generateNewsletterContent(project: {
    title: string;
    description: string;
    type: string;
    slug: string;
    image_url?: string;
    event_date?: string;
    rsvp_link?: string;
}) {
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rcsb-website.pages.dev";
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        throw new Error("GROQ_API_KEY not configured");
    }

    const { title, description, type, slug, image_url, event_date, rsvp_link } = project;
    const section = type === "event" ? "events" : (type === "blog" ? "blogs" : "projects");

    let dateContext = "";
    if (event_date) {
        const eDate = new Date(event_date);
        const today = new Date();
        const diffTime = eDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 0) {
            dateContext = `\nThe event is scheduled for ${eDate.toLocaleDateString()}. It is exactly ${diffDays} days away. Make sure to mention this countdown/urgency in the email.`;
        } else if (diffDays === 0) {
            dateContext = `\nThe event is scheduled for today! Emphasize that it's happening today in the email.`;
        } else {
            dateContext = `\nThe event was on ${eDate.toLocaleDateString()}. Write the email in past tense as a recap or highlight of the successful event.`;
        }
    }

    const absImageUrl = image_url ? (image_url.startsWith("http") ? image_url : `${SITE_URL}${image_url}`) : "";
    const imageTag = absImageUrl ? `<img src="${absImageUrl}" alt="${title}" style="width:100%; border-radius:12px; margin-bottom:24px; border: 1px solid rgba(255,215,0,0.1);" />` : "";

    let imageContext = "";
    if (imageTag) {
        imageContext = `\nCRITICAL: You MUST include this EXACT cover image tag at the very top of your body: ${imageTag}`;
    }

    let rsvpContext = "";
    if (rsvp_link) {
        rsvpContext = `\nThere is an RSVP link for this event: ${rsvp_link}. Create a large, prominent RSVP button that points to this exact link with the text "RSVP Now" or "Get Your Tickets".`;
    }

    const prompt = `You are a professional communications officer for the Rotaract Club of Swarna Bengaluru (RCSB). 
Please write a highly engaging, branded HTML email newsletter announcing the following ${type}.

Title: ${title}
Details: ${description}
Official Website: ${SITE_URL}
Official Email: rota.rcbs@gmail.com
Link to view on site: ${SITE_URL}/${section}/${slug}

CONTEXTUAL DATA:
${dateContext}${imageContext}${rsvpContext}

Guidelines:
1. Always start the email body with a professional header: "Rotaract Club of Swarna Bengaluru".
2. Use a sophisticated, warm, and community-focused tone.
3. **Buttons**: Any primary link (like a feedback form or "Read More") MUST be a styled button. Use this EXACT HTML: 
   <div style="margin: 32px 0; text-align: center;">
     <a href="URL_HERE" style="background-color: #C9982A; color: #0a0f1e; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 900; font-size: 15px; display: inline-block; letter-spacing: 1px; text-transform: uppercase;">BUTTON_TEXT_HERE</a>
   </div>
4. **Media Usage**: Do NOT use placeholder images. Only use the image tag provided in the context above. If no image tag is provided, do not include an image.
5. Ensure the Call-To-Action (CTA) text is interesting and compelling.
6. **Note**: Do not repeat the physical address or social media links in the body; they are already handled by our permanent email footer.
7. Output ONLY a valid JSON object with keys "subject" and "body". Use semantic HTML tags in the body.`;

    const systemPrompt = `You are a professional copywriter for the Rotaract Club of Swarna Bengaluru (RCSB). 
The user will provide project details and any necessary media links.

STRICT GUIDELINES:
1. **NO Hallucinations**: Do NOT use placeholder URLs (like via.placeholder.com). If a cover image URL is provided in the prompt, use it EXACTLY.
2. **Proper Buttons**: Primary Call-To-Actions (e.g. Feedback forms, RSVP, "Read More") MUST be a styled button. 
   Use this HTML: <div style="margin: 24px 0; text-align: center;"><a href="URL" style="background-color: #C9982A; color: #0a0f1e; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">BUTTON TEXT</a></div>
3. **Minimal HTML**: Do NOT include <style>, <head>, or <html> tags. Write only the inner content for a container.
4. **Branding**: Maintain a warm, community-driven tone. No headers (handled by wrapper).

Return ONLY a JSON object with "subject" and "body".`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
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
        throw new Error(`AI Generation failed: ${errorData}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0]?.message?.content;

    if (!generatedText) {
        throw new Error("No content returned from AI");
    }

    return JSON.parse(generatedText) as { subject: string; body: string };
}
export async function generateNewsletterReminder(project: {
    title: string;
    description: string;
    type: string;
    slug: string;
    image_url?: string;
    event_date: string;
    rsvp_link?: string;
}) {
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rcsb-website.pages.dev";
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        throw new Error("GROQ_API_KEY not configured");
    }

    const { title, description, type, slug, image_url, event_date, rsvp_link } = project;
    const section = type === "event" ? "events" : (type === "blog" ? "blogs" : "projects");

    const eDate = new Date(event_date);
    const today = new Date();
    const diffTime = eDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return null; // Already passed

    const absImageUrl = image_url ? (image_url.startsWith("http") ? image_url : `${SITE_URL}${image_url}`) : "";
    const imageTag = absImageUrl ? `<img src="${absImageUrl}" alt="${title}" style="width:100%; border-radius:12px; margin-bottom:24px; border: 1px solid rgba(255,215,0,0.1);" />` : "";

    const prompt = `You are a professional communications officer for the Rotaract Club of Swarna Bengaluru (RCSB). 
Please write an urgent, high-energy REMINDER email for our upcoming ${type}.

Title: ${title}
Details: ${description}
Official Website: ${SITE_URL}
Official Link: ${SITE_URL}/${section}/${slug}
RSVP Link: ${rsvp_link || "N/A"}
Countdown: EXACTLY ${diffDays} DAYS REMAINING.

Guidelines:
1. The subject MUST emphasize the urgency (e.g., "Only ${diffDays} Days Left!", "Time is Running Out!", "Final Call for ${title}").
2. The body MUST start with the countdown: "Tick-tock! 🕒 Only ${diffDays} days remain until ${title}."
3. Encourage immediate action/registration. Use a "FOMO" (Fear Of Missing Out) approach but keep it professional.
4. **Buttons**: Use this EXACT HTML for the registration button: 
   <div style="margin: 32px 0; text-align: center;">
     <a href="${rsvp_link || `${SITE_URL}/${section}/${slug}`}" style="background-color: #C9982A; color: #0a0f1e; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 900; font-size: 15px; display: inline-block; letter-spacing: 1px; text-transform: uppercase;">Register Now →</a>
   </div>
5. **Media Usage**: include this image tag at the top: ${imageTag}
6. Keep the email concise and punchy.
7. Output ONLY a valid JSON object with keys "subject" and "body".`;

    const systemPrompt = `You are a professional copywriter for RCSB. You specialize in high-conversion reminder emails.
Return ONLY a JSON object with "subject" and "body".`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt }
            ],
            temperature: 0.8,
            response_format: { type: "json_object" }
        }),
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`AI Reminder Generation failed: ${errorData}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0]?.message?.content;

    if (!generatedText) {
        throw new Error("No content returned from AI");
    }

    return JSON.parse(generatedText) as { subject: string; body: string };
}
