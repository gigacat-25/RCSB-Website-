import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await apiFetch("/api/team", {
      method: "POST",
      body: JSON.stringify(body),
    });
    revalidatePath("/team");
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const team = await apiFetch("/api/team");
    return NextResponse.json(team);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
