"use client";
import { motion } from "framer-motion";
import Link from "next/link";

interface HeroProps {
  headline: string;
  subtext: string;
}

const ROTARACT_WHEEL = (
  <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
    <circle cx="50" cy="50" r="45" fill="none" stroke="#003DA5" strokeWidth="5" opacity="0.15" />
    <circle cx="50" cy="50" r="30" fill="none" stroke="#F5A623" strokeWidth="4" opacity="0.3" />
    <circle cx="50" cy="50" r="10" fill="#003DA5" opacity="0.2" />
    {[0,45,90,135,180,225,270,315].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const x1 = 50 + 12 * Math.cos(rad);
      const y1 = 50 + 12 * Math.sin(rad);
      const x2 = 50 + 44 * Math.cos(rad);
      const y2 = 50 + 44 * Math.sin(rad);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#003DA5" strokeWidth="3" opacity="0.12" />;
    })}
  </svg>
);

export default function Hero({ headline, subtext }: HeroProps) {
  const words = headline.split(" ");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-void pt-20">
      {/* 21st.dev inspired Aurora Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-[0.25] animate-aurora"
          style={{
            backgroundImage: "radial-gradient(circle at 50% 50%, #F9A826 0%, transparent 40%), radial-gradient(circle at 80% 20%, #E91E63 0%, transparent 30%), radial-gradient(circle at 20% 80%, #00897B 0%, transparent 40%)",
            backgroundSize: "200% 200%",
            filter: "blur(60px)"
          }}
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-void/40 via-transparent to-brand-void" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center w-full flex flex-col items-center">
        {/* Kicker Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 badge-glass px-4 py-1.5 rounded-full inline-flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
          <span className="text-xs font-medium text-white tracking-widest uppercase opacity-90">
            Rotaract Club of Swarna Bengaluru
          </span>
        </motion.div>

        {/* Massive Typography Headline */}
        <h1 className="font-heading font-extrabold text-5xl sm:text-7xl md:text-8xl lg:text-[100px] text-white leading-[1.05] tracking-tighter mb-8 max-w-5xl text-glow-blue flex flex-wrap justify-center gap-x-4 gap-y-2">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.1 * i, type: "spring", stiffness: 100 }}
              className={i === words.length - 1 ? "text-brand-gold text-glow-gold" : ""}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl leading-relaxed font-light"
        >
          {subtext}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-6 items-center"
        >
          <Link
            href="/events"
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-void font-bold rounded-full hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)]"
          >
            <span>View Events</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 glass-panel text-white font-medium hover:bg-white/10 transition-all duration-300"
          >
            Our Projects
          </Link>
        </motion.div>

        {/* Stats bar floating below */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-12 glass-panel px-10 py-5 w-max z-20"
        >
          {[
            { value: "2014", label: "Founded" },
            { value: "10+", label: "Years of Service" },
            { value: "50+", label: "Projects" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="font-heading font-bold text-3xl text-white tracking-tight">{value}</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
