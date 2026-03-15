"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CalendarIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

export default function FeaturedContent() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        
        // Get latest 3 blogs
        const latestBlogs = data
          .filter((p: any) => p.type === "blog")
          .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 3);
          
        // Get latest 2 upcoming events
        const upcomingEvents = data
          .filter((p: any) => p.type === "event" && p.status === "upcoming")
          .slice(0, 2);
          
        setBlogs(latestBlogs);
        setEvents(upcomingEvents);
      } catch (err) {
        console.error("Failed to fetch featured content:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return null;
  if (blogs.length === 0 && events.length === 0) return null;

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container-custom relative z-10">
        
        {/* Events Section */}
        {events.length > 0 && (
          <div className="mb-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <h2 className="text-sm font-bold text-brand-azure uppercase tracking-[0.3em] mb-3">Mark Your Calendars</h2>
                <h3 className="text-3xl md:text-4xl font-heading font-bold text-brand-blue">Upcoming Events</h3>
              </div>
              <Link href="/projects" className="group flex items-center gap-2 text-brand-blue font-bold hover:text-brand-azure transition-colors">
                View All Events <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {events.map((event) => (
                <Link 
                  key={event.id}
                  href={`/projects/${event.slug}`}
                  className="group relative flex flex-col md:flex-row bg-gray-50 rounded-[32px] overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100"
                >
                  <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                    <img 
                      src={event.image_url || "/images/placeholder.jpg"} 
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="md:w-2/3 p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-brand-azure text-xs font-bold uppercase tracking-wider mb-3">
                      <CalendarIcon className="w-4 h-4" />
                      {event.year}
                    </div>
                    <h4 className="text-xl font-heading font-bold text-brand-blue mb-2 group-hover:text-brand-azure transition-colors line-clamp-2">
                      {event.title}
                    </h4>
                    <p className="text-brand-gray text-sm line-clamp-2 italic">
                      {event.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Blogs Section */}
        {blogs.length > 0 && (
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <h2 className="text-sm font-bold text-brand-cranberry uppercase tracking-[0.3em] mb-3">Latest Stories</h2>
                <h3 className="text-3xl md:text-4xl font-heading font-bold text-brand-blue">From Our Blog</h3>
              </div>
              <Link href="/blogs" className="group flex items-center gap-2 text-brand-blue font-bold hover:text-brand-azure transition-colors">
                Read All Stories <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <Link 
                  key={blog.id} 
                  href={`/projects/${blog.slug}`}
                  className="group flex flex-col h-full rounded-2xl overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="relative h-56 overflow-hidden rounded-2xl mb-6">
                    <img 
                      src={blog.image_url || "/images/placeholder.jpg"} 
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="flex-1 px-2">
                    <span className="text-brand-azure text-xs font-bold uppercase tracking-widest mb-2 block">
                      {blog.category}
                    </span>
                    <h4 className="text-xl font-heading font-bold text-brand-blue mb-3 group-hover:text-brand-azure transition-colors line-clamp-2">
                      {blog.title}
                    </h4>
                    <p className="text-brand-gray text-sm line-clamp-3">
                      {blog.description}
                    </p>
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
