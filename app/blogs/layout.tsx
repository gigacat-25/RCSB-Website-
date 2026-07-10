import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Blogs & Stories | Rotaract Club of Swarna Bengaluru',
    description: 'Read the latest articles, reports, community service stories, and updates from the members of Rotaract Club of Swarna Bengaluru.',
    alternates: {
        canonical: '/blogs',
    },
};

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
