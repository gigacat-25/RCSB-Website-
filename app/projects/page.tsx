import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { allProjectsQuery } from "@/sanity/lib/queries";
import SectionHeader from "@/components/ui/SectionHeader";
import ProjectCard from "@/components/projects/ProjectCard";

export const metadata: Metadata = {
  title: "Projects",
  description: "Service projects by RCSB — Project Sthree, ROSHANY, Vedtathva, and more.",
};

export const revalidate = 3600;

const SEED_PROJECTS = [
  {
    _id: "sthree",
    title: "Project Sthree",
    slug: { current: "project-sthree" },
    coverImage: null,
    impactStats: [
      { label: "Beneficiaries", value: "500+" },
      { label: "Years Active", value: "3+" },
    ],
    description: [{ _type: "block", children: [{ _type: "span", text: "Empowering women through skill development, awareness programs, and community support across Bengaluru." }] }],
  },
  {
    _id: "roshany",
    title: "Project ROSHANY",
    slug: { current: "project-roshany" },
    coverImage: null,
    impactStats: [
      { label: "Children Reached", value: "300+" },
      { label: "Sessions Held", value: "20+" },
    ],
    description: [{ _type: "block", children: [{ _type: "span", text: "Bringing quality education and opportunities to underprivileged children in Bengaluru." }] }],
  },
  {
    _id: "vedtathva",
    title: "Vedtathva",
    slug: { current: "vedtathva" },
    coverImage: null,
    impactStats: [
      { label: "Participants", value: "200+" },
      { label: "Editions", value: "5+" },
    ],
    description: [{ _type: "block", children: [{ _type: "span", text: "A leadership and community development initiative that roots youth in values and practical service." }] }],
  },
];

export default async function ProjectsPage() {
  const cmsProjects = await client.fetch(allProjectsQuery).catch(() => []);
  const projects = cmsProjects.length > 0 ? cmsProjects : SEED_PROJECTS;

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Our Projects"
          subtitle="Initiatives that create real, lasting impact in the communities we serve."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: Parameters<typeof ProjectCard>[0] & { _id: string }) => (
            <ProjectCard
              key={project._id}
              title={project.title}
              slug={project.slug?.current || ""}
              description={project.description}
              coverImage={project.coverImage}
              impactStats={project.impactStats}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
