export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_API_URL!;
const WORKER_SECRET = process.env.CLOUDFLARE_WORKER_SECRET!;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rcsb-website.pages.dev";
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || "updates@rcsb.in";

function buildEmailHtml(subject: string, body: string, unsubscribeUrl: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f1e;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#0d1528;border-radius:16px;overflow:hidden;border:1px solid rgba(255,215,0,0.15);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0a0f1e 0%,#1a2744 100%);padding:32px 40px;border-bottom:2px solid #C9982A;">
              <table width="100%">
                <tr>
                  <td>
                    <p style="margin:0;color:#C9982A;font-size:11px;text-transform:uppercase;letter-spacing:3px;">Rotaract Club of Swarna Bengaluru</p>
                    <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:700;">${subject}</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <div style="color:#c8d0e0;font-size:15px;line-height:1.7;">
                ${body}
              </div>
              <div style="margin-top:32px;">
                <a href="${SITE_URL}" style="display:inline-block;background:#C9982A;color:#0a0f1e;text-decoration:none;font-weight:700;padding:12px 28px;border-radius:8px;font-size:14px;">
                  Visit RCSB Website →
                </a>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#090e1a;padding:20px 40px;border-top:1px solid rgba(255,255,255,0.06);">
              <p style="margin:0;color:#556;font-size:11px;text-align:center;">
                © 2026 Rotaract Club of Swarna Bengaluru · Service Above Self
                <br/>
                <a href="${unsubscribeUrl}" style="color:#C9982A;text-decoration:underline;font-size:11px;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  // Allow internal server-to-server calls (e.g. 10-likes trigger) via x-internal-key
  const internalKey = req.headers.get("x-internal-key");
  const isInternalCall = internalKey === WORKER_SECRET;

  if (!isInternalCall) {
    // Protect for external admin usage — require Clerk auth
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const { subject, body } = await req.json();
    if (!subject || !body) {
      return NextResponse.json({ error: "subject and body are required" }, { status: 400 });
    }

    if (!RESEND_API_KEY || RESEND_API_KEY.includes('put_your_resend_api_key_here')) {
      return NextResponse.json({
        success: false,
        sent: 0,
        errors: ["Resend API Key is not configured. Please add RESEND_API_KEY to your .env.local."]
      });
    }

    // 1. Fetch subscribers from Worker
    const subsRes = await fetch(`${WORKER_URL}/api/newsletter/subscribers`, {
      headers: { Authorization: `Bearer ${WORKER_SECRET}` },
    });
    const subscribers: { email: string; name: string | null; token: string }[] = await subsRes.json();

    if (!subscribers.length) {
      return NextResponse.json({ success: true, sent: 0, message: "No subscribers" });
    }

    // 2. Send via Resend API
    let sent = 0;
    const errors: string[] = [];

    // Batch send emails (or send one by one if batching isn't straightforward)
    // For simplicity and direct unsubscribe links, we map and send in parallel or sequentially.
    for (const sub of subscribers) {
      if (!sub.token) {
        console.warn(`[Newsletter Send] Skipping ${sub.email} - missing unsubscribe token.`);
        continue;
      }
      const unsubUrl = `${SITE_URL}/unsubscribe?token=${sub.token}`;
      const html = buildEmailHtml(subject, body, unsubUrl);

      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: EMAIL_FROM,
            to: sub.email,
            subject: subject,
            html: html,
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Failed to send");
        }

        sent++;
      } catch (e: any) {
        errors.push(`${sub.email}: ${e.message}`);
      }
    }

    return NextResponse.json({ success: true, sent, total: subscribers.length, errors });
  } catch (err: any) {
    console.error("[Newsletter Send]", err);
    return NextResponse.json({ error: "Internal server error: " + err.message }, { status: 500 });
  }
}

