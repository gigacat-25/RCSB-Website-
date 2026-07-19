"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { isAdmin, isSuperAdmin } from "@/lib/admin";
import {
  DocumentTextIcon,
  UsersIcon,
  EnvelopeIcon,
  Squares2X2Icon,
  BookOpenIcon,
  HandRaisedIcon,
  ClockIcon,
  ShieldCheckIcon,
  CogIcon,
  NewspaperIcon,
  TrophyIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

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

interface AdminSidebarProps {
  userIsAdmin?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({
  userIsAdmin: propUserIsAdmin,
  isOpen = false,
  onClose
}: AdminSidebarProps = {}) {
  const pathname = usePathname();
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const userIsAdmin = propUserIsAdmin !== undefined 
    ? propUserIsAdmin 
    : isAdmin(email, user?.publicMetadata?.role);
  const userIsSuperAdmin = isSuperAdmin(email);

  // Lock background scroll when mobile sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Dark Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 bg-brand-blue text-white flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 flex flex-col items-center shrink-0 relative">
          {/* Mobile Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white/60 hover:text-white md:hidden"
              aria-label="Close Sidebar"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          )}

          <Link href="/" onClick={onClose} className="group mb-4">
            <div className="bg-white p-3 rounded-2xl shadow-xl shadow-black/20 group-hover:scale-105 transition-transform">
              <img src="/logo.png" alt="RCSB Logo" className="h-10 w-auto" />
            </div>
          </Link>
          <div className="text-center">
            <h2 className="text-lg font-heading font-black text-brand-gold tracking-tight">
              {userIsAdmin ? "RCSB Admin" : "RCSB Community"}
            </h2>
            <p className="text-[10px] text-blue-300 font-bold mt-0.5 uppercase tracking-[0.2em] opacity-80">
              {userIsAdmin ? "Management Suite" : "Contributor Portal"}
            </p>
          </div>
        </div>

        <nav className="flex-1 min-h-0 overflow-y-auto px-4 py-2 custom-scrollbar">
          <ul className="space-y-1.5">
            {navItems.map((item) => {
              if (!userIsAdmin && item.name !== "Dashboard" && item.name !== "Blogs") {
                return null;
              }

              const label = !userIsAdmin && item.name === "Blogs" ? "My Stories" : item.name;
              const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin");

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors text-sm ${
                      isActive
                        ? "bg-white/10 text-brand-gold font-bold"
                        : "text-blue-100 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}

            {userIsSuperAdmin && (
              <li className="pt-3 mt-3 border-t border-brand-gold/10">
                <Link
                  href="/admin/access"
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors text-sm ${
                    pathname === "/admin/access"
                      ? "bg-white/10 text-brand-gold font-bold"
                      : "text-brand-gold/60 hover:bg-white/5 hover:text-brand-gold"
                  }`}
                >
                  <ShieldCheckIcon className="w-5 h-5 flex-shrink-0" />
                  <span>Access Control</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <div className="p-4 shrink-0 mt-auto border-t border-white/10">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-brand-cranberry hover:bg-red-700 text-white font-bold rounded-xl transition-colors text-sm"
          >
            ← Exit Admin Panel
          </Link>
        </div>
      </aside>
    </>
  );
}
