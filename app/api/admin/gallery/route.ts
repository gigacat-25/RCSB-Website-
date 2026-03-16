import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL!;
const WORKER_SECRET = process.env.WORKER_SECRET!;

// GET /api/admin/gallery — fetch all slides (proxied from Worker public endpoint)
export async function GET() {
  const res = await fetch(`${WORKER_URL}/api/gallery`);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

// POST /api/admin/gallery — create a new slide
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const res = await fetch(`${WORKER_URL}/api/gallery`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${WORKER_SECRET}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
