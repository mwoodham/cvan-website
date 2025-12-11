import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
