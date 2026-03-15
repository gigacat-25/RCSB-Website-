export const runtime = 'edge';
import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_API_URL || "https://rcsb-api-worker.impact1-iceas.workers.dev";
const API_SECRET = process.env.CLOUDFLARE_WORKER_SECRET || "RCSB_Admin_Secure_Key_2026";

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/api/messages`, {
      headers: {
        "Authorization": `Bearer ${API_SECRET}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: `Worker returned ${res.status}: ${errText}` }, { status: res.status });
    }

    const messages = await res.json();
    return NextResponse.json(Array.isArray(messages) ? messages : []);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
