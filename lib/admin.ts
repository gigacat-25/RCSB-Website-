export const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "thejaswinps@gmail.com";

export function isAdmin(email?: string | null) {
  if (!email) return false;
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
