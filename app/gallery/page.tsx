import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { allEventsQuery } from "@/sanity/lib/queries";
import SectionHeader from "@/components/ui/SectionHeader";
import MasonryGrid from "@/components/gallery/MasonryGrid";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photo gallery from RCSB events and service projects.",
};

export const revalidate = 3600;

export default async function GalleryPage() {
  const events = await client.fetch(allEventsQuery).catch(() => []);

  // Collect all photos with event grouping
  const groups = events
    .filter((e: { photoAlbum?: string[] }) => e.photoAlbum && e.photoAlbum.length > 0)
    .map((e: { title: string; slug: { current: string }; photoAlbum: string[] }) => ({
      title: e.title,
      slug: e.slug.current,
      photos: e.photoAlbum,
    }));

  const allPhotos = groups.flatMap((g: { photos: string[] }) => g.photos);

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Gallery"
          subtitle="Moments from our events, projects, and fellowship."
        />

        {allPhotos.length === 0 ? (
          <div className="text-center py-20 bg-brand-grey rounded-xl">
            <p className="text-gray-400 text-sm">Photos will appear here once events are added.</p>
          </div>
        ) : (
          <>
            {groups.map((group: { title: string; slug: string; photos: string[] }) => (
              <div key={group.slug} className="mb-12">
                <h2 className="font-heading font-semibold text-brand-blue text-lg mb-4 flex items-center gap-3">
                  <span className="w-8 h-0.5 bg-brand-gold rounded-full" />
                  {group.title}
                </h2>
                <MasonryGrid images={group.photos} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
