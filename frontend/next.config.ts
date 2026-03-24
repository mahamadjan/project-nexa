import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei', 'framer-motion', 'lucide-react'],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
