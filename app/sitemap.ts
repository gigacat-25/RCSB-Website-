import { MetadataRoute } from 'next';
import { apiFetch } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticRoutes = ['', '/about', '/projects', '/awards', '/team', '/blogs', '/contact', '/past-presidents', '/privacy', '/terms'].map((route) => ({
        url: `https://rotaractswarnabengaluru.in${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    let projectUrls: MetadataRoute.Sitemap = [];
    try {
        const data = await apiFetch('/api/projects');
        if (Array.isArray(data)) {
            projectUrls = data
                .filter((item: any) => item.status !== 'trash')
                .map((item: any) => {
                    let segment = 'projects';
                    if (item.type === 'blog') {
                        segment = 'blogs';
                    } else if (item.type === 'award') {
                        segment = 'awards';
                    }
                    return {
                        url: `https://rotaractswarnabengaluru.in/${segment}/${item.slug}`,
                        lastModified: new Date(item.updated_at || item.created_at || new Date()),
                        changeFrequency: 'monthly' as const,
                        priority: 0.6,
                    };
                });
        }
    } catch (error) {
        console.error("Failed to fetch dynamic routes for sitemap:", error);
    }

    return [...staticRoutes, ...projectUrls];
}




