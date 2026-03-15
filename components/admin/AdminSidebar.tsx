"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: "⊞" },
  { name: "Projects", href: "/admin/projects", icon: "📂" },
  { name: "Team Leadership", href: "/admin/team", icon: "👥" },
  { name: "Messages", href: "/admin/messages", icon: "✉️" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-brand-blue text-white min-h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h2 className="text-2xl font-heading font-bold text-brand-gold">RCSB Admin</h2>
        <p className="text-xs text-blue-200 mt-1 uppercase tracking-widest">Management Suite</p>
      </div>
      
      <nav className="flex-1 mt-6 px-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin");
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? "bg-white/10 text-brand-gold font-bold"
                      : "text-blue-100 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-6 mt-auto">
        <Link 
          href="/" 
          className="flex items-center justify-center gap-2 w-full py-3 bg-brand-cranberry hover:bg-red-700 text-white font-bold rounded-xl transition-colors"
        >
          &larr; Exit Admin
        </Link>
      </div>
    </aside>
  );
}
