import Link from "next/link";
import { apiFetch } from "@/lib/api";

export const revalidate = 0; // Revalidate immediately to skip stale cache

export default async function ProjectsPage() {
  let projects = [];
  try {
    const data = await apiFetch("/api/projects");
    // Show both projects and events here
    projects = data.filter((p: any) => p.type === "project" || p.type === "event");
  } catch (error) {
    console.error("Failed to fetch projects:", error);
  }

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
    <div className="bg-brand-light min-h-screen">
      {/* Header */}
      <section className="bg-brand-blue py-20 text-white mt-16 md:mt-0">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 pt-12 md:pt-24">Our Projects & Events</h1>
          <p className="text-blue-100 max-w-2xl text-lg">
            Discover how we're making a difference. From local community service to global initiatives, our projects and events reflect our commitment to change.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container-custom">
          <div className="flex flex-wrap gap-4 mb-12">
            {["All", "Leadership", "Community Service", "Club Service", "Environment", "Education"].map((tag) => (
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
                <div key={idx} className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group p-4">
                  <div className="relative h-64 overflow-hidden rounded-[24px]">
                    <img 
                      src={fixImageUrl(project.image_url)} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Category Pill - Left */}
                    <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white text-[11px] font-semibold px-4 py-1.5 rounded-full shadow-md">
                      {project.category}
                    </div>

                    {/* Status Pill - Right */}
                    <div className={`absolute top-4 right-4 text-[11px] font-bold px-4 py-1.5 rounded-full shadow-md backdrop-blur-sm border ${
                      project.status === 'upcoming' 
                        ? 'bg-amber-100/95 text-amber-900 border-amber-200' 
                        : project.status === 'ongoing'
                        ? 'bg-blue-100/95 text-blue-900 border-blue-200'
                        : 'bg-green-100/95 text-green-900 border-green-200' 
                    }`}>
                      {project.status === 'upcoming' ? 'Upcoming' : project.status === 'ongoing' ? 'Ongoing' : 'Completed'}
                    </div>

                  </div>
                  <div className="p-6 flex flex-col flex-1 pb-4">
                    <div className="text-brand-gray text-xs font-bold tracking-wider mb-2">{project.year}</div>
                    <h3 className="text-xl font-heading font-bold text-brand-blue mb-3 group-hover:text-brand-azure transition-colors line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-6 line-clamp-3">
                      {project.description}
                    </p>
                    <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                      <Link 
                        href={`/projects/${project.slug}`} 
                        className="text-brand-blue font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all"
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
    </div>
  );
}
