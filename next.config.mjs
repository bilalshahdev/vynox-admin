/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ✅ Fail production build on ESLint errors
    ignoreDuringBuilds: false,
  },
  typescript: {
    // ✅ Fail production build on TypeScript errors
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true, // keep if you don’t use next/image optimizer
  },
};

export default nextConfig;
