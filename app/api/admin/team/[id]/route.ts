import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await apiFetch(`/api/team/${params.id}`, {
      method: "DELETE",
    });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
