import Link from "next/link";

export default function ContactCTA() {
  return (
    <section className="py-32 bg-white relative">
      <div className="container-custom">
        <div className="relative rounded-[4rem] p-10 md:p-24 overflow-hidden shadow-premium group">
          {/* Dynamic Background */}
          <div className="absolute inset-0 bg-brand-blue z-0" />
          <div className="absolute inset-0 bg-mesh-gradient opacity-60 mix-blend-overlay z-0" />

          {/* Decorative glass elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-azure/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 z-0" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-[80px] -translate-x-1/2 translate-y-1/2 z-0" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16 text-center lg:text-left">
            <div className="max-w-3xl animate-fade-up">
              <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em] mb-6 block">Join the movement</span>
              <h2 className="text-5xl md:text-7xl font-heading font-black text-white mb-8 leading-[1.1]">
                Ready to make a <br />
                <span className="text-brand-gold italic">Real Difference?</span>
              </h2>
              <p className="text-blue-50/80 text-xl font-light leading-relaxed max-w-2xl">
                Join the Rotaract Club of Swarna Bengaluru. Work towards a brighter future and connect the world.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto animate-fade-up" style={{ animationDelay: "200ms" }}>
              <Link
                href="/contact"
                className="px-12 py-6 bg-brand-gold text-brand-blue font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-white transition-all shadow-[0_20px_40px_rgba(247,168,27,0.3)] hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 text-center"
              >
                Send us a Message
              </Link>
              <Link
                href="/join"
                className="px-12 py-6 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-white/20 transition-all hover:-translate-y-1 active:translate-y-0 text-center"
              >
                Become a Member
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
