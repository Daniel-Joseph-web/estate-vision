import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Google account avatars served for Firebase OAuth users.
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },

  // Turbopack configuration (top-level, not experimental)
  turbopack: {
    root: process.cwd(),
  },

  // Allow larger Server Action request bodies (e.g., base64 screenshots)
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;