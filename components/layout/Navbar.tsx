"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { isAdmin } from "@/lib/admin";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/projects", label: "Projects" },
  { href: "/awards", label: "Awards" },
  { href: "/blogs", label: "Blogs" },
  { href: "/team", label: "Leadership" },
  { href: "/contact", label: "Contact Us" },
];

function AuthSection({ scrolled = false }: { scrolled?: boolean }) {
  const { isSignedIn, isLoaded, user } = useUser();
  const { openSignIn, openSignUp, signOut, openUserProfile } = useClerk();

  if (!isLoaded) {
    return <div className="w-4 h-4 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" />;
  }

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/admin"
          className={`text-[11px] font-black uppercase tracking-[0.25em] whitespace-nowrap transition-colors ${
            scrolled ? "text-brand-blue hover:text-brand-azure" : "text-brand-gold hover:text-yellow-300"
          }`}
        >
          My Dashboard
        </Link>

        <button
          onClick={() => openUserProfile()}
          className="w-9 h-9 rounded-full overflow-hidden border-2 border-brand-gold/40 hover:border-brand-gold transition-colors shrink-0"
        >
          <img src={user?.imageUrl} alt="Profile" className="w-full h-full object-cover" />
        </button>

        <button
          onClick={() => signOut()}
          className={`text-[11px] font-bold uppercase tracking-[0.2em] whitespace-nowrap transition-colors ${
            scrolled ? "text-brand-gray hover:text-brand-blue" : "text-white/60 hover:text-white"
          }`}
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-5">
      <button
        onClick={() => openSignIn()}
        className={`text-[11px] font-black uppercase tracking-[0.25em] whitespace-nowrap transition-colors ${
          scrolled ? "text-brand-blue hover:text-brand-azure" : "text-white hover:text-brand-gold"
        }`}
      >
        Log In
      </button>

      <button
        onClick={() => openSignUp()}
        className="bg-brand-gold text-brand-blue text-[11px] font-black uppercase tracking-[0.2em] px-7 py-2.5 rounded-full hover:bg-yellow-400 transition-colors whitespace-nowrap shadow-md active:scale-95"
      >
        Join Us
      </button>
    </div>
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

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Background Layer — Handles Glassmorphism & Scrolled State */}
      <div 
        className={`absolute inset-0 transition-all duration-500 -z-10 ${
          scrolled || open
            ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100"
            : "bg-transparent"
        }`}
        style={{
          height: scrolled ? '72px' : '88px'
        }}
      />

      <div className={`max-w-screen-xl mx-auto px-6 md:px-8 flex items-center justify-between transition-all duration-500 ${
        scrolled ? "h-[72px]" : "h-[88px]"
      }`}>
        {/* Logo */}
        <Link href="/" className="shrink-0 relative z-50">
          <img
            src="/logo.png"
            alt="Rotaract Swarna Bengaluru"
            className={`transition-all duration-500 object-contain ${
              scrolled ? "h-12 md:h-14" : "h-16 md:h-20"
            }`}
          />
        </Link>

        {/* Desktop Nav Links — Center */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-[12px] font-bold uppercase tracking-[0.15em] whitespace-nowrap transition-colors duration-200 group ${
                  isActive
                    ? scrolled ? "text-brand-blue" : "text-white"
                    : scrolled
                    ? "text-brand-gray hover:text-brand-blue"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] bg-brand-gold rounded-full transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Auth — Right */}
        <div className="hidden lg:flex items-center gap-5">
          <div className={`h-5 w-px ${scrolled ? "bg-gray-300" : "bg-white/25"}`} />
          <AuthSection scrolled={scrolled} />
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className={`lg:hidden p-2 rounded-lg transition-colors relative z-50 ${
            open 
              ? "text-white" // Menu is dark, so X should be white
              : (scrolled ? "text-brand-blue hover:bg-gray-100" : "text-white hover:bg-white/10")
          }`}
          aria-label="Toggle menu"
        >
          <div className="w-6 flex flex-col gap-[5px]">
            <span className={`block h-[2px] bg-current rounded-full transition-all duration-300 ${open ? "rotate-45 translate-y-[7px] w-6" : "w-6"}`} />
            <span className={`block h-[2px] bg-current rounded-full transition-all duration-300 ${open ? "opacity-0" : "w-4"}`} />
            <span className={`block h-[2px] bg-current rounded-full transition-all duration-300 ${open ? "-rotate-45 -translate-y-[7px] w-6" : "w-5"}`} />
          </div>
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-[#0a0f1e]/98 backdrop-blur-2xl transition-all duration-500 z-40 ${
          open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8">
          {navLinks.map((link, idx) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`text-2xl font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                  isActive ? "text-brand-gold scale-110" : "text-white/60 hover:text-white"
                }`}
                style={{
                  transitionDelay: `${idx * 50}ms`
                }}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="w-full max-w-xs mt-4 pt-10 border-t border-white/10 flex flex-col gap-4">
            <MobileAuth />
          </div>
          
          <div className="mt-8 flex flex-col items-center gap-2 opacity-40">
             <img src="/logo.png" alt="RCSB" className="h-10 grayscale invert brightness-0" />
             <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white">Swarna Bengaluru</p>
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileAuth() {
  const { isSignedIn, isLoaded } = useUser();
  const { openSignIn, openSignUp, signOut } = useClerk();

  if (!isLoaded) return null;

  if (isSignedIn) {
    return (
      <>
        <Link href="/admin" className="w-full text-center py-3 rounded-xl text-sm font-bold bg-brand-gold text-brand-blue">
          My Dashboard
        </Link>
        <button onClick={() => signOut()} className="w-full text-center py-3 rounded-xl text-sm font-bold text-red-400 border border-red-900/30">
          Sign Out
        </button>
      </>
    );
  }

  return (
    <>
      <button onClick={() => openSignIn()} className="w-full py-3 text-white font-bold uppercase tracking-widest text-xs border border-white/20 rounded-xl">
        Sign In
      </button>
      <button onClick={() => openSignUp()} className="w-full py-3 text-brand-blue bg-brand-gold rounded-xl font-bold uppercase tracking-widest text-xs">
        Join Us
      </button>
    </>
  );
}
