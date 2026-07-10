import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Awards & Recognitions | Rotaract Club of Swarna Bengaluru',
    description: 'Explore the awards, accolades, and district recognitions earned by the Rotaract Club of Swarna Bengaluru for outstanding community service and youth leadership.',
    alternates: {
        canonical: '/awards',
    },
};

export default function AwardsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
