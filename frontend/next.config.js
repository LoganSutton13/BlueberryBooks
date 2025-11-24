const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Get existing aliases
    const existingAliases = config.resolve.alias || {};
    
    // Resolve src path - __dirname is the directory containing next.config.js
    // When Root Directory is 'frontend', __dirname should be the frontend directory
    const srcPath = path.resolve(__dirname, 'src');
    
    // Set up aliases - explicitly set @ to point to src directory
    // This ensures webpack can resolve @/lib/api to src/lib/api
    config.resolve.alias = {
      ...existingAliases,
      '@': srcPath,
      'react-native$': 'react-native-web',
    };
    
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ];
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

