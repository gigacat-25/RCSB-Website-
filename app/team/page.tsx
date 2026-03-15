import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { teamQuery } from "@/sanity/lib/queries";
import SectionHeader from "@/components/ui/SectionHeader";
import MemberCard from "@/components/team/MemberCard";

export const metadata: Metadata = {
  title: "Our Team",
  description: "Meet the board of the Rotaract Club of Swarna Bengaluru (2025–26).",
};

export const revalidate = 3600;

const SEED_TEAM = [
  { _id: "president", name: "Rtr Dr Harish", role: "President 2025–26", category: "board", photo: null, year: 2025 },
  { _id: "sec", name: "Secretary", role: "Honorary Secretary", category: "board", photo: null, year: 2025 },
  { _id: "treas", name: "Treasurer", role: "Honorary Treasurer", category: "board", photo: null, year: 2025 },
  { _id: "saa", name: "Sergeant at Arms", role: "SAA", category: "board", photo: null, year: 2025 },
  { _id: "dir1", name: "Community Service Director", role: "Director — Community Service", category: "board", photo: null, year: 2025 },
  { _id: "dir2", name: "Club Service Director", role: "Director — Club Service", category: "board", photo: null, year: 2025 },
];

interface TeamMember { _id: string; name: string; role: string; photo?: string; year?: number; category?: string; }

export default async function TeamPage() {
  const cmsTeam = await client.fetch(teamQuery).catch(() => []);
  const team: TeamMember[] = cmsTeam.length > 0 ? cmsTeam : SEED_TEAM;

  const boardMembers = team.filter((m) => !m.category || m.category === "board");
  const advisors = team.filter((m) => m.category === "advisor" || m.category === "mentor");

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Our Team"
          subtitle="The dedicated board members who make RCSB's mission possible."
        />

        {boardMembers.length > 0 && (
          <div className="mb-12">
            <h2 className="font-heading font-semibold text-gray-600 text-sm uppercase tracking-widest mb-6">
              Board 2025–26
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {boardMembers.map((member) => (
                <MemberCard key={member._id} name={member.name} role={member.role} photo={member.photo} category={member.category} />
              ))}
            </div>
          </div>
        )}

        {advisors.length > 0 && (
          <div>
            <h2 className="font-heading font-semibold text-gray-600 text-sm uppercase tracking-widest mb-6">
              Advisors & Mentors
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {advisors.map((member) => (
                <MemberCard key={member._id} name={member.name} role={member.role} photo={member.photo} category={member.category} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
