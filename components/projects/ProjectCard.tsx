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
    <div className="card-hover bg-white rounded-xl overflow-hidden border border-gray-100 h-full flex flex-col">
      <div className="relative h-48 bg-brand-grey overflow-hidden">
        {coverImage ? (
          <Image
            src={`${coverImage}?width=600&format=webp`}
            alt={title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-blue/10 to-brand-gold/10">
            <span className="text-brand-blue/30 font-heading font-bold text-5xl">
              {title.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-heading font-bold text-brand-blue text-lg mb-2">{title}</h3>
        {description && (
          <div className="text-gray-500 text-sm line-clamp-3 mb-4 prose prose-sm max-w-none">
            <PortableText value={description as Parameters<typeof PortableText>[0]["value"]} />
          </div>
        )}
        {impactStats && impactStats.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-gray-100">
            {impactStats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="font-heading font-bold text-brand-gold text-xl">{stat.value}</p>
                <p className="text-gray-500 text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
