"use client";
// Photo strip with CSS marquee animation (no JS scroll needed)
// Shows club highlight images in a continuous horizontal scroll

const PLACEHOLDER_PHOTOS = [
  { bg: "#003DA5", label: "Service Day" },
  { bg: "#F5A623", label: "Project ROSHANY" },
  { bg: "#1a1a2e", label: "Annual Meet" },
  { bg: "#003DA5", label: "Vedtathva" },
  { bg: "#F5A623", label: "Sthree Project" },
  { bg: "#003DA5", label: "Fellowship Night" },
  { bg: "#1a1a2e", label: "Community Drive" },
  { bg: "#F5A623", label: "Blood Donation" },
];

interface PhotoStripProps {
  photos?: string[];
}

export default function PhotoStrip({ photos }: PhotoStripProps) {
  const items = photos && photos.length > 0 ? photos : null;

  return (
    <section className="py-16 overflow-hidden bg-white">
      <div className="mb-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading font-bold text-xl text-brand-blue">
          Club Highlights <span className="inline-block w-10 h-0.5 bg-brand-gold align-middle ml-2" />
        </h2>
      </div>
      <div className="relative">
        {/* Double the items for seamless loop */}
        <div className="flex gap-4 animate-marquee w-max">
          {[...PLACEHOLDER_PHOTOS, ...PLACEHOLDER_PHOTOS].map((p, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-64 h-44 rounded-xl overflow-hidden flex items-center justify-center text-white font-heading font-bold text-lg"
              style={items ? undefined : { backgroundColor: p.bg }}
            >
              {items ? (
                <img
                  src={`${items[i % items.length]}?width=400&format=webp`}
                  alt={`Highlight ${i + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                p.label
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
