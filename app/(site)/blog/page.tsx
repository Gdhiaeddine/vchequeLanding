import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import { Calendar, Clock, Eye, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BlogIndexPage() {
  const posts = await prisma.blogPost.findMany({
    where: { status: 'published' },
    orderBy: { published_at: 'desc' },
  });

  return (
    <div className="py-16 bg-[#fdfbf7]">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-wider text-[#b99a5a] mb-2">
            Blog & Actualités
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#122620] font-serif mb-4">
            Guides & Bonnes Pratiques Bancaires
          </h1>
          <p className="text-[#4f5f58] text-base leading-relaxed">
            Retrouvez tous nos articles, réglementations et conseils d’experts pour sécuriser et réussir vos impressions de chèques en Algérie.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#e2dcce] p-8">
            <p className="text-[#4f5f58]">Aucun article publié pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="rounded-2xl bg-white border border-[#e2dcce] overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video bg-[#f0ede4] overflow-hidden">
                    {post.cover_image_path ? (
                      <Image
                        src={`/api/blog/cover/${post.id}`}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#122620]/5 text-[#b99a5a] font-bold text-lg">
                        VCheque
                      </div>
                    )}
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 text-[#122620] text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                      {post.category}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-4 text-xs text-[#86928b] mb-3">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {post.reading_time} min de lecture
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={14} />
                        {post.views_count} vues
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-[#122620] font-serif mb-3 line-clamp-2 hover:text-[#b99a5a] transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>

                    <p className="text-sm text-[#4f5f58] line-clamp-3 leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-[#f4f0e6]">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#122620] hover:text-[#b99a5a] transition-colors"
                  >
                    <span>Lire l'article</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
