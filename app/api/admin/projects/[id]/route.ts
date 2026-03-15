import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";
import { currentUser } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/admin";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;
    const isUserAdmin = isAdmin(email);
    const body = await request.json();

    // 1. Fetch existing project to check ownership
    const existing = await apiFetch(`/api/projects/${params.id}`);
    
    // 2. Permission Check:
    // - Admin can edit anything.
    // - Blogger can only edit their own 'blog' posts.
    const isOwner = existing.author_email === email;
    
    if (!isUserAdmin && !isOwner) {
      return NextResponse.json({ error: "Unauthorized: You can only edit your own stories." }, { status: 403 });
    }

    const result = await apiFetch(`/api/projects/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
    return NextResponse.json(result);
  } catch (error: any) {
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

    // Safety: Only Admins can delete content for now
    if (!isAdmin(email)) {
      return NextResponse.json({ error: "Access Denied: Only administrators can delete content." }, { status: 403 });
    }

    const result = await apiFetch(`/api/projects/${params.id}`, {
      method: "DELETE",
    });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
