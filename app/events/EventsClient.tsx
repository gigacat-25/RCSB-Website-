"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import EventCard from "@/components/events/EventCard";

interface Event {
  _id: string;
  title: string;
  date: string;
  location?: string;
  slug: { current: string };
  coverImage?: string;
  isUpcoming: boolean;
}

export default function EventsClient({ events }: { events: Event[] }) {
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");

  const filtered = events.filter((e) => {
    if (filter === "upcoming") return e.isUpcoming;
    if (filter === "past") return !e.isUpcoming;
    return true;
  });

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Events"
          subtitle="From service projects to fellowship nights — here's what we've been up to."
        />

        {/* Filter tabs */}
        <div className="flex gap-2 mb-8">
          {(["all", "upcoming", "past"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                filter === f
                  ? "bg-brand-blue text-white"
                  : "bg-brand-grey text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-brand-grey rounded-xl">
            <p className="text-gray-400">No events found. Check back soon!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((event, i) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <EventCard
                  title={event.title}
                  date={event.date}
                  location={event.location}
                  slug={event.slug.current}
                  coverImage={event.coverImage}
                  isUpcoming={event.isUpcoming}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
