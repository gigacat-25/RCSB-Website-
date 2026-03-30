"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon, CameraIcon } from "@heroicons/react/24/outline";

interface GallerySlide {
  id: number | string;
  title: string;
  caption: string;
  image_url: string;
  order_index: number;
}

// Fallback slides shown while loading or if the API has no data yet
const FALLBACK_SLIDES: Omit<GallerySlide, "id" | "order_index">[] = [
  {
    image_url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1498&auto=format&fit=crop",
    title: "Leadership Summits",
    caption: "Empowering the next generation through collaborative learning.",
  },
  {
    image_url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop",
    title: "Global Service",
    caption: "Extending our reach far beyond local borders to impact lives.",
  },
  {
    image_url: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=2070&auto=format&fit=crop",
    title: "Youth Empowerment",
    caption: "Cultivating talent and drive in every community we touch.",
  },
];

export default function EventGallery() {
  const [slides, setSlides] = useState<GallerySlide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const allSlides: GallerySlide[] = [];
          data.forEach(item => {
            // Only include actual content items, not settings, and skip trash
            if (!["project", "blog", "event"].includes(item.type) || item.status === "trash") return;

            const time = new Date(item.created_at || 0).getTime();

            if (item.image_url) {
              allSlides.push({
                id: `${item.id}-main`,
                title: item.title,
                caption: item.description || item.category,
                image_url: item.image_url,
                order_index: time
              });
            }

            try {
              const galleries = JSON.parse(item.gallery_urls || "[]");
              if (Array.isArray(galleries)) {
                galleries.forEach((gUrl: string, gIdx: number) => {
                  allSlides.push({
                    id: `${item.id}-gallery-${gIdx}`,
                    title: item.title,
                    caption: item.description || item.category,
                    image_url: gUrl,
                    order_index: time - (gIdx + 1) // slightly offset to keep ordering deterministic
                  });
                });
              }
            } catch (e) {
              // ignore JSON parse errors
            }
          });

          allSlides.sort((a, b) => b.order_index - a.order_index);

          if (allSlides.length > 0) {
            setSlides(allSlides.slice(0, 15));
          } else {
            setSlides(FALLBACK_SLIDES as GallerySlide[]);
          }
        } else {
          setSlides(FALLBACK_SLIDES as GallerySlide[]);
        }
      })
      .catch(() => setSlides(FALLBACK_SLIDES as GallerySlide[]));
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
    }),
  };

  const paginate = (newDirection: number) => {
    if (slides.length === 0) return;
    setDirection(newDirection);
    setCurrentIndex((prev) => (prev + newDirection + slides.length) % slides.length);
  };

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => paginate(1), 6000);
    return () => clearInterval(timer);
  }, [currentIndex, slides.length]);

  const current = slides[currentIndex];

  return (
    <section className="py-20 md:py-32 bg-slate-900 border-y border-white/5 relative overflow-hidden">
      {/* Mesh Background */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-20 pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="text-center mb-16 md:mb-20 animate-fade-up">
          <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.5em] mb-4 block">
            Event Gallery
          </span>
          <h2 className="text-4xl md:text-7xl font-heading font-black text-white italic">
            Moments of <span className="text-brand-gold">Fellowship.</span>
          </h2>
        </div>

        {slides.length === 0 ? (
          // Skeleton while loading
          <div className="relative h-[400px] md:h-[600px] w-full max-w-6xl mx-auto rounded-[2rem] md:rounded-[3rem] bg-slate-800 animate-pulse" />
        ) : (
          <div className="relative h-[400px] md:h-[600px] w-full max-w-6xl mx-auto group">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.4 },
                  scale: { duration: 0.4 },
                }}
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
              >
                <div className="relative h-full w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 group/card">
                  <Image
                    src={current.image_url}
                    alt={current.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 1200px"
                    className="object-cover transition-transform duration-[2000ms] group-hover/card:scale-110"
                    priority={currentIndex === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent" />

                  <div className="absolute bottom-8 left-6 right-6 md:bottom-16 md:left-16 md:right-16">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="max-w-2xl"
                    >
                      <div className="flex items-center gap-3 mb-2 md:mb-4">
                        <div className="w-6 md:w-8 h-[1px] bg-brand-gold" />
                        <span className="text-[9px] md:text-[10px] font-black text-brand-gold uppercase tracking-[0.3em] font-sans">
                          Feature Story
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-5xl font-heading font-black text-white mb-3 md:mb-6 leading-tight">
                        {current.title}
                      </h3>
                      {current.caption && (
                        <p className="text-sm md:text-lg text-white/60 font-light leading-relaxed line-clamp-3 md:line-clamp-none">
                          {current.caption}
                        </p>
                      )}
                    </motion.div>
                  </div>

                  <div className="absolute top-6 right-6 md:top-10 md:right-10">
                    <div className="px-4 py-2 md:px-6 md:py-3 glass rounded-full flex items-center gap-2 md:gap-3">
                      <CameraIcon className="w-4 h-4 text-brand-gold" />
                      <span className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-widest leading-none">
                        RCSB Archives
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="absolute -bottom-10 md:-bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-4 md:gap-8">
              <button
                onClick={() => paginate(-1)}
                className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-brand-gold hover:text-slate-950 hover:border-brand-gold transition-all group/nav"
              >
                <ChevronLeftIcon className="w-5 h-5 md:w-6 md:h-6 group-hover/nav:-translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center gap-4">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setDirection(idx > currentIndex ? 1 : -1);
                      setCurrentIndex(idx);
                    }}
                    className={`h-1 rounded-full transition-all duration-500 ${idx === currentIndex ? "w-8 md:w-12 bg-brand-gold" : "w-3 md:w-4 bg-white/20 hover:bg-white/40"
                      }`}
                  />
                ))}
              </div>
              <button
                onClick={() => paginate(1)}
                className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-brand-gold hover:text-slate-950 hover:border-brand-gold transition-all group/nav"
              >
                <ChevronRightIcon className="w-5 h-5 md:w-6 md:h-6 group-hover/nav:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
