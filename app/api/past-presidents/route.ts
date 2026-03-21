export const runtime = 'edge';
import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";

export async function GET() {
    try {
        const data = await apiFetch("/api/past-presidents");
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
