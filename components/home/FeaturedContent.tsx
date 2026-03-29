"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpenIcon, UserIcon, ArrowRightIcon, CalendarIcon } from "@heroicons/react/24/outline";

export default function FeaturedContent() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/projects?t=${new Date().getTime()}`);
        const data = await res.json();

        setBlogs((data || []).filter((p: any) => p.type === "blog").slice(0, 3));
        setEvents((data || []).filter((p: any) => p.type === "event" && p.status === "upcoming").slice(0, 2));
      } catch (err) {
        console.error("Failed to fetch featured content:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fixImageUrl = (url: string | null | undefined) => {
    if (!url) return "/Images/placeholder.jpg";
    if (url.includes("rcsb-website.pages.dev/media/")) {
      const key = url.split("rcsb-website.pages.dev/media/").pop();
      return `https://rcsb-api-worker.impact1-iceas.workers.dev/media/${key}`;
    }
    if (url.includes("media.rcsb.in/")) {
      const key = url.split("media.rcsb.in/").pop();
      return `https://rcsb-api-worker.impact1-iceas.workers.dev/media/${key}`;
    }
    return url;
  };

  if (loading) return null;
  if (blogs.length === 0 && events.length === 0) return null;

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="container-custom relative z-10">

        {/* Events Section */}
        {events.length > 0 && (
          <div className="mb-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
              <div className="animate-fade-up">
                <span className="text-[10px] font-black text-brand-azure uppercase tracking-[0.3em] mb-4 block">Mark Your Calendars</span>
                <h3 className="text-5xl md:text-6xl font-heading font-black text-brand-blue">Upcoming Events</h3>
              </div>
              <Link href="/projects" className="group flex items-center gap-4 text-brand-blue font-black uppercase tracking-[0.2em] text-[10px] hover:text-brand-azure transition-colors animate-fade-up">
                View All Events <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {events.map((event, idx) => (
                <Link
                  key={event.id}
                  href={`/projects/${event.slug}`}
                  className="group relative flex flex-col md:flex-row premium-card animate-fade-up"
                  style={{ animationDelay: `${idx * 200}ms` }}
                >
                  <div className="md:w-2/5 h-64 md:h-auto overflow-hidden relative">
                    <div className="absolute inset-0 bg-brand-blue/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                    <Image
                      src={fixImageUrl(event.image_url)}
                      alt={event.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 20vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                  </div>
                  <div className="md:w-3/5 p-10 flex flex-col justify-center bg-white">
                    <div className="flex items-center gap-3 text-brand-azure text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                      <CalendarIcon className="w-4 h-4" />
                      {event.year}
                    </div>
                    <h4 className="text-2xl font-heading font-black text-brand-blue mb-4 group-hover:text-brand-azure transition-colors line-clamp-2">
                      {event.title}
                    </h4>
                    <p className="text-brand-gray/60 text-sm line-clamp-2 italic font-light leading-relaxed">
                      {event.description}
                    </p>
                    <div className="mt-8 flex items-center gap-2 text-brand-blue font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      See Invitation &rarr;
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Blogs Section */}
        {blogs.length > 0 && (
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
              <div className="animate-fade-up">
                <span className="text-[10px] font-black text-brand-cranberry uppercase tracking-[0.3em] mb-4 block">Latest Stories</span>
                <h3 className="text-5xl md:text-6xl font-heading font-black text-brand-blue">From Our Blog</h3>
              </div>
              <Link href="/blogs" className="group flex items-center gap-4 text-brand-blue font-black uppercase tracking-[0.2em] text-[10px] hover:text-brand-cranberry transition-colors animate-fade-up">
                Read All Stories <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {blogs.map((blog, idx) => (
                <Link
                  key={blog.id}
                  href={`/blogs/${blog.slug}`}
                  className="group flex flex-col animate-fade-up"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <div className="relative h-72 overflow-hidden rounded-[2.5rem] mb-8 shadow-premium group-hover:shadow-2xl transition-all duration-500">
                    <div className="absolute inset-0 bg-brand-blue/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                    <Image
                      src={fixImageUrl(blog.image_url)}
                      alt={blog.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-20"></div>
                  </div>
                  <div className="flex-1 px-4">
                    <span className="text-brand-azure text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">
                      {blog.category}
                    </span>
                    <h4 className="text-2xl font-heading font-black text-brand-blue mb-4 group-hover:text-brand-azure transition-colors line-clamp-2">
                      {blog.title}
                    </h4>
                    <p className="text-brand-gray/60 text-sm line-clamp-3 leading-relaxed font-light mb-6">
                      {blog.description}
                    </p>
                    <div className="w-12 h-1 bg-slate-100 group-hover:w-full group-hover:bg-brand-gold transition-all duration-500" />
                    {/* Read Link */}
                    <div className="my-auto mt-6 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-blue/40 group-hover:text-brand-azure transition-colors">
                        Read Full Story
                      </span>
                      <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-all duration-300 transform group-hover:translate-x-2">
                        <ArrowRightIcon className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
