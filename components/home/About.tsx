"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function About() {
  const [memberCount, setMemberCount] = useState(50);

  useEffect(() => {
    fetch('/api/team')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          setMemberCount(data.length);
        }
      })
      .catch(err => console.error("Could not fetch team count:", err));
  }, []);
  return (
    <section className="py-20 md:py-32 bg-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-light/50 -skew-x-12 translate-x-1/2 -z-10" />
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-brand-gold opacity-5 blur-[100px] -z-10" />

      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Visual Side */}
          <div className="relative animate-fade-up">
            <div className="relative z-10 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-premium group">
              <div className="absolute inset-0 bg-brand-blue/20 group-hover:bg-transparent transition-colors duration-700" />
              <img
                src="/group-photo-2.jpeg"
                alt="Rotaract Team in Action"
                className="w-full h-auto object-contain transition-transform duration-1000 group-hover:scale-105"
              />
            </div>

            {/* Floating Info Card */}
            <div className="absolute -bottom-6 -right-4 lg:-bottom-10 lg:-right-4 glass p-4 md:p-6 rounded-[2rem] shadow-xl max-w-[200px] md:max-w-[240px] hidden sm:block animate-float z-20 bg-white/80 backdrop-blur-xl border border-white/20">
              <div className="flex flex-col gap-1">
                <span className="text-2xl md:text-3xl font-heading font-black text-brand-blue">{memberCount}+</span>
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-brand-gray/60 leading-tight">
                  Active Members Dedicated to Community Change
                </span>
                <div className="w-10 h-1 bg-brand-gold mt-1.5 rounded-full" />
              </div>
            </div>

            <div className="absolute -top-10 -left-10 w-40 h-40 border-2 border-brand-azure/10 rounded-full -z-10" />
          </div>

          {/* Content Side */}
          <div className="space-y-8 md:space-y-10 animate-fade-up mt-8 lg:mt-0" style={{ animationDelay: "200ms" }}>
            <div>
              <span className="text-[10px] font-black text-brand-azure uppercase tracking-[0.3em] mb-4 md:mb-6 block">Who We Are</span>
              <h2 className="text-4xl md:text-7xl font-heading font-black mb-6 md:mb-8 leading-[1.1]">
                Together, <br />
                <span className="text-brand-blue italic">Change is Possible!</span>
              </h2>
            </div>

            <div className="space-y-6 text-brand-gray/80 text-lg leading-relaxed font-light">
              <p>
                Rotaract Club of Swarna Bengaluru (Formerly Rotaract Club of Bangalore Seshadripuram), emerged in the cradle of service dreamt by 15 young friends in Bengaluru in 2014.
              </p>
              <p>
                Since inception, the team has grown bigger, serving the society. As a part of Rotary International, RCSB strives hard to Connect the World and also shouts out, "Together, Change is Possible!". Join us to Inspire and Serve.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 pt-4">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center text-brand-blue">
                  <span className="font-heading font-bold text-xl leading-none">01</span>
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xl mb-2">Leadership</h4>
                  <p className="text-xs text-brand-gray/60 font-medium leading-relaxed uppercase tracking-wider">Mentoring the next generation of changemakers.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-brand-gold">
                  <span className="font-heading font-bold text-xl leading-none">02</span>
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xl mb-2">Impact</h4>
                  <p className="text-xs text-brand-gray/60 font-medium leading-relaxed uppercase tracking-wider">Executing service projects that matter to Bengaluru.</p>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link href="/team" className="group inline-flex items-center gap-4 text-brand-blue font-black uppercase tracking-[0.2em] text-xs">
                <span className="relative">
                  Discover our journey
                  <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-brand-blue/20 group-hover:bg-brand-blue transition-colors" />
                </span>
                <div className="w-10 h-10 rounded-full border border-brand-blue/20 flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                  <span className="text-xl">&rarr;</span>
                </div>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
