import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL!;
const WORKER_SECRET = process.env.WORKER_SECRET!;

// PUT /api/admin/gallery/[id] — update a slide
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const res = await fetch(`${WORKER_URL}/api/gallery/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${WORKER_SECRET}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

// DELETE /api/admin/gallery/[id] — delete a slide
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const res = await fetch(`${WORKER_URL}/api/gallery/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${WORKER_SECRET}` },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
