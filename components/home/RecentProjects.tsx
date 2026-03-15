import Link from "next/link";
import { apiFetch } from "@/lib/api";

export default async function RecentProjects() {
  let projects = [];
  try {
    const allProjects = await apiFetch("/api/projects");
    projects = allProjects.slice(0, 3); // Only show top 3 on home
  } catch (error) {
    console.error("Failed to fetch recent projects:", error);
  }

  return (
    <section className="py-24 bg-brand-light">
      <div className="container-custom">
        
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <span className="text-brand-gold font-bold uppercase tracking-widest text-sm mb-4 block underline decoration-brand-blue underline-offset-4">Impact Showcase</span>
            <h2 className="text-4xl font-heading font-bold text-brand-blue leading-tight">
              Our Recent Contributions <br /> to the Community
            </h2>
          </div>
          <Link 
            href="/projects" 
            className="px-6 py-3 border-2 border-brand-blue text-brand-blue font-bold rounded-full hover:bg-brand-blue hover:text-white transition-all whitespace-nowrap"
          >
            See All Projects
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-400 font-bold">
              Stay tuned for our upcoming projects!
            </div>
          ) : (
            projects.map((project: any, idx: number) => (
              <div key={idx} className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={project.image_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80"} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-brand-blue text-white text-[10px] font-bold uppercase tracking-tighter px-3 py-1 rounded-full shadow-lg">
                    {project.category}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-heading font-bold text-brand-blue mb-3 line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-3">
                    {project.description}
                  </p>
                  <div className="mt-auto">
                    <Link 
                      href={`/projects/${project.slug}`} 
                      className="text-brand-azure font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all"
                    >
                      View Details <span>&rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
}

