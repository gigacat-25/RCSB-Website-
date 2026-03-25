import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
        return new NextResponse(
            `<!DOCTYPE html><html><head><title>Already done</title></head>
      <body style="font-family:sans-serif;text-align:center;padding:60px;background:#0a0f1e;color:white;">
        <h1 style="color:#C9982A;">Invalid Link</h1>
        <p>This unsubscribe link is invalid or has already been used.</p>
        <a href="/" style="color:#C9982A;">← Back to RCSB</a>
      </body></html>`,
            { status: 400, headers: { "Content-Type": "text/html" } }
        );
    }

    const WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_API_URL!;
    const WORKER_SECRET = process.env.CLOUDFLARE_WORKER_SECRET!;

    await fetch(`${WORKER_URL}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`, {
        headers: { Authorization: `Bearer ${WORKER_SECRET}` },
    });

    return new NextResponse(
        `<!DOCTYPE html><html lang="en"><head>
      <title>Unsubscribed | RCSB</title>
      <meta name="viewport" content="width=device-width,initial-scale=1"/>
      <style>
        body{margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#0a0f1e;font-family:Arial,sans-serif;}
        .card{background:#0d1528;border:1px solid rgba(201,152,42,0.2);border-radius:16px;padding:48px 40px;text-align:center;max-width:400px;width:90%;}
        h1{color:#C9982A;margin:0 0 12px;}p{color:#8899aa;font-size:14px;line-height:1.6;}
        a{display:inline-block;margin-top:24px;color:#C9982A;text-decoration:none;font-size:13px;}
      </style>
    </head>
    <body>
      <div class="card">
        <div style="font-size:48px;margin-bottom:16px;">✓</div>
        <h1>Unsubscribed</h1>
        <p>You've been successfully removed from our newsletter.<br/>You won't receive any more emails from us.</p>
        <a href="/">← Back to Rotaract Swarna Bengaluru</a>
      </div>
    </body></html>`,
        { headers: { "Content-Type": "text/html" } }
    );
}
