export const runtime = 'edge';
import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";
import { currentUser } from "@clerk/nextjs/server";
import { isAdmin, SUPER_ADMIN } from "@/lib/admin";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!isAdmin(email, user?.publicMetadata?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const result = await apiFetch(`/api/messages/${params.id}`, {
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
    if (!isAdmin(email, user?.publicMetadata?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Permission Bridge: Proxy as SUPER_ADMIN to ensure worker allows deletion
    const result = await apiFetch(`/api/messages/${params.id}?user_email=${encodeURIComponent(SUPER_ADMIN)}`, {
      method: "DELETE",
    });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
