import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { apiFetch } from '@/lib/api';

export async function GET() {
    try {
        const client = await clerkClient();
        const users = await client.users.getUserList({ limit: 100 });

        const formattedUsers = users.data.map(u => ({
            id: u.id,
            name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Unknown',
            email: u.emailAddresses[0]?.emailAddress || '',
            role: (u.publicMetadata?.role as string) || 'user',
            imageUrl: u.imageUrl
        }));

        return NextResponse.json(formattedUsers);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { userId, email, name, action } = await request.json();
        const client = await clerkClient();

        if (action === 'grant') {
            try {
                // 1. Sync D1 Authorized Admins (for worker)
                await apiFetch("/api/authorized-admins", {
                    method: "POST",
                    body: JSON.stringify({ email, name, role: 'editor' }),
                });
            } catch (dbError: any) {
                // If it's already in the DB from a previous attempt, simply ignore the error 
                // and proceed to update Clerk.
                if (!dbError.message.includes("Email already authorized")) {
                    throw dbError;
                }
            }

            // 2. Update Clerk Metadata (for next.js frontend)
            await client.users.updateUserMetadata(userId, {
                publicMetadata: { role: 'editor' }
            });

            return NextResponse.json({ success: true });
        } else if (action === 'revoke') {
            // Find D1 record by email
            const d1Record = await apiFetch("/api/authorized-admins");
            const match = d1Record.find((r: any) => r.email === email);
            if (match) {
                await apiFetch(`/api/authorized-admins/${match.id}`, { method: "DELETE" });
            }

            // Update Clerk Metadata
            await client.users.updateUserMetadata(userId, {
                publicMetadata: { role: null }
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
