export const ADMIN_EMAILS = [
  "thejaswinps@gmail.com",
  "pabt2024@gmail.com",
];

export function isAdmin(email?: string | null) {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export type UserRole = "admin" | "blogger";

export function getUserRole(email?: string | null): UserRole {
  if (isAdmin(email)) return "admin";
  return "blogger";
}
