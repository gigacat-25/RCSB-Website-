import Link from "next/link";
import EventCard from "@/components/events/EventCard";
import SectionHeader from "@/components/ui/SectionHeader";
import AnimatedSection from "@/components/ui/AnimatedSection";

interface Event {
  _id: string;
  title: string;
  date: string;
  location?: string;
  slug: { current: string };
  coverImage?: string;
  isUpcoming: boolean;
}

interface FeaturedEventsProps { events: Event[] }

export default function FeaturedEvents({ events }: FeaturedEventsProps) {
  const featured = events.slice(0, 3);

  return (
    <AnimatedSection className="py-24 relative z-10 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="badge-glass px-4 py-1.5 rounded-full inline-flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
              <span className="text-xs font-medium text-white tracking-widest uppercase opacity-90">What's Next</span>
            </div>
            <h2 className="font-heading font-bold text-3xl md:text-5xl text-white tracking-tight">
              Upcoming Events
            </h2>
          </div>
          <Link href="/events" className="group glass-panel px-6 py-3 text-white font-medium text-sm hover:bg-white/10 transition-all whitespace-nowrap">
            View all <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {featured.length === 0 ? (
          <div className="text-center py-20 glass-panel">
            <p className="text-gray-400 text-sm font-light">No upcoming events right now. The calendar is brewing!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((event) => (
              <div key={event._id} className="glass-panel overflow-hidden">
                <EventCard
                  title={event.title}
                  date={event.date}
                  location={event.location}
                  slug={event.slug.current}
                  coverImage={event.coverImage}
                  isUpcoming={event.isUpcoming}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}
