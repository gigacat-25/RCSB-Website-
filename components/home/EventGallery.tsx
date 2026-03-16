"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon, CameraIcon } from "@heroicons/react/24/outline";

const images = [
  {
    url: "https://rcsb-api-worker.impact1-iceas.workers.dev/media/event_fellowship_1.jpg", // Placeholder for user's image
    title: "Vibrant Community",
    caption: "Moments of fellowship and shared purpose ignite our mission."
  },
  {
    url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1498&auto=format&fit=crop",
    title: "Leadership Summits",
    caption: "Empowering the next generation through collaborative learning."
  },
  {
    url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop",
    title: "Global Service",
    caption: "Extending our reach far beyond local borders to impact lives."
  },
  {
    url: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=2070&auto=format&fit=crop",
    title: "Youth Empowerment",
    caption: "Cultivating talent and drive in every community we touch."
  }
];

export default function EventGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

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
    })
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => (prevIndex + newDirection + images.length) % images.length);
  };

  useEffect(() => {
    const timer = setInterval(() => paginate(1), 6000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <section className="py-32 bg-slate-900 border-y border-white/5 relative overflow-hidden">
      {/* Mesh Background */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-20 pointer-events-none" />
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-20 animate-fade-up">
          <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.5em] mb-4 block">Event Gallery</span>
          <h2 className="text-5xl md:text-7xl font-heading font-black text-white italic">
            Moments of <span className="text-brand-gold">Fellowship.</span>
          </h2>
        </div>

        <div className="relative h-[600px] w-full max-w-6xl mx-auto group">
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
                scale: { duration: 0.4 }
              }}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
              <div className="relative h-full w-full rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 group/card">
                <img 
                  src={images[currentIndex].url} 
                  alt={images[currentIndex].title}
                  className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover/card:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent" />
                
                <div className="absolute bottom-16 left-16 right-16">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="max-w-2xl"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-[1px] bg-brand-gold" />
                      <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.3em] font-sans">
                        Feature Story
                      </span>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-heading font-black text-white mb-6">
                      {images[currentIndex].title}
                    </h3>
                    <p className="text-lg text-white/60 font-light leading-relaxed">
                      {images[currentIndex].caption}
                    </p>
                  </motion.div>
                </div>

                <div className="absolute top-10 right-10">
                   <div className="px-6 py-3 glass rounded-full flex items-center gap-3">
                      <CameraIcon className="w-4 h-4 text-brand-gold" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">
                        RCSB Archives
                      </span>
                   </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-8">
            <button 
              onClick={() => paginate(-1)}
              className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-brand-gold hover:text-slate-950 hover:border-brand-gold transition-all group/nav"
            >
              <ChevronLeftIcon className="w-6 h-6 group-hover/nav:-translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center gap-4">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > currentIndex ? 1 : -1);
                    setCurrentIndex(idx);
                  }}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    idx === currentIndex ? "w-12 bg-brand-gold" : "w-4 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
            <button 
              onClick={() => paginate(1)}
              className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-brand-gold hover:text-slate-950 hover:border-brand-gold transition-all group/nav"
            >
              <ChevronRightIcon className="w-6 h-6 group-hover/nav:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
