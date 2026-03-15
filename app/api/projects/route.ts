import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";

export const revalidate = 0;

export async function GET() {
  try {
    const projects = await apiFetch("/api/projects");
    return NextResponse.json(projects);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
