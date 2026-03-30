"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { isAdmin, isSuperAdmin } from "@/lib/admin";
import { DocumentTextIcon, UsersIcon, EnvelopeIcon, Squares2X2Icon, BookOpenIcon, HandRaisedIcon, ClockIcon, ShieldCheckIcon, CogIcon, NewspaperIcon, TrophyIcon } from "@heroicons/react/24/outline";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: Squares2X2Icon },
  { name: "Projects & Events", href: "/admin/projects", icon: DocumentTextIcon },
  { name: "Awards", href: "/admin/awards", icon: TrophyIcon },
  { name: "Blogs", href: "/admin/blogs", icon: BookOpenIcon },
  { name: "Team Members", href: "/admin/team", icon: UsersIcon },
  { name: "Past Presidents", href: "/admin/past-presidents", icon: ClockIcon },
  { name: "Partners", href: "/admin/partners", icon: HandRaisedIcon },
  { name: "Newsletter", href: "/admin/newsletter", icon: NewspaperIcon },
  { name: "Inquiries", href: "/admin/messages", icon: EnvelopeIcon },
  { name: "Settings", href: "/admin/settings", icon: CogIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const userIsAdmin = isAdmin(email, user?.publicMetadata?.role);
  const userIsSuperAdmin = isSuperAdmin(email);

  return (
    <aside className="w-64 bg-brand-blue text-white h-screen flex flex-col fixed left-0 top-0 overflow-y-auto custom-scrollbar">
      <div className="p-6">
        <h2 className="text-2xl font-heading font-bold text-brand-gold">
          {userIsAdmin ? "RCSB Admin" : "RCSB Community"}
        </h2>
        <p className="text-xs text-blue-200 mt-1 uppercase tracking-widest">
          {userIsAdmin ? "Management Suite" : "Contributor Portal"}
        </p>
      </div>

      <nav className="flex-1 mt-6 px-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            // RBAC: If not admin, only show Dashboard and Blogs
            if (!userIsAdmin && item.name !== "Dashboard" && item.name !== "Blogs") {
              return null;
            }

            const label = !userIsAdmin && item.name === "Blogs" ? "My Stories" : item.name;

            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin");
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive
                    ? "bg-white/10 text-brand-gold font-bold"
                    : "text-blue-100 hover:bg-white/5 hover:text-white"
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}

          {userIsSuperAdmin && (
            <li className="pt-4 mt-4 border-t border-brand-gold/10">
              <Link
                href="/admin/access"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname === "/admin/access"
                  ? "bg-white/10 text-brand-gold font-bold"
                  : "text-brand-gold/60 hover:bg-white/5 hover:text-brand-gold"
                  }`}
              >
                <ShieldCheckIcon className="w-5 h-5" />
                <span>Access Control</span>
              </Link>
            </li>
          )}
        </ul>
      </nav>

      <div className="p-6 mt-auto">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full py-3 bg-brand-cranberry hover:bg-red-700 text-white font-bold rounded-xl transition-colors"
        >
          &larr; Exit {userIsAdmin ? "Admin" : "Portal"}
        </Link>
      </div>
    </aside>
  );
}
