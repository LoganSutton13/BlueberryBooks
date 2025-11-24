const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Configure alias to match tsconfig.json paths
    // tsconfig.json has: "@/*": ["./src/*"] with baseUrl: "."
    // __dirname is always the directory containing this config file (frontend/)
    const srcPath = path.resolve(__dirname, 'src');
    
    // Ensure the alias is configured correctly
    // This makes @/lib/api resolve to src/lib/api
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': srcPath,
    };
    
    return config;
  },
  // PWA configuration
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

