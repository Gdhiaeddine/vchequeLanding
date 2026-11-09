/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/checkout',
        destination: '/commander',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
