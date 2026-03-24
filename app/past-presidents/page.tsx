"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";

export default function PastPresidentsPage() {
    const [pastPresidents, setPastPresidents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/past-presidents?t=${new Date().getTime()}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setPastPresidents(data);
                } else {
                    setPastPresidents([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch past presidents:", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Header */}
            <section className="relative py-24 md:py-40 overflow-hidden bg-[#0a1835] border-b border-brand-gold/10">
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
                    <div className="max-w-4xl animate-fade-up pt-16 md:pt-24">
                        <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em] mb-4 md:mb-6 block">Our Legacy</span>
                        <h1 className="text-5xl md:text-8xl font-heading font-black text-white mb-6 md:mb-8 leading-[1.1]">
                            Past <br />
                            <span className="text-brand-gold italic">Presidents.</span>
                        </h1>
                        <p className="text-white/90 text-lg md:text-xl font-light leading-relaxed max-w-2xl mb-8">
                            Honoring the visionary leaders who have guided Rotaract Swarna Bengaluru through the years, leaving an indelible mark on our community.
                        </p>
                        <Link
                            href="/team"
                            className="inline-flex items-center gap-3 text-brand-gold font-bold uppercase tracking-widest text-sm hover:text-white transition-colors"
                        >
                            View Current Board <ArrowLongRightIcon className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Grid */}
            <section className="py-16 md:py-24">
                <div className="container-custom">
                    {loading ? (
                        <div className="glass p-10 md:p-24 text-center rounded-[2rem] md:rounded-[4rem] text-slate-400 font-heading font-bold text-xl md:text-3xl italic animate-pulse">
                            Loading history...
                        </div>
                    ) : pastPresidents.length === 0 ? (
                        <div className="glass p-10 md:p-24 text-center rounded-[2rem] md:rounded-[4rem] text-slate-400 font-heading font-bold text-xl md:text-3xl italic animate-fade-up">
                            Our history is being transcribed. Check back soon.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-16">
                            {pastPresidents.map((member: any, idx: number) => (
                                <div
                                    key={idx}
                                    className="group flex flex-col items-center text-center animate-fade-up"
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                >
                                    <div className="relative w-full aspect-square rounded-full overflow-hidden mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-500 border-4 border-white">
                                        <img
                                            src={member.image_url || "/favicon.png"}
                                            alt={member.name}
                                            className={`w-full h-full transition-transform duration-700 ${member.image_url ? 'object-cover group-hover:scale-110' : 'object-contain p-6 bg-slate-100 group-hover:scale-110 grayscale opacity-50'}`}
                                        />
                                        <div className="absolute inset-0 bg-brand-blue/0 group-hover:bg-brand-blue/10 transition-colors duration-500 z-10" />
                                    </div>
                                    <h3 className="text-xl font-heading font-black text-brand-blue mb-1 group-hover:text-brand-azure transition-colors">{member.name}</h3>
                                    <div className="inline-flex items-center justify-center bg-brand-gold/10 text-brand-gold px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                                        {member.period}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
