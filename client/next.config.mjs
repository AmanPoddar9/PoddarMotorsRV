/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'realvaluestorage.s3.ap-south-1.amazonaws.com' }
    ],
    unoptimized: true,
  },
  transpilePackages: [
    '@ant-design/icons',
    'rc-util',
    'rc-pagination',
    'rc-picker',
  ],
}

import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

export default withPWA(nextConfig)
