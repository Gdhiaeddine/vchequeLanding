import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { ArrowLeft, Clock, Eye, Calendar, Share2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post || post.status !== 'published') {
    notFound();
  }

  // Increment view count
  await prisma.blogPost.update({
    where: { id: post.id },
    data: { views_count: { increment: 1 } },
  });

  return (
    <div className="py-16 bg-[#fdfbf7]">
      <div className="container max-w-4xl mx-auto px-6">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#6b7c74] hover:text-[#122620] mb-8"
        >
          <ArrowLeft size={16} />
          <span>Retour aux articles</span>
        </Link>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-[#122620]/5 text-[#b99a5a] text-xs font-bold uppercase tracking-wider">
              {post.category}
            </span>
            <span className="text-xs text-[#86928b] flex items-center gap-1">
              <Clock size={14} />
              {post.reading_time} min de lecture
            </span>
            <span className="text-xs text-[#86928b] flex items-center gap-1">
              <Eye size={14} />
              {post.views_count + 1} vues
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-[#122620] font-serif leading-tight mb-6">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg text-[#4f5f58] leading-relaxed border-l-4 border-[#b99a5a] pl-4 italic">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Featured Image */}
        {post.cover_image_path && (
          <div className="relative aspect-video rounded-2xl overflow-hidden mb-12 shadow-md">
            <Image
              src={`/api/blog/cover/${post.id}`}
              alt={post.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* Content Body */}
        <article className="prose prose-lg max-w-none text-[#2b3832] leading-relaxed space-y-6">
          {post.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={index} className="text-2xl font-bold font-serif text-[#122620] pt-6 pb-2 border-b border-[#e2dcce]">
                  {paragraph.replace('## ', '')}
                </h2>
              );
            }
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={index} className="text-xl font-bold font-serif text-[#122620] pt-4">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('> ')) {
              return (
                <blockquote key={index} className="p-4 rounded-xl bg-[#fcfaf5] border-l-4 border-[#b99a5a] text-sm text-[#122620]">
                  {paragraph.replace('> ', '')}
                </blockquote>
              );
            }
            if (paragraph.startsWith('- ')) {
              const items = paragraph.split('\n').map((li) => li.replace('- ', ''));
              return (
                <ul key={index} className="list-disc pl-6 space-y-2 text-base">
                  {items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={index} className="text-base sm:text-lg text-[#35433d] leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </article>

        {/* Post Footer */}
        <div className="mt-16 pt-8 border-t border-[#e2dcce] flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#122620] hover:text-[#b99a5a]"
          >
            <ArrowLeft size={16} />
            <span>Tous les articles</span>
          </Link>
          <Link
            href="/commander"
            className="btn btn-primary px-6 py-2.5 rounded-lg text-sm font-semibold shadow-sm"
          >
            Découvrir VCheque
          </Link>
        </div>
      </div>
    </div>
  );
}
