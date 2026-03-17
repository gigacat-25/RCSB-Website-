export const runtime = 'edge';
import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";

export const revalidate = 0;

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const team = await apiFetch(`/api/team?t=${Date.now()}`, { cache: "no-store", headers: { "Cache-Control": "no-cache" } });
        return NextResponse.json(team);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
