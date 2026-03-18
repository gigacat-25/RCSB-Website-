import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Our Portfolio',
    description: 'Discover our legacy of impact. From deep-rooted community service to high-reach leadership initiatives.',
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
