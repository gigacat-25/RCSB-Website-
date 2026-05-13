export const runtime = 'edge';
import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/admin";

export async function POST(request: Request) {
    const WORKER_SECRET = process.env.CLOUDFLARE_WORKER_SECRET!;
    const internalKey = request.headers.get("x-internal-key");
    const isInternalCall = internalKey === WORKER_SECRET;
    const client = await clerkClient();

    if (!isInternalCall) {
        const { userId } = await auth();
        const user = userId ? await client.users.getUser(userId) : null;
        const email = user?.primaryEmailAddress?.emailAddress;

        if (!isAdmin(email, user?.publicMetadata?.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    }

    try {
        // 1. Fetch all users from Clerk
        const { data: users } = await client.users.getUserList({ limit: 500 });

        let synced = 0;
        const origin = new URL(request.url).origin;

        // 2. Subscribe each user
        for (const u of users) {
            const uEmail = u.primaryEmailAddress?.emailAddress;
            if (!uEmail) continue;

            await fetch(`${origin}/api/newsletter/subscribe`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: uEmail,
                    name: u.fullName || u.firstName || null,
                    forceResubscribe: false
                }),
            }).catch(() => { });
            synced++;
        }

        return NextResponse.json({ success: true, synced });
    } catch (err: any) {
        console.error("[Sync Users]", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
