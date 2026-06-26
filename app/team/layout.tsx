import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Our Team | Leadership & Members | Rotaract Swarna Bengaluru',
    description: 'Meet the dedicated board of directors, leaders, and members of Rotaract Swarna Bengaluru driving community service, youth leadership, and fellowship in Bengaluru.',
};

export default function TeamLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
