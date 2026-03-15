export const runtime = 'edge';
import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";

import { currentUser } from "@clerk/nextjs/server";
import { isAdmin, getUserRole } from "@/lib/admin";

export async function POST(request: Request) {
  let email: string | undefined | null = null;
  try {
    const user = await currentUser();
    email = user?.primaryEmailAddress?.emailAddress;
    const body = await request.json();

    // Authorization logic:
    // 1. Admin can do anything.
    // 2. Blogger can ONLY create 'blog' type.
    const isUserAdmin = isAdmin(email);
    const userRole = getUserRole(email);

    if (!isUserAdmin && body.type !== "blog") {
      return NextResponse.json({ error: "Unauthorized: Only Admins can manage projects/events." }, { status: 403 });
    }

    // Attach author_email for tracking ownership
    const payload = { ...body, author_email: email };

    const result = await apiFetch("/api/projects", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Internal API Error [POST /api/admin/projects]:", {
      message: error.message,
      email
    });
    // Return a more descriptive error so the UI can show it
    return NextResponse.json({ 
      error: `Server Error: ${error.message}`, 
      details: error.message,
      email
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;
    const isUserAdmin = isAdmin(email);

    // If not admin, only fetch their own stories
    const endpoint = isUserAdmin ? "/api/projects" : `/api/projects?author=${encodeURIComponent(email || "")}`;
    let projects = await apiFetch(endpoint);

    // [SECURITY SAFEGUARD] 
    // Double-check filtering in the Next.js layer in case the Worker isn't upgraded yet
    if (!isUserAdmin && Array.isArray(projects)) {
      projects = projects.filter((p: any) => p.author_email === email);
    }

    return NextResponse.json(projects);
  } catch (error: any) {
    console.error("Internal API Error [GET /api/admin/projects]:", error);
    return NextResponse.json({ 
      error: "Internal Server Error during projects fetch.", 
      details: error.message 
    }, { status: 500 });
  }
}
