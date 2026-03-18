import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Our Leadership Team',
    description: 'Meet the visionaries behind our impact. A dedicated board of directors committed to steering our club towards sustainable change and community growth.',
};

export default function TeamLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
