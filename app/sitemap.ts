import type { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://vcheque.virtanis.net';
  const now = new Date();

  // Pages statiques publiques principales (NOTE: /telecharger est strictement exclu de l'indexation)
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/commander`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/demonstration`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/conditions-generales-de-vente`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/mentions-legales`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/politique-de-confidentialite`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Articles de blog publiés
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const articles = await prisma.blogPost.findMany({
      where: { status: 'published' },
      select: { slug: true, updated_at: true },
    });

    blogRoutes = articles.map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: article.updated_at || now,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
  } catch (err) {
    console.warn('[Sitemap] Failed to fetch blog articles for sitemap:', err);
  }

  return [...staticRoutes, ...blogRoutes];
}
