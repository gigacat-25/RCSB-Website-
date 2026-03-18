/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Production media CDN
      {
        protocol: "https",
        hostname: "media.rcsb.in",
        pathname: "/**",
      },
      // Cloudflare R2 direct (dev before custom domain)
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
        pathname: "/**",
      },
      // Cloudflare Worker media proxy
      {
        protocol: "https",
        hostname: "rcsb-api-worker.impact1-iceas.workers.dev",
        pathname: "/media/**",
      },
      // Unsplash placeholder images
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      // Mixkit video assets
      {
        protocol: "https",
        hostname: "assets.mixkit.co",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
          },
          {
            key: 'Content-Security-Policy',
            // Simple generic CSP that shouldn't break Next.js or Clerk:
            // forces https, prevents clickjacking, stops MIME sniffing.
            value: "upgrade-insecure-requests; frame-ancestors 'self';"
          }
        ],
      },
    ]
  },
};

module.exports = nextConfig;
