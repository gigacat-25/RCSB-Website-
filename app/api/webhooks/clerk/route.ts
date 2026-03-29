// app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { sendEmail } from '@/lib/email-utils';

export const runtime = 'edge';

const WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_API_URL!;
const WORKER_SECRET = process.env.CLOUDFLARE_WORKER_SECRET!;
const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(req: Request) {
    console.log(`[Clerk Webhook] Received request at ${new Date().toISOString()}`);

    if (!WEBHOOK_SECRET) {
        console.error(' [Clerk Webhook] Error: CLERK_WEBHOOK_SECRET is not set');
        return new Response('Error occured -- no webhook secret', {
            status: 500
        });
    }

    // Get the headers
    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occured -- no svix headers', {
            status: 400
        });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Error occured', {
            status: 400
        });
    }

    const eventType = evt.type;

    if (eventType === 'user.created') {
        const { id, email_addresses, first_name, last_name, image_url } = evt.data;
        const email = email_addresses[0]?.email_address;
        const name = `${first_name || ''} ${last_name || ''}`.trim() || 'Community Member';

        if (email) {
            console.log(`[Clerk Webhook] New user created: ${email} (${id})`);

            try {
                // 1. Send Welcome Email
                const subject = "Welcome to Rotaract Club of Swarna Bengaluru! 🌟";
                const emailBody = `
          <p>Hello ${first_name || 'there'}! 👋</p>
          <p>Welcome to <strong>Rotaract Club of Swarna Bengaluru (RCSB)</strong>! We're thrilled to have you join our vibrant community of young professionals committed to "Service Above Self".</p>
          <p>By joining us, you've taken the first step towards creating a lasting impact in Bengaluru and beyond. Here are a few things you can explore to get started:</p>
          <ul style="padding-left:20px; margin-bottom:24px;">
            <li style="margin-bottom:12px;"><strong>Meet the Team:</strong> Get to know the visionaries leading our club this term on our <a href="${process.env.NEXT_PUBLIC_SITE_URL}/team" style="color:#C9982A;text-decoration:none;font-weight:bold;">Leadership Page</a>.</li>
            <li style="margin-bottom:12px;"><strong>Our Impact:</strong> See the projects we've been working on and our journey so far in the <a href="${process.env.NEXT_PUBLIC_SITE_URL}/projects" style="color:#C9982A;text-decoration:none;font-weight:bold;">Projects & Events</a> section.</li>
            <li style="margin-bottom:12px;"><strong>Read Our Stories:</strong> Check out our <a href="${process.env.NEXT_PUBLIC_SITE_URL}/blogs" style="color:#C9982A;text-decoration:none;font-weight:bold;">Blog</a> for updates, experiences, and community highlights.</li>
          </ul>
          <p>We're excited to see the change we can create together. Feel free to reach out if you have any questions!</p>
          <p>Cheers,<br/><strong>The RCSB Team</strong></p>
        `;

                await sendEmail(email, subject, emailBody);
                console.log(`[Clerk Webhook] Welcome email sent to ${email}`);

                // 2. Auto-subscribe to newsletter (Worker D1 Sync)
                const subRes = await fetch(`${WORKER_URL}/api/newsletter/subscribe`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${WORKER_SECRET}`,
                    },
                    body: JSON.stringify({
                        email: email,
                        name: name,
                        forceResubscribe: false
                    }),
                });

                if (subRes.ok) {
                    console.log(`[Clerk Webhook] ${email} auto-subscribed to newsletter.`);
                } else {
                    console.error(`[Clerk Webhook] Failed to auto-subscribe ${email}:`, await subRes.text());
                }

            } catch (error) {
                console.error(`[Clerk Webhook] Error processing user.created for ${email}:`, error);
            }
        }
    }

    return new Response('', { status: 200 });
}
