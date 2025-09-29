import type { NextConfig } from 'next';
import { hostname } from 'os';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: 'jpxuvzi55k.ufs.sh',
      },
    ],
  },
};

export default nextConfig;
