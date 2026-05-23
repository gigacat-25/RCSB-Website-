async function callGroq(systemPrompt: string, prompt: string, apiKey: string) {
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

    const parsed = JSON.parse(generatedText);
    let subject = "";
    let body = "";
    for (const key of Object.keys(parsed)) {
        const lowerKey = key.toLowerCase();
        if (lowerKey === "subject" || lowerKey === "subject_line") {
            subject = parsed[key];
        } else if (lowerKey === "body" || lowerKey === "content" || lowerKey === "email_body") {
            body = parsed[key];
        }
    }
    return { subject, body };
}

export async function generateNewsletterContent(project: {
    title: string;
    description: string;
    type: string;
    slug: string;
    image_url?: string;
    event_date?: string;
    rsvp_link?: string;
    content?: string;
    author_email?: string;
}) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error("GROQ_API_KEY not configured");
    }

    const { type } = project;

    if (type === "blog") {
        return generateBlogNewsletter(project);
    } else if (type === "award") {
        return generateAwardNewsletter(project);
    } else if (type === "project") {
        return generateProjectNewsletter(project);
    } else {
        const eDate = project.event_date ? new Date(project.event_date) : null;
        const isRecap = eDate ? (eDate.getTime() < Date.now()) : false;
        return generateEventNewsletter(project, isRecap);
    }
}

async function generateEventNewsletter(project: {
    title: string;
    description: string;
    slug: string;
    image_url?: string;
    event_date?: string;
    rsvp_link?: string;
    content?: string;
}, isRecap: boolean) {
    const apiKey = process.env.GROQ_API_KEY!;
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rcsb-website.pages.dev";
    const { title, description, slug, image_url, event_date, rsvp_link, content } = project;

    let dateContext = "";
    if (event_date) {
        const eDate = new Date(event_date);
        dateContext = isRecap 
            ? `\nThe event was held on ${eDate.toLocaleDateString()}. Write the email in past tense as a recap or highlight of the successful event. Do NOT ask people to RSVP or register.`
            : `\nThe event is scheduled for ${eDate.toLocaleDateString()}. It is an upcoming event. Encourage people to register and attend.`;
    }

    const absImageUrl = image_url ? (image_url.startsWith("http") ? image_url : `${SITE_URL}${image_url}`) : "";
    const imageTag = absImageUrl ? `<img src="${absImageUrl}" alt="${title}" style="width:100%; border-radius:12px; margin-bottom:24px; border: 1px solid rgba(255,215,0,0.1);" />` : "";
    
    let rsvpContext = "";
    if (rsvp_link && !isRecap) {
        rsvpContext = `\nThere is an RSVP link for this event: ${rsvp_link}. Create a large, prominent RSVP button that points to this exact link with the text "RSVP Now" or "Get Your Tickets".`;
    }

    const prompt = `You are a professional communications officer for the Rotaract Club of Swarna Bengaluru (RCSB). 
Please write a highly engaging, branded HTML email newsletter ${isRecap ? 'highlighting the recap of' : 'announcing'} our event.

Title: ${title}
Summary/Description: ${description}
${content ? `Full Event Details/Context:\n${content}\n` : ""}

URLs (FOR BUTTON LINKS ONLY. DO NOT WRITE THEM OUT AS TEXT IN THE EMAIL BODY):
- Official Website: ${SITE_URL}
- Link to view event details: ${SITE_URL}/events/${slug}

CONTEXTUAL DATA:
${dateContext}
${imageTag ? `\nCRITICAL: Include this cover image at the top of the body: ${imageTag}` : ""}
${rsvpContext}

Guidelines:
1. Always start the email body with a professional header: "Rotaract Club of Swarna Bengaluru".
2. Tone: ${isRecap ? 'Warm, proud, reflective, and grateful to all attendees.' : 'Exciting, inviting, and welcoming.'}
3. **Body Text**: Explain what the event is about. Based on the 'Summary/Description' and any 'Full Event Details' provided, write an engaging paragraph or two summarizing the event agenda, topics, or key highlights.
4. **NO Hardcoded / Raw Links**: Do NOT include raw URLs, raw link text, or standard blue anchor links in the text. All calls to action or navigation links MUST be formatted as styled gold buttons. Never write something like "visit our website at ${SITE_URL}".
5. **Buttons**: Any primary link (like RSVP or Read More) MUST be a styled button. Use this EXACT HTML: 
   <div style="margin: 32px 0; text-align: center;">
     <a href="URL_HERE" style="background-color: #C9982A; color: #0a0f1e; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 900; font-size: 15px; display: inline-block; letter-spacing: 1px; text-transform: uppercase;">BUTTON_TEXT_HERE</a>
   </div>
6. Output ONLY a valid JSON object with keys "subject" and "body". Use semantic HTML tags in the body.`;

    const systemPrompt = `You are a professional copywriter for RCSB. Write an ${isRecap ? 'event recap' : 'upcoming event invitation'} email. Return ONLY a JSON object with "subject" and "body". Never print raw text links or default anchor links.`;
    
    return callGroq(systemPrompt, prompt, apiKey);
}

async function generateBlogNewsletter(project: {
    title: string;
    description: string;
    slug: string;
    image_url?: string;
    content?: string;
    event_date?: string;
    author_email?: string;
}) {
    const apiKey = process.env.GROQ_API_KEY!;
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rcsb-website.pages.dev";
    const { title, description, slug, image_url, content, event_date, author_email } = project;
    const authorName = event_date || (author_email ? author_email.split('@')[0] : "") || "RCSB Editorial Team";

    const absImageUrl = image_url ? (image_url.startsWith("http") ? image_url : `${SITE_URL}${image_url}`) : "";
    const imageTag = absImageUrl ? `<img src="${absImageUrl}" alt="${title}" style="width:100%; border-radius:12px; margin-bottom:24px; border: 1px solid rgba(255,215,0,0.1);" />` : "";

    const prompt = `You are a professional communications officer for the Rotaract Club of Swarna Bengaluru (RCSB). 
Please write an engaging, editorial-style HTML email newsletter sharing our latest blog post / story.

Title: ${title}
Author: ${authorName}
Summary/Intro: ${description}
${content ? `Full Blog Post Content:\n${content}\n` : ""}

URLs (FOR BUTTON LINKS ONLY. DO NOT WRITE THEM OUT AS TEXT IN THE EMAIL BODY):
- Official Website: ${SITE_URL}
- Link to read story on site: ${SITE_URL}/blogs/${slug}

CONTEXTUAL DATA:
${imageTag ? `\nCRITICAL: Include this cover image at the top of the body: ${imageTag}` : ""}

Guidelines:
1. Always start the email body with a professional header: "Rotaract Club of Swarna Bengaluru".
2. Tone: Narrative, engaging, thoughtful, and editorial.
3. **DO NOT treat this as an event**: Do NOT mention dates, RSVP links, invitations, or "You're invited". It is a blog post / story publication.
4. **Subject Line**: The subject line must announce a new blog story, editorial, or article (e.g., "New Story: [Title]" or "Read Our Latest Article: [Title]"). NEVER use words like "Invited", "Invitation", "Register", "RSVP", or dates/countdowns in the subject.
5. **Header Block**: Underneath the main logo or professional header, design a beautiful headline section for the blog post. This should include:
   - A small uppercase label/category badge: "BLOG STORY" or "EDITORIAL"
   - The main title of the blog post as a bold header/heading (<h1> or similar styled tags)
   - A clear credit line: "Written by ${authorName}" or "By ${authorName}" in smaller styled text
6. **Body Text**: Summarize what the blog post is about. Based on the 'Summary/Intro' and the 'Full Blog Post Content' provided, write an engaging 2-3 paragraph overview describing the topics covered, key thoughts/arguments, or narratives in the article. Provide enough detail to make it interesting to read but encourage them to click the button for the full story. Do NOT invite people to an event or write in an RSVP context.
7. **NO Hardcoded / Raw Links**: Do NOT include raw URLs, raw link text, or standard blue anchor links in the text. All links MUST be formatted as styled gold buttons. Never write something like "visit our website at ${SITE_URL}".
8. **Buttons**: Provide a prominent "Read Full Article" or "Read Story" button pointing to ${SITE_URL}/blogs/${slug}. Use this EXACT HTML:
   <div style="margin: 32px 0; text-align: center;">
     <a href="${SITE_URL}/blogs/${slug}" style="background-color: #C9982A; color: #0a0f1e; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 900; font-size: 15px; display: inline-block; letter-spacing: 1px; text-transform: uppercase;">Read Full Story</a>
   </div>
9. Output ONLY a valid JSON object with keys "subject" and "body". Use semantic HTML tags in the body.`;

    const systemPrompt = `You are a professional copywriter for RCSB. Write a blog announcement newsletter. Do not include event details, RSVP, or invitations. Never print raw text links or default anchor links. Return ONLY a JSON object with "subject" and "body".`;
    
    return callGroq(systemPrompt, prompt, apiKey);
}

async function generateAwardNewsletter(project: {
    title: string;
    description: string;
    slug: string;
    image_url?: string;
    content?: string;
}) {
    const apiKey = process.env.GROQ_API_KEY!;
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rcsb-website.pages.dev";
    const { title, description, slug, image_url, content } = project;

    const absImageUrl = image_url ? (image_url.startsWith("http") ? image_url : `${SITE_URL}${image_url}`) : "";
    const imageTag = absImageUrl ? `<img src="${absImageUrl}" alt="${title}" style="width:100%; border-radius:12px; margin-bottom:24px; border: 1px solid rgba(255,215,0,0.1);" />` : "";

    const prompt = `You are a professional communications officer for the Rotaract Club of Swarna Bengaluru (RCSB). 
Please write a celebratory, prestigious HTML email newsletter announcing an award or milestone recognition.

Title: ${title}
Summary/Citation: ${description}
${content ? `Full Award Details:\n${content}\n` : ""}

URLs (FOR BUTTON LINKS ONLY. DO NOT WRITE THEM OUT AS TEXT IN THE EMAIL BODY):
- Official Website: ${SITE_URL}
- Link to view award details: ${SITE_URL}/awards/${slug}

CONTEXTUAL DATA:
${imageTag ? `\nCRITICAL: Include this cover image at the top of the body: ${imageTag}` : ""}

Guidelines:
1. Always start the email body with a professional header: "Rotaract Club of Swarna Bengaluru".
2. Tone: Proud, celebratory, prestigious, and grateful to club members, sponsors, and partners.
3. **DO NOT treat this as an event**: Do NOT mention future event dates, RSVP buttons, or ticketing. This is an announcement of an award or recognition we have received.
4. **Subject Line**: The subject line must celebrate the award or recognition (e.g., "Proud Moment: RCSB Receives [Title]" or "We Won! Announcing [Title]"). NEVER use words like "Invited", "Invitation", "Register", "RSVP", or dates/countdowns in the subject.
5. **Body Text**: Explain what the award or recognition is about. Based on the 'Summary/Citation' and 'Full Award Details' provided, write an engaging overview describing the achievement, what it recognizes, and what this milestone means to the club. Do NOT invite people to an event or write in an RSVP context.
6. **NO Hardcoded / Raw Links**: Do NOT include raw URLs, raw link text, or standard blue anchor links in the text. All links MUST be formatted as styled gold buttons. Never write something like "visit our website at ${SITE_URL}".
7. **Buttons**: Provide a prominent "View Award Details" or "Read Full Citation" button pointing to ${SITE_URL}/awards/${slug}. Use this EXACT HTML:
   <div style="margin: 32px 0; text-align: center;">
     <a href="${SITE_URL}/awards/${slug}" style="background-color: #C9982A; color: #0a0f1e; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 900; font-size: 15px; display: inline-block; letter-spacing: 1px; text-transform: uppercase;">View Award Details</a>
   </div>
8. Output ONLY a valid JSON object with keys "subject" and "body". Use semantic HTML tags in the body.`;

    const systemPrompt = `You are a professional copywriter for RCSB. Write a celebratory award announcement newsletter. Do not include event details, RSVP, or invitations. Never print raw text links or default anchor links. Return ONLY a JSON object with "subject" and "body".`;
    
    return callGroq(systemPrompt, prompt, apiKey);
}

async function generateProjectNewsletter(project: {
    title: string;
    description: string;
    slug: string;
    image_url?: string;
    content?: string;
}) {
    const apiKey = process.env.GROQ_API_KEY!;
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rcsb-website.pages.dev";
    const { title, description, slug, image_url, content } = project;

    const absImageUrl = image_url ? (image_url.startsWith("http") ? image_url : `${SITE_URL}${image_url}`) : "";
    const imageTag = absImageUrl ? `<img src="${absImageUrl}" alt="${title}" style="width:100%; border-radius:12px; margin-bottom:24px; border: 1px solid rgba(255,215,0,0.1);" />` : "";

    const prompt = `You are a professional communications officer for the Rotaract Club of Swarna Bengaluru (RCSB). 
Please write an inspiring, impact-driven HTML email newsletter highlighting a completed project initiative.

Title: ${title}
Summary/Overview: ${description}
${content ? `Full Project Details/Content:\n${content}\n` : ""}

URLs (FOR BUTTON LINKS ONLY. DO NOT WRITE THEM OUT AS TEXT IN THE EMAIL BODY):
- Official Website: ${SITE_URL}
- Link to view project details: ${SITE_URL}/projects/${slug}

CONTEXTUAL DATA:
${imageTag ? `\nCRITICAL: Include this cover image at the top of the body: ${imageTag}` : ""}

Guidelines:
1. Always start the email body with a professional header: "Rotaract Club of Swarna Bengaluru".
2. Tone: Impactful, inspiring, service-minded, and community-focused.
3. **DO NOT treat this as an event**: Do NOT mention future event dates, ticket links, or RSVP. This is a showcase of a project that has been successfully completed.
4. **Subject Line**: The subject line must announce the successful completion or showcase of the project (e.g., "Project Completed: [Title]" or "Making a Difference: [Title]"). NEVER use words like "Invited", "Invitation", "Register", "RSVP", or dates/countdowns in the subject.
5. **Body Text**: Explain what the project is about. Based on the 'Summary/Overview' and the 'Full Project Details/Content' provided, write an inspiring overview describing the project's goals, execution, its impact on the community, and key figures/outcomes. Do NOT invite people to an event or write in an RSVP context.
6. **NO Hardcoded / Raw Links**: Do NOT include raw URLs, raw link text, or standard blue anchor links in the text. All links MUST be formatted as styled gold buttons. Never write something like "visit our website at ${SITE_URL}".
7. **Buttons**: Provide a prominent "Read Case Study" or "View Project Details" button pointing to ${SITE_URL}/projects/${slug}. Use this EXACT HTML:
   <div style="margin: 32px 0; text-align: center;">
     <a href="${SITE_URL}/projects/${slug}" style="background-color: #C9982A; color: #0a0f1e; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 900; font-size: 15px; display: inline-block; letter-spacing: 1px; text-transform: uppercase;">View Project Details</a>
   </div>
8. Output ONLY a valid JSON object with keys "subject" and "body". Use semantic HTML tags in the body.`;

    const systemPrompt = `You are a professional copywriter for RCSB. Write a project showcase newsletter. Do not include RSVP or future event details. Never print raw text links or default anchor links. Return ONLY a JSON object with "subject" and "body".`;
    
    return callGroq(systemPrompt, prompt, apiKey);
}

export async function generateNewsletterReminder(project: {
    title: string;
    description: string;
    type: string;
    slug: string;
    image_url?: string;
    event_date: string;
    rsvp_link?: string;
}, daysRemainingOverride?: number) {
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rcsb-website.pages.dev";
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        throw new Error("GROQ_API_KEY not configured");
    }

    const { title, description, type, slug, image_url, event_date, rsvp_link } = project;
    const section = type === "event" ? "events" : (type === "blog" ? "blogs" : (type === "award" ? "awards" : "projects"));

    const eDate = new Date(event_date);
    const today = new Date();
    const diffTime = eDate.getTime() - today.getTime();
    const calculatedDiffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const diffDays = daysRemainingOverride !== undefined ? daysRemainingOverride : calculatedDiffDays;

    if (diffDays < 0 && daysRemainingOverride === undefined) return null; // Already passed

    const absImageUrl = image_url ? (image_url.startsWith("http") ? image_url : `${SITE_URL}${image_url}`) : "";
    const imageTag = absImageUrl ? `<img src="${absImageUrl}" alt="${title}" style="width:100%; border-radius:12px; margin-bottom:24px; border: 1px solid rgba(255,215,0,0.1);" />` : "";

    const prompt = `You are a professional communications officer for the Rotaract Club of Swarna Bengaluru (RCSB). 
Please write an urgent, high-energy REMINDER email for our upcoming ${type}.

Title: ${title}
Details: ${description}
Countdown: EXACTLY ${diffDays} DAYS REMAINING.

URLs (FOR BUTTON LINKS ONLY. DO NOT WRITE THEM OUT AS TEXT IN THE EMAIL BODY):
- Official Website: ${SITE_URL}
- Official Link: ${SITE_URL}/${section}/${slug}
- RSVP Link: ${rsvp_link || "N/A"}

Guidelines:
1. The subject MUST emphasize the urgency (e.g., "Only ${diffDays} Days Left!", "Time is Running Out!", "Final Call for ${title}").
2. The body MUST start with the countdown: "Tick-tock! 🕒 Only ${diffDays} days remain until ${title}."
3. Encourage immediate action/registration. Use a "FOMO" (Fear Of Missing Out) approach but keep it professional.
4. **NO Hardcoded / Raw Links**: Do NOT include raw URLs, raw link text, or standard blue anchor links in the text. All links MUST be formatted as styled gold buttons. Never write something like "visit our website at ${SITE_URL}".
5. **Buttons**: Use this EXACT HTML for the registration button: 
   <div style="margin: 32px 0; text-align: center;">
     <a href="${rsvp_link || `${SITE_URL}/${section}/${slug}`}" style="background-color: #C9982A; color: #0a0f1e; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 900; font-size: 15px; display: inline-block; letter-spacing: 1px; text-transform: uppercase;">Register Now →</a>
   </div>
6. **Media Usage**: include this image tag at the top: ${imageTag}
7. Keep the email concise and punchy.
8. Output ONLY a valid JSON object with keys "subject" and "body".`;

    const systemPrompt = `You are a professional copywriter for RCSB. You specialize in high-conversion reminder emails. Never print raw text links or default anchor links. Return ONLY a JSON object with "subject" and "body".`;

    const parsed = await callGroq(systemPrompt, prompt, apiKey);
    return parsed;
}
export async function triggerN8NWebhook(type: "blog_published" | "user_subscribed", data: any) {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
        console.warn("[n8n] N8N_WEBHOOK_URL not configured. Skipping automation.");
        return;
    }

    try {
        console.log(`[n8n] Triggering webhook for ${type}...`);
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                trigger: type,
                timestamp: new Date().toISOString(),
                data: data
            }),
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`n8n Webhook failed: ${errText}`);
        }

        console.log(`[n8n] Webhook triggered successfully for ${type}`);
    } catch (err) {
        console.error(`[n8n] Error triggering webhook for ${type}:`, err);
    }
}
