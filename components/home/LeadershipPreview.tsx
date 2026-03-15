import Link from "next/link";
import { apiFetch } from "@/lib/api";

export default async function LeadershipPreview() {
  let team = [];
  try {
    const allMembers = await apiFetch("/api/team");
    team = allMembers.slice(0, 4); // Only show top 4 on home
  } catch (error) {
    console.error("Failed to fetch team preview:", error);
  }

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 -skew-x-12 translate-x-1/2 -z-10"></div>
      
      <div className="container-custom">
        <div className="mb-16">
          <span className="text-brand-azure font-bold uppercase tracking-widest text-sm mb-4 block">Our Guiding Force</span>
          <h2 className="text-4xl font-heading font-bold text-brand-blue">Meet Our Leadership</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-400 font-bold border-2 border-dashed border-gray-100 rounded-3xl">
              Updating our leadership roster...
            </div>
          ) : (
            team.map((member: any, idx: number) => (
              <div key={idx} className="group">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-6 shadow-sm group-hover:shadow-xl transition-all duration-500">
                  <img 
                    src={member.image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"} 
                    alt={member.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                    <p className="text-white text-xs italic font-medium">"{member.bio || "Leading with impact."}"</p>
                  </div>
                </div>
                <h3 className="text-xl font-heading font-bold text-brand-blue mb-1 group-hover:text-brand-azure transition-colors">{member.name}</h3>
                <p className="text-brand-gray font-bold text-xs uppercase tracking-wider">{member.role}</p>
              </div>
            ))
          )}
        </div>

        <div className="mt-16 text-center">
          <Link 
            href="/team" 
            className="inline-flex items-center gap-2 text-brand-blue font-bold hover:gap-3 transition-all group"
          >
            Meet the full 2024-25 Board 
            <span className="bg-brand-gold text-brand-blue px-2 py-1 rounded-lg group-hover:bg-brand-blue group-hover:text-white transition-colors">
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
