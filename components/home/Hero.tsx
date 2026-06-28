"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as any },
    },
  };

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-32 pb-16 md:pt-20">
      {/* Background */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 z-0"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/images/hero-fallback.png"
          className="w-full h-full object-cover"
        >
          <source src={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/hero-bg.mp4`} type="video/mp4" />
        </video>

        {/* Fallback Static Image if Video fails to load */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/hero-fallback.png"
            alt="RCSB Hero Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Layered Overlays for Depth */}
        <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-mesh-gradient opacity-30 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/10 to-slate-950" />
      </motion.div>

      <div className="container-custom relative z-10 text-white w-full">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto md:mx-0"
        >
          {/* Tagline */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[9px] md:text-[10px] font-black uppercase tracking-[0.25em] mb-6 md:mb-8"
          >
            <span className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-pulse" />
            Together, Change is Possible
          </motion.div>

          {/* Heading Staggered Reveal */}
          <motion.h1 
            variants={itemVariants}
            className="text-[2.75rem] leading-[1.1] sm:text-5xl md:text-8xl font-heading font-black text-white mb-6 md:mb-8 tracking-tight"
          >
            Grow your <span className="text-brand-gold">leadership</span>, <br className="hidden sm:block" />
            <span className="relative inline-block mt-2 md:mt-0 pr-2 md:pr-4">
              Create impact
              <svg className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-2 md:h-3 text-brand-azure/40" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>{" "}
            <span className="inline-block mt-2 md:mt-0">with us</span>
          </motion.h1>

          {/* Description */}
          <motion.p 
            variants={itemVariants}
            className="text-base md:text-2xl text-white/95 mb-8 md:mb-12 max-w-2xl leading-relaxed font-light font-sans"
          >
            Working Towards a Brighter Future. Rotaract Club of Swarna Bengaluru (Formerly Rotaract Club of Bangalore Seshadripuram), emerged in the cradle of service dreamt by 15 young friends in Bengaluru in 2014.
          </motion.p>

          {/* Actions */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row flex-wrap gap-4 md:gap-6"
          >
            <Link
              href="/projects"
              className="premium-button text-center px-10 py-5 bg-brand-gold text-brand-blue font-black uppercase tracking-[0.15em] text-xs rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:bg-yellow-400 hover:-translate-y-1 active:translate-y-0 active:scale-98 font-poppins shrink-0"
            >
              Latest Projects
            </Link>
            <Link
              href="/contact"
              className="premium-button-outline text-center px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black uppercase tracking-[0.15em] text-xs rounded-2xl hover:bg-white hover:text-brand-blue transition-all hover:-translate-y-1 active:translate-y-0 active:scale-98 font-poppins shrink-0"
            >
              Join Our Tribe
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

