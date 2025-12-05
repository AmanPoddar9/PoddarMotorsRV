/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'realvaluestorage.s3.ap-south-1.amazonaws.com' }
    ],
    unoptimized: true, // Temporarily re-enabled - TODO: Configure proper image optimization for Vercel
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  transpilePackages: [
    '@ant-design/icons',
    'rc-util',
    'rc-pagination',
    'rc-picker',
  ],
}

import withPWAInit from 'next-pwa';
import withBundleAnalyzer from '@next/bundle-analyzer';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default bundleAnalyzer(withPWA(nextConfig))
