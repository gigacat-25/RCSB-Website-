"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  userIsAdmin: boolean;
}

export default function AdminLayoutClient({ children, userIsAdmin }: AdminLayoutClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen h-[100dvh] bg-brand-light relative overflow-hidden">
      {/* Sidebar Navigation */}
      <AdminSidebar
        userIsAdmin={userIsAdmin}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 w-full md:ml-64 flex flex-col min-w-0 h-full overflow-hidden transition-all">
        <AdminHeader onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-full min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
}
