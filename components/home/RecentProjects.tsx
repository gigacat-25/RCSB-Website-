"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function RecentProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects?t=${new Date().getTime()}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProjects(data.filter((p: any) => p.type !== "blog").slice(0, 3));
        } else {
          setProjects([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch recent projects:", err);
        setLoading(false);
      });
  }, []);

  // Import or inline definition for fixImageUrl
  const fixImageUrl = (url: string | null | undefined) => {
    if (!url) return "/Images/placeholder.jpg";
    if (url.includes("media.rcsb.in/")) {
      const key = url.split("media.rcsb.in/").pop();
      return `https://rcsb-api-worker.impact1-iceas.workers.dev/media/${key}`;
    }
    return url;
  };

  return (
    <section className="py-20 md:py-32 bg-brand-light relative">
      <div className="container-custom">

        <div className="flex flex-col md:flex-row items-end justify-between mb-12 md:mb-20 gap-6 md:gap-8">
          <div className="max-w-2xl animate-fade-up w-full md:w-auto">
            <span className="text-brand-azure font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Impact Showcase</span>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-heading font-black text-brand-blue leading-[1.1]">
              Recent contributions to <br />
              <span className="text-brand-gold italic">our community.</span>
            </h2>
          </div>
          <Link
            href="/projects"
            className="group px-6 py-3 md:px-8 md:py-4 bg-white border border-slate-200 text-brand-blue font-black uppercase tracking-[0.15em] text-[10px] rounded-2xl hover:bg-brand-blue hover:text-white transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 active:translate-y-0 whitespace-nowrap self-start md:self-end"
          >
            Explore Portfolio
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 relative z-20">
          {loading ? (
            <div className="col-span-full glass p-10 md:p-24 text-center rounded-[2rem] md:rounded-[4rem] text-slate-400 font-heading font-bold text-2xl md:text-3xl italic animate-pulse">
              Loading projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="col-span-full glass p-10 md:p-24 text-center rounded-[2rem] md:rounded-[4rem] text-slate-400 font-heading font-bold text-2xl md:text-3xl italic">
              New milestones are currently in the making...
            </div>
          ) : (
            projects.map((project: any, idx: number) => (
              <Link
                key={idx}
                href={`/projects/${project.slug}`}
                className="premium-card group flex flex-col animate-fade-up"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className="relative h-80 overflow-hidden">
                  <div className="absolute inset-0 bg-brand-blue/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <img
                    src={fixImageUrl(project.image_url)}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute top-6 left-6 glass px-4 py-2 text-[10px] font-black uppercase tracking-widest text-brand-blue z-20 rounded-full">
                    {project.category}
                  </div>
                </div>
                <div className="p-6 md:p-10 flex flex-col flex-1 bg-white">
                  <h3 className="text-2xl font-heading font-black text-brand-blue mb-4 group-hover:text-brand-azure transition-colors line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-brand-gray/60 text-sm mb-6 md:mb-10 line-clamp-3 leading-relaxed font-light">
                    {project.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-blue/40 group-hover:text-brand-azure transition-colors">
                      Discover Story
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
  );
}

