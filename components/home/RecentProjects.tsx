import Link from "next/link";
import { apiFetch } from "@/lib/api";

export default async function RecentProjects() {
  let projects = [];
  try {
    const allProjects = await apiFetch("/api/projects");
    projects = (allProjects || []).slice(0, 3); // Only show top 3 on home
  } catch (error) {
    console.error("Failed to fetch recent projects:", error);
  }

  return (
    <section className="py-32 bg-brand-light relative">
      <div className="container-custom">
        
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl animate-fade-up">
            <span className="text-brand-azure font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Impact Showcase</span>
            <h2 className="text-5xl md:text-7xl font-heading font-black text-brand-blue leading-[1.1]">
              Recent contributions to <br /> 
              <span className="text-brand-gold italic">our community.</span>
            </h2>
          </div>
          <Link 
            href="/projects" 
            className="group px-8 py-4 bg-white border border-slate-200 text-brand-blue font-black uppercase tracking-[0.15em] text-[10px] rounded-2xl hover:bg-brand-blue hover:text-white transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 active:translate-y-0 whitespace-nowrap"
          >
            Explore Portfolio
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.length === 0 ? (
            <div className="col-span-full glass p-20 text-center rounded-[3rem] text-slate-400 font-heading font-bold text-2xl italic">
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
                    src={project.image_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80"} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute top-6 left-6 glass px-4 py-2 text-[10px] font-black uppercase tracking-widest text-brand-blue z-20 rounded-full">
                    {project.category}
                  </div>
                </div>
                <div className="p-10 flex flex-col flex-1 bg-white">
                  <h3 className="text-2xl font-heading font-black text-brand-blue mb-4 group-hover:text-brand-azure transition-colors line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-brand-gray/60 text-sm mb-10 line-clamp-3 leading-relaxed font-light">
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

