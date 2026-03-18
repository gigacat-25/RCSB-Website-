"use client";
import { useEffect, useState } from "react";

export default function PartnersCarousel() {
    const [partners, setPartners] = useState<any[]>([]);

    useEffect(() => {
        fetch(`/api/partners?t=${new Date().getTime()}`, { cache: "no-store" })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setPartners(data);
                }
            })
            .catch(err => console.error("Could not fetch partners:", err));
    }, []);

    if (partners.length === 0) return null;

    // Duplicate logos enough times so the marquee scrolls smoothly without jumping empty space
    // The animation translates -50%, so the content should be exactly doubled
    const displayPartners = [...partners, ...partners];

    return (
        <section className="py-16 md:py-24 bg-white overflow-hidden border-t border-gray-100">
            <div className="container-custom mb-10 text-center">
                <span className="text-[10px] font-black text-brand-blue/40 uppercase tracking-[0.3em] block mb-2">Better Together</span>
                <h2 className="text-3xl md:text-4xl font-heading font-black text-brand-blue">
                    Our Collaborative Network
                </h2>
            </div>

            <div className="relative flex overflow-hidden group py-6">
                <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>

                <div className="flex animate-marquee hover:[animation-play-state:paused] whitespace-nowrap w-max">
                    {displayPartners.map((partner, idx) => (
                        <div key={`${partner.id}-${idx}`} className="flex flex-col items-center justify-center min-w-[200px] md:min-w-[250px] px-8">
                            <img
                                src={partner.image_url}
                                alt={partner.name}
                                className="h-16 md:h-20 w-auto object-contain grayscale hover:grayscale-0 hover:scale-110 transition-all duration-500 opacity-60 hover:opacity-100"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
