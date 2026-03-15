import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // If Cloudflare Worker URL is set, proxy to it
    const workerUrl = process.env.CLOUDFLARE_D1_API_URL;
    if (workerUrl) {
      const res = await fetch(`${workerUrl}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CLOUDFLARE_WORKER_SECRET}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }

    // Fallback: log to console (dev mode without Worker)
    console.log("[Contact Submission]", body);
    return NextResponse.json({ success: true, message: "Message received (dev mode)" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
