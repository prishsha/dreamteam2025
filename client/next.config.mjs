/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8069',
        pathname: '/assets/**',
      },
      {
        protocol: 'https',
        hostname: 's.ndtvimg.com',
        pathname: '**',
      }
    ]
  }
};

export default nextConfig;
