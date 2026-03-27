export const runtime = 'edge';
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_API_URL!;
const WORKER_SECRET = process.env.CLOUDFLARE_WORKER_SECRET!;

export async function DELETE() {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const res = await fetch(`${WORKER_URL}/api/newsletter/purge`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${WORKER_SECRET}` },
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (err: any) {
        console.error("[Purge Subscribers]", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
