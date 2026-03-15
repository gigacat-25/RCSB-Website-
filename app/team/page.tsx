import { apiFetch } from "@/lib/api";

export const revalidate = 60;

export default async function TeamPage() {
  let teamMembers = [];
  try {
    teamMembers = await apiFetch("/api/team");
  } catch (error) {
    console.error("Failed to fetch team:", error);
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-brand-blue py-20 text-white">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Our Leadership</h1>
          <p className="text-blue-100 max-w-2xl text-lg">
            The dedicated individuals behind our initiatives. Meet the board members of Rotaract Club of Swarna Bengaluru.
          </p>
        </div>
      </section>

      {/* Leadership Grid */}
      <section className="py-20">
        <div className="container-custom">
          
          <div className="mb-16">
            <h2 className="text-3xl font-heading font-bold text-brand-blue mb-8 pb-2 border-b-2 border-brand-gold inline-block">Board of Directors 2024-25</h2>
            
            {teamMembers.length === 0 ? (
              <div className="text-center py-20 text-gray-400 font-bold">
                Team roster updating soon.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                {teamMembers.map((member: any, idx: number) => (
                  <div key={idx} className="group flex flex-col">
                    <div className="relative aspect-square rounded-2xl overflow-hidden mb-6 shadow-md border border-gray-100">
                      <img 
                        src={member.image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"} 
                        alt={member.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-brand-blue mb-1">{member.name}</h3>
                    <p className="text-brand-azure font-bold text-sm uppercase mb-3">{member.role} <span className="text-gray-300 mx-2">|</span> {member.period}</p>
                    {member.bio && <p className="text-gray-500 text-sm italic">"{member.bio}"</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>
    </div>
  );
}

