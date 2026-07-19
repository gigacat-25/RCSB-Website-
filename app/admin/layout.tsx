import AdminLayoutClient from "@/components/admin/AdminLayoutClient";
import { currentUser } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/admin";
import { getDatabaseRole, syncClerkRoleWithDatabase, checkAndPromoteSuperAdmin } from "@/lib/admin-server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  
  let role = user?.publicMetadata?.role;
  
  if (user && email) {
    // 1. Promote Super Admin if needed
    const promoted = await checkAndPromoteSuperAdmin(user.id, email, role);
    if (promoted) {
      role = 'admin';
    } else if (!role || (role !== 'admin' && role !== 'editor')) {
      // 2. Otherwise check database role
      const dbRole = await getDatabaseRole(email);
      if (dbRole) {
        // Sync database role to Clerk in the background
        syncClerkRoleWithDatabase(user.id, email, role, dbRole);
        role = dbRole;
      }
    }
  }

  const userIsAdmin = isAdmin(email, role);

  return (
    <AdminLayoutClient userIsAdmin={userIsAdmin}>
      {children}
    </AdminLayoutClient>
  );
}
