import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us | Join Rotaract Swarna Bengaluru',
    description: 'Get in touch with Rotaract Swarna Bengaluru. Contact us to join our ranks, partner on community service initiatives, or collaborate on projects in Bengaluru.',
    alternates: {
        canonical: '/contact',
    },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
