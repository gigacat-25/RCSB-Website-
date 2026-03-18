import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Start a Conversation. Whether you are looking to join our ranks, partner on a project, or simply learn more about our impact.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
