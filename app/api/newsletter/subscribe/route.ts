export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";

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
        return NextResponse.json(data, { status: res.status });
    } catch (err) {
        console.error("[Newsletter Subscribe]", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
