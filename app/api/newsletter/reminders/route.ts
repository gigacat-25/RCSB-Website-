export const runtime = 'edge';
import { NextResponse } from "next/server";
import { generateNewsletterReminder } from "@/lib/newsletter-utils";

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

        // 1. Fetch all projects/events from Worker
        const res = await fetch(`${WORKER_URL}/api/projects`, {
            headers: { Authorization: `Bearer ${WORKER_SECRET}` },
        });

        if (!res.ok) throw new Error("Failed to fetch projects");
        const projects = await res.json() as any[];

        // 2. Filter for upcoming events/projects with event_date
        const upcoming = projects.filter(p => p.event_date && (p.type === 'event' || p.type === 'project'));

        const sentReminders = [];

        for (const p of upcoming) {
            const eventDate = new Date(p.event_date);
            const today = new Date();
            
            // Normalize dates to midnight for accurate day difference
            const tDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const eDate = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
            
            const diffTime = eDate.getTime() - tDate.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // Logic: Send reminder every 2 days if diffDays <= 10
            // Specifically: 10, 8, 6, 4, 2 days remaining
            const shouldSend = diffDays > 0 && diffDays <= 10 && diffDays % 2 === 0;

            if (shouldSend) {
                console.log(`[Reminders] Triggering reminder for "${p.title}" - ${diffDays} days left`);
                
                // Generate AI Content
                const aiContent = await generateNewsletterReminder({
                    title: p.title,
                    description: p.description,
                    type: p.type,
                    slug: p.slug,
                    image_url: p.image_url,
                    event_date: p.event_date,
                    rsvp_link: p.rsvp_link
                });

                if (aiContent) {
                    // Send Newsletter
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
