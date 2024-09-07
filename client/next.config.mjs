/** @type {import('next').NextConfig} */
const nextConfig = {

  async headers() {
    return [
      {
        // matching all API routes
        source: "*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
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
        hostname: 's.ndtvimg.com',
        pathname: '**',
      }
    ]
  }
};

export default nextConfig;
