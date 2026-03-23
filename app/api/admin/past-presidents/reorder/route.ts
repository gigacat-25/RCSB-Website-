export const runtime = 'edge';
import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = await apiFetch("/api/past-presidents/reorder", {
            method: "POST",
            body: JSON.stringify(body),
        });
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
