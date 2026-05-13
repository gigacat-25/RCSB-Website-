// export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";

import { currentUser } from "@clerk/nextjs/server";
import { isAdmin, getUserRole, isAuthorized } from "@/lib/admin";

export async function POST(request: Request) {
  let email: string | undefined | null = null;
  try {
    const user = await currentUser();
    email = user?.primaryEmailAddress?.emailAddress;
    const body = await request.json();
    const userRole = user?.publicMetadata?.role;
    
    // [SECURITY FIX] Check both Clerk and Database authorization
    const isUserAuthorized = await isAuthorized(email, userRole);
    
    if (!isUserAuthorized && body.type !== "blog") {
      return NextResponse.json({ error: "Unauthorized: Only Admins can manage projects/events." }, { status: 403 });
    }

    // Attach author_email for tracking ownership
    const payload = { ...body, author_email: email };

    // [FIX] Ensure gallery_urls and featured_links are strings before sending to Worker
    // This prevents D1_TYPE_ERROR: Type 'object' not supported
    if (payload.gallery_urls && typeof payload.gallery_urls !== 'string') {
      payload.gallery_urls = JSON.stringify(payload.gallery_urls);
    }
    if (payload.featured_links && typeof payload.featured_links !== 'string') {
      payload.featured_links = JSON.stringify(payload.featured_links);
    }

    const result = await apiFetch("/api/projects", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    // If a new event, blog or project is created, announce it via newsletter
    if (result.success && (body.type === 'event' || body.type === 'blog' || body.type === 'project')) {
      const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
      
      // Perform AI generation and newsletter sending in the background
      (async () => {
        try {
          console.log(`[Automation] Generating AI newsletter for ${body.type}: ${body.title}`);
          const { generateNewsletterContent } = await import("@/lib/newsletter-utils");
          
          const aiContent = await generateNewsletterContent({
            title: body.title,
            description: body.description,
            type: body.type,
            slug: body.slug,
            image_url: body.image_url,
            event_date: body.event_date,
            rsvp_link: body.rsvp_link
          });

          console.log(`[Automation] Sending AI-generated newsletter: ${aiContent.subject}`);

          // Sync members automatically before sending
          console.log(`[Automation] Syncing web users to subscriber list...`);
          await fetch(`${SITE_URL}/api/newsletter/sync-users`, {
            method: "POST",
            headers: {
              "x-internal-key": process.env.CLOUDFLARE_WORKER_SECRET || "",
            },
          }).catch(err => console.error("[Automation] Sync failed (continuing anyway):", err));

          await fetch(`${SITE_URL}/api/newsletter/send`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-internal-key": process.env.CLOUDFLARE_WORKER_SECRET || "",
            },
            body: JSON.stringify({
              subject: aiContent.subject,
              body: aiContent.body,
            }),
          });
          console.log(`[Automation] Newsletter broadcast initiated successfully.`);
        } catch (err) {
          console.error("[Automation] Newsletter auto-send failed:", err);
        }
      })();
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Internal API Error [POST /api/admin/projects]:", {
      message: error.message,
      email
    });
    // Return a more descriptive error so the UI can show it
    return NextResponse.json({
      error: `Server Error: ${error.message}`,
      details: error.message,
      email
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;
    const isUserAdmin = isAdmin(email, user?.publicMetadata?.role);

    // If not admin, only fetch their own stories
    const baseEndpoint = isUserAdmin ? "/api/projects?show_trash=true" : `/api/projects?author=${encodeURIComponent(email || "")}&show_trash=true`;
    const endpoint = `${baseEndpoint}${baseEndpoint.includes('?') ? '&' : '?'}t=${Date.now()}`;
    let projects = await apiFetch(endpoint, { cache: "no-store", headers: { "Cache-Control": "no-cache" } });

    // [SECURITY SAFEGUARD] 
    // Double-check filtering in the Next.js layer in case the Worker isn't upgraded yet
    if (!isUserAdmin && Array.isArray(projects)) {
      projects = projects.filter((p: any) => p.author_email === email);
    }

    return NextResponse.json(projects);
  } catch (error: any) {
    console.error("Internal API Error [GET /api/admin/projects]:", error);
    return NextResponse.json({
      error: "Internal Server Error during projects fetch.",
      details: error.message
    }, { status: 500 });
  }
}
