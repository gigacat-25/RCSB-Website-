"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { isAdmin } from "@/lib/admin";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/blogs", label: "Blogs" },
  { href: "/team", label: "Leadership" },
  { href: "/contact", label: "Contact Us" },
];

function AuthSection({ mobile = false }: { mobile?: boolean }) {
  const { isSignedIn, isLoaded, user } = useUser();
  const { openSignIn, signOut, openUserProfile } = useClerk();
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const isUserAdmin = isAdmin(userEmail);

  if (!isLoaded) return null;

  if (isSignedIn) {
    return mobile ? (
      <div className="flex flex-col gap-2 w-full">
        {isUserAdmin && (
          <Link 
            href="/admin" 
            className="w-full text-center py-3 rounded-lg text-sm font-bold bg-brand-gold text-brand-blue hover:bg-white transition-colors border border-brand-gold"
          >
            Admin Dashboard
          </Link>
        )}
        <button 
          onClick={() => openUserProfile()}
          className="w-full flex items-center justify-center gap-3 px-2 py-3 text-brand-blue font-semibold hover:bg-gray-100 rounded-lg transition-colors"
        >
          <img src={user?.imageUrl} alt="Profile" className="w-8 h-8 rounded-full" />
          <span>Manage Account</span>
        </button>
      </div>
    ) : (
      <div className="flex items-center gap-6">
        {isUserAdmin && (
          <Link 
            href="/admin" 
            className="text-xs font-bold text-brand-gold uppercase tracking-widest hover:text-brand-azure transition-colors"
          >
            Dashboard
          </Link>
        )}
        <div className="flex items-center gap-4">
          <button onClick={() => openUserProfile()} className="hover:scale-105 transition-transform">
            <img src={user?.imageUrl} alt="Profile" className="w-8 h-8 rounded-full border-2 border-brand-azure" />
          </button>
          <button 
            onClick={() => signOut()} 
            className="text-sm font-medium text-gray-500 hover:text-brand-cranberry transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <button 
      onClick={() => openSignIn()}
      className={`font-semibold rounded-full transition-colors ${
        mobile 
          ? "w-full py-3 text-brand-white bg-brand-blue hover:bg-brand-blue/90" 
          : "px-6 py-2.5 text-sm text-brand-white bg-brand-blue hover:bg-brand-blue/90 shadow-md hover:shadow-lg"
      }`}
    >
      Admin Login
    </button>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);
  
  // Don't show public navbar on admin routes
  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-md shadow-md py-3" : "bg-white/40 backdrop-blur-md py-5 border-b border-white/20"}`}>
      <div className="container-custom flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <img 
            src="/logo.png" 
            alt="Rotaract Swarna Bengaluru Logo" 
            className="h-24 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`text-sm font-semibold transition-colors ${
                      isActive 
                        ? "text-brand-azure" 
                        : "text-brand-gray hover:text-brand-blue"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
          
          <div className="pl-6 border-l border-gray-200">
            <AuthSection />
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-brand-blue focus:outline-none"
          aria-label="Toggle menu"
        >
          <div className="w-6 flex flex-col gap-[6px]">
            <span className={`block h-[2px] bg-current rounded-full transition-transform duration-300 ${open ? "rotate-45 translate-y-[8px]" : ""}`} />
            <span className={`block h-[2px] bg-current rounded-full transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
            <span className={`block h-[2px] bg-current rounded-full transition-transform duration-300 ${open ? "-rotate-45 -translate-y-[8px]" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100">
          <nav className="container-custom py-4 flex flex-col gap-2">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`block py-3 px-4 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-brand-light text-brand-blue"
                      : "text-brand-gray hover:bg-gray-50 hover:text-brand-blue"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            <div className="mt-4 pt-4 border-t border-gray-100 px-4">
              <AuthSection mobile />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
