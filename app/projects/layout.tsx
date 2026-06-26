import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Projects | Community Service Initiatives | Rotaract Swarna Bengaluru',
    description: "Explore Rotaract Club of Swarna Bengaluru's community service projects. From health camps to environmental drives, see how we're making an impact in Bengaluru.",
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
