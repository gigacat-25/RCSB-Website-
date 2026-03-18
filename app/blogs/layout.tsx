import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Our Stories',
    description: 'Insights and perspectives. Exploring the heart of Rotaract through reports, reflections, and deep-dives into our community impact.',
};

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
