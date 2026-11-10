import React from 'react';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import BlogCatalog, { BlogPostItem } from '@/components/blog/BlogCatalog';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Le Blog Officiel VCheque — Guides & Réglementation Bancaire',
  description:
    'Conseils pratiques, actualités bancaires algériennes et astuces professionnelles pour préparer et imprimer vos chèques en toute sérénité.',
  openGraph: {
    title: 'Le Blog Officiel VCheque — Guides & Réglementation Bancaire',
    description:
      'Conseils pratiques, actualités bancaires algériennes et astuces professionnelles pour préparer et imprimer vos chèques en toute sérénité.',
    type: 'website',
  },
};

export default async function BlogPage() {
  const postsRaw = await prisma.blogPost.findMany({
    where: { status: 'published' },
    orderBy: { published_at: 'desc' },
  });

  const posts: BlogPostItem[] = postsRaw.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    content: p.content,
    cover_image_path: p.cover_image_path,
    category: p.category,
    reading_time: p.reading_time,
    views_count: p.views_count,
    published_at: p.published_at ? p.published_at.toISOString() : null,
    created_at: p.created_at ? p.created_at.toISOString() : null,
  }));

  return <BlogCatalog initialPosts={posts} />;
}
