"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpenIcon, UserIcon, MagnifyingGlassIcon, TagIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const { isSignedIn, isLoaded: isUserLoaded } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/projects"); // Use the public endpoint
        const data = await res.json();
        // The public endpoint returns all projects/events/blogs
        const blogsData = Array.isArray(data) ? data.filter((p: any) => p.type === "blog") : [];
        setBlogs(blogsData);
        setFilteredBlogs(blogsData);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = blogs.filter((blog) => {
      const matchesSearch = blog.title.toLowerCase().includes(query) ||
        blog.description.toLowerCase().includes(query);
      const matchesCategory = activeCategory === "All" || blog.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredBlogs(filtered);
  }, [searchQuery, activeCategory, blogs]);

  const categories = ["All", ...Array.from(new Set(blogs.map((b) => b.category)))];

  const fixImageUrl = (url: string | null | undefined) => {
    if (!url) return "/Images/placeholder.jpg";
    if (url.includes("media.rcsb.in/")) {
      const key = url.split("media.rcsb.in/").pop();
      return `https://rcsb-api-worker.impact1-iceas.workers.dev/media/${key}`;
    }
    return url;
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-brand-blue">
        <div className="absolute inset-0 bg-mesh-gradient opacity-40 mix-blend-overlay" />
        <div className="container-custom relative z-10 text-white">
          <div className="max-w-4xl animate-fade-up pt-16 md:pt-24">
            <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em] mb-4 md:mb-6 block">Our Stories</span>
            <h1 className="text-5xl md:text-8xl font-heading font-black text-white mb-6 md:mb-8 leading-[1.1]">
              Insights and <br />
              <span className="text-brand-gold italic">Perspectives.</span>
            </h1>
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
              <p className="text-white/90 text-lg md:text-xl font-light leading-relaxed max-w-xl text-center md:text-left">
                Exploring the heart of Rotaract through reports, reflections, and deep-dives into our community impact.
              </p>
              <button
                onClick={() => {
                  if (!isSignedIn) {
                    openSignIn({ forceRedirectUrl: "/admin/blogs/add" });
                  } else {
                    router.push("/admin/blogs/add");
                  }
                }}
                className="group px-8 py-4 md:px-10 md:py-5 w-full md:w-auto bg-brand-gold text-brand-blue font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-white transition-all shadow-xl hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 whitespace-nowrap"
              >
                <PencilSquareIcon className="w-4 h-4" />
                Draft a Story
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="container-custom -translate-y-12 relative z-20">
        {/* Search & Filter Bar */}
        <div className="max-w-6xl mx-auto mb-12 md:mb-20 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <div className="glass p-4 rounded-[2rem] md:rounded-[2.5rem] shadow-premium flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-blue/30" />
              <input
                type="text"
                placeholder="Search stories by title or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-6 py-4 bg-white/50 border-transparent focus:bg-white focus:shadow-inner rounded-2xl outline-none transition-all text-brand-blue font-bold text-sm tracking-tight"
              />
            </div>
            <div className="flex items-center gap-3 overflow-x-auto pb-1 lg:pb-0 px-2 lg:border-l lg:border-slate-100 lg:pl-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all whitespace-nowrap ${activeCategory === cat
                    ? "bg-brand-blue text-white shadow-xl scale-105"
                    : "text-brand-blue/60 hover:bg-brand-blue/5 hover:text-brand-blue"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blogs Grid */}
        <div className="max-w-7xl mx-auto mb-20 md:mb-40">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-[2rem] md:rounded-[3rem] h-[500px] animate-pulse border border-slate-100 shadow-sm"></div>
              ))}
            </div>
          ) : filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16 lg:gap-20">
              {filteredBlogs.map((blog: any, idx) => (
                <Link
                  href={`/blogs/${blog.slug}`}
                  key={blog.id}
                  className="premium-card group flex flex-col animate-fade-up"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="h-72 relative overflow-hidden">
                    <div className="absolute inset-0 bg-brand-blue/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                    <img
                      src={fixImageUrl(blog.image_url)}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute top-6 left-6 z-20">
                      <span className="glass px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-blue">
                        {blog.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 md:p-10 flex flex-col flex-1 bg-white">
                    <div className="flex items-center gap-4 text-brand-blue/30 mb-6 text-[10px] font-black uppercase tracking-[0.2em]">
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-3 h-3" />
                        <span className="truncate max-w-[100px]">{blog.author_email?.split('@')[0] || "Author"}</span>
                      </div>
                      <span className="w-1 h-1 bg-brand-gold rounded-full" />
                      <span>{blog.year}</span>
                    </div>

                    <h3 className="text-2xl font-heading font-black text-brand-blue mb-4 leading-tight group-hover:text-brand-azure transition-colors line-clamp-2">
                      {blog.title}
                    </h3>

                    <p className="text-brand-gray/60 text-sm line-clamp-3 mb-6 md:mb-10 flex-1 font-light leading-relaxed">
                      {blog.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-blue/40 group-hover:text-brand-azure transition-colors">
                        Read Story
                      </span>
                      <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                        &rarr;
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="glass p-10 md:p-24 text-center rounded-[2rem] md:rounded-[4rem] max-w-2xl mx-auto shadow-premium animate-fade-up">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-brand-blue/5 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8">
                <BookOpenIcon className="w-8 h-8 md:w-10 md:h-10 text-brand-blue/20" />
              </div>
              <h3 className="text-2xl md:text-3xl font-heading font-black text-brand-blue mb-4 italic">No stories found</h3>
              <p className="text-brand-gray/60 font-light text-sm md:text-lg mb-8 md:mb-10">Our archives are deep, but we couldn't find a match. Try broadening your criteria.</p>
              <button
                onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                className="px-8 py-3 bg-brand-blue text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-brand-azure transition-all shadow-xl"
              >
                Reset Exploration
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
