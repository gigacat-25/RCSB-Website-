"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ContactCTA() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any },
    },
  };

  return (
    <section className="py-20 md:py-32 bg-white relative">
      <div className="container-custom">
        <motion.div 
          initial={isMobile ? false : "hidden"}
          whileInView={isMobile ? undefined : "visible"}
          viewport={isMobile ? undefined : { once: true, amount: 0.2 }}
          variants={containerVariants}
          className="relative rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-24 overflow-hidden shadow-premium group"
        >
          {/* Dynamic Background */}
          <div className="absolute inset-0 bg-brand-blue z-0" />
          <div className="absolute inset-0 bg-mesh-gradient opacity-60 mix-blend-overlay z-0" />

          {/* Decorative glass elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-azure/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 z-0" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-[80px] -translate-x-1/2 translate-y-1/2 z-0" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 md:gap-16 text-center lg:text-left">
            <div className="max-w-2xl">
              <motion.span variants={itemVariants} className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em] mb-4 md:mb-6 block font-sans">
                Join the movement
              </motion.span>
              <motion.h2 variants={itemVariants} className="text-4xl md:text-7xl font-heading font-black text-white mb-6 md:mb-8 leading-[1.1]">
                Ready to make a <br className="hidden sm:block" />
                <span className="text-brand-gold italic">Real Difference?</span>
              </motion.h2>
              <motion.p variants={itemVariants} className="text-blue-50/80 text-lg md:text-xl font-light leading-relaxed max-w-xl mx-auto lg:mx-0 font-sans">
                Join the Rotaract Club of Swarna Bengaluru. Work towards a brighter future and connect the world.
              </motion.p>
            </div>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full sm:w-auto shrink-0"
            >
              <Link
                href="/contact"
                className="px-8 py-4 md:px-12 md:py-6 bg-brand-gold text-brand-blue font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-white transition-all shadow-[0_20px_40px_rgba(247,168,27,0.3)] hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 active:scale-98 text-center w-full sm:w-auto font-sans"
              >
                Send us a Message
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 md:px-12 md:py-6 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-white/20 transition-all hover:-translate-y-1 active:translate-y-0 active:scale-98 text-center w-full sm:w-auto font-sans"
              >
                Become a Member
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
