import Link from "next/link";
import Image from "next/image";
import { PortableText } from "@portabletext/react";

interface ProjectCardProps {
  title: string;
  slug: string;
  description?: unknown[];
  coverImage?: string;
  impactStats?: { label: string; value: string }[];
}

export default function ProjectCard({ title, slug, description, coverImage, impactStats }: ProjectCardProps) {
  return (
    <div className="glass-panel overflow-hidden h-full flex flex-col group relative">
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/10 to-transparent flex-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
      
      <div className="relative h-48 bg-brand-void/50 overflow-hidden shrink-0 z-10 p-2">
        <div className="relative w-full h-full rounded-xl overflow-hidden">
          {coverImage ? (
            <Image
              src={`${coverImage}?width=600&format=webp`}
              alt={title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-blue/20 to-brand-gold/20">
              <span className="text-brand-gold/50 font-heading font-bold text-5xl tracking-tighter">
                {title.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-brand-void/30 group-hover:bg-transparent transition-colors duration-500" />
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col z-10">
        <h3 className="font-heading font-bold text-white text-xl lg:text-2xl mb-3 tracking-tight group-hover:text-brand-gold transition-colors">{title}</h3>
        {description && (
          <div className="text-gray-400 text-sm line-clamp-3 mb-6 prose prose-sm prose-invert max-w-none font-light leading-relaxed">
            <PortableText value={description as Parameters<typeof PortableText>[0]["value"]} />
          </div>
        )}
        {impactStats && impactStats.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mt-auto pt-5 border-t border-white/10">
            {impactStats.map((stat, i) => (
              <div key={i} className="text-center bg-white/5 rounded-lg py-2 backdrop-blur-sm">
                <p className="font-heading font-bold text-brand-gold text-2xl drop-shadow-[0_0_8px_rgba(245,166,35,0.4)]">{stat.value}</p>
                <p className="text-gray-400 text-[10px] uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
