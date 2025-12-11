import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rcnrmnwmhfqxcovixwms.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '*.onrender.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8055',
      },
    ],
  },
  async rewrites() {
    return [
      {
        // Proxy /assets/* requests to Directus
        source: '/assets/:path*',
        destination: `${process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055'}/assets/:path*`,
      },
    ];
  },
};

export default nextConfig;
