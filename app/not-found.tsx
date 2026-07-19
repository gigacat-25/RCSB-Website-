import Link from "next/link";
import {
  HomeIcon,
  FolderIcon,
  TrophyIcon,
  BookOpenIcon,
  UserGroupIcon,
  EnvelopeIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export default function NotFound() {
  const quickLinks = [
    {
      title: "About RCSB",
      description: "Discover our mission, vision, and 7 focus areas.",
      href: "/about",
      icon: SparklesIcon,
      badge: "Explore",
      color: "from-blue-500/10 to-brand-azure/10 text-brand-azure",
    },
    {
      title: "Our Projects",
      description: "Explore community service & youth leadership initiatives.",
      href: "/projects",
      icon: FolderIcon,
      badge: "Impact",
      color: "from-amber-500/10 to-brand-gold/10 text-amber-500",
    },
    {
      title: "Awards & Honors",
      description: "See our club recognitions, accolades, and milestones.",
      href: "/awards",
      icon: TrophyIcon,
      badge: "Recognitions",
      color: "from-yellow-500/10 to-amber-500/10 text-yellow-500",
    },
    {
      title: "Blogs & Stories",
      description: "Read latest articles, project reports, and news updates.",
      href: "/blogs",
      icon: BookOpenIcon,
      badge: "Read",
      color: "from-emerald-500/10 to-teal-500/10 text-emerald-500",
    },
    {
      title: "Leadership Team",
      description: "Meet the board members and youth leaders of RCSB.",
      href: "/team",
      icon: UserGroupIcon,
      badge: "Board",
      color: "from-indigo-500/10 to-blue-500/10 text-indigo-400",
    },
    {
      title: "Contact & Support",
      description: "Get in touch with us, send inquiries, or join RCSB.",
      href: "/contact",
      icon: EnvelopeIcon,
      badge: "Reach Out",
      color: "from-rose-500/10 to-pink-500/10 text-rose-400",
    },
  ];

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-16 md:py-24 overflow-hidden bg-slate-950/95 text-white">
      {/* Dynamic Background Glow & Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-blue/20 rounded-full blur-[140px] animate-pulse-soft" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-brand-gold/15 rounded-full blur-[120px] animate-pulse-soft" style={{ animationDelay: "2s" }} />
        <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-brand-azure/15 rounded-full blur-[100px] animate-pulse-soft" style={{ animationDelay: "4s" }} />
        
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-5xl w-full mx-auto text-center">

        {/* Big 404 Visual Graphic */}
        <div className="relative mb-6 select-none animate-fade-up">
          <h1 className="text-8xl sm:text-9xl md:text-[13rem] font-heading font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-white via-white/80 to-white/20 drop-shadow-2xl">
            404
          </h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs sm:text-sm font-black uppercase tracking-[0.3em] px-6 py-2 rounded-full bg-brand-gold text-brand-blue shadow-lg shadow-brand-gold/20 transform rotate-[-3deg]">
            Wandered Off Map
          </div>
        </div>

        {/* Heading & Subtitle */}
        <div className="max-w-2xl mx-auto mb-10 space-y-4 animate-fade-up" style={{ animationDelay: "150ms" }}>
          <h2 className="text-2xl sm:text-4xl font-heading font-bold text-white tracking-tight">
            Oops! You've Explored Beyond Our Grid
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-light">
            The page you are looking for might have been moved, renamed, or is temporarily offline. 
            Don't worry—let's guide you back to the right path!
          </p>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16 animate-fade-up" style={{ animationDelay: "300ms" }}>
          <Link
            href="/"
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-gold via-yellow-400 to-amber-500 text-brand-blue font-black text-sm uppercase tracking-widest shadow-xl shadow-brand-gold/20 hover:shadow-brand-gold/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <HomeIcon className="w-5 h-5 relative z-10 stroke-[2.5]" />
            <span className="relative z-10">Back To Homepage</span>
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-sm uppercase tracking-wider backdrop-blur-md hover:-translate-y-0.5 transition-all duration-300"
          >
            <EnvelopeIcon className="w-5 h-5 text-brand-azure" />
            <span>Contact Support</span>
          </Link>
        </div>

        {/* Section Divider */}
        <div className="relative mb-12 flex items-center justify-center">
          <div className="w-full border-t border-white/10" />
          <span className="absolute bg-slate-950 px-4 text-xs uppercase tracking-[0.25em] font-bold text-slate-500">
            Or Explore Popular Destinations
          </span>
        </div>

        {/* Quick Destination Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left animate-fade-up" style={{ animationDelay: "450ms" }}>
          {quickLinks.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={idx}
                href={item.href}
                className="group relative p-6 rounded-3xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-brand-gold/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-gold/10"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${item.color} border border-white/10`}>
                    <IconComponent className="w-6 h-6 stroke-[2]" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 group-hover:text-brand-gold group-hover:border-brand-gold/30 transition-colors">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-lg font-heading font-bold text-white mb-1.5 group-hover:text-brand-gold transition-colors flex items-center justify-between">
                  <span>{item.title}</span>
                  <span className="text-slate-500 group-hover:text-brand-gold group-hover:translate-x-1 transition-all duration-300">
                    &rarr;
                  </span>
                </h3>

                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  {item.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
