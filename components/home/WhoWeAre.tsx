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
    <AnimatedSection className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeader title="Who We Are" />
            <p className="text-gray-600 leading-relaxed mb-6">
              {aboutText ||
                `The Rotaract Club of Swarna Bengaluru (RCSB) was founded in 2014 by 15 passionate friends who believed in the power of youth-led change. 
                Formerly known as the Rotaract Club of Bangalore Seshadripuram, we are a proud member of Rotary International.
                Under President Rtr. Dr. Harish (2025–26), we continue our mission of service above self.`}
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="w-2 h-2 rounded-full bg-brand-gold" />
              <span>Affiliated with Rotary International</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500 mt-2">
              <span className="w-2 h-2 rounded-full bg-brand-blue" />
              <span>Serving Bengaluru since 2014</span>
            </div>
          </div>
          <div className="grid gap-5">
            {PILLARS.map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-5 rounded-xl bg-brand-grey hover:bg-brand-blue/5 transition-colors">
                <span className="text-2xl flex-shrink-0">{icon}</span>
                <div>
                  <h3 className="font-heading font-semibold text-brand-blue mb-1">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
