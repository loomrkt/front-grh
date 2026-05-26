const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  turbopack: {},
  webpack: (config: any) => {
    config.resolve.fallback = {
      canvas: false,
    };
    return config;
  },
};

module.exports = nextConfig;
