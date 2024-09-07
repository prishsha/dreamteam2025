/** @type {import('next').NextConfig} */

const nextConfig = {
  async redirects() {
    return [
      {
        // NOTE: No CDN as of now obviously, but this is a placeholder for future use (if)
        source: '/cdn/:slug*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/:slug*`,
        permanent: true,
      }
    ]
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NEXT_PUBLIC_BACKEND_URL,
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
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};



export default nextConfig;
