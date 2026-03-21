export const runtime = 'edge';
import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const data = await apiFetch(`/api/past-presidents/${params.id}`);
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const body = await request.json();
        const result = await apiFetch(`/api/past-presidents/${params.id}`, {
            method: "PUT",
            body: JSON.stringify(body),
        });
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const result = await apiFetch(`/api/past-presidents/${params.id}`, {
            method: "DELETE",
        });
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
