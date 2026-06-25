import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { currentUser } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/admin";
import { getDatabaseRole, syncClerkRoleWithDatabase, checkAndPromoteSuperAdmin } from "@/lib/admin-server";
import { redirect } from "next/navigation";

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
    <div className="flex min-h-screen bg-brand-light">
      {/* Sidebar Navigation */}
      <AdminSidebar userIsAdmin={userIsAdmin} />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
