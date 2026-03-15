import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { eventBySlugQuery } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";
import RSVPForm from "@/components/events/RSVPForm";
import MasonryGrid from "@/components/gallery/MasonryGrid";

interface EventPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const event = await client.fetch(eventBySlugQuery, { slug: params.slug }).catch(() => null);
  if (!event) return { title: "Event Not Found" };
  return {
    title: event.title,
    description: `${event.title} — ${event.location || "Bengaluru"}`,
    openGraph: {
      images: event.coverImage ? [{ url: event.coverImage }] : [],
    },
  };
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const event = await client.fetch(eventBySlugQuery, { slug: params.slug }).catch(() => null);
  if (!event) notFound();

  const formattedDate = new Date(event.date).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cover */}
        {event.coverImage && (
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8 bg-brand-grey">
            <Image
              src={`${event.coverImage}?width=1200&format=webp`}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          {event.isUpcoming && (
            <span className="inline-block bg-brand-gold text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
              Upcoming
            </span>
          )}
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-brand-blue mb-4">{event.title}</h1>
          <div className="flex flex-col sm:flex-row gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-2">📅 {formattedDate}</span>
            {event.location && <span className="flex items-center gap-2">📍 {event.location}</span>}
          </div>
        </div>

        {/* Description */}
        {event.description && (
          <div className="prose prose-blue max-w-none mb-10 text-gray-600">
            <PortableText value={event.description} />
          </div>
        )}

        {/* RSVP */}
        {event.isUpcoming && (
          <div className="mb-12">
            <RSVPForm eventSlug={event.slug.current} eventTitle={event.title} />
          </div>
        )}

        {/* Photo Album */}
        {event.photoAlbum && event.photoAlbum.length > 0 && (
          <div>
            <h2 className="font-heading font-bold text-xl text-brand-blue mb-6">
              📸 Photo Album
            </h2>
            <MasonryGrid images={event.photoAlbum} />
          </div>
        )}
      </div>
    </div>
  );
}
