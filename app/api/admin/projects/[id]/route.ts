import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";
import { currentUser } from "@clerk/nextjs/server";
import { isAdmin, SUPER_ADMIN, isAuthorized } from "@/lib/admin";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "No project ID provided" }, { status: 400 });
    }
    const project = await apiFetch(`/api/projects/${id}`);
    return NextResponse.json(project);
  } catch (error: any) {
    console.error(`[GET /api/admin/projects/${params.id}] Error:`, error);
    // If it's a 404 from the API, we keep it as 404
    if (error.message.includes("404")) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;
    
    if (!email) {
      return NextResponse.json({ error: "Unauthorized: No session found." }, { status: 401 });
    }

    const isUserAdmin = isAdmin(email, user?.publicMetadata?.role);
    const body = await request.json();

    // 1. Fetch existing project to check ownership
    let existing;
    try {
      existing = await apiFetch(`/api/projects/${params.id}`);
    } catch (err) {
      return NextResponse.json({ error: "Record not found." }, { status: 404 });
    }

    // 2. Permission Check (Dual-check: Admin Role or Owner)
    const isOwner = existing && existing.author_email === email;
    const isUserAuthorized = await isAuthorized(email, user?.publicMetadata?.role);

    if (!isUserAuthorized && !isOwner) {
      return NextResponse.json({ error: "Unauthorized: Access Denied." }, { status: 403 });
    }

    // Pass body to worker
    // [FIX] Ensure gallery_urls and featured_links are strings before sending to Worker
    // This prevents D1_TYPE_ERROR: Type 'object' not supported
    const processedBody = { ...body };
    if (processedBody.gallery_urls && typeof processedBody.gallery_urls !== 'string') {
      processedBody.gallery_urls = JSON.stringify(processedBody.gallery_urls);
    }
    if (processedBody.featured_links && typeof processedBody.featured_links !== 'string') {
      processedBody.featured_links = JSON.stringify(processedBody.featured_links);
    }

    // THE KEY FIX: The Worker uses `author_email` to check authorization.
    // - Admins editing ANY content → send SUPER_ADMIN to bypass the Worker's ownership check.
    // - Regular users editing their OWN content → send their own email (ownership match).
    const authorEmailForWorker = isUserAuthorized ? SUPER_ADMIN : email;

    const result = await apiFetch(`/api/projects/${params.id}`, {
      method: "PUT",
      body: JSON.stringify({ ...processedBody, author_email: authorEmailForWorker }),
    });
    return NextResponse.json(result);
  } catch (error: any) {
    console.error(`[PUT /api/admin/projects/${params.id}] Failure:`, error);
    return NextResponse.json({ 
      error: `Failed to update project: ${error.message}`,
      details: error.message 
    }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;

    if (!email) {
      return NextResponse.json({ error: "Unauthorized: No session found." }, { status: 401 });
    }

    const isUserAdmin = isAdmin(email, user?.publicMetadata?.role);
    const url = new URL(request.url);
    const permanent = url.searchParams.get("permanent") === "true";

    // 1. Fetch existing project to check state
    let existing;
    try {
      existing = await apiFetch(`/api/projects/${params.id}`);
    } catch (err: any) {
      return NextResponse.json({ success: true, message: "Item was already removed." });
    }

    // 2. Permission Check (Dual-check: Admin Role or Owner)
    const isOwner = existing && existing.author_email === email;
    const isUserAuthorized = await isAuthorized(email, user?.publicMetadata?.role);

    if (!isUserAuthorized && !isOwner) {
      return NextResponse.json({ error: "Access Denied: You do not have permission to delete this." }, { status: 403 });
    }

    /**
     * BIN FEATURE (SOFT DELETE)
     * If 'permanent' is not true, we move the item to the trash bin 
     * by updating its status to 'trash' instead of a hard delete.
     */
    if (!permanent) {
      // 1. Check if already in bin
      if (existing.status === 'trash') {
        return NextResponse.json({ error: "Already in trash bin." }, { status: 400 });
      }

      // 2. Mark as trash
      const result = await apiFetch(`/api/projects/${params.id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...existing,
          status: 'trash',
          // We set updated_at to now for the 30-day countdown
          author_email: existing.author_email // Keep original owner
        }),
      });

      return NextResponse.json({ 
        success: true, 
        message: "Item moved to trash bin. You can restore it within 30 days.",
        movedToBin: true 
      });
    }

    // Hard Delete Logic (Permanent)
    const authorizedEmailForWorker = isUserAdmin ? SUPER_ADMIN : email;
    const result = await apiFetch(`/api/projects/${params.id}?user_email=${encodeURIComponent(authorizedEmailForWorker)}`, {
      method: "DELETE",
    });
    return NextResponse.json(result);

  } catch (error: any) {
    console.error(`[DELETE /api/admin/projects/${params.id}] Failure:`, error);
    return NextResponse.json({ 
      error: `Failed to delete project: ${error.message}`,
      details: error.message 
    }, { status: 500 });
  }
}
