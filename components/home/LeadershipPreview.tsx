"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function LeadershipPreview() {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/team")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          setTeam(data.slice(0, 4)); // Only show top 4 on home
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch team preview:", err);
        setLoading(false);
      });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const memberVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as any },
    },
  };

  return (
    <section className="py-20 md:py-32 bg-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-light/40 -skew-x-12 translate-x-1/2 -z-10"></div>

      <div className="container-custom">
        <div className="mb-12 md:mb-20">
          <span className="text-[10px] font-black text-brand-azure uppercase tracking-[0.3em] mb-4 block">Our Guiding Force</span>
          <h2 className="text-4xl md:text-6xl font-heading font-black text-brand-blue">Meet Our Leadership</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="space-y-6 animate-pulse">
                <div className="aspect-[4/5] rounded-[2.5rem] bg-slate-100" />
                <div className="h-6 w-32 bg-slate-100 rounded-lg ml-2" />
                <div className="h-4 w-24 bg-slate-100 rounded-lg ml-2" />
              </div>
            ))}
          </div>
        ) : team.length === 0 ? (
          <div className="glass p-10 md:p-20 text-center rounded-[2rem] md:rounded-[3rem] text-slate-400 font-heading font-bold text-xl md:text-2xl italic">
            Updating our leadership roster...
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
          >
            {team.map((member: any, idx: number) => (
              <motion.div 
                key={idx} 
                variants={memberVariants}
                className="group"
              >
                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-8 shadow-premium group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-700">
                  <div className="absolute inset-0 bg-brand-blue/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <Image
                    src={member.image_url || "/favicon.png"}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className={`transition-transform duration-1000 ${member.image_url ? 'object-cover group-hover:scale-105' : 'object-contain p-12 bg-white/50 group-hover:scale-105'}`}
                  />
                  
                  {/* Sliding Glass Bio */}
                  <div className="absolute inset-x-4 bottom-4 glass p-6 rounded-[1.5rem] opacity-100 sm:opacity-0 group-hover:opacity-100 translate-y-0 sm:translate-y-10 group-hover:translate-y-0 transition-all duration-500 z-20 bg-white/80 backdrop-blur-md">
                    <p className="text-brand-blue text-[11px] italic font-medium leading-relaxed font-sans">
                      "{member.bio || "Leading with empathy and impact."}"
                    </p>
                  </div>
                </div>
                <div className="px-2">
                  <h3 className="text-2xl font-heading font-black text-brand-blue mb-2 group-hover:text-brand-azure transition-colors">{member.name}</h3>
                  <p className="text-brand-gray/60 text-[10px] font-black uppercase tracking-[0.2em] font-sans">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 md:mt-20 text-center"
        >
          <Link
            href="/team"
            className="group inline-flex items-center gap-4 text-brand-blue font-black uppercase tracking-[0.2em] text-[10px] font-sans"
          >
            Meet the 2026-27 Board
            <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-brand-gold group-hover:border-brand-gold group-hover:text-brand-blue transition-all duration-300 transform group-hover:translate-x-1">
              &rarr;
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
