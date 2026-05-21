export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email-utils";

const WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_API_URL!;
const WORKER_SECRET = process.env.CLOUDFLARE_WORKER_SECRET!;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        if (!body.email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const res = await fetch(`${WORKER_URL}/api/newsletter/subscribe`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${WORKER_SECRET}`,
            },
            body: JSON.stringify({
                email: body.email,
                name: body.name || null,
                forceResubscribe: body.forceResubscribe !== false
            }),
        });

        const data = await res.json();

        // 3. Trigger n8n automation (New Subscriber)
        if (res.ok && body.email) {
            const { triggerN8NWebhook } = await import("@/lib/newsletter-utils");
            triggerN8NWebhook("user_subscribed", {
                email: body.email,
                name: body.name || null,
                subscribed_at: new Date().toISOString(),
                source: "website_footer"
            }).catch(err => console.error("[Newsletter Subscribe] n8n trigger failed:", err));

            // Optional: Internal welcome email (can be removed if n8n handles it)
            const userSubject = "Welcome to the RCSB Newsletter!";
            const userBody = `
                <p>Hi ${body.name || "there"},</p>
                <p>Thank you for subscribing to the Rotaract Club of Swarna Bengaluru newsletter!</p>
                <p>You are now part of our community. We'll keep you updated with our latest projects, events, and impact stories.</p>
                <p>Stay tuned for exciting updates!</p>
                <p style="margin-top:24px;">Best regards,<br/><strong>Rotaract Club of Swarna Bengaluru</strong></p>
            `;

            sendEmail(body.email, userSubject, userBody).catch(err => 
                console.error("[Newsletter Subscribe] Welcome email failed:", err)
            );
        }

        return NextResponse.json(data, { status: res.status });
    } catch (err) {
        console.error("[Newsletter Subscribe]", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
