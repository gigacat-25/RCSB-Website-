export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_API_URL!;
const WORKER_SECRET = process.env.CLOUDFLARE_WORKER_SECRET!;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rcsb-website.pages.dev";

// Gmail API Config
const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const GMAIL_REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
const GMAIL_USER = process.env.GMAIL_USER || "rcsb.allert@gmail.com";
const EMAIL_FROM = process.env.EMAIL_FROM || `Rotaract Swarna Bengaluru <${GMAIL_USER}>`;

async function getGmailAccessToken() {
  const params = new URLSearchParams({
    client_id: GMAIL_CLIENT_ID!,
    client_secret: GMAIL_CLIENT_SECRET!,
    refresh_token: GMAIL_REFRESH_TOKEN!,
    grant_type: 'refresh_token',
  });

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(`Failed to refresh Gmail token: ${JSON.stringify(errorData)}`);
  }

  const data = await res.json();
  return data.access_token;
}

// Helper for Edge-safe Base64 encoding (handles UTF-8)
function encodeB64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function encodeB64Url(str: string): string {
  return encodeB64(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function createRawEmail(to: string, from: string, subject: string, html: string): string {
  const utf8Subject = `=?utf-8?B?${encodeB64(subject)}?=`;

  const emailLines = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${utf8Subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset=utf-8`,
    `Content-Transfer-Encoding: base64`,
    ``,
    encodeB64(html),
  ];

  return encodeB64Url(emailLines.join('\r\n'));
}

function buildEmailHtml(subject: string, body: string, unsubscribeUrl: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    body { background: #0a0f1e; color: #c8d0e0; font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 40px auto; background: #0d1528; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,215,0,0.15); }
    .header { background: linear-gradient(135deg,#0a0f1e 0%,#1a2744 100%); padding: 32px 40px; border-bottom: 2px solid #C9982A; }
    .content { padding: 32px 40px; }
    .footer { background: #090e1a; padding: 20px 40px; border-top: 1px solid rgba(255,255,255,0.06); text-align: center; }
  </style>
</head>
<body style="margin:0;padding:40px 0;background:#0a0f1e;">
  <div class="container" style="max-width: 600px; margin: 0 auto; background: #0d1528; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,215,0,0.15);">
    <div class="header" style="background: linear-gradient(135deg,#0a0f1e 0%,#1a2744 100%); padding: 32px 40px; border-bottom: 2px solid #C9982A;">
      <div style="margin-bottom:20px; background:#ffffff; display:inline-block; padding:8px; border-radius:8px; line-height: 0;">
        <img src="https://rcsb-website.pages.dev/logo.png" alt="RCSB Logo" style="height:44px; width:auto; border:0; display:block;" />
      </div>
      <p style="margin:0;color:#C9982A;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:700;">Rotaract Club of Swarna Bengaluru</p>
      <h1 style="margin:8px 0 0;color:#ffffff;font-size:24px;font-weight:900;letter-spacing:-0.5px;">${subject}</h1>
    </div>
    <div class="content" style="padding: 32px 40px; color:#c8d0e0; font-size:15px; line-height: 1.7;">
      ${body}
      <div style="margin-top:32px;">
        <a href="${SITE_URL}" style="display:inline-block;background:#C9982A;color:#0a0f1e;text-decoration:none;font-weight:700;padding:12px 28px;border-radius:8px;font-size:14px;">
          Visit the Website →
        </a>
      </div>
    </div>
    <div class="footer" style="background:#090e1a; padding:40px 40px; border-top: 1px solid rgba(255,255,255,0.06); text-align:center;">
      <div style="margin-bottom:28px;">
        <a href="https://www.instagram.com/rotaract_swarnabengaluru" style="display:inline-block; margin:0 10px; text-decoration:none;">
          <img src="https://img.icons8.com/ios-filled/50/C9982A/instagram-new.png" alt="IG" style="width:24px; height:24px;" />
        </a>
        <a href="https://www.facebook.com/rotaractswarnabengaluru/" style="display:inline-block; margin:0 10px; text-decoration:none;">
          <img src="https://img.icons8.com/ios-filled/50/C9982A/facebook-new.png" alt="FB" style="width:24px; height:24px;" />
        </a>
        <a href="https://linkedin.com/company/rotaract-club-of-swarna-bengaluru" style="display:inline-block; margin:0 10px; text-decoration:none;">
          <img src="https://img.icons8.com/ios-filled/50/C9982A/linkedin.png" alt="LI" style="width:24px; height:24px;" />
        </a>
        <a href="https://x.com/RCSwarnaB" style="display:inline-block; margin:0 10px; text-decoration:none;">
          <img src="https://img.icons8.com/ios-filled/50/C9982A/twitterx.png" alt="X" style="width:24px; height:24px;" />
        </a>
        <a href="https://www.youtube.com/channel/UCE4XQBKSjPs8rj5xyH6FOxA" style="display:inline-block; margin:0 10px; text-decoration:none;">
          <img src="https://img.icons8.com/ios-filled/50/C9982A/youtube-play.png" alt="YT" style="width:24px; height:24px;" />
        </a>
      </div>
      
      <div style="margin-bottom:24px; color:#c8d0e0; font-size:12px; line-height:1.6;">
        <p style="margin:0; font-weight:700; color:#ffffff;">Rotaract Club of Swarna Bengaluru</p>
        <p style="margin:4px 0 0;">Rotary House of Friendship, 11 Lavelle Road, Bengaluru</p>
        <p style="margin:2px 0 0;"><a href="mailto:rota.rcbs@gmail.com" style="color:#C9982A; text-decoration:none;">rota.rcbs@gmail.com</a> | <a href="${SITE_URL}" style="color:#C9982A; text-decoration:none;">Visit Website</a></p>
      </div>

      <p style="margin:0;color:#556677;font-size:10px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">
        © 2026 Rotaract Club of Swarna Bengaluru
      </p>
      <p style="margin:16px 0 0;color:#556677;font-size:11px;">
        You're receiving this because you're a member of the RCSB community.
        <br/><br/>
        <a href="${unsubscribeUrl}" style="color:#C9982A;text-decoration:underline;font-weight:600;">Unsubscribe from these emails</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

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
    const { subject, body } = await req.json();
    if (!subject || !body) {
      return NextResponse.json({ error: "subject and body are required" }, { status: 400 });
    }

    console.log("[Newsletter] Gmail Send Request:", { subject });

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

    const subscribers: { email: string; name: string | null; token: string }[] = await subsRes.json();
    console.log(`[Newsletter] Found ${subscribers.length} subscribers.`);

    if (!subscribers.length) {
      return NextResponse.json({ success: true, sent: 0, message: "No subscribers found." });
    }

    // 3. Send via Gmail API
    let sent = 0;
    const errors: string[] = [];

    for (const sub of subscribers) {
      if (!sub.token) continue;

      const unsubUrl = `${SITE_URL}/unsubscribe?token=${sub.token}`;
      const html = buildEmailHtml(subject, body, unsubUrl);
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

