import type { NextConfig } from "next";

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  webpack: (config: any) => {
    config.resolve.fallback = {
      canvas: false,
    };
    return config;
  },
};

module.exports = nextConfig;
