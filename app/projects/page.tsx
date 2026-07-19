"use client";
export const runtime = 'edge';

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProjectCardSkeleton } from "@/components/ui/SkeletonCard";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    fetch(`/api/projects?t=${new Date().getTime()}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProjects(data.filter((p: any) => 
            p.type !== "blog" && 
            p.type !== "award" &&
            p.type !== "system_setting" && 
            (p.category || "").toUpperCase() !== "SYSTEM" &&
            p.status !== "trash"
          ));
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

  // Filter projects by active category (case-insensitive contains match)
  const filteredProjects = activeFilter === "All"
    ? projects
    : projects.filter((p: any) =>
        (p.category || "").toLowerCase().includes(activeFilter.toLowerCase())
      );

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Helper to fix broken legacy image URLs
  const fixImageUrl = (url: string | null | undefined) => {
    if (!url) return "/Images/placeholder.jpg";
    if (url.includes("rotaractswarnabengaluru.in/media/")) {
      const key = url.split("rotaractswarnabengaluru.in/media/").pop();
      return `https://rcsb-api-worker.impact1-iceas.workers.dev/media/${key}`;
    }
    if (url.includes("media.rcsb.in/")) {
      const key = url.split("media.rcsb.in/").pop();
      return `https://rcsb-api-worker.impact1-iceas.workers.dev/media/${key}`;
    }
    return url;
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <section className="relative flex flex-col justify-center min-h-[400px] md:min-h-[480px] pt-28 md:pt-36 pb-16 overflow-hidden bg-[#0a1835] border-b border-brand-gold/10">
        {/* Premium Line Grid */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)
              `,
              backgroundSize: '48px 48px',
              maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 10%, transparent 80%)'
            }}
          />
        </div>

        {/* Ambient Color Glows */}
        <div className="absolute -top-20 right-1/4 w-[600px] h-[600px] bg-brand-gold/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 left-1/4 w-[600px] h-[600px] bg-brand-azure/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container-custom relative z-10 text-white">
          <div className="max-w-3xl animate-fade-up">
            <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em] mb-4 md:mb-6 block">Our Portfolio</span>
            <h1 className="text-5xl md:text-8xl font-heading font-black text-white mb-6 md:mb-8 leading-[1.1]">
              Crafting <span className="text-brand-gold italic">Change.</span>
            </h1>
            <p className="text-white/90 text-lg md:text-xl font-light leading-relaxed max-w-2xl">
              Discover our legacy of impact. From deep-rooted community service to high-reach leadership initiatives, these are the milestones of our journey.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          {/* Refined Filter */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-10 md:mb-16 animate-fade-up">
            <span className="text-[10px] font-black text-brand-blue/40 uppercase tracking-[0.2em] md:mr-2">Filter By</span>
            <div className="flex items-center gap-2 md:gap-3 overflow-x-auto pb-2 md:pb-0 w-full hide-scrollbar px-1 -mx-1 md:px-0 md:mx-0">
              {["All", "Leadership", "Community Service", "Club Service", "Environment", "Education"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => { setActiveFilter(tag); setCurrentPage(1); }}
                  className={`px-5 py-2 md:px-6 rounded-full text-[9px] md:text-[10px] whitespace-nowrap font-black uppercase tracking-[0.1em] transition-all border ${activeFilter === tag
                    ? "bg-brand-blue text-white border-brand-blue shadow-lg"
                    : "bg-white text-brand-blue border-slate-200 hover:border-brand-blue hover:shadow-md"
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16 lg:gap-20">
            {loading ? (
              [1, 2, 3, 4, 5, 6].map((n) => (
                <ProjectCardSkeleton key={n} />
              ))
            ) : filteredProjects.length === 0 ? (
              <div className="col-span-full glass p-10 md:p-24 text-center rounded-[2rem] md:rounded-[4rem] text-slate-400 font-heading font-bold text-xl md:text-3xl italic">
                No projects found in this category.
              </div>
            ) : (
              paginatedProjects.map((project: any, idx: number) => (
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

                  <div className="p-6 md:p-10 flex flex-col flex-1 bg-white">
                    <div className="text-brand-blue/40 text-[10px] font-black uppercase tracking-[0.2em] mb-4">{project.year}</div>
                    <h3 className="text-2xl font-heading font-black text-brand-blue mb-4 group-hover:text-brand-azure transition-colors line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="text-brand-gray/60 text-sm mb-6 md:mb-10 line-clamp-3 leading-relaxed font-light">
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

          {/* Interactive Pagination */}
          {!loading && totalPages > 1 && (
            <div className="mt-16 md:mt-20 flex flex-col items-center gap-6">

              {/* Results count */}
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-blue/40">
                Showing{" "}
                <span className="text-brand-blue">
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredProjects.length)}
                </span>{" "}
                of <span className="text-brand-blue">{filteredProjects.length}</span> projects
              </p>

              {/* Pagination controls */}
              <div className="flex items-center gap-2 md:gap-3">

                {/* Previous */}
                <button
                  onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  disabled={currentPage === 1}
                  className="group flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] border transition-all duration-300 disabled:opacity-25 disabled:cursor-not-allowed bg-white text-brand-blue border-slate-200 hover:border-brand-blue hover:shadow-lg hover:-translate-x-0.5 active:scale-95"
                >
                  <span className="group-hover:-translate-x-0.5 transition-transform duration-200">←</span>
                  <span className="hidden sm:inline">Prev</span>
                </button>

                {/* Page number buttons */}
                <div className="flex items-center gap-1.5 md:gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    const isActive = page === currentPage;
                    const isNear = Math.abs(page - currentPage) <= 1;
                    const isEdge = page === 1 || page === totalPages;
                    if (!isNear && !isEdge) {
                      if (page === 2 || page === totalPages - 1) {
                        return <span key={page} className="text-brand-blue/30 font-black text-xs px-1">…</span>;
                      }
                      return null;
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        className={`relative w-9 h-9 md:w-10 md:h-10 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-wider transition-all duration-300 active:scale-90 ${
                          isActive
                            ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/30 scale-110"
                            : "bg-white text-brand-blue border border-slate-200 hover:border-brand-blue hover:shadow-md hover:scale-105"
                        }`}
                      >
                        {page}
                        {isActive && (
                          <span className="absolute inset-0 rounded-full bg-brand-blue animate-ping opacity-20 pointer-events-none" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Next */}
                <button
                  onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  disabled={currentPage === totalPages}
                  className="group flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] border transition-all duration-300 disabled:opacity-25 disabled:cursor-not-allowed bg-brand-blue text-white border-brand-blue hover:shadow-lg hover:translate-x-0.5 active:scale-95"
                >
                  <span className="hidden sm:inline">Next</span>
                  <span className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
                </button>

              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
