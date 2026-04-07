import { currentUser } from "@clerk/nextjs/server";
import { SUPER_ADMIN, isAdmin, isSuperAdmin } from "@/lib/admin";

export default async function DebugAdminPage() {
    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;
    
    return (
        <div style={{ padding: '40px', fontFamily: 'monospace' }}>
            <h1>Admin Debug</h1>
            <pre>
                {JSON.stringify({
                    loggedInEmail: email,
                    envAdminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
                    libSuperAdminConstant: SUPER_ADMIN,
                    isAdminResult: isAdmin(email, user?.publicMetadata?.role),
                    isSuperAdminResult: isSuperAdmin(email),
                    publicMetadata: user?.publicMetadata
                }, null, 2)}
            </pre>
            <p>
                Try to visit this page while logged in as the Super Admin.
            </p>
        </div>
    );
}
