import Link from "next/link";

const footerLinks = [
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Projects", href: "/projects" },
  { label: "Team", href: "/team" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-dark-grey text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center text-white font-heading font-bold">
                RC
              </div>
              <div>
                <p className="font-heading font-bold text-white text-sm leading-tight">Rotaract Club of</p>
                <p className="font-heading font-bold text-brand-gold text-sm leading-tight">Swarna Bengaluru</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Together, Change is Possible! Serving the community of Bengaluru since 2014. Part of Rotary International.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4">Quick Links</h3>
            <ul className="flex flex-col gap-2">
              {footerLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-gray-400 hover:text-brand-gold text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4">Contact</h3>
            <div className="flex flex-col gap-3 text-sm text-gray-400">
              <div>
                <p className="text-white font-medium mb-1">Address</p>
                <p>Rotary House of Friendship</p>
                <p>11 Lavelle Road, Bengaluru</p>
              </div>
              <div>
                <p className="text-white font-medium mb-1">Email</p>
                <a href="mailto:rota.rcbs@gmail.com" className="hover:text-brand-gold transition-colors">
                  rota.rcbs@gmail.com
                </a>
              </div>
              <div className="flex gap-3 mt-2">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold transition-colors text-xs font-bold">
                  IG
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold transition-colors text-xs font-bold">
                  FB
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Rotaract Club of Swarna Bengaluru. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            Formerly Rotaract Club of Bangalore Seshadripuram · Founded 2014
          </p>
        </div>
      </div>
    </footer>
  );
}
