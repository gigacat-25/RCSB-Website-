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
    <Link href={`/events/${slug}`} className="block group h-full">
      <div className="glass-panel overflow-hidden h-full flex flex-col relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/10 to-transparent flex-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
        
        <div className="relative h-48 bg-brand-void/50 overflow-hidden shrink-0 z-10 p-2">
          <div className="relative w-full h-full rounded-xl overflow-hidden">
            {coverImage ? (
              <Image
                src={`${coverImage}?width=600&format=webp`}
                alt={title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white/5">
                <div className="text-white/20 text-4xl font-heading font-bold tracking-tighter">RCSB</div>
              </div>
            )}
            <div className="absolute inset-0 bg-brand-void/20 group-hover:bg-transparent transition-colors duration-500" />
            
            {isUpcoming && (
              <span className="absolute top-3 left-3 bg-brand-gold text-brand-void text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full shadow-lg">
                Upcoming
              </span>
            )}
          </div>
        </div>
        
        <div className="p-5 sm:p-6 flex-1 flex flex-col z-10">
          <h3 className="font-heading font-bold text-white text-lg lg:text-xl mb-3 line-clamp-2 group-hover:text-brand-gold transition-colors tracking-tight">
            {title}
          </h3>
          <div className="flex flex-col gap-2 text-sm text-gray-400 mt-auto font-light">
            <span className="flex items-center gap-2">
              <span className="opacity-60">📅</span> {formattedDate}
            </span>
            {location && (
              <span className="flex items-center gap-2 line-clamp-1">
                <span className="opacity-60">📍</span> {location}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
