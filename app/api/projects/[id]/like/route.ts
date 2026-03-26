export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";

const WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_API_URL!;
const WORKER_SECRET = process.env.CLOUDFLARE_WORKER_SECRET!;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rcsb-website.pages.dev";

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;

    try {
        // Forward the like to the Worker
        const res = await fetch(`${WORKER_URL}/api/projects/${id}/like`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${WORKER_SECRET}`,
            },
        });

        const data = await res.json() as { likes: number };

        // When the blog hits exactly 10 likes, fire an email to all subscribers
        if (data.likes === 10) {
            // Fetch project details for the email
            const projectRes = await fetch(`${WORKER_URL}/api/projects/${id}`, {
                headers: { Authorization: `Bearer ${WORKER_SECRET}` },
            });
            const project = await projectRes.json() as any;

            const emailBody = `
        <p>Hey there! 👋</p>
        <p>The blog post <strong>"${project.title || "Trending Post"}"</strong> has just hit 10 likes on the Rotaract Swarna Bengaluru website — it's trending! 🔥</p>
        <p>
          <a href="${SITE_URL}/projects/${project.slug || id}" 
             style="color:#C9982A;font-weight:bold;">
            Read the trending post →
          </a>
        </p>
        <p>Check it out and join the conversation!</p>
      `;

            // Fire-and-forget — don't block the like response
            fetch(`${SITE_URL}/api/newsletter/send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Use an internal system key so no Clerk session needed
                    "x-internal-key": WORKER_SECRET,
                },
                body: JSON.stringify({
                    subject: `🔥 Trending on RCSB: "${project.title || "Popular Blog Post"}"`,
                    body: emailBody,
                    _internal: true, // bypass Clerk auth for internal calls
                }),
            }).catch(() => {/* non-critical, silent fail */ });
        }

        return NextResponse.json(data, { status: res.status });
    } catch (err) {
        console.error("[Like Proxy]", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
