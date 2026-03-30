export const runtime = 'edge';
import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";

export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const data = await apiFetch(`/api/projects?t=${Date.now()}`, { cache: "no-store", headers: { "Cache-Control": "no-cache" } });
    
    // Filter out trash at the API proxy level too for safety
    const projects = Array.isArray(data) 
      ? data.filter((p: any) => p.status !== 'trash') 
      : data;

    return NextResponse.json(projects);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
