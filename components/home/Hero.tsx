import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center overflow-hidden pt-20">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-110 blur-[2px]"
        >
          <source src={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/hero-bg.mp4`} type="video/mp4" />
        </video>
        
        {/* Layered Overlays for Depth */}
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-mesh-gradient opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-950" />
      </div>

      <div className="container-custom relative z-10 text-white">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-fade-down">
            <span className="w-2 h-2 bg-brand-gold rounded-full animate-pulse" />
            Together, Change is Possible
          </div>
          
          <h1 className="text-6xl md:text-8xl font-heading font-black text-white mb-8 leading-[1.1] animate-fade-up">
            Grow your <span className="text-brand-gold">leadership</span>, <br />
            <span className="relative">
              Create impact
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-brand-azure/40" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span> with us
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl leading-relaxed font-light animate-fade-up" style={{ animationDelay: "200ms" }}>
            Rotaract Club of Swarna Bengaluru is a community of young professionals committed to service above self.
          </p>
          
          <div className="flex flex-wrap gap-6 animate-fade-up" style={{ animationDelay: "400ms" }}>
            <Link 
              href="/projects" 
              className="group px-10 py-5 bg-brand-gold text-brand-blue font-black rounded-2xl hover:bg-white transition-all shadow-[0_20px_40px_rgba(247,168,27,0.3)] hover:shadow-[0_25px_50px_rgba(255,255,255,0.4)] hover:-translate-y-1 active:translate-y-0"
            >
              Latest Projects
            </Link>
            <Link 
              href="/contact" 
              className="group px-10 py-5 bg-white/10 backdrop-blur-md border border-white/30 text-white font-black rounded-2xl hover:bg-white/20 transition-all hover:-translate-y-1 active:translate-y-0"
            >
              Join Our Tribe
            </Link>
          </div>
        </div>
      </div>

      {/* Modern scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-50">
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-white" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Scroll</span>
      </div>
    </section>
  );
}
