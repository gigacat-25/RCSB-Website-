import { apiFetch } from "@/lib/api";
import Link from "next/link";
import { ArrowLeftIcon, CalendarIcon, UserIcon, ShareIcon } from "@heroicons/react/24/outline";
import { notFound } from "next/navigation";
import CommentsSection from "@/components/blog/CommentsSection";

export const revalidate = 0;

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  let blog: any = null;

  try {
    const data = await apiFetch("/api/projects");
    blog = data.find((p: any) => p.slug === params.slug);
  } catch (error) {
    console.error("Failed to fetch blog:", error);
  }

  if (!blog) {
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

  let gallery: string[] = [];
  try {
    gallery = JSON.parse(blog.gallery_urls || "[]");
  } catch (e) {
    gallery = [];
  }

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <img
          src={fixImageUrl(blog.image_url)}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-end pb-12 md:pb-24">
          <div className="container mx-auto px-6">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors font-bold text-sm uppercase tracking-widest"
            >
              <ArrowLeftIcon className="w-4 h-4" /> Back to Stories
            </Link>
            <div className="max-w-4xl">
              <span className="bg-brand-gold text-brand-blue px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-4 inline-block shadow-lg">
                {blog.category}
              </span>
              <h1 className="text-4xl md:text-6xl font-heading font-black text-white leading-tight mb-6">
                {blog.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-white/80 font-bold uppercase text-[11px] tracking-widest">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-brand-gold" />
                  <span>By {blog.author_email || "RCSB Editorial Team"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-brand-gold" />
                  <span>Published in {blog.year}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="container mx-auto px-6 mt-12 md:mt-20">
        <div className="flex flex-col lg:flex-row gap-16 max-w-7xl mx-auto">

          {/* Main Content */}
          <article className="lg:col-span-2 w-full max-w-3xl">
            <div className="text-brand-gray text-lg md:text-xl leading-relaxed space-y-8 font-medium italic mb-12 border-l-4 border-brand-gold pl-6 py-2">
              {blog.description}
            </div>

            <div className="blog-content text-brand-gray text-lg leading-relaxed whitespace-pre-wrap">
              {blog.content}
            </div>

            {/* Gallery Section */}
            {gallery.length > 0 && (
              <div className="mt-20">
                <h2 className="text-3xl font-heading font-black text-brand-blue mb-8 flex items-center gap-4">
                  <span className="w-8 h-1 bg-brand-gold rounded-full"></span>
                  Captured Moments
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {gallery.map((url, idx) => (
                    <div
                      key={idx}
                      className={`relative overflow-hidden rounded-[32px] group shadow-md transition-all duration-500 hover:shadow-2xl ${idx % 3 === 0 ? "md:col-span-2 aspect-[16/9]" : "aspect-square"
                        }`}
                    >
                      <img
                        src={fixImageUrl(url)}
                        alt={`Gallery ${idx}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <CommentsSection projectId={blog.id} />
          </article>

          {/* Sticky Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="sticky top-32 space-y-8">
              <div className="bg-gray-50 p-8 rounded-[40px] border border-gray-100">
                <h4 className="text-brand-blue font-black uppercase tracking-widest text-xs mb-6">Share this story</h4>
                <div className="flex gap-4">
                  <button className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:bg-brand-azure hover:text-white transition-all shadow-sm">
                    <ShareIcon className="w-5 h-5" />
                  </button>
                  {/* Add more share buttons as needed */}
                </div>
              </div>

              <div className="bg-brand-blue p-8 rounded-[40px] text-white overflow-hidden relative group">
                <div className="relative z-10">
                  <h4 className="text-brand-gold font-black uppercase tracking-widest text-[10px] mb-2">Next Journey</h4>
                  <p className="font-heading font-bold text-xl mb-6">Inspired by our work? Join us!</p>
                  <Link
                    href="/contact"
                    className="inline-block w-full py-4 bg-brand-gold text-brand-blue text-center font-black rounded-2xl hover:bg-white transition-all shadow-xl"
                  >
                    Contact Us
                  </Link>
                </div>
                {/* Decorative Pattern */}
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
