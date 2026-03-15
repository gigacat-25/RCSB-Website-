import Link from "next/link";
import Image from "next/image";

interface EventCardProps {
  title: string;
  date: string;
  location?: string;
  slug: string;
  coverImage?: string;
  isUpcoming?: boolean;
}

export default function EventCard({ title, date, location, slug, coverImage, isUpcoming }: EventCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <Link href={`/events/${slug}`} className="block group">
      <div className="card-hover rounded-xl overflow-hidden border border-gray-100 bg-white h-full">
        <div className="relative h-48 bg-brand-grey overflow-hidden">
          {coverImage ? (
            <Image
              src={`${coverImage}?width=600&format=webp`}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-brand-blue/20 text-6xl font-heading font-bold">RCSB</div>
            </div>
          )}
          {isUpcoming && (
            <span className="absolute top-3 left-3 bg-brand-gold text-white text-xs font-semibold px-2 py-1 rounded-full">
              Upcoming
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-heading font-semibold text-brand-blue text-base mb-2 line-clamp-2 group-hover:text-brand-gold transition-colors">
            {title}
          </h3>
          <div className="flex flex-col gap-1 text-xs text-gray-500">
            <span className="flex items-center gap-1">📅 {formattedDate}</span>
            {location && <span className="flex items-center gap-1">📍 {location}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}
