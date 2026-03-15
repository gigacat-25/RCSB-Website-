import { NextResponse } from "next/server";
import { API_URL, API_SECRET } from "@/lib/api";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const res = await fetch(`${API_URL}/api/upload`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_SECRET}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json({ error }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
