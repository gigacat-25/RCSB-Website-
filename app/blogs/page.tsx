"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpenIcon, UserIcon, MagnifyingGlassIcon, TagIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/admin/projects"); // Using the proxy endpoint that actually returns data
        const data = await res.json();
        const blogsData = data.filter((p: any) => p.type === "blog");
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
    <main className="min-h-screen pt-32 pb-20 bg-[#F8FAFC]">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-brand-blue mb-4">Our Stories & Blogs</h1>
          <p className="text-xl text-brand-gray mb-8">Insights, reports, and experiences from the hearts of our Rotaractors.</p>
          <Link 
            href="/admin/blogs/add"
            className="inline-flex items-center gap-3 px-8 py-4 bg-brand-gold text-brand-blue font-black rounded-2xl hover:bg-brand-blue hover:text-white transition-all shadow-xl hover:-translate-y-1"
          >
            <PencilSquareIcon className="w-6 h-6" />
            Write a Story
          </Link>
        </div>

        {/* Search & Filter Bar */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="bg-white p-4 rounded-[32px] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search stories by title or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-brand-azure focus:ring-0 rounded-2xl outline-none transition-all text-brand-blue font-medium"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 px-2">
              <TagIcon className="w-5 h-5 text-gray-400 hidden md:block" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                    activeCategory === cat 
                      ? "bg-brand-blue text-white shadow-md"
                      : "bg-gray-50 text-brand-gray hover:bg-gray-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blogs Grid */}
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-3xl h-96 animate-pulse border border-gray-100"></div>
              ))}
            </div>
          ) : filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog: any) => (
                <Link 
                  href={`/blogs/${blog.slug}`} 
                  key={blog.id}
                  className="group bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 border border-gray-100 flex flex-col h-full p-4"
                >
                  <div className="h-56 relative overflow-hidden rounded-[24px]">
                    <img 
                      src={fixImageUrl(blog.image_url)} 
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-black/60 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                        {blog.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-brand-gray mb-4 text-[11px] font-bold uppercase tracking-widest">
                      <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-brand-gold" />
                      </div>
                      <span className="truncate max-w-[120px]">By {blog.author_email?.split('@')[0] || "Club Member"}</span>
                      <span className="text-gray-200">•</span>
                      <span>{blog.year}</span>
                    </div>
                    
                    <h3 className="text-xl font-heading font-black text-brand-blue mb-4 leading-tight group-hover:text-brand-azure transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    
                    <p className="text-brand-gray text-sm line-clamp-3 mb-8 flex-1 italic">
                      "{blog.description}"
                    </p>
                    
                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                      <span className="text-brand-azure font-black text-[11px] uppercase tracking-widest flex items-center gap-2">
                        Read Full Story <span className="group-hover:translate-x-2 transition-transform duration-300">&rarr;</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[40px] p-20 text-center border border-gray-100 max-w-2xl mx-auto shadow-xl">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpenIcon className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-2xl font-black text-brand-blue mb-3">No stories found</h3>
              <p className="text-brand-gray font-medium">Try adjusting your search or category filters to find what you're looking for.</p>
              <button 
                onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                className="mt-8 text-brand-azure font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
