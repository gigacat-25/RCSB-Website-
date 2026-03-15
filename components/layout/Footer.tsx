"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-brand-blue text-white pt-16 pb-8 border-t-[6px] border-brand-gold">
      <div className="container-custom grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        
        {/* Brand Column */}
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center mb-6">
            <img 
              src="/logo.png" 
              alt="Rotaract Swarna Bengaluru Logo" 
              className="h-32 w-auto object-contain brightness-0 invert" 
            />
          </div>
          <p className="text-sm text-blue-100 leading-relaxed mb-6">
            A community of young leaders creating positive, lasting change in our communities and around the world.
          </p>
        </div>

        {/* Links Column */}
        <div>
          <h3 className="font-heading font-bold text-lg mb-4 text-brand-gold">Discover</h3>
          <ul className="flex flex-col gap-3">
            <li><Link href="/about" className="text-sm text-blue-100 hover:text-white transition-colors">Who We Are</Link></li>
            <li><Link href="/projects" className="text-sm text-blue-100 hover:text-white transition-colors">Our Projects</Link></li>
            <li><Link href="/team" className="text-sm text-blue-100 hover:text-white transition-colors">Leadership</Link></li>
            <li><Link href="/contact" className="text-sm text-blue-100 hover:text-white transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Get Involved Column */}
        <div>
          <h3 className="font-heading font-bold text-lg mb-4 text-brand-gold">Get Involved</h3>
          <ul className="flex flex-col gap-3">
            <li><Link href="/join" className="text-sm text-blue-100 hover:text-white transition-colors">Join the Club</Link></li>
            <li><Link href="/donate" className="text-sm text-blue-100 hover:text-white transition-colors">Donate</Link></li>
            <li><Link href="/partner" className="text-sm text-blue-100 hover:text-white transition-colors">Partner With Us</Link></li>
          </ul>
        </div>

        {/* Contact Column */}
        <div>
          <h3 className="font-heading font-bold text-lg mb-4 text-brand-gold">Contact</h3>
          <address className="not-italic flex flex-col gap-3 text-sm text-blue-100">
            <p>
              <strong>Rotaract Club of Swarna Bengaluru</strong><br />
              Bengaluru, Karnataka, India
            </p>
            <p>
              Email: <a href="mailto:contact@rcsb.in" className="hover:text-white transition-colors">contact@rcsb.in</a>
            </p>
          </address>
        </div>

      </div>

      <div className="container-custom pt-8 border-t border-blue-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-blue-200">
          &copy; {currentYear} Rotaract Club of Swarna Bengaluru. All rights reserved.
        </p>
        <div className="flex gap-4">
          {/* Placeholder Social Icons */}
          <a href="#" className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center hover:bg-brand-azure transition-colors text-xs">FB</a>
          <a href="#" className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center hover:bg-brand-azure transition-colors text-xs">IG</a>
          <a href="#" className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center hover:bg-brand-azure transition-colors text-xs">LI</a>
        </div>
      </div>
    </footer>
  );
}
