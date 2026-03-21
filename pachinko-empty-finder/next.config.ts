import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-36c91f49090f4d17963dfd21b0e7248a.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'pub-34654406a54c41e7b17e18764789c1a5.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'images.1geki.jp',
      },
      {
        protocol: 'https',
        hostname: 'placeholder.jp',
      },
      {
        protocol: 'https',
        hostname: 'placehold.jp',
      },
    ],
  },
};

export default nextConfig;
