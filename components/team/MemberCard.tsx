import Image from "next/image";

interface MemberCardProps {
  name: string;
  role: string;
  photo?: string;
  category?: string;
}

export default function MemberCard({ name, role, photo, category }: MemberCardProps) {
  return (
    <div className="glass-panel text-center p-6 flex flex-col items-center group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
      
      <div className="relative w-28 h-28 mx-auto mb-5 rounded-full overflow-hidden bg-brand-void/50 border-2 border-white/5 group-hover:border-brand-blue/30 transition-colors duration-500 z-10 p-1">
        <div className="relative w-full h-full rounded-full overflow-hidden">
          {photo ? (
            <Image
              src={`${photo}?width=300&format=webp`}
              alt={name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-brand-blue/20">
              <span className="text-brand-blue text-3xl font-heading font-bold">
                {name.charAt(0)}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center">
        <h3 className="font-heading font-bold text-white text-lg leading-tight mb-1 group-hover:text-brand-gold transition-colors">{name}</h3>
        <p className="text-gray-400 text-sm font-light mb-4">{role}</p>
        
        {category && (
          <span className={`mt-auto inline-block text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-widest ${
            category === "board" ? "bg-brand-blue/20 text-blue-300 border border-brand-blue/30" :
            category === "advisor" ? "bg-brand-gold/10 text-brand-gold border border-brand-gold/20" :
            "bg-white/5 text-gray-300 border border-white/10"
          }`}>
            {category}
          </span>
        )}
      </div>
    </div>
  );
}
