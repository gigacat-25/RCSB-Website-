"use client";
import { ReactNode, useEffect, useState } from "react";
import Lenis from "lenis";

export default function Providers({ children }: { children: ReactNode }) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    // Update progress on scroll
    lenis.on("scroll", (e: any) => {
      setScrollProgress(e.progress);
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Standard scroll listener fallback
  useEffect(() => {
    const handleScrollFallback = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(window.scrollY / totalScroll);
      }
    };
    window.addEventListener("scroll", handleScrollFallback);
    return () => window.removeEventListener("scroll", handleScrollFallback);
  }, []);

  return (
    <>
      <div 
        className="scroll-progress-bar" 
        style={{ transform: `scaleX(${scrollProgress})` }} 
      />
      {children}
    </>
  );
}
