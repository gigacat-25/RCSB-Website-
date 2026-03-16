export const runtime = "edge";

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL;
const WORKER_SECRET = process.env.WORKER_SECRET;

// GET /api/admin/gallery
export async function GET() {
  try {
    if (!WORKER_URL) {
      return NextResponse.json(
        { error: "WORKER_URL not configured" },
        { status: 500 }
      );
    }

    const res = await fetch(`${WORKER_URL}/api/gallery`);

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch gallery", details: String(error) },
      { status: 500 }
    );
  }
}

// POST /api/admin/gallery
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!WORKER_URL || !WORKER_SECRET) {
      return NextResponse.json(
        { error: "Worker environment variables missing" },
        { status: 500 }
      );
    }

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

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create gallery slide", details: String(error) },
      { status: 500 }
    );
  }
}