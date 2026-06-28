"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { UserGroupIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { motion, useInView, animate } from "framer-motion";

function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!inView) return;
    const node = ref.current;
    if (!node) return;

    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1], // easeOutExpo
      onUpdate(val) {
        node.textContent = Math.round(val).toString();
      },
    });

    return () => controls.stop();
  }, [inView, value]);

  return <span ref={ref}>0</span>;
}

export default function About() {
  const [memberCount, setMemberCount] = useState(50);
  const [aboutImage, setAboutImage] = useState("/group-photo-2.jpeg");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    fetch('/api/team')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          setMemberCount(data.length);
        }
      })
      .catch(err => console.error("Could not fetch team count:", err));

    fetch("/api/settings/about-photo")
      .then(res => res.json())
      .then(data => {
        if (data && data.url) setAboutImage(data.url);
      })
      .catch(err => console.error("Could not load about photo:", err));

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const imageContainerVariants = {
    hidden: isMobile 
      ? { opacity: 0, scale: 0.95 }
      : { clipPath: "inset(10% 10% 10% 10% rounded 2.5rem)", opacity: 0, scale: 0.95 },
    visible: {
      clipPath: isMobile ? undefined : "inset(0% 0% 0% 0% rounded 2.5rem)",
      opacity: 1,
      scale: 1,
      transition: { duration: isMobile ? 0.6 : 1.2, ease: [0.16, 1, 0.3, 1] as any }
    }
  };

  const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.05 : 0.1,
        delayChildren: isMobile ? 0.1 : 0.2
      }
    }
  };

  const textItemVariants = {
    hidden: isMobile
      ? { opacity: 0, y: 25 }
      : { opacity: 0, y: 25, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: isMobile ? undefined : "blur(0px)",
      transition: { duration: isMobile ? 0.5 : 0.8, ease: [0.16, 1, 0.3, 1] as any }
    }
  };

  return (
    <section className="py-20 md:py-32 bg-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-light/50 -skew-x-12 translate-x-1/2 -z-10" />
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-brand-gold opacity-5 blur-[100px] -z-10" />

      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">

          {/* Visual Side */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={imageContainerVariants}
            className="relative lg:col-span-7"
          >
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-premium group aspect-[4/3] md:aspect-video">
              <div className="absolute inset-0 bg-brand-blue/15 group-hover:bg-transparent transition-colors duration-700 z-10" />
              <Image
                src={aboutImage}
                alt="Rotaract Team in Action"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-103"
              />
            </div>

            {/* Floating Info Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              className="absolute -bottom-6 -right-4 lg:-bottom-10 lg:-right-4 glass p-4 md:p-6 rounded-[2rem] shadow-xl max-w-[200px] md:max-w-[240px] hidden sm:block z-20 bg-white/85 backdrop-blur-xl border border-white/20"
            >
              <div className="flex flex-col gap-1">
                <span className="text-2xl md:text-3xl font-heading font-black text-brand-blue">
                  <Counter value={memberCount} />+
                </span>
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-brand-gray/60 leading-tight">
                  Active Members Dedicated to Community Change
                </span>
                <div className="w-10 h-1 bg-brand-gold mt-1.5 rounded-full" />
              </div>
            </motion.div>

            <div className="absolute -top-10 -left-10 w-40 h-40 border-2 border-brand-azure/10 rounded-full -z-10" />
          </motion.div>

          {/* Content Side */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={textContainerVariants}
            className="space-y-8 md:space-y-10 mt-8 lg:mt-0 lg:col-span-5"
          >
            <motion.div variants={textItemVariants}>
              <span className="text-[10px] font-black text-brand-azure uppercase tracking-[0.3em] mb-4 md:mb-6 block">Who We Are</span>
              <h2 className="text-4xl md:text-7xl font-heading font-black mb-6 md:mb-8 leading-[1.1]">
                Together, <br />
                <span className="text-brand-blue italic">Change is Possible!</span>
              </h2>
            </motion.div>

            <motion.div variants={textItemVariants} className="space-y-6 text-brand-gray/80 text-lg leading-relaxed font-light font-sans">
              <p>
                Rotaract Club of Swarna Bengaluru (Formerly Rotaract Club of Bangalore Seshadripuram), emerged in the cradle of service dreamt by 15 young friends in Bengaluru in 2014.
              </p>
              <p>
                Since inception, the team has grown bigger, serving the society. As a part of Rotary International, RCSB strives hard to Connect the World and also shouts out, "Together, Change is Possible!". Join us to Inspire and Serve.
              </p>
            </motion.div>

            <motion.div variants={textItemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10 pt-6">
              <div className="group space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-brand-azure/10 flex items-center justify-center text-brand-azure group-hover:bg-brand-azure group-hover:text-white transition-all duration-500 shadow-sm">
                  <UserGroupIcon className="w-7 h-7 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="font-heading font-black text-xl text-brand-blue mb-2 group-hover:text-brand-azure transition-colors">Leadership</h4>
                  <p className="text-[10px] text-brand-gray/60 font-black leading-relaxed uppercase tracking-[0.1em]">
                    Mentoring the next <br /> generation of changemakers.
                  </p>
                </div>
              </div>

              <div className="group space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-blue transition-all duration-500 shadow-sm">
                  <SparklesIcon className="w-7 h-7 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="font-heading font-black text-xl text-brand-blue mb-2 group-hover:text-brand-gold transition-colors">Impact</h4>
                  <p className="text-[10px] text-brand-gray/60 font-black leading-relaxed uppercase tracking-[0.1em]">
                    Executing service projects <br /> that matter to Bengaluru.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={textItemVariants} className="pt-4">
              <Link href="/about" className="group inline-flex items-center gap-4 text-brand-blue font-black uppercase tracking-[0.2em] text-[10px] font-sans">
                <span className="relative py-1">
                  Discover our journey
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-blue group-hover:w-full transition-all duration-300" />
                </span>
                <div className="w-10 h-10 rounded-full border border-brand-blue/20 flex items-center justify-center group-hover:bg-brand-blue group-hover:border-brand-blue group-hover:text-white transition-all duration-300 transform group-hover:translate-x-1">
                  <span className="text-lg">&rarr;</span>
                </div>
              </Link>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
