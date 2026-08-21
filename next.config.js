/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // No ESLint config is bundled in this starter yet — don't let a missing
    // lint setup block the production build on Vercel.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
