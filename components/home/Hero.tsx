import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-32 pb-16 md:pt-20">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/images/hero-fallback.png"
          className="w-full h-full object-cover scale-110"
        >
          <source src={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/hero-bg.mp4`} type="video/mp4" />
        </video>

        {/* Fallback Static Image if Video fails to load */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/hero-fallback.png"
            alt="RCSB Hero Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Layered Overlays for Depth */}
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-mesh-gradient opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-950" />
      </div>

      <div className="container-custom relative z-10 text-white w-full">
        <div className="max-w-4xl mx-auto md:mx-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-6 md:mb-8 animate-fade-down">
            <span className="w-2 h-2 bg-brand-gold rounded-full animate-pulse" />
            Together, Change is Possible
          </div>

          <h1 className="text-[2.75rem] leading-[1.1] sm:text-5xl md:text-8xl font-heading font-black text-white mb-6 md:mb-8 animate-fade-up">
            Grow your <span className="text-brand-gold">leadership</span>, <br className="hidden sm:block" />
            <span className="relative inline-block mt-2 md:mt-0 pr-2 md:pr-4">
              Create impact
              <svg className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-2 md:h-3 text-brand-azure/40" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>
            <span className="inline-block mt-2 md:mt-0">with us</span>
          </h1>

          <p className="text-base md:text-2xl text-white/90 mb-8 md:mb-12 max-w-2xl leading-relaxed font-light animate-fade-up" style={{ animationDelay: "200ms" }}>
            Working Towards a Brighter Future. Rotaract Club of Swarna Bengaluru (Formerly Rotaract Club of Bangalore Seshadripuram), emerged in the cradle of service dreamt by 15 young friends in Bengaluru in 2014.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-6 animate-fade-up" style={{ animationDelay: "400ms" }}>
            <Link
              href="/projects"
              className="premium-button text-center px-10 py-5 bg-brand-gold text-brand-blue font-bold rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 font-heading text-lg"
            >
              Latest Projects
            </Link>
            <Link
              href="/contact"
              className="premium-button-outline text-center px-10 py-5 bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold rounded-2xl hover:bg-white/20 transition-all hover:-translate-y-1 active:scale-95 font-heading text-lg"
            >
              Join Our Tribe
            </Link>
          </div>
        </div>
      </div>


    </section>
  );
}
