export const runtime = 'edge';
import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";
import { currentUser } from "@clerk/nextjs/server";
import { isAdmin, SUPER_ADMIN } from "@/lib/admin";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const project = await apiFetch(`/api/projects/${params.id}`);
    return NextResponse.json(project);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 404 });
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

    // 2. Permission Check:
    const isOwner = existing && existing.author_email === email;
    if (!isUserAdmin && !isOwner) {
      return NextResponse.json({ error: "Unauthorized: Access Denied." }, { status: 403 });
    }

    // Pass body to worker
    const result = await apiFetch(`/api/projects/${params.id}`, {
      method: "PUT",
      body: JSON.stringify({ ...body, author_email: body.author_email || email }),
    });
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[PUT /api/admin/projects/[id]] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
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

    // 2. Permission Check:
    const isOwner = existing && existing.author_email === email;
    if (!isUserAdmin && !isOwner) {
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
    console.error("[DELETE /api/admin/projects/[id]] Failure:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
