import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Past Presidents | Legacy & Leadership | Rotaract Swarna Bengaluru',
    description: 'Honoring the visionary leaders and past presidents of the Rotaract Club of Swarna Bengaluru who have guided our club and served the community through the years.',
    alternates: {
        canonical: '/past-presidents',
    },
};

export default function PastPresidentsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
