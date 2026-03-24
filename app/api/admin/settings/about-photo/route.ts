export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";
import { currentUser } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/admin";

export async function POST(req: Request) {
    try {
        const user = await currentUser();
        const email = user?.primaryEmailAddress?.emailAddress;
        if (!isAdmin(email, user?.publicMetadata?.role)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

        const { url } = await req.json();

        // Get existing to find its ID
        const projects = await apiFetch("/api/projects?t=" + Date.now());
        const existing = Array.isArray(projects) ? projects.find((p: any) => p.slug === "site-setting-about-image") : null;

        if (existing) {
            const res = await apiFetch(`/api/projects/${existing.id}`, {
                method: "PUT",
                body: JSON.stringify({ ...existing, image_url: url, author_email: email })
            });
            return NextResponse.json(res);
        } else {
            const res = await apiFetch("/api/projects", {
                method: "POST",
                body: JSON.stringify({
                    title: "Site Setting: About Image",
                    slug: "site-setting-about-image",
                    category: "System",
                    description: "Stores the home page about section image.",
                    type: "system_setting",
                    image_url: url,
                    author_email: email
                })
            });
            return NextResponse.json(res);
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
