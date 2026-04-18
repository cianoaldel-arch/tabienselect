const path = require('path');

// Load root .env so NEXT_PUBLIC_* values are available during `next dev` and `next build`.
// In Docker builds, NEXT_PUBLIC_API_URL is injected via ARG/ENV before `next build`, and
// this call is a harmless no-op because the root file is not present in the build context.
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};

module.exports = nextConfig;
