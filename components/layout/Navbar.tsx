"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
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

function UserAvatar({ user, size = "w-9 h-9" }: { user: any; size?: string }) {
  const [imgError, setImgError] = useState(false);
  const initials = user?.firstName
    ? `${user.firstName[0]}${user.lastName ? user.lastName[0] : ""}`.toUpperCase()
    : user?.username?.[0]?.toUpperCase() || user?.fullName?.[0]?.toUpperCase() || "U";

  if (!user?.imageUrl || imgError) {
    return (
      <div className={`${size} rounded-full bg-brand-gold text-brand-blue flex items-center justify-center font-bold text-xs shrink-0 select-none shadow-sm`}>
        {initials}
      </div>
    );
  }

  return (
    <div className={`${size} rounded-full overflow-hidden shrink-0 relative bg-brand-gold/20`}>
      <Image
        src={user.imageUrl}
        alt={user.fullName || "User profile"}
        fill
        sizes="36px"
        className="object-cover"
        unoptimized
        onError={() => setImgError(true)}
      />
    </div>
  );
}

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
          className={`text-[11px] font-black uppercase tracking-[0.25em] whitespace-nowrap transition-colors ${scrolled ? "text-brand-blue hover:text-brand-azure" : "text-brand-gold hover:text-yellow-300"
            }`}
        >
          My Dashboard
        </Link>

        <button
          onClick={() => openUserProfile()}
          className="rounded-full border-2 border-brand-gold/40 hover:border-brand-gold hover:scale-105 transition-all shrink-0 focus:outline-none focus:ring-2 focus:ring-brand-gold"
          title="Account Profile"
          aria-label="Open User Profile"
        >
          <UserAvatar user={user} size="w-9 h-9" />
        </button>

        <button
          onClick={() => signOut()}
          className={`text-[11px] font-bold uppercase tracking-[0.2em] whitespace-nowrap transition-colors ${scrolled ? "text-brand-gray hover:text-brand-blue" : "text-white/60 hover:text-white"
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
        className={`text-[11px] font-black uppercase tracking-[0.25em] whitespace-nowrap transition-colors ${scrolled ? "text-brand-blue hover:text-brand-azure" : "text-white hover:text-brand-gold"
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
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Background Layer — Handles Glassmorphism & Scrolled State */}
      <div
        className={`absolute inset-0 transition-all duration-500 -z-10 ${scrolled || open
            ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100"
            : "bg-transparent"
          }`}
        style={{
          height: scrolled ? '72px' : '88px'
        }}
      />

      <div className={`max-w-screen-xl mx-auto px-6 md:px-8 flex items-center justify-between transition-all duration-500 ${scrolled ? "h-[72px]" : "h-[88px]"
        }`}>
        {/* Logo */}
        <Link href="/" className="shrink-0 relative z-50 flex items-center">
          <Image
            src="/logo.png"
            alt="Rotaract Swarna Bengaluru"
            width={160}
            height={64}
            priority
            className={`transition-all duration-500 w-auto object-contain ${scrolled ? "h-12 md:h-14" : "h-16 md:h-20"
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
                className={`relative py-1 text-[12px] font-bold uppercase tracking-[0.15em] whitespace-nowrap transition-colors duration-300 group ${isActive
                    ? scrolled ? "text-brand-blue" : "text-white"
                    : scrolled
                      ? "text-brand-gray hover:text-brand-blue"
                      : "text-white/60 hover:text-white"
                  }`}
              >
                {link.label}
                {isActive ? (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1 left-0 h-[2.5px] bg-brand-gold rounded-full w-full"
                    transition={{ type: "spring", stiffness: 350, damping: 26 }}
                  />
                ) : (
                  <span className="absolute -bottom-1 left-0 h-[2px] bg-brand-gold/60 rounded-full w-0 group-hover:w-full transition-all duration-300" />
                )}
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
          className={`lg:hidden p-2 rounded-lg transition-colors relative z-50 ${open
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
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden fixed inset-0 bg-[#0a0f1e]/98 backdrop-blur-2xl z-40 overflow-y-auto"
          >
            <div className="flex flex-col items-center justify-center min-h-screen py-12 px-6 gap-6">
              {navLinks.map((link, idx) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + idx * 0.04, duration: 0.4, ease: "easeOut" }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`text-2xl font-black uppercase tracking-[0.2em] transition-all duration-300 ${isActive ? "text-white scale-110" : "text-brand-gold hover:text-white"
                        }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + navLinks.length * 0.04, duration: 0.4 }}
                className="w-full max-w-xs mt-4 pt-10 border-t border-white/10 flex flex-col gap-4"
              >
                <MobileAuth />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + navLinks.length * 0.04, duration: 0.5 }}
                className="mt-8 flex flex-col items-center gap-2 opacity-40"
              >
                <Image src="/logo.png" alt="RCSB" width={100} height={40} className="h-10 w-auto grayscale invert brightness-0 object-contain" />
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white">Swarna Bengaluru</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function MobileAuth() {
  const { isSignedIn, isLoaded, user } = useUser();
  const { openSignIn, openSignUp, signOut, openUserProfile } = useClerk();

  if (!isLoaded) return null;

  if (isSignedIn) {
    return (
      <>
        <button
          onClick={() => openUserProfile()}
          className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-colors w-full text-left"
        >
          <UserAvatar user={user} size="w-10 h-10" />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-bold text-white truncate">
              {user.fullName || user.username || "My Account"}
            </span>
            <span className="text-xs text-brand-gold/80 truncate">
              {user.primaryEmailAddress?.emailAddress}
            </span>
          </div>
        </button>
        <Link href="/admin" className="w-full text-center py-3 rounded-xl text-sm font-bold bg-brand-gold text-brand-blue shadow-md">
          My Dashboard
        </Link>
        <button onClick={() => signOut()} className="w-full text-center py-3 rounded-xl text-sm font-bold text-red-400 border border-red-900/30 hover:bg-red-500/10 transition-colors">
          Sign Out
        </button>
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => openSignIn()}
        className="w-full py-3 text-brand-gold border border-brand-gold/40 rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-brand-gold/10 transition-all active:scale-[0.98]"
      >
        Sign In
      </button>
      <button
        onClick={() => openSignUp()}
        className="w-full py-3 text-brand-blue bg-brand-gold rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-yellow-400 transition-all shadow-lg shadow-brand-gold/10 active:scale-[0.98]"
      >
        Join Us
      </button>
    </>
  );
}
