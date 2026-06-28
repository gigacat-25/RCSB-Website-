import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/'],
            },
            {
                userAgent: [
                    'GPTBot',
                    'ChatGPT-User',
                    'Google-Extended',
                    'Anthropic-AI',
                    'Claude-Web',
                    'ClaudeBot',
                    'Applebot-Extended',
                    'Cohere-ai',
                    'Omgilibot',
                    'Omgili',
                    'PerplexityBot',
                    'YouBot',
                    'FacebookBot',
                    'Diffbot',
                    'Bytespider',
                    'ImagesiftBot',
                ],
                disallow: '/',
            },
        ],
        sitemap: 'https://rotaractswarnabengaluru.in/sitemap.xml',
    };
}
