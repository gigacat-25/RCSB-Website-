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
};

module.exports = nextConfig;
