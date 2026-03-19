export const runtime = 'edge';
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import { ArrowLeftIcon, CalendarIcon, MapPinIcon, RocketLaunchIcon, PencilSquareIcon, ClockIcon } from "@heroicons/react/24/outline";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ImageGallery from "@/components/projects/ImageGallery";

export const revalidate = 0;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const data = await apiFetch("/api/projects");
    const project = data.find((p: any) => p.slug === params.slug);
    if (!project) return {};

    const fixImageUrl = (url: string | null | undefined) => {
      if (!url) return "https://rcsb.in/Images/placeholder.jpg";
      if (url.includes("media.rcsb.in/")) {
        const key = url.split("media.rcsb.in/").pop();
        return `https://rcsb-api-worker.impact1-iceas.workers.dev/media/${key}`;
      }
      return url.startsWith("/") ? `https://rcsb.in${url}` : url;
    };

    return {
      title: project.title,
      description: project.description?.substring(0, 160),
      openGraph: {
        title: project.title,
        description: project.description?.substring(0, 160),
        type: 'article',
        url: `https://rcsb.in/projects/${project.slug}`,
        images: [{ url: fixImageUrl(project.image_url) }],
      },
    };
  } catch (e) {
    return {};
  }
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  let project: any = null;

  try {
    const data = await apiFetch("/api/projects");
    project = data.find((p: any) => p.slug === params.slug);
  } catch (error) {
    console.error("Failed to fetch project:", error);
  }

  if (!project) {
    return notFound();
  }

  const fixImageUrl = (url: string | null | undefined) => {
    if (!url) return "/Images/placeholder.jpg";
    if (url.includes("media.rcsb.in/")) {
      const key = url.split("media.rcsb.in/").pop();
      return `https://rcsb-api-worker.impact1-iceas.workers.dev/media/${key}`;
    }
    return url;
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'upcoming': return 'Upcoming Initiative';
      case 'ongoing': return 'Active Project';
      case 'completed': default: return 'Completed Project';
    }
  };

  const statusColors: any = {
    upcoming: "bg-amber-100/90 text-amber-900 border-amber-200",
    ongoing: "bg-blue-100/90 text-blue-900 border-blue-200",
    completed: "bg-green-100/90 text-green-900 border-green-200"
  };

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
        <img
          src={fixImageUrl(project.image_url)}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-end pb-12 md:pb-20">
          <div className="container mx-auto px-6">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors font-bold text-sm uppercase tracking-widest"
            >
              <ArrowLeftIcon className="w-4 h-4" /> Back to All Projects
            </Link>
            <div className="max-w-4xl">
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                  {project.category}
                </span>
                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-lg ${statusColors[project.status] || statusColors.completed}`}>
                  {project.status || 'completed'}
                </span>
              </div>
              <h1 className="text-3xl md:text-6xl font-heading font-black text-white leading-tight mb-6">
                {project.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 mt-16">
        <div className="flex flex-col lg:flex-row gap-16 max-w-7xl mx-auto">

          {/* Article */}
          <article className="flex-1 w-full max-w-3xl">
            <div className="text-brand-gray text-lg md:text-2xl leading-relaxed font-bold mb-8 md:mb-12 text-brand-blue/90">
              {project.description}
            </div>

            <div className="text-brand-gray text-lg leading-relaxed whitespace-pre-wrap">
              {project.content || "Full project details coming soon..."}
            </div>

            {/* If it's an event, maybe show a "Register" call to action */}
            {(project.type === "event" && project.status === "upcoming") || project.rsvp_link ? (
              <div className="mt-12 md:mt-16 p-6 md:p-8 bg-brand-gold/10 border-2 border-brand-gold rounded-[2rem] md:rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                <div>
                  <h3 className="text-xl font-black text-brand-blue mb-2">Interested in participating?</h3>
                  <p className="text-brand-gray font-medium">Join us as a volunteer or guest for this upcoming event.</p>
                </div>
                <Link
                  href={project.rsvp_link || "/contact"}
                  target={project.rsvp_link ? "_blank" : undefined}
                  rel={project.rsvp_link ? "noopener noreferrer" : undefined}
                  className="w-full md:w-auto px-6 py-3 md:px-8 md:py-4 bg-brand-blue text-white font-black rounded-2xl hover:bg-brand-azure transition-all shadow-xl text-center"
                >
                  {project.rsvp_link ? "RSVP Now" : "Register Interest"}
                </Link>
              </div>
            ) : null}
            {/* Share Experience CTA */}
            {project.status !== "upcoming" && (
              <div className="mt-12 md:mt-16 p-6 md:p-8 bg-brand-blue text-white rounded-[2rem] md:rounded-[40px] shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="text-2xl font-heading font-black mb-2">Were you there?</h3>
                  <p className="text-white/80 font-medium mb-6 md:mb-8 max-w-md">Every journey has a story. Share your personal experience at this {project.type} and inspire others!</p>
                  <Link
                    href={`/admin/blogs/add?title=My Experience at ${encodeURIComponent(project.title)}&category=Event Recap`}
                    className="inline-flex justify-center w-full md:w-auto items-center gap-3 px-6 py-3 md:px-8 md:py-4 bg-brand-gold text-brand-blue font-black rounded-2xl hover:bg-white transition-all shadow-xl text-sm"
                  >
                    <PencilSquareIcon className="w-5 h-5 flex-shrink-0" />
                    Share Your Story
                  </Link>
                </div>
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
              </div>
            )}

            {/* Dynamic Project Gallery */}
            {project.gallery_urls && project.gallery_urls !== "[]" && JSON.parse(project.gallery_urls).length > 0 && (
              <div className="mt-16">
                <h3 className="text-2xl font-black text-brand-blue mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand-gold rounded-full"></span>
                  Project Gallery
                </h3>
                <ImageGallery images={JSON.parse(project.gallery_urls)} title={project.title} />
              </div>
            )}
          </article>

          {/* Quick Info Sidebar */}
          <aside className="w-full lg:w-96 flex-shrink-0">
            <div className="sticky top-24 md:top-32 bg-gray-50 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 border border-gray-100 shadow-sm space-y-8 md:space-y-10">
              <div>
                <h4 className="text-[11px] font-black text-brand-gray uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-gold rounded-full"></span>
                  Quick Highlights
                </h4>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 flex items-center justify-center shadow-sm">
                      <CalendarIcon className="w-6 h-6 text-brand-gold" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Timeline</div>
                      <div className="text-brand-blue font-bold">{project.year}</div>
                    </div>
                  </div>
                  {project.event_date && (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 flex items-center justify-center shadow-sm">
                        <ClockIcon className="w-6 h-6 text-brand-gold" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Event Date</div>
                        <div className="text-brand-blue font-bold">{new Date(project.event_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 flex items-center justify-center shadow-sm">
                      <RocketLaunchIcon className="w-6 h-6 text-brand-gold" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Mission</div>
                      <div className="text-brand-blue font-bold">{project.category}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 flex items-center justify-center shadow-sm">
                      <MapPinIcon className="w-6 h-6 text-brand-gold" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Impact</div>
                      <div className="text-brand-blue font-bold tracking-tight">{getStatusLabel(project.status)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-200">
                <p className="text-sm text-brand-gray font-medium leading-relaxed mb-6">
                  We are constantly looking for partners and volunteers. Support our {project.type} to make a bigger impact.
                </p>
                <Link
                  href="/contact"
                  className="block w-full py-4 bg-brand-blue text-white text-center font-black rounded-2xl hover:shadow-xl transition-all shadow-blue-900/20"
                >
                  Inquire Now
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
