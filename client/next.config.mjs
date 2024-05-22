/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }] },
  transpilePackages: ['@ant-design/icons', 'rc-util', 'rc-pagination', 'rc-picker'],
};

export default nextConfig;
