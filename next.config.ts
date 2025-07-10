import type { NextConfig } from "next";

const nextConfig = {
  webpack: (config: any) => {
    config.resolve.fallback = {
      canvas: false,
    };
    return config;
  },
};

module.exports = nextConfig;
