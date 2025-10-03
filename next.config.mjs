/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // http://96.9.215.27:2025/api/v1/flags/de.png
  // http://server.guardxvpn.com/
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "server.guardxvpn.com",
      },
    ],
  },
};

export default nextConfig;
