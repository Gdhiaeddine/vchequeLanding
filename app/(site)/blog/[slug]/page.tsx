import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ArticleMarkdownRenderer from '@/components/blog/ArticleMarkdownRenderer';
import ArticleShareBar from '@/components/blog/ArticleShareBar';
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ShoppingCart,
  Play,
  ShieldCheck,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const CATEGORY_CONFIG: Record<
  string,
  { label: string; badgeClass: string; dotColor: string }
> = {
  conseils: {
    label: 'Conseils Pratiques',
    badgeClass: 'badge--conseils',
    dotColor: '#34D399',
  },
  reglementation: {
    label: 'Réglementation Bancaire',
    badgeClass: 'badge--reglementation',
    dotColor: '#B99A5A',
  },
  comptabilite: {
    label: 'Comptabilité & PME',
    badgeClass: 'badge--comptabilite',
    dotColor: '#60A5FA',
  },
  actualites: {
    label: 'Actualités VCheque',
    badgeClass: 'badge--actualites',
    dotColor: '#C084FC',
  },
};

function getCategoryMeta(cat: string) {
  const c = (cat || '').toLowerCase().trim();
  if (c.includes('regle') || c.includes('droit')) return CATEGORY_CONFIG.reglementation;
  if (c.includes('conseil') || c.includes('astuce')) return CATEGORY_CONFIG.conseils;
  if (c.includes('compta') || c.includes('pme')) return CATEGORY_CONFIG.comptabilite;
  if (c.includes('actu') || c.includes('news')) return CATEGORY_CONFIG.actualites;
  return {
    label: cat || 'Actualités VCheque',
    badgeClass: 'badge--actualites',
    dotColor: '#C084FC',
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post || post.status !== 'published') {
    return {
      title: 'Article introuvable | VCheque Algérie',
    };
  }

  const siteUrl = 'https://vcheque.com';
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const imageUrl = post.cover_image_path
    ? `${siteUrl}/api/blog/cover/${post.id}`
    : undefined;

  return {
    title: `${post.title} | Blog VCheque Algérie`,
    description: post.excerpt || undefined,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      url: postUrl,
      type: 'article',
      publishedTime: post.published_at ? post.published_at.toISOString() : undefined,
      authors: ['Équipe Virtanis'],
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post || post.status !== 'published') {
    notFound();
  }

  // Incrémenter le compteur de vues
  await prisma.blogPost.update({
    where: { id: post.id },
    data: { views_count: { increment: 1 } },
  });

  // Récupération des articles recommandés
  let relatedPosts: Array<{
    id: number;
    title: string;
    slug: string;
    category: string;
    excerpt: string | null;
    cover_image_path: string | null;
    published_at: Date | null;
    updated_at: Date | null;
    reading_time: number;
  }> = await prisma.blogPost.findMany({
    where: {
      status: 'published',
      id: { not: post.id },
      category: post.category,
    },
    orderBy: { published_at: 'desc' },
    take: 3,
  });

  if (relatedPosts.length < 3) {
    const remainingCount = 3 - relatedPosts.length;
    const excludeIds = [post.id, ...relatedPosts.map((p: { id: number }) => p.id)];
    const additional = await prisma.blogPost.findMany({
      where: {
        status: 'published',
        id: { notIn: excludeIds },
      },
      orderBy: { published_at: 'desc' },
      take: remainingCount,
    });
    relatedPosts = [...relatedPosts, ...additional];
  }

  const categoryMeta = getCategoryMeta(post.category);

  const formattedDate = (date: Date | null) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(date));
  };

  const formattedShortDate = (date: Date | null) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(date));
  };

  // Schéma de métadonnées JSON-LD BlogPosting
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at
      ? post.published_at.toISOString()
      : post.created_at
        ? post.created_at.toISOString()
        : new Date().toISOString(),
    dateModified: post.updated_at
      ? post.updated_at.toISOString()
      : post.created_at
        ? post.created_at.toISOString()
        : new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: 'Équipe Virtanis',
      url: 'https://vcheque.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'VCheque Algérie',
      logo: {
        '@type': 'ImageObject',
        url: 'https://vcheque.com/icon.svg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://vcheque.com/blog/${post.slug}`,
    },
    image: post.cover_image_path
      ? `https://vcheque.com/api/blog/cover/${post.id}`
      : undefined,
  };

  return (
    <article className="article-detail-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. EN-TÊTE HÉRO SOMBRE */}
      <header className="article-header">
        <div className="article-header-inner">
          {/* Fil d'Ariane & Bouton retour */}
          <div className="article-breadcrumb-nav">
            <nav aria-label="Fil d'Ariane" className="article-breadcrumb">
              <Link href="/">Accueil</Link>
              <span className="article-breadcrumb-separator">/</span>
              <Link href="/blog">Blog</Link>
              <span className="article-breadcrumb-separator">/</span>
              <span className="article-breadcrumb-current">{categoryMeta.label}</span>
            </nav>

            <Link href="/blog" className="article-back-link">
              <ArrowLeft size={14} />
              <span>Retour au blog</span>
            </Link>
          </div>

          {/* Badge simple */}
          <div className="mb-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-medium text-[#F7F4EC] tracking-wide">
              {categoryMeta.label}
            </span>
          </div>

          {/* Grand Titre H1 */}
          <h1 className="article-main-title">{post.title}</h1>

          {/* Barre de métadonnées avec auteur et lecture */}
          <div className="article-meta-bar">
            {/* Auteur */}
            <div className="article-author-info">
              <div className="author-avatar-gold">V</div>
              <div className="author-names">
                <span className="author-name-bold">Équipe Virtanis</span>
                <span className="author-role-gold">Rédaction VCheque Algérie</span>
              </div>
            </div>

            {/* Statistiques & Dates */}
            <div className="article-stats-group">
              {post.published_at && (
                <div className="article-stat-item">
                  <Calendar size={15} className="text-[#B99A5A]" />
                  <span>{formattedDate(post.published_at)}</span>
                </div>
              )}
              <div className="article-stat-item">
                <Clock size={15} className="text-[#B99A5A]" />
                <span>{post.reading_time} min de lecture</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. ZONE DE LECTURE PRINCIPALE (EN CHEVAUCHEMENT) */}
      <div className="article-content-container">
        {/* Image de couverture panoramique */}
        <figure className="article-cover-wrapper">
          {post.cover_image_path ? (
            <Image
              src={`/api/blog/cover/${post.id}?v=${post.updated_at ? new Date(post.updated_at).getTime() : post.id}`}
              alt={post.title}
              fill
              priority
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="article-cover-fallback select-none cursor-default">
              <div className="relative z-10 flex flex-col items-center justify-center p-8 text-center max-w-xl select-none pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-[#B99A5A]/20 border border-[#B99A5A]/50 flex items-center justify-center mb-4 shadow-inner">
                  <ShieldCheck size={32} className="text-[#B99A5A]" />
                </div>
                <span className="text-2xl sm:text-3xl font-serif text-[#F7F4EC] tracking-wide mb-2 text-balance leading-snug">
                  {post.title}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="h-px w-6 bg-[#B99A5A]/50" />
                  <span className="text-xs uppercase tracking-widest text-[#B99A5A] font-semibold">
                    VCheque Algérie • {categoryMeta.label}
                  </span>
                  <span className="h-px w-6 bg-[#B99A5A]/50" />
                </div>
                <span className="text-[11px] text-[#A7F3D0]/70 mt-3 font-mono tracking-wider">
                  SÉCURISATION FIDUCIAIRE • BANQUES ALGÉRIENNES
                </span>
              </div>
            </div>
          )}
        </figure>

        {/* Chapô / Résumé */}
        {post.excerpt && (
          <div className="article-lead-box">
            <p className="article-lead-text">{post.excerpt}</p>
          </div>
        )}

        {/* Corps d'article enrichi */}
        <ArticleMarkdownRenderer content={post.content} />

        {/* 3. BARRE DE PARTAGE SOCIALE */}
        <ArticleShareBar title={post.title} slug={post.slug} />

        {/* 4. ENCART D'AUTORITÉ VIRTANIS */}
        <aside className="article-author-card mb-14">
          <div className="author-card-logo">
            <ShieldCheck size={28} className="text-[#B99A5A]" />
          </div>
          <div className="author-card-text">
            <h3 className="author-card-title">À propos de l'équipe VCheque</h3>
            <p className="author-card-bio">
              VCheque est la solution logicielle de référence conçue par Virtanis pour
              fiabiliser, normaliser et sécuriser l'impression de chèques bancaires auprès
              de l'ensemble des établissements financiers en Algérie (BNA, CPA, BEA, BADR,
              BDL, Al Baraka). Nos guides éditoriaux sont rédigés en collaboration avec des
              experts comptables et des spécialistes de la conformité bancaire.
            </p>
          </div>
        </aside>

        {/* 5. BANNIÈRE CTA DE CONVERSION LOGICIELLE */}
        <section className="blog-cta-banner mt-14 mb-16">
          <div className="blog-cta-inner">
            <div className="blog-cta-content">
              <div className="cta-badge">
                <span className="cta-dot" />
                <span>LOGICIEL VCHEQUE WINDOWS</span>
              </div>
              <h3 className="blog-cta-title">
                Prêt à imprimer vos chèques en toute simplicité ?
              </h3>
              <p className="blog-cta-desc">
                Compatible avec toutes les banques algériennes (BNA, CPA, BEA, BADR, BDL,
                Al Baraka). Licence permanente sans abonnement. Calibrage d'impression au
                millimètre près.
              </p>
            </div>

            <div className="blog-cta-actions">
              <Link href="/commander" className="btn-cta-primary">
                <ShoppingCart size={17} />
                <span>Acheter maintenant</span>
              </Link>
              <Link href="/demonstration" className="btn-cta-secondary">
                <Play size={16} />
                <span>Voir la démo vidéo</span>
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* 6. ARTICLES RECOMMANDÉS */}
      {relatedPosts.length > 0 && (
        <section className="related-posts-section">
          <div className="related-section-header">
            <div className="eyebrow eyebrow--gold mb-1">POURSUIVRE LA LECTURE</div>
            <h3 className="related-section-title">Articles recommandés</h3>
          </div>

          <div className="articles-grid">
            {relatedPosts.map((related) => {
              const relCategory = getCategoryMeta(related.category);
              return (
                <article key={related.id} className="article-card">
                  <div className="article-media">
                    {related.cover_image_path ? (
                      <Image
                        src={`/api/blog/cover/${related.id}?v=${related.updated_at ? new Date(related.updated_at).getTime() : related.id}`}
                        alt={related.title}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                        decoding="async"
                        className="article-media-img"
                      />
                    ) : (
                      <div className="article-media-fallback select-none">
                        <BookOpen size={28} />
                        <span className="pointer-events-none">{relCategory.label}</span>
                      </div>
                    )}
                    <span className="article-cat-badge">
                      <span>{relCategory.label}</span>
                    </span>
                  </div>

                  <div className="article-body">
                    <div className="article-meta">
                      {related.published_at && (
                        <time dateTime={related.published_at.toISOString()}>
                          {formattedShortDate(related.published_at)}
                        </time>
                      )}
                      <span>•</span>
                      <span>⏱ {related.reading_time} min</span>
                    </div>

                    <h3 className="article-title">
                      <Link href={`/blog/${related.slug}`}>{related.title}</Link>
                    </h3>

                    <p className="article-excerpt">
                      {related.excerpt ||
                        'Conseils professionnels et explications techniques pour sécuriser l’émission de chèques en Algérie.'}
                    </p>
                  </div>

                  <div className="article-footer">
                    <Link href={`/blog/${related.slug}`} className="read-more-link">
                      <span>Lire l&apos;article</span>
                      <ArrowRight size={14} className="read-more-arrow" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </article>
  );
}
