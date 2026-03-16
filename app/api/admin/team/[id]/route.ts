import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const member = await apiFetch(`/api/team/${params.id}`);
    return NextResponse.json(member);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const result = await apiFetch(`/api/team/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    revalidatePath("/team");
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
    const result = await apiFetch(`/api/team/${params.id}`, {
      method: "DELETE",
    });
    revalidatePath("/team");
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

