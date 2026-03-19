export const runtime = 'edge';
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import { ArrowLeftIcon, CalendarIcon, UserIcon } from "@heroicons/react/24/outline";
import { notFound } from "next/navigation";
import CommentsSection from "@/components/blog/CommentsSection";
import ShareButton from "@/components/blog/ShareButton";
import { Metadata } from "next";
import ImageGallery from "@/components/projects/ImageGallery";

export const revalidate = 0;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const data = await apiFetch("/api/projects");
    const blog = data.find((p: any) => p.slug === params.slug);
    if (!blog) return {};

    const fixImageUrl = (url: string | null | undefined) => {
      if (!url) return "https://rcsb.in/Images/placeholder.jpg";
      if (url.includes("media.rcsb.in/")) {
        const key = url.split("media.rcsb.in/").pop();
        return `https://rcsb-api-worker.impact1-iceas.workers.dev/media/${key}`;
      }
      return url.startsWith("/") ? `https://rcsb.in${url}` : url;
    };

    return {
      title: blog.title,
      description: blog.description?.substring(0, 160),
      openGraph: {
        title: blog.title,
        description: blog.description?.substring(0, 160),
        type: 'article',
        url: `https://rcsb.in/blogs/${blog.slug}`,
        images: [{ url: fixImageUrl(blog.image_url) }],
      },
    };
  } catch (e) {
    return {};
  }
}

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
      <section className="relative w-full overflow-hidden min-h-[50vh] md:h-[70vh] flex flex-col justify-end">
        <div className="absolute inset-0 z-0">
          <img
            src={fixImageUrl(blog.image_url)}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20"></div>
        </div>

        <div className="relative z-10 w-full pt-32 pb-10 md:pt-40 md:pb-24">
          <div className="container mx-auto px-6">
            <Link
              href="/blogs"
              className="relative z-20 inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 md:mb-8 transition-colors font-bold text-xs md:text-sm uppercase tracking-widest"
            >
              <ArrowLeftIcon className="w-4 h-4" /> Back to Stories
            </Link>
            <div className="max-w-4xl relative z-10">
              <span className="bg-brand-gold text-brand-blue px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-4 inline-block shadow-lg">
                {blog.category}
              </span>
              <h1 className="text-3xl md:text-6xl font-heading font-black text-white leading-tight mb-4 md:mb-6">
                {blog.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/80 font-bold uppercase text-[10px] md:text-[11px] tracking-widest">
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
      <div className="container mx-auto px-6 mt-8 md:mt-20">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 max-w-7xl mx-auto">

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
                <ImageGallery images={gallery} title={blog.title} isBlogLayout />
              </div>
            )}

            {/* Comments Section */}
            <CommentsSection projectId={blog.id} />
          </article>

          {/* Sticky Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="sticky top-24 md:top-32 space-y-8">
              <div className="bg-gray-50 p-6 md:p-8 rounded-[2.5rem] md:rounded-[40px] border border-gray-100">
                <h4 className="text-brand-blue font-black uppercase tracking-widest text-xs mb-6">Share this story</h4>
                <div className="flex gap-4">
                  <ShareButton title={blog.title} description={blog.description} />
                  {/* Add more share buttons as needed */}
                </div>
              </div>

              <div className="bg-brand-blue p-6 md:p-8 rounded-[2.5rem] md:rounded-[40px] text-white overflow-hidden relative group">
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
