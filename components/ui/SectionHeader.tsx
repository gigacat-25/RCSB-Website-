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
      className={`mb-10 ${centered ? "text-center" : ""}`}
    >
      <div className={`flex items-center gap-4 mb-3 ${centered ? "justify-center" : ""}`}>
        <div className="w-10 h-1 bg-brand-gold rounded-full" />
        <h2 className={`font-heading font-bold text-2xl md:text-3xl ${light ? "text-white" : "text-brand-blue"}`}>
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className={`text-base md:text-lg max-w-2xl ${centered ? "mx-auto" : ""} ${light ? "text-gray-300" : "text-gray-500"}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
