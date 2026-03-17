"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-slate-950 text-white pt-24 pb-12 relative overflow-hidden">
      {/* Decorative background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-blue via-brand-gold to-brand-azure" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">

          {/* Brand Column */}
          <div className="space-y-8">
            <Link href="/" className="inline-block group">
              <img
                src="/logo.png"
                alt="Rotaract Swarna Bengaluru Logo"
                className="h-24 w-auto object-contain brightness-0 invert group-hover:scale-105 transition-transform duration-500"
              />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed font-light">
              Working Towards a Brighter Future. Join us to Inspire and Serve.
            </p>
          </div>

          {/* Links Column */}
          <div>
            <h3 className="font-heading font-black text-xs uppercase tracking-[0.3em] mb-10 text-brand-gold">Discover</h3>
            <ul className="flex flex-col gap-5">
              <li><Link href="/team" className="text-[13px] text-white/60 hover:text-white transition-all hover:translate-x-2 inline-flex items-center gap-2 group">
                <span className="w-1 h-1 bg-brand-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                Who We Are
              </Link></li>
              <li><Link href="/projects" className="text-[13px] text-white/60 hover:text-white transition-all hover:translate-x-2 inline-flex items-center gap-2 group">
                <span className="w-1 h-1 bg-brand-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                Impact Portfolio
              </Link></li>
              <li><Link href="/contact" className="text-[13px] text-white/60 hover:text-white transition-all hover:translate-x-2 inline-flex items-center gap-2 group">
                <span className="w-1 h-1 bg-brand-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                Contact Us
              </Link></li>
            </ul>
          </div>

          {/* Get Involved Column */}
          <div>
            <h3 className="font-heading font-black text-xs uppercase tracking-[0.3em] mb-10 text-brand-gold">Action</h3>
            <ul className="flex flex-col gap-5">
              <li><Link href="/contact" className="text-[13px] text-white/60 hover:text-white transition-all hover:translate-x-2 inline-flex items-center gap-2 group">
                <span className="w-1 h-1 bg-brand-azure rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                Join the Tribe
              </Link></li>
              <li><Link href="/contact" className="text-[13px] text-white/60 hover:text-white transition-all hover:translate-x-2 inline-flex items-center gap-2 group">
                <span className="w-1 h-1 bg-brand-azure rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                Direct Support
              </Link></li>
              <li><Link href="/contact" className="text-[13px] text-white/60 hover:text-white transition-all hover:translate-x-2 inline-flex items-center gap-2 group">
                <span className="w-1 h-1 bg-brand-azure rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                Collaborate
              </Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-heading font-black text-xs uppercase tracking-[0.3em] mb-10 text-brand-gold">Reach Out</h3>
            <address className="not-italic space-y-6">
              <div className="flex flex-col gap-1">
                <p className="text-white font-bold text-sm">Headquarters</p>
                <p className="text-white/60 text-xs font-light leading-relaxed">Rotary House of Friendship, 11 Lavelle Road, Bengaluru</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-white font-bold text-sm">Inquiries</p>
                <a href="mailto:rota.rcbs@gmail.com" className="text-brand-azure text-xs font-black uppercase tracking-widest hover:text-white transition-colors">rota.rcbs@gmail.com</a>
              </div>
            </address>
          </div>

        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 text-[11px] font-black uppercase tracking-[0.2em] text-white/30">
            <span>&copy; {currentYear} Rotaract Club of Swarna Bengaluru</span>
            <span className="hidden md:block w-1 h-1 bg-white/10 rounded-full" />
            <span>Service Above Self</span>
            <span className="hidden md:block w-1 h-1 bg-white/10 rounded-full" />
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="hidden md:block w-1 h-1 bg-white/10 rounded-full" />
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>

          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-blue hover:border-brand-blue transition-all duration-300 text-xs font-black group">
              FB
            </a>
            <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-azure hover:border-brand-azure transition-all duration-300 text-xs font-black group">
              IG
            </a>
            <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-gold hover:border-brand-gold hover:text-brand-blue transition-all duration-300 text-xs font-black group">
              LI
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
