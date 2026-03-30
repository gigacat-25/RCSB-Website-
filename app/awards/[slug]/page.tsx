export const runtime = 'edge';
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import { ArrowLeftIcon, CalendarIcon, MapPinIcon, RocketLaunchIcon, PencilSquareIcon, ClockIcon, TrophyIcon } from "@heroicons/react/24/outline";
import { FaYoutube, FaInstagram, FaFacebook, FaLinkedin, FaTwitter, FaGlobe, FaGithub } from "react-icons/fa";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ImageGallery from "@/components/projects/ImageGallery";

export const revalidate = 0;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const data = await apiFetch("/api/projects");
    const award = data.find((p: any) => p.slug === params.slug && p.type === 'award');
    if (!award) return {};

    const fixImageUrl = (url: string | null | undefined) => {
      if (!url) return "https://rcsb-website.pages.dev/Images/placeholder.jpg";
      if (url.includes("media.rcsb.in/")) {
        const key = url.split("media.rcsb.in/").pop();
        return `https://rcsb-api-worker.impact1-iceas.workers.dev/media/${key}`;
      }
      return url.startsWith("/") ? `https://rcsb-website.pages.dev${url}` : url;
    };

    return {
      title: `${award.title} | Awards & Milestones`,
      description: award.description?.substring(0, 160),
      openGraph: {
        title: award.title,
        description: award.description?.substring(0, 160),
        type: 'article',
        url: `https://rcsb-website.pages.dev/awards/${award.slug}`,
        images: [{ url: fixImageUrl(award.image_url) }],
      },
    };
  } catch (e) {
    return {};
  }
}

export default async function AwardDetailPage({ params }: { params: { slug: string } }) {
  let award: any = null;

  try {
    const data = await apiFetch("/api/projects");
    award = data.find((p: any) => p.slug === params.slug && p.type === 'award');
  } catch (error) {
    console.error("Failed to fetch award:", error);
  }

  if (!award) {
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

  const renderLinkIcon = (iconName: string) => {
    switch (iconName) {
      case 'youtube': return <FaYoutube className="w-5 h-5 flex-shrink-0" />;
      case 'instagram': return <FaInstagram className="w-5 h-5 flex-shrink-0" />;
      case 'facebook': return <FaFacebook className="w-5 h-5 flex-shrink-0" />;
      case 'linkedin': return <FaLinkedin className="w-5 h-5 flex-shrink-0" />;
      case 'twitter': return <FaTwitter className="w-5 h-5 flex-shrink-0" />;
      case 'github': return <FaGithub className="w-5 h-5 flex-shrink-0" />;
      case 'globe': return <FaGlobe className="w-5 h-5 flex-shrink-0" />;
      default: return null;
    }
  };

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
        <img
          src={fixImageUrl(award.image_url)}
          alt={award.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-end pb-12 md:pb-20">
          <div className="container mx-auto px-6">
            <Link
              href="/awards"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors font-bold text-sm uppercase tracking-widest"
            >
              <ArrowLeftIcon className="w-4 h-4" /> Back to Awards & Milestones
            </Link>
            <div className="max-w-4xl">
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                  {award.category}
                </span>
                <span className="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-lg bg-green-100/90 text-green-900 border-green-200">
                  Honored Achievement
                </span>
              </div>
              <h1 className="text-3xl md:text-6xl font-heading font-black text-white leading-tight mb-6">
                {award.title}
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
            <div className="text-brand-gray text-lg md:text-2xl leading-relaxed font-bold mb-8 md:mb-12 text-brand-blue/90 font-heading">
              {award.description}
            </div>

            <div className="text-brand-gray text-lg leading-relaxed whitespace-pre-wrap">
              {award.content || "Full milestone details coming soon..."}
            </div>

            {/* Share Experience CTA */}
            <div className="mt-12 md:mt-16 p-6 md:p-8 bg-brand-blue text-white rounded-[2rem] md:rounded-[40px] shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-2xl font-heading font-black mb-2">Be Part of the Legacy</h3>
                <p className="text-white/80 font-medium mb-6 md:mb-8 max-w-md">Every milestone is a step toward a better tomorrow. Join our mission to create more such historic moments.</p>
                <Link
                  href="/contact"
                  className="inline-flex justify-center w-full md:w-auto items-center gap-3 px-6 py-3 md:px-8 md:py-4 bg-brand-gold text-brand-blue font-black rounded-2xl hover:bg-white transition-all shadow-xl text-sm"
                >
                  <TrophyIcon className="w-5 h-5 flex-shrink-0" />
                  Apply for Membership
                </Link>
              </div>
              {/* Decorative Pattern */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
            </div>

            {/* Dynamic Award Gallery */}
            {award.gallery_urls && award.gallery_urls !== "[]" && JSON.parse(award.gallery_urls).length > 0 && (
              <div className="mt-16">
                <h3 className="text-2xl font-black text-brand-blue mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand-gold rounded-full"></span>
                  Glimpses of Success
                </h3>
                <ImageGallery images={JSON.parse(award.gallery_urls)} title={award.title} />
              </div>
            )}
          </article>

          {/* Quick Info Sidebar */}
          <aside className="w-full lg:w-96 flex-shrink-0">
            <div className="sticky top-24 md:top-32 bg-gray-50 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 border border-gray-100 shadow-sm space-y-8 md:space-y-10">
              <div>
                <h4 className="text-[11px] font-black text-brand-gray uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-gold rounded-full"></span>
                  Milestone Brief
                </h4>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 flex items-center justify-center shadow-sm">
                      <CalendarIcon className="w-6 h-6 text-brand-gold" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Conferred Year</div>
                      <div className="text-brand-blue font-bold">{award.year}</div>
                    </div>
                  </div>
                  {award.event_date && (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 flex items-center justify-center shadow-sm">
                        <ClockIcon className="w-6 h-6 text-brand-gold" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Award Date</div>
                        <div className="text-brand-blue font-bold">{new Date(award.event_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 flex items-center justify-center shadow-sm">
                      <RocketLaunchIcon className="w-6 h-6 text-brand-gold" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Scope</div>
                      <div className="text-brand-blue font-bold">{award.category}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Links Sidebar */}
              {award.featured_links && award.featured_links !== "[]" && JSON.parse(award.featured_links).length > 0 && (
                <div className="pt-8 border-t border-gray-200">
                  <h4 className="text-[11px] font-black text-brand-gray uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-brand-gold rounded-full"></span>
                    Verification Links
                  </h4>
                  <div className="space-y-4">
                    {JSON.parse(award.featured_links).map((link: { label: string, url: string, icon?: string }, index: number) => (
                      <Link
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 w-full py-4 bg-brand-gold text-brand-blue text-center font-black rounded-2xl hover:bg-yellow-500 transition-all shadow-md hover:shadow-xl"
                      >
                        {renderLinkIcon(link.icon || "none")}
                        <span>{link.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-8 border-t border-gray-200">
                <p className="text-sm text-brand-gray font-medium leading-relaxed mb-6">
                  Our journey is fueled by collective effort. Inquire more about our club's achievements and how you can contribute.
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
