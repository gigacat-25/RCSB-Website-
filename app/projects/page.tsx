import Link from "next/link";
import { apiFetch } from "@/lib/api";

export const revalidate = 60; // Revalidate every minute

export default async function ProjectsPage() {
  let projects = [];
  try {
    projects = await apiFetch("/api/projects");
  } catch (error) {
    console.error("Failed to fetch projects:", error);
  }

  return (
    <div className="bg-brand-light min-h-screen">
      {/* Header */}
      <section className="bg-brand-blue py-20 text-white">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Our Projects</h1>
          <p className="text-blue-100 max-w-2xl text-lg">
            Discover how we're making a difference. From local community service to global initiatives, our projects reflect our commitment to change.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container-custom">
          <div className="flex flex-wrap gap-4 mb-12">
            {["All", "Leadership", "Community Service", "Social Service", "Environment", "Education"].map((tag) => (
              <button key={tag} className={`px-5 py-2 rounded-full text-sm font-semibold border ${tag === "All" ? "bg-brand-blue text-white border-brand-blue" : "bg-white text-brand-gray border-gray-200 hover:border-brand-blue"}`}>
                {tag}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.length === 0 ? (
              <div className="col-span-full text-center py-20 text-gray-400 font-bold">
                No projects found. Check back later for updates!
              </div>
            ) : (
              projects.map((project: any, idx: number) => (
                <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group">
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={project.image_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80"} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-brand-gold text-brand-blue text-[10px] font-bold uppercase px-3 py-1 rounded-full">
                      {project.year}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-brand-azure text-xs font-bold uppercase tracking-wider mb-2">{project.category}</span>
                    <h3 className="text-xl font-heading font-bold text-brand-blue mb-3 group-hover:text-brand-azure transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-6 line-clamp-3">
                      {project.description}
                    </p>
                    <div className="mt-auto pt-4 border-t border-gray-50">
                      <Link 
                        href={`/projects/${project.slug}`} 
                        className="text-brand-blue font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all"
                      >
                        Read Case Study <span>&rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

