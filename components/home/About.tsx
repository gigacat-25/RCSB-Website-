"use client";
import Link from "next/link";

export default function About() {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-light/50 -skew-x-12 translate-x-1/2 -z-10" />
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-brand-gold opacity-5 blur-[100px] -z-10" />
      
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Visual Side */}
          <div className="relative animate-fade-up">
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-premium aspect-[4/5] group">
              <div className="absolute inset-0 bg-brand-blue/20 group-hover:bg-transparent transition-colors duration-700" />
               <img 
                 src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop" 
                 alt="Rotaract Team in Action" 
                 className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
               />
            </div>
            
            {/* Floating Info Card */}
            <div className="absolute -bottom-10 -right-10 glass p-8 rounded-[2rem] shadow-xl max-w-[280px] hidden md:block animate-float">
              <div className="flex flex-col gap-2">
                <span className="text-4xl font-heading font-black text-brand-blue">50+</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gray/60 leading-tight">
                  Active Members Dedicated to Community Change
                </span>
                <div className="w-12 h-1 bg-brand-gold mt-2 rounded-full" />
              </div>
            </div>
            
            <div className="absolute -top-10 -left-10 w-40 h-40 border-2 border-brand-azure/10 rounded-full -z-10" />
          </div>

          {/* Content Side */}
          <div className="space-y-10 animate-fade-up" style={{ animationDelay: "200ms" }}>
            <div>
              <span className="text-[10px] font-black text-brand-azure uppercase tracking-[0.3em] mb-4 block">Our Legacy & Mission</span>
              <h2 className="text-5xl md:text-7xl font-heading font-black mb-8 leading-[1.1]">
                Service, Fellowship, and <br />
                <span className="text-brand-blue font-italic">Global Leadership.</span>
              </h2>
            </div>
            
            <div className="space-y-6 text-brand-gray/80 text-lg leading-relaxed font-light">
              <p>
                The Rotaract Club of Swarna Bengaluru is a vibrant community of young professionals and students committed to service above self. We believe in the transformative power of youth to drive positive change.
              </p>
              <p>
                Our mission is to empower individuals through skill-sharing, community engagement, and international cooperation—fostering a world of mutual understanding and lasting impact.
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
               <Link href="/about" className="group inline-flex items-center gap-4 text-brand-blue font-black uppercase tracking-[0.2em] text-xs">
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
