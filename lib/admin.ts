// NOTE: These are used for UI visibility only. 
// The Cloudflare Worker SQL database (authorized_admins table) 
// is the source of truth for authorization.
export const SUPER_ADMIN = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "rscbadmin@rotract.com").toLowerCase();

export function isAdmin(email?: string | null, roleMetadata?: any) {
  if (!email) return false;
  if (email.toLowerCase() === SUPER_ADMIN) return true;
  // Accept both 'editor' and 'admin' roles from Clerk metadata
  if (roleMetadata === 'editor' || roleMetadata === 'admin') return true;
  return false;
}

/**
 * Checks if a user is authorized in the Cloudflare Worker's database.
 * Use this as a fallback when Clerk roles are not yet set.
 */
export async function isAuthorized(email?: string | null, roleMetadata?: any) {
  if (!email) return false;
  
  // 1. Check local/Clerk indicators (fast)
  if (isAdmin(email, roleMetadata)) return true;

  // 2. Check Worker Database (slow but source of truth for "given access")
  try {
    const { apiFetch } = await import("./api");
    const check = await apiFetch(`/api/authorized-admins/check?email=${encodeURIComponent(email)}`);
    return !!(check && check.role);
  } catch (error) {
    console.error("Database authorization check failed:", error);
    return false;
  }
}

export function isSuperAdmin(email?: string | null) {
  if (!email) return false;
  return email.toLowerCase() === SUPER_ADMIN;
}

export type UserRole = "superadmin" | "editor" | "blogger";

export function getUserRole(email?: string | null, roleMetadata?: any): UserRole {
  if (isSuperAdmin(email)) return "superadmin";
  if (isAdmin(email, roleMetadata)) return "editor";
  return "blogger";
}
