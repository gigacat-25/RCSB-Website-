export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";

export async function GET() {
    try {
        const partners = await apiFetch("/api/partners", { cache: "no-store" });
        return NextResponse.json(partners);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
