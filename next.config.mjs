/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // http://96.9.215.27:2025/api/v1/flags/de.png
  images: {
    unoptimized: true,
  }
};

export default nextConfig;
