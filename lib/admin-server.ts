import { clerkClient } from "@clerk/nextjs/server";
import { SUPER_ADMIN } from "./admin";

/**
 * Gets the user's role from the Cloudflare Worker database.
 */
export async function getDatabaseRole(email?: string | null): Promise<string | null> {
  if (!email) return null;

  try {
    const workerUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_API_URL || "";
    const workerSecret = process.env.CLOUDFLARE_WORKER_SECRET || "";
    const res = await fetch(
      `${workerUrl}/api/authorized-admins/check?email=${encodeURIComponent(email)}`,
      { headers: { Authorization: `Bearer ${workerSecret}` } }
    );
    if (!res.ok) return null;
    const data = await res.json() as { role?: string };
    return data?.role || null;
  } catch (error) {
    console.error("Database role check failed:", error);
    return null;
  }
}

/**
 * Syncs the user's role from the database to Clerk metadata.
 */
export async function syncClerkRoleWithDatabase(
  userId: string,
  email: string,
  currentRole: any,
  targetRole: string
) {
  // If Clerk already has the correct role, skip updating
  if (currentRole === targetRole) return;

  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { role: targetRole }
    });
    console.log(`[Sync] Successfully synced Clerk role for ${email} to '${targetRole}'.`);
  } catch (e) {
    console.error(`[Sync] Failed to sync Clerk role for ${email}:`, e);
  }
}

/**
 * Auto-promotes the super admin email in Clerk public metadata if not already set.
 */
export async function checkAndPromoteSuperAdmin(userId: string, email: string, currentRole: any) {
  if (email.toLowerCase() === SUPER_ADMIN.toLowerCase() && currentRole !== 'admin') {
    try {
      const client = await clerkClient();
      await client.users.updateUserMetadata(userId, {
        publicMetadata: { role: 'admin' }
      });
      console.log(`[Sync] Auto-promoted Super Admin ${email} to 'admin' in Clerk.`);
      return true;
    } catch (e) {
      console.error(`[Sync] Failed to promote Super Admin ${email}:`, e);
    }
  }
  return false;
}
