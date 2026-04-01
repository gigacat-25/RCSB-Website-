"use client";
export const runtime = 'edge';

import { useEffect, useState } from "react";
import Link from "next/link";

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/team?t=${new Date().getTime()}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTeamMembers(data);
        } else {
          setTeamMembers([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch team:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <section className="relative flex flex-col justify-center min-h-[400px] md:min-h-[480px] pt-28 md:pt-36 pb-16 overflow-hidden bg-[#0a1835] border-b border-brand-gold/10">
        {/* Premium Line Grid */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)
              `,
              backgroundSize: '48px 48px',
              maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 10%, transparent 80%)'
            }}
          />
        </div>

        {/* Ambient Color Glows */}
        <div className="absolute -top-20 right-1/4 w-[600px] h-[600px] bg-brand-gold/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 left-1/4 w-[600px] h-[600px] bg-brand-azure/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="container-custom relative z-10 text-white">
          <div className="max-w-4xl animate-fade-up">
            <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em] mb-4 md:mb-6 block">Our Leadership</span>
            <h1 className="text-5xl md:text-8xl font-heading font-black text-white mb-6 md:mb-8 leading-[1.1]">
              The Guiding <br />
              <span className="text-brand-gold italic">Force.</span>
            </h1>
            <p className="text-white/90 text-lg md:text-xl font-light leading-relaxed max-w-2xl">
              Meet the visionaries behind our impact. A dedicated board of directors committed to steering our club towards sustainable change and community growth.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Grid */}
      <section className="py-16 md:py-24">
        <div className="container-custom">

          <div className="mb-12 md:mb-24">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10 md:mb-16 animate-fade-up">
              <h2 className="text-2xl md:text-3xl font-heading font-black text-brand-blue italic underline decoration-brand-gold decoration-4 underline-offset-8">
                Board of Directors 2025-26
              </h2>
              <Link
                href="/past-presidents"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-gold/10 text-brand-gold hover:bg-brand-gold hover:text-white font-bold text-sm tracking-widest uppercase rounded-full transition-all border border-brand-gold/20 hover:border-brand-gold shadow-sm"
              >
                View Past Presidents &rarr;
              </Link>
            </div>

            {loading ? (
              <div className="glass p-10 md:p-24 text-center rounded-[2rem] md:rounded-[4rem] text-slate-400 font-heading font-bold text-xl md:text-3xl italic animate-pulse">
                Loading leadership team...
              </div>
            ) : teamMembers.length === 0 ? (
              <div className="glass p-10 md:p-24 text-center rounded-[2rem] md:rounded-[4rem] text-slate-400 font-heading font-bold text-xl md:text-3xl italic animate-fade-up">
                The roster is being curated for the upcoming term.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-24">
                {teamMembers.map((member: any, idx: number) => (
                  <div
                    key={idx}
                    className="group flex flex-col animate-fade-up"
                    style={{ animationDelay: `${idx * 150}ms` }}
                  >
                    <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-10 shadow-premium group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-700">
                      <div className="absolute inset-0 bg-brand-blue/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                      <img
                        src={member.image_url || "/favicon.png"}
                        alt={member.name}
                        className={`w-full h-full transition-transform duration-1000 ${member.image_url ? 'object-cover group-hover:scale-110' : 'object-contain p-12 bg-white/50 group-hover:scale-110'}`}
                      />
                      <div className="absolute inset-x-4 bottom-4 glass p-6 md:p-8 rounded-[1.5rem] opacity-0 group-hover:opacity-100 translate-y-10 group-hover:translate-y-0 transition-all duration-500 z-20 text-center">
                        <p className="text-brand-blue text-[11px] md:text-[12px] italic font-medium leading-relaxed">
                          "{member.bio || "Leading with empathy and impact."}"
                        </p>
                      </div>
                    </div>
                    <div className="px-4">
                      <h3 className="text-2xl md:text-3xl font-heading font-black text-brand-blue mb-2 group-hover:text-brand-azure transition-colors">{member.name}</h3>
                      <div className="text-brand-gray/40 text-[10px] font-black uppercase tracking-[0.3em] flex items-start justify-between gap-4 mt-2">
                        <div className="flex-1 leading-[1.6]">
                          {member.role}
                        </div>
                        <div className="flex items-center gap-3 shrink-0 mt-[2px]">
                          <span className="w-4 h-px bg-slate-200" />
                          <span className="text-brand-gold">{member.period}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>
    </div>
  );
}

