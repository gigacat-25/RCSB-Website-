export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import {
  sendEmail,
  getGmailAccessToken,
  createRawEmail,
  buildEmailHtml
} from "@/lib/email-utils";

const WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_API_URL!;
const WORKER_SECRET = process.env.CLOUDFLARE_WORKER_SECRET!;
const SITE_URL = "https://rotaractswarnabengaluru.in";

// Gmail API Config for local constants
const GMAIL_REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
const GMAIL_USER = process.env.GMAIL_USER || "rcsb.allert@gmail.com";
const EMAIL_FROM = process.env.EMAIL_FROM || `Rotaract Swarna Bengaluru <${GMAIL_USER}>`;

export async function POST(req: NextRequest) {
  const internalKey = req.headers.get("x-internal-key");
  const isInternalCall = internalKey === WORKER_SECRET;

  if (!isInternalCall) {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

    try {
        const { subject, body, targetEmails } = await req.json();
        if (!subject || !body) {
            return NextResponse.json({ error: "subject and body are required" }, { status: 400 });
        }

        console.log("[Newsletter] Gmail Send Request:", { subject, selective: !!targetEmails });

        if (!GMAIL_REFRESH_TOKEN || GMAIL_REFRESH_TOKEN.includes('put_your')) {
            console.error("[Newsletter] GMAIL_REFRESH_TOKEN is missing or placeholder.");
            return NextResponse.json({
                success: false,
                sent: 0,
                errors: ["Gmail API is not configured correctly. Check .env.local"]
            });
        }

        // 1. Get Google Access Token
        console.log("[Newsletter] Refreshing Gmail Access Token...");
        const accessToken = await getGmailAccessToken();

        // 2. Fetch subscribers from Worker
        console.log("[Newsletter] Fetching subscribers from Worker...");
        const subsRes = await fetch(`${WORKER_URL}/api/newsletter/subscribers`, {
            headers: { Authorization: `Bearer ${WORKER_SECRET}` },
        });

        if (!subsRes.ok) {
            const errText = await subsRes.text();
            throw new Error(`Failed to fetch subscribers: ${errText}`);
        }

        let subscribers: { email: string; name: string | null; token: string }[] = await subsRes.json();
        console.log(`[Newsletter] Found ${subscribers.length} total subscribers.`);

        // --- BYPASS SUBREQUEST LIMIT BY SELF-CHUNKING ---
        const origin = new URL(req.url).origin;
        const isBulkSend = !targetEmails || !Array.isArray(targetEmails) || targetEmails.length === 0;

        if (isBulkSend && subscribers.length > 35) {
            console.log(`[Newsletter] Bulk send requested for ${subscribers.length} subscribers. Chunking to bypass Cloudflare subrequest limits...`);
            
            const chunkSize = 35;
            const chunks: string[][] = [];
            for (let i = 0; i < subscribers.length; i += chunkSize) {
                chunks.push(subscribers.slice(i, i + chunkSize).map(s => s.email));
            }

            console.log(`[Newsletter] Split into ${chunks.length} chunks. Dispatching chunk requests...`);
            
            const chunkPromises = chunks.map((chunkEmails, index) => {
                return fetch(`${origin}/api/newsletter/send`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-internal-key": WORKER_SECRET,
                    },
                    body: JSON.stringify({
                        subject,
                        body,
                        targetEmails: chunkEmails
                    })
                }).then(async (res) => {
                    if (!res.ok) {
                        const errText = await res.text();
                        console.log(`[Newsletter] Chunk ${index + 1} failed: ${errText}`);
                        return { success: false, error: errText, sent: 0, errors: [] };
                    }
                    const data = await res.json() as any;
                    return { success: true, sent: data.sent || 0, errors: data.errors || [], error: null };
                }).catch(e => {
                    console.error(`[Newsletter] Network error for chunk ${index + 1}:`, e);
                    return { success: false, error: e.message, sent: 0, errors: [] };
                });
            });

            const results = await Promise.all(chunkPromises);
            
            let totalSent = 0;
            const allErrors: string[] = [];
            results.forEach((r, idx) => {
                if (r.success) {
                    totalSent += r.sent;
                    if (r.errors && r.errors.length > 0) {
                        allErrors.push(...r.errors);
                    }
                } else {
                    allErrors.push(`Chunk ${idx + 1} execution failed: ${r.error}`);
                }
            });

            return NextResponse.json({
                success: true,
                sent: totalSent,
                total: subscribers.length,
                errors: allErrors
            });
        }

        // Filter if targetEmails is provided
        if (targetEmails && Array.isArray(targetEmails) && targetEmails.length > 0) {
            const dbEmails = new Set(subscribers.map(s => s.email));
            const targetedDbSubs = subscribers.filter(sub => targetEmails.includes(sub.email));
            
            // Add custom emails not in DB
            const customSubs = targetEmails
                .filter((email: string) => !dbEmails.has(email))
                .map((email: string) => ({ email, name: null, token: "" }));
            
            subscribers = [...targetedDbSubs, ...customSubs];
            console.log(`[Newsletter] Filtered to ${subscribers.length} targeted subscribers.`);
        }

        if (!subscribers.length) {
            return NextResponse.json({ success: true, sent: 0, message: "No subscribers found." });
        }

        // 3. Send via Gmail API
        let sent = 0;
        const errors: string[] = [];

        for (const sub of subscribers) {
            const unsubUrl = sub.token ? `${SITE_URL}/unsubscribe?token=${sub.token}` : undefined;
      const html = buildEmailHtml(subject, body, unsubUrl, true);
      const raw = createRawEmail(sub.email, EMAIL_FROM, subject, html);

      try {
        const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/send`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ raw }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error?.message || "Failed to send to Google API");
        }

        sent++;
        console.log(`[Newsletter] Successfully sent to ${sub.email}`);
      } catch (e: any) {
        console.error(`[Newsletter] Error sending to ${sub.email}:`, e.message);
        errors.push(`${sub.email}: ${e.message}`);
      }
    }

    return NextResponse.json({ success: true, sent, total: subscribers.length, errors });
  } catch (err: any) {
    console.error("[Newsletter Gmail Send Error]", err);
    return NextResponse.json({ error: "Internal server error: " + err.message }, { status: 500 });
  }
}

