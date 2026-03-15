import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await apiFetch("/api/projects", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const projects = await apiFetch("/api/projects");
    return NextResponse.json(projects);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
