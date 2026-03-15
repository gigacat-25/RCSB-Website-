import Link from "next/link";
import { apiFetch } from "@/lib/api";

export default async function LeadershipPreview() {
  let team = [];
  try {
    const allMembers = await apiFetch("/api/team");
    team = (allMembers || []).slice(0, 4); // Only show top 4 on home
  } catch (error) {
    console.error("Failed to fetch team preview:", error);
  }

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-light/40 -skew-x-12 translate-x-1/2 -z-10"></div>
      
      <div className="container-custom">
        <div className="mb-20 animate-fade-up">
          <span className="text-[10px] font-black text-brand-azure uppercase tracking-[0.3em] mb-4 block">Our Guiding Force</span>
          <h2 className="text-5xl md:text-6xl font-heading font-black text-brand-blue">Meet Our Leadership</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {team.length === 0 ? (
            <div className="col-span-full glass p-20 text-center rounded-[3rem] text-slate-400 font-heading font-bold text-2xl italic">
              Updating our leadership roster...
            </div>
          ) : (
            team.map((member: any, idx: number) => (
              <div key={idx} className="group animate-fade-up" style={{ animationDelay: `${idx * 150}ms` }}>
                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-8 shadow-premium group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-700">
                  <div className="absolute inset-0 bg-brand-blue/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <img 
                    src={member.image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"} 
                    alt={member.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-x-4 bottom-4 glass p-6 rounded-[1.5rem] opacity-0 group-hover:opacity-100 translate-y-10 group-hover:translate-y-0 transition-all duration-500 z-20">
                    <p className="text-brand-blue text-[11px] italic font-medium leading-relaxed">"{member.bio || "Leading with empathy and impact."}"</p>
                  </div>
                </div>
                <div className="px-2">
                  <h3 className="text-2xl font-heading font-black text-brand-blue mb-2 group-hover:text-brand-azure transition-colors">{member.name}</h3>
                  <p className="text-brand-gray/60 text-[10px] font-black uppercase tracking-[0.2em]">{member.role}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-20 text-center animate-fade-up" style={{ animationDelay: "600ms" }}>
          <Link 
            href="/team" 
            className="group inline-flex items-center gap-4 text-brand-blue font-black uppercase tracking-[0.2em] text-[10px]"
          >
            Meet the 2024-25 Board 
            <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-brand-gold group-hover:text-brand-blue transition-all duration-300">
              &rarr;
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
