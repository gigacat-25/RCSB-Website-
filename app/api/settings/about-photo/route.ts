export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";

export async function GET() {
    try {
        const projects = await apiFetch("/api/projects?t=" + Date.now());
        const match = Array.isArray(projects) ? projects.find((p: any) => p.slug === "site-setting-about-image") : null;
        return NextResponse.json({ url: match?.image_url || "/group-photo-2.jpeg" });
    } catch (e) {
        return NextResponse.json({ url: "/group-photo-2.jpeg" });
    }
}
