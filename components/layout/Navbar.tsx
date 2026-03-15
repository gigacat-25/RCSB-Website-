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
            className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity"
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? "bg-white/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] py-2 border-b border-white/20" 
        : "bg-transparent py-5"
    }`}>
      <div className="container-custom flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center group relative">
          <div className="absolute -inset-2 bg-brand-gold/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <img 
            src="/logo.png" 
            alt="Rotaract Swarna Bengaluru Logo" 
            className={`h-20 w-auto object-contain transition-all duration-500 ${scrolled ? "scale-90" : "scale-100"}`}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          <ul className="flex items-center gap-8">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`text-[13px] font-bold uppercase tracking-[0.15em] transition-all duration-300 relative group py-2 ${
                      isActive 
                        ? (scrolled ? "text-brand-blue" : "text-white")
                        : (scrolled ? "text-brand-gray/80 hover:text-brand-blue" : "text-white/70 hover:text-white")
                    }`}
                  >
                    {label}
                    <span className={`absolute bottom-0 left-0 h-[2px] bg-brand-gold transition-all duration-300 rounded-full ${isActive ? "w-full" : "w-0 group-hover:w-full"}`} />
                  </Link>
                </li>
              );
            })}
          </ul>
          
          <div className="pl-6 border-l border-slate-200/50">
            <AuthSection />
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-3 text-brand-blue glass rounded-2xl focus:outline-none hover:scale-105 active:scale-95 transition-all"
          aria-label="Toggle menu"
        >
          <div className="w-6 flex flex-col gap-[6px]">
            <span className={`block h-[2px] bg-current rounded-full transition-all duration-300 ${open ? "rotate-45 translate-y-[8px] w-6" : "w-6"}`} />
            <span className={`block h-[2px] bg-current rounded-full transition-all duration-300 ${open ? "opacity-0" : "w-4"}`} />
            <span className={`block h-[2px] bg-current rounded-full transition-all duration-300 ${open ? "-rotate-45 -translate-y-[8px] w-6" : "w-5"}`} />
          </div>
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div className={`md:hidden absolute top-0 left-0 right-0 h-screen transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
      }`}>
        <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-2xl" />
        <div className="relative h-full flex flex-col items-center justify-center p-8">
          <button 
            onClick={() => setOpen(false)}
            className="absolute top-6 right-6 p-4 text-white hover:rotate-90 transition-transform duration-300"
          >
            <span className="text-4xl leading-none">&times;</span>
          </button>
          
          <nav className="flex flex-col items-center gap-8 w-full max-w-xs">
            {navLinks.map(({ href, label }, idx) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  style={{ transitionDelay: `${idx * 50}ms` }}
                  className={`text-2xl font-heading font-bold transition-all duration-500 ${
                    isActive
                      ? "text-brand-gold scale-110"
                      : "text-white/60 hover:text-white"
                  } ${open ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                >
                  {label}
                </Link>
              );
            })}
            <div className={`mt-10 w-full pt-10 border-t border-white/10 ${open ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"} transition-all duration-1000 delay-300`}>
              <AuthSection mobile />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
