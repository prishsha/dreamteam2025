/** @type {import('next').NextConfig} */
const nextConfig = {

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://dreamteam.milind.lol',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,POST,PUT,DELETE',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
    ];
  },

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
        hostname: 'dreamteam.milind.lol',
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
