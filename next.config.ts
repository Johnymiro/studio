import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'export', // Enables static export (Next.js 13+)
  distDir: 'dist',  // Custom output folder
};

export default nextConfig;