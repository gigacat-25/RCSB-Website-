import Image from "next/image";

interface MemberCardProps {
  name: string;
  role: string;
  photo?: string;
  category?: string;
}

export default function MemberCard({ name, role, photo, category }: MemberCardProps) {
  return (
    <div className="card-hover bg-white rounded-xl overflow-hidden border border-gray-100 text-center p-5">
      <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-brand-grey">
        {photo ? (
          <Image
            src={`${photo}?width=200&format=webp`}
            alt={name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-brand-blue/10">
            <span className="text-brand-blue font-heading font-bold text-2xl">
              {name.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <h3 className="font-heading font-semibold text-brand-blue text-sm leading-tight mb-1">{name}</h3>
      <p className="text-gray-500 text-xs">{role}</p>
      {category && (
        <span className={`mt-2 inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
          category === "board" ? "bg-brand-blue/10 text-brand-blue" :
          category === "advisor" ? "bg-brand-gold/20 text-amber-700" :
          "bg-gray-100 text-gray-600"
        }`}>
          {category}
        </span>
      )}
    </div>
  );
}
