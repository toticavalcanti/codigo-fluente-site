import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'codigofluente.com.br',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      }
    ],
  },
};

export default nextConfig;
