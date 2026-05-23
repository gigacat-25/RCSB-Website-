export const runtime = 'edge';
import { NextResponse } from "next/server";
import { generateNewsletterReminder, generateNewsletterContent } from "@/lib/newsletter-utils";

const WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_API_URL!;
const WORKER_SECRET = process.env.CLOUDFLARE_WORKER_SECRET!;

export async function POST(request: Request) {
    const internalKey = request.headers.get("x-internal-key");
    const isInternalCall = internalKey === WORKER_SECRET;

    if (!isInternalCall) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const origin = new URL(request.url).origin;
        let body: any = null;
        try {
            body = await request.json();
        } catch (e) {
            // No body or parsing failed, fallback to cron behavior
        }

        // --- WORKFLOW SINGLE-EVENT TRIGGER FLOW ---
        if (body && body.eventId) {
            const { eventId, daysRemaining, isPostEvent, isNewPost } = body;
            console.log(`[Workflow Reminder] Triggered for event ${eventId}. Type: ${isNewPost ? 'New Post' : isPostEvent ? 'Post-Event Recap' : `${daysRemaining} Days Reminder`}`);

            // Fetch the specific event
            const res = await fetch(`${WORKER_URL}/api/projects/${eventId}`, {
                headers: { Authorization: `Bearer ${WORKER_SECRET}` },
            });

            if (!res.ok) throw new Error(`Failed to fetch project ID ${eventId}`);
            const project = await res.json() as any;

            if (!project) {
                return NextResponse.json({ error: "Event not found" }, { status: 404 });
            }

            // Verify the event is active
            if (project.status === 'trash' || project.status === 'draft') {
                console.log(`[Workflow Reminder] Event ${project.title} is inactive (status: ${project.status}). Skipping.`);
                return NextResponse.json({ success: true, message: "Event is inactive, skipped sending email" });
            }

            let aiContent: { subject: string; body: string } | null = null;

            if (isNewPost) {
                // Immediate notification on creation
                console.log(`[Workflow Reminder] Generating new post notification for: "${project.title}"`);
                aiContent = await generateNewsletterContent({
                    title: project.title,
                    description: project.description,
                    type: project.type,
                    slug: project.slug,
                    image_url: project.image_url,
                    event_date: project.event_date,
                    rsvp_link: project.rsvp_link,
                    content: project.content,
                    author_email: project.author_email
                });
            } else if (isPostEvent) {
                // Post-event recap: use standard generateNewsletterContent (which automatically writes recap if event is in the past)
                console.log(`[Workflow Reminder] Generating post-event recap for: "${project.title}"`);
                aiContent = await generateNewsletterContent({
                    title: project.title,
                    description: project.description,
                    type: project.type,
                    slug: project.slug,
                    image_url: project.image_url,
                    event_date: project.event_date,
                    rsvp_link: project.rsvp_link,
                    content: project.content,
                    author_email: project.author_email
                });
            } else {
                // Pre-event reminder: use generateNewsletterReminder
                console.log(`[Workflow Reminder] Generating ${daysRemaining}-day reminder for: "${project.title}"`);
                aiContent = await generateNewsletterReminder({
                    title: project.title,
                    description: project.description,
                    type: project.type,
                    slug: project.slug,
                    image_url: project.image_url,
                    event_date: project.event_date,
                    rsvp_link: project.rsvp_link
                }, daysRemaining);
            }

            if (aiContent) {
                console.log(`[Workflow Reminder] Sending email: "${aiContent.subject}"`);
                const sendRes = await fetch(`${origin}/api/newsletter/send`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-internal-key": WORKER_SECRET,
                    },
                    body: JSON.stringify({
                        subject: aiContent.subject,
                        body: aiContent.body,
                    }),
                });

                if (!sendRes.ok) {
                    throw new Error(`Failed to send email newsletter: ${await sendRes.text()}`);
                }

                return NextResponse.json({ 
                    success: true, 
                    sent: [{ title: project.title, daysRemaining: isPostEvent ? "post-event" : daysRemaining }] 
                });
            }

            return NextResponse.json({ success: true, message: "No content generated" });
        }

        // --- OLD DAILY CRON POLLING FALLBACK ---
        console.log("[Reminders] Fallback Cron run: Fetching all projects...");
        const res = await fetch(`${WORKER_URL}/api/projects`, {
            headers: { Authorization: `Bearer ${WORKER_SECRET}` },
        });

        if (!res.ok) throw new Error("Failed to fetch projects");
        const projects = await res.json() as any[];

        const upcoming = projects.filter(p => p.event_date && (p.type === 'event' || p.type === 'project'));
        const sentReminders = [];

        for (const p of upcoming) {
            const eventDate = new Date(p.event_date);
            const today = new Date();
            
            const tDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const eDate = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
            
            const diffTime = eDate.getTime() - tDate.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // Logic: Send reminder every 2 days if diffDays <= 10
            const shouldSend = diffDays > 0 && diffDays <= 10 && diffDays % 2 === 0;

            if (shouldSend) {
                console.log(`[Reminders] Triggering reminder for "${p.title}" - ${diffDays} days left`);
                
                const aiContent = await generateNewsletterReminder({
                    title: p.title,
                    description: p.description,
                    type: p.type,
                    slug: p.slug,
                    image_url: p.image_url,
                    event_date: p.event_date,
                    rsvp_link: p.rsvp_link
                }, diffDays);

                if (aiContent) {
                    const sendRes = await fetch(`${origin}/api/newsletter/send`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "x-internal-key": WORKER_SECRET,
                        },
                        body: JSON.stringify({
                            subject: aiContent.subject,
                            body: aiContent.body,
                        }),
                    });

                    if (sendRes.ok) {
                        sentReminders.push({ title: p.title, daysRemaining: diffDays });
                    }
                }
            }
        }

        return NextResponse.json({ success: true, sent: sentReminders });
    } catch (err: any) {
        console.error("[Reminders Error]", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
