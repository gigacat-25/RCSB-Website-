import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeader from "@/components/ui/SectionHeader";

const PILLARS = [
  { icon: "🤝", title: "Fellowship", desc: "Building lifelong friendships through shared purpose and community service." },
  { icon: "🌍", title: "Service", desc: "Driving change in Bengaluru through targeted projects in education, health, and women's empowerment." },
  { icon: "🚀", title: "Leadership", desc: "Developing the next generation of ethical, empathetic leaders." },
];

interface WhoWeAreProps { aboutText?: string }

export default function WhoWeAre({ aboutText }: WhoWeAreProps) {
  return (
    <AnimatedSection className="py-24 relative z-10 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12 flex justify-center">
          <div className="badge-glass px-5 py-2 rounded-full inline-flex items-center gap-2">
            <span className="text-brand-gold text-lg leading-none">✦</span>
            <span className="text-sm font-medium text-white tracking-widest uppercase">Who We Are</span>
          </div>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[minmax(200px,auto)]">
          
          {/* Main About Box (takes up 2 columns on desktop) */}
          <div className="glass-panel p-8 md:p-12 md:col-span-2 flex flex-col justify-between group">
            <div>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-6 tracking-tight">
                A community of young leaders serving Bengaluru since 2014.
              </h2>
              <p className="text-gray-400 leading-relaxed text-lg max-w-2xl font-light">
                {aboutText ||
                  `The Rotaract Club of Swarna Bengaluru (RCSB) was founded by 15 passionate friends who believed in the power of youth-led change. Formerly known as the Rotaract Club of Bangalore Seshadripuram, we are a proud member of Rotary International. Under President Rtr. Dr. Harish (2025–26), we continue our mission of service above self.`}
              </p>
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <div className="badge-glass px-4 py-2 rounded-lg text-xs text-gray-300">Affiliated with Rotary International</div>
              <div className="badge-glass px-4 py-2 rounded-lg text-xs text-brand-gold">10+ Years of Impact</div>
            </div>
          </div>

          {/* Pillars tightly packed */}
          <div className="flex flex-col gap-4 md:gap-6">
            {PILLARS.map(({ icon, title, desc }) => (
              <div key={title} className="glass-panel p-6 flex-1 flex flex-col justify-center relative overflow-hidden group">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <span className="text-3xl mb-4 block relative z-10 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{icon}</span>
                <h3 className="font-heading font-semibold text-white mb-2 relative z-10">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed relative z-10 font-light">{desc}</p>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </AnimatedSection>
  );
}
