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
    <AnimatedSection className="py-20 bg-brand-grey/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <SectionHeader
            title="Upcoming Events"
            subtitle="Join us and be part of something meaningful."
          />
          <Link href="/events" className="text-brand-blue font-semibold text-sm hover:text-brand-gold transition-colors whitespace-nowrap pb-10">
            All events →
          </Link>
        </div>

        {featured.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-400 text-sm">No upcoming events. Check back soon!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((event) => (
              <EventCard
                key={event._id}
                title={event.title}
                date={event.date}
                location={event.location}
                slug={event.slug.current}
                coverImage={event.coverImage}
                isUpcoming={event.isUpcoming}
              />
            ))}
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}
