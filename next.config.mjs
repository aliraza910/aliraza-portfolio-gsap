/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    const cmsOrigin =
      process.env.PAYLOAD_CMS_URL ||
      process.env.PAYLOAD_API_URL?.replace(/\/api\/?$/, '') ||
      'http://localhost:3001';

    return [
      {
        source: '/media/:path*',
        destination: `${cmsOrigin}/media/:path*`,
      },
      {
        source: '/sitemap.xml',
        destination: '/api/sitemaps/pages',
      },
      {
        source: '/post-sitemap.xml',
        destination: '/api/sitemaps/posts',
      },
    ];
  },
};

export default nextConfig;
