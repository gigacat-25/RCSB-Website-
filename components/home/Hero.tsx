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
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white pt-16">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-grey/40 rounded-bl-[80px] z-0" />
      <div className="absolute top-20 right-8 w-64 h-64 md:w-80 md:h-80 opacity-60 z-0">
        {ROTARACT_WHEEL}
      </div>
      <div className="absolute bottom-10 left-4 w-6 h-24 bg-brand-gold rounded-full opacity-40 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-2xl">
          {/* Kicker */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-1 h-8 bg-brand-gold rounded-full" />
            <span className="text-sm font-medium text-brand-gold tracking-widest uppercase">
              Rotaract Club of Swarna Bengaluru
            </span>
          </motion.div>

          {/* Headline: words animate in staggered */}
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl text-brand-blue leading-tight mb-6">
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                className="inline-block mr-3"
              >
                {i === words.length - 1 ? (
                  <span className="text-brand-gold">{word}</span>
                ) : word}
              </motion.span>
            ))}
          </h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-base md:text-lg text-gray-600 mb-10 max-w-xl leading-relaxed"
          >
            {subtext}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/events"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-blue text-white font-semibold rounded-xl hover:bg-brand-blue/90 transition-all text-sm"
            >
              View Events →
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-brand-blue text-brand-blue font-semibold rounded-xl hover:bg-brand-blue hover:text-white transition-all text-sm"
            >
              Our Projects
            </Link>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex gap-8 mt-12 pt-8 border-t border-gray-100"
          >
            {[
              { value: "2014", label: "Founded" },
              { value: "10+", label: "Years of Service" },
              { value: "50+", label: "Projects" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="font-heading font-bold text-2xl text-brand-blue">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
