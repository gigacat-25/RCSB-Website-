"use client";
import { motion } from "framer-motion";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export default function SectionHeader({ title, subtitle, centered = false, light = false }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`mb-12 ${centered ? "text-center flex flex-col items-center" : ""}`}
    >
      <div className={`badge-glass px-4 py-1.5 rounded-full inline-flex items-center gap-2 mb-4 ${centered ? "justify-center" : ""}`}>
        <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
        <span className="text-xs font-medium text-white tracking-widest uppercase opacity-90">
          RCSB
        </span>
      </div>
      <h2 className="font-heading font-bold text-3xl md:text-5xl text-white tracking-tight mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className={`text-base md:text-lg max-w-2xl text-gray-400 font-light leading-relaxed ${centered ? "mx-auto" : ""}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
