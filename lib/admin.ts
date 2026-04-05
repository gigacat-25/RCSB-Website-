// NOTE: These are used for UI visibility only. 
// The Cloudflare Worker SQL database (authorized_admins table) 
// is the source of truth for authorization.
export const SUPER_ADMIN = "rscbadmin@rotaract.com";

export function isAdmin(email?: string | null, roleMetadata?: any) {
  if (!email) return false;
  if (email.toLowerCase() === SUPER_ADMIN) return true;
  if (roleMetadata === 'editor') return true;
  return false;
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
