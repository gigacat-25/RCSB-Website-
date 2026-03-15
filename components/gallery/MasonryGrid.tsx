"use client";
import { useState } from "react";
import Image from "next/image";

interface LightboxProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

export function Lightbox({ images, initialIndex, onClose }: LightboxProps) {
  const [current, setCurrent] = useState(initialIndex);

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-white text-3xl z-10 hover:text-brand-gold transition-colors">
        ✕
      </button>
      <button onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-4 text-white text-4xl z-10 hover:text-brand-gold transition-colors p-2">
        ‹
      </button>
      <div className="relative w-full max-w-4xl max-h-[85vh] aspect-video mx-8" onClick={(e) => e.stopPropagation()}>
        <Image
          src={`${images[current]}?width=1200&format=webp`}
          alt={`Photo ${current + 1}`}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 80vw"
        />
      </div>
      <button onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-4 text-white text-4xl z-10 hover:text-brand-gold transition-colors p-2">
        ›
      </button>
      <p className="absolute bottom-4 text-gray-400 text-sm">
        {current + 1} / {images.length}
      </p>
    </div>
  );
}

interface MasonryGridProps {
  images: string[];
}

export default function MasonryGrid({ images }: MasonryGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <div className="masonry-grid">
        {images.map((src, i) => (
          <div key={i} className="masonry-item cursor-pointer group" onClick={() => setLightboxIndex(i)}>
            <div className="relative overflow-hidden rounded-lg bg-brand-grey">
              <img
                src={`${src}?width=600&format=webp`}
                alt={`Photo ${i + 1}`}
                loading="lazy"
                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-brand-blue/0 group-hover:bg-brand-blue/10 transition-colors duration-300" />
            </div>
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
