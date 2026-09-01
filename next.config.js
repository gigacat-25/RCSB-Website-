/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rotaractswarnabengaluru.in",
        pathname: "/**",
      },
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
      // AWS S3 multi-region uploads
      {
        protocol: "https",
        hostname: "*.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
      // Clerk User Avatars
      {
        protocol: "https",
        hostname: "img.clerk.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
        pathname: "/**",
      },
      // Google User Profile Images
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        pathname: "/**",
      },
      // GitHub Avatars
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
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
