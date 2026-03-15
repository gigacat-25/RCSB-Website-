import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center overflow-hidden bg-brand-blue pt-20">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-105" // Slight scale to avoid edge artifacts
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        {/* Refined Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/80 via-brand-blue/40 to-transparent" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="container-custom relative z-10 text-brand-white">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-heading font-extrabold mb-6 leading-tight animate-fade-up">
            Grow your leadership, <br />
            <span className="text-brand-gold underline decoration-brand-azure underline-offset-8">Create impact</span> with us
          </h1>
          <p className="text-lg md:text-xl text-blue-50 mb-10 max-w-2xl leading-relaxed animate-fade-up" style={{ animationDelay: "100ms" }}>
            Rotaract Club of Swarna Bengaluru is a community of young leaders committed to making a difference through service, fellowship, and professional development.
          </p>
          <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: "200ms" }}>
            <Link 
              href="/projects" 
              className="px-8 py-4 bg-brand-gold text-brand-blue font-bold rounded-full hover:bg-brand-white transition-all shadow-lg hover:shadow-xl"
            >
              Latest Projects
            </Link>
            <Link 
              href="/contact" 
              className="px-8 py-4 border-2 border-brand-white text-brand-white font-bold rounded-full hover:bg-brand-white hover:text-brand-blue transition-all"
            >
              Join Our Tribe
            </Link>
          </div>
        </div>
      </div>

      {/* Stats overlay or decorative element at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
    </section>
  );
}
