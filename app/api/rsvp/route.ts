export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const workerUrl = process.env.CLOUDFLARE_D1_API_URL;
    if (workerUrl) {
      const res = await fetch(`${workerUrl}/api/rsvp`, {
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

    console.log("[RSVP Submission]", body);
    return NextResponse.json({ success: true, message: "RSVP recorded (dev mode)" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
