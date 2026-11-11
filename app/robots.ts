import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://vcheque.virtanis.net';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/telecharger/',
          '/telecharger',
          '/commander/succes',
          '/commander/annulation',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
