import { NextRequest, NextResponse } from "next/server";

const WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_API_URL!;
const WORKER_SECRET = process.env.CLOUDFLARE_WORKER_SECRET!;

export async function GET(req: NextRequest) {
    const token = req.nextUrl.searchParams.get("token");
    if (!token) {
        return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    try {
        const res = await fetch(
            `${WORKER_URL}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`,
            {
                headers: { Authorization: `Bearer ${WORKER_SECRET}` },
            }
        );
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (err) {
        console.error("[Newsletter Unsubscribe]", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
