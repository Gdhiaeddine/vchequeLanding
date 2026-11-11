/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['pdfkit'],
  outputFileTracingIncludes: {
    '/api/checkout/invoice/:path*': ['./node_modules/pdfkit/**/*', './public/fonts/**/*'],
    '/**/invoice/**': ['./node_modules/pdfkit/**/*', './public/fonts/**/*'],
    '/**/api/checkout/**': ['./node_modules/pdfkit/**/*', './public/fonts/**/*'],
  },
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
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
