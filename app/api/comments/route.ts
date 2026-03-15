export const runtime = 'edge';
import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";

export async function POST(request: Request) {
  try {
    const { projectId, ...commentData } = await request.json();
    
    if (!projectId) {
      return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
    }

    const result = await apiFetch(`/api/projects/${projectId}/comments`, {
      method: "POST",
      body: JSON.stringify(commentData),
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Comment Proxy Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
