"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects?t=${new Date().getTime()}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProjects(data.filter((p: any) => p.type !== "blog"));
        } else {
          setProjects([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch projects:", err);
        setLoading(false);
      });
  }, []);

  // Helper to fix broken legacy image URLs
  const fixImageUrl = (url: string | null | undefined) => {
    if (!url) return "/Images/placeholder.jpg";
    if (url.includes("media.rcsb.in/")) {
      const key = url.split("media.rcsb.in/").pop();
      return `https://rcsb-api-worker.impact1-iceas.workers.dev/media/${key}`;
    }
    return url;
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <section className="relative py-32 overflow-hidden bg-brand-blue">
        <div className="absolute inset-0 bg-mesh-gradient opacity-40 mix-blend-overlay" />
        <div className="container-custom relative z-10 text-white">
          <div className="max-w-3xl animate-fade-up pt-16 md:pt-24">
            <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em] mb-6 block">Our Portfolio</span>
            <h1 className="text-6xl md:text-8xl font-heading font-black text-white mb-8 leading-[1.1]">
              Crafting <span className="text-brand-gold italic">Change.</span>
            </h1>
            <p className="text-white/90 text-xl font-light leading-relaxed max-w-2xl">
              Discover our legacy of impact. From deep-rooted community service to high-reach leadership initiatives, these are the milestones of our journey.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-24">
        <div className="container-custom">
          {/* Refined Filter */}
          <div className="flex flex-wrap items-center gap-4 mb-16 animate-fade-up">
            <span className="text-[10px] font-black text-brand-blue/40 uppercase tracking-[0.2em] mr-4">Filter By</span>
            {["All", "Leadership", "Community Service", "Club Service", "Environment", "Education"].map((tag) => (
              <button
                key={tag}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.1em] transition-all border ${tag === "All"
                  ? "bg-brand-blue text-white border-brand-blue shadow-lg"
                  : "bg-white text-brand-blue border-slate-200 hover:border-brand-blue hover:shadow-md"
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-20">
            {loading ? (
              <div className="col-span-full glass p-24 text-center rounded-[4rem] text-slate-400 font-heading font-bold text-3xl italic animate-pulse">
                Loading projects...
              </div>
            ) : projects.length === 0 ? (
              <div className="col-span-full glass p-24 text-center rounded-[4rem] text-slate-400 font-heading font-bold text-3xl italic">
                Our portfolio is evolving. New stories coming soon.
              </div>
            ) : (
              projects.map((project: any, idx: number) => (
                <Link
                  key={idx}
                  href={`/projects/${project.slug}`}
                  className="premium-card group flex flex-col animate-fade-up"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="relative h-72 overflow-hidden">
                    <div className="absolute inset-0 bg-brand-blue/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                    <img
                      src={fixImageUrl(project.image_url)}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />

                    {/* Tags */}
                    <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
                      <div className="glass px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-brand-blue">
                        {project.category}
                      </div>
                      <div className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full shadow-sm backdrop-blur-md border ${project.status === 'upcoming'
                        ? 'bg-amber-100/90 text-amber-900 border-amber-200'
                        : project.status === 'ongoing'
                          ? 'bg-blue-100/90 text-blue-900 border-blue-200'
                          : 'bg-green-100/90 text-green-900 border-green-200'
                        }`}>
                        {project.status}
                      </div>
                    </div>
                  </div>

                  <div className="p-10 flex flex-col flex-1 bg-white">
                    <div className="text-brand-blue/40 text-[10px] font-black uppercase tracking-[0.2em] mb-4">{project.year}</div>
                    <h3 className="text-2xl font-heading font-black text-brand-blue mb-4 group-hover:text-brand-azure transition-colors line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="text-brand-gray/60 text-sm mb-10 line-clamp-3 leading-relaxed font-light">
                      {project.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-blue/40 group-hover:text-brand-azure transition-colors">
                        View Details
                      </span>
                      <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                        &rarr;
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
