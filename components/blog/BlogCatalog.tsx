'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  X,
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  ShoppingCart,
  Play,
  RotateCcw,
} from 'lucide-react';

export interface BlogPostItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_path: string | null;
  category: string;
  reading_time: number;
  views_count: number;
  published_at: string | null;
  created_at: string | null;
}

const CATEGORY_MAP: Record<string, string> = {
  all: 'Tous les articles',
  reglementation: 'Réglementation',
  conseils: 'Conseils Pratiques',
  comptabilite: 'Comptabilité PME',
  actualites: 'Actualités',
};

const PAGE_SIZE = 6;

export default function BlogCatalog({ initialPosts }: { initialPosts: BlogPostItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Normalisation des catégories existantes
  const normalizeCategory = (cat: string) => {
    const c = (cat || '').toLowerCase().trim();
    if (c.includes('regle') || c.includes('droit')) return 'reglementation';
    if (c.includes('conseil') || c.includes('astuce') || c.includes('tuto')) return 'conseils';
    if (c.includes('compta') || c.includes('gestion') || c.includes('pme')) return 'comptabilite';
    if (c.includes('actu') || c.includes('news')) return 'actualites';
    return c || 'conseils';
  };

  // Calcul dynamique des compteurs par catégorie
  const counts = useMemo(() => {
    const tally: Record<string, number> = {
      all: initialPosts.length,
      reglementation: 0,
      conseils: 0,
      comptabilite: 0,
      actualites: 0,
    };

    initialPosts.forEach((p) => {
      const normalized = normalizeCategory(p.category);
      if (tally[normalized] !== undefined) {
        tally[normalized]++;
      } else {
        tally[normalized] = 1;
      }
    });

    return tally;
  }, [initialPosts]);

  // Filtrage combiné : Recherche + Catégorie
  const filteredPosts = useMemo(() => {
    let result = initialPosts;

    if (selectedCategory !== 'all') {
      result = result.filter((p) => normalizeCategory(p.category) === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.excerpt?.toLowerCase().includes(q) ||
          p.content?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [initialPosts, selectedCategory, searchQuery]);

  // Détection du mode "Article à la une"
  // Actif uniquement si pas de recherche, sur la première page et catégorie générale
  const isSearchActive = searchQuery.trim().length > 0;
  const isCategoryFiltered = selectedCategory !== 'all';
  const showFeatured = !isSearchActive && !isCategoryFiltered && currentPage === 1 && filteredPosts.length > 0;

  const featuredPost = showFeatured ? filteredPosts[0] : null;
  const gridCandidates = showFeatured ? filteredPosts.slice(1) : filteredPosts;

  // Pagination sur la grille des candidats
  const totalGridPages = Math.ceil(gridCandidates.length / PAGE_SIZE) || 1;
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return gridCandidates.slice(start, start + PAGE_SIZE);
  }, [gridCandidates, currentPage]);

  const handleCategorySelect = (catKey: string) => {
    setSelectedCategory(catKey);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const formatLongDate = (dateStr: string | null) => {
    if (!dateStr) return 'Date récente';
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return 'Date récente';
    }
  };

  const formatShortDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return '—';
    }
  };

  const getCategoryLabel = (cat: string) => {
    const normalized = normalizeCategory(cat);
    return CATEGORY_MAP[normalized] || cat || 'Guide';
  };

  return (
    <div className="blog-catalog-page">
      {/* 1. HERO HEADER AVEC FILIGRANE GUILLOCHÉ */}
      <section className="checkout-hero" aria-labelledby="blog-hero-title">
        <div className="container checkout-hero-inner">
          <p className="eyebrow eyebrow--gold">ACTUALITÉS, GUIDES &amp; RÉGLEMENTATION</p>
          <h1 id="blog-hero-title" className="checkout-hero-title">
            Le Blog Officiel VCheque
          </h1>
          <p className="checkout-hero-lede">
            Conseils pratiques, actualités bancaires algériennes et astuces professionnelles pour
            préparer et imprimer vos chèques en toute sérénité.
          </p>
        </div>
      </section>

      {/* 2. BARRE DE FILTRAGE & RECHERCHE */}
      <div className="blog-nav-bar">
        <div className="container blog-nav-inner">
          {/* Pilules de Catégories avec compteurs */}
          <nav className="blog-pills-wrap" aria-label="Catégories d'articles">
            {Object.entries(CATEGORY_MAP).map(([key, label]) => {
              const count = counts[key] || 0;
              const isActive = selectedCategory === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleCategorySelect(key)}
                  className={`blog-pill ${isActive ? 'is-active' : ''}`}
                  aria-pressed={isActive}
                >
                  <span>{label}</span>
                  <span className="blog-pill-count">({count})</span>
                </button>
              );
            })}
          </nav>

          {/* Champ de recherche interactif */}
          <div className="blog-search-form" role="search">
            <span className="blog-search-icon" aria-hidden="true">
              <Search size={15} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Rechercher un article…"
              className="blog-search-input"
              aria-label="Rechercher des articles"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="blog-search-clear"
                title="Effacer la recherche"
                aria-label="Effacer le champ de recherche"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container">
        {/* Bandeau d'information si recherche active */}
        {isSearchActive && (
          <div className="blog-search-notice" role="status" aria-live="polite">
            <div>
              <span>
                Résultats pour la recherche « <strong>{searchQuery}</strong> » ({filteredPosts.length}{' '}
                article{filteredPosts.length > 1 ? 's' : ''})
              </span>
            </div>
            <button type="button" onClick={handleResetFilters} className="blog-search-reset-btn">
              Voir tous les articles
            </button>
          </div>
        )}

        {/* 3. ARTICLE EN VEDETTE « À LA UNE » */}
        {featuredPost && (
          <article className="featured-article-card" aria-labelledby="featured-title">
            <div className="featured-media-col">
              {featuredPost.cover_image_path ? (
                <Image
                  src={`/api/blog/cover/${featuredPost.id}`}
                  alt={featuredPost.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  priority
                  unoptimized
                  className="featured-media-img"
                />
              ) : (
                <div className="featured-media-fallback select-none">
                  <BookOpen size={48} className="featured-media-fallback-icon" />
                  <span className="pointer-events-none">Virtanis • VCheque Édition</span>
                </div>
              )}
              <span className="featured-badge">
                <span className="featured-badge-dot" aria-hidden="true" />
                <span>À la une • {getCategoryLabel(featuredPost.category)}</span>
              </span>
            </div>

            <div className="featured-content-col">
              <div>
                <div className="featured-meta">
                  <span className="featured-meta-item">
                    <Calendar size={13} className="text-[#B99A5A]" />
                    <time dateTime={featuredPost.published_at || ''}>
                      {formatLongDate(featuredPost.published_at || featuredPost.created_at)}
                    </time>
                  </span>
                  <span className="featured-meta-item">
                    <Clock size={13} className="text-[#B99A5A]" />
                    <span>{featuredPost.reading_time || 4} min de lecture</span>
                  </span>
                </div>

                <h2 id="featured-title" className="featured-title">
                  <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                </h2>

                <p className="featured-excerpt">
                  {featuredPost.excerpt ||
                    'Découvrez nos conseils et analyses expertes sur l’alignement, la sécurité bancaire et l’impression assistée par ordinateur de chèques en Algérie.'}
                </p>
              </div>

              <div>
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="btn btn-primary btn-sm inline-flex items-center gap-2"
                >
                  <span>Lire l&apos;article complet</span>
                  <ArrowRight size={14} className="btn-icon" />
                </Link>
              </div>
            </div>
          </article>
        )}

        {/* 4. GRILLE DES ARTICLES STANDARDS */}
        {paginatedPosts.length > 0 ? (
          <section className="articles-grid" aria-label="Liste des articles">
            {paginatedPosts.map((post) => (
              <article key={post.id} className="article-card">
                <div className="article-media">
                  {post.cover_image_path ? (
                    <Image
                      src={`/api/blog/cover/${post.id}`}
                      alt={post.title}
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
                      <span className="pointer-events-none">{getCategoryLabel(post.category)}</span>
                    </div>
                  )}
                  <span className="article-cat-badge">
                    <span>{getCategoryLabel(post.category)}</span>
                  </span>
                </div>

                <div className="article-body">
                  <div className="article-meta">
                    <time dateTime={post.published_at || ''}>
                      {formatShortDate(post.published_at || post.created_at)}
                    </time>
                    <span>•</span>
                    <span>⏱ {post.reading_time || 3} min</span>
                  </div>

                  <h3 className="article-title">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="article-excerpt">
                    {post.excerpt ||
                      'Conseils professionnels et explications techniques pour sécuriser l’émission de chèques en Algérie.'}
                  </p>
                </div>

                <div className="article-footer">
                  <Link href={`/blog/${post.slug}`} className="read-more-link">
                    <span>Lire l&apos;article</span>
                    <ArrowRight size={14} className="read-more-arrow" />
                  </Link>
                </div>
              </article>
            ))}
          </section>
        ) : !featuredPost ? (
          /* 5. ÉTAT "AUCUN RÉSULTAT" */
          <div className="blog-empty-card" role="status">
            <div className="blog-empty-icon" aria-hidden="true">
              <Search size={28} />
            </div>
            <h3 className="blog-empty-title">Aucun article trouvé</h3>
            <p className="blog-empty-desc">
              Aucun article ne correspond à votre sélection. Consultez nos autres rubriques ou
              réinitialisez la recherche.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="btn-pill-primary inline-flex items-center gap-2"
            >
              <RotateCcw size={14} />
              <span>Voir tous les articles</span>
            </button>
          </div>
        ) : null}

        {/* 6. PAGINATION ACCESSIBLE */}
        {totalGridPages > 1 && (
          <nav className="blog-pagination-wrap" aria-label="Pagination des articles">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="blog-page-btn"
              aria-label="Page précédente"
            >
              ←
            </button>

            {Array.from({ length: totalGridPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setCurrentPage(num)}
                className={`blog-page-btn ${currentPage === num ? 'is-active' : ''}`}
                aria-current={currentPage === num ? 'page' : undefined}
              >
                {num}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalGridPages}
              onClick={() => setCurrentPage((p) => Math.min(totalGridPages, p + 1))}
              className="blog-page-btn"
              aria-label="Page suivante"
            >
              →
            </button>
          </nav>
        )}

        {/* 7. BANNIÈRE DE CONVERSION LOGICIEL */}
        <section className="blog-cta-banner" aria-labelledby="cta-heading">
          <div className="cta-accent-line" aria-hidden="true" />
          <div className="blog-cta-inner">
            <div className="blog-cta-content">
              <span className="cta-badge">
                <span className="cta-pulse-dot" aria-hidden="true" />
                <span>LOGICIEL PROFESSIONNEL WINDOWS</span>
              </span>

              <h3 id="cta-heading" className="blog-cta-title">
                Automatisez vos impressions de chèques en Algérie
              </h3>

              <p className="blog-cta-desc">
                VCheque remplit vos chèques, convertit vos montants en lettres françaises et calibre
                vos impressions au millimètre près sur toutes les imprimantes standard.
              </p>
            </div>

            <div className="blog-cta-actions">
              <Link href="/commander" className="btn-cta-primary">
                <ShoppingCart size={16} />
                <span>Acheter une licence</span>
              </Link>

              <Link href="/demonstration" className="btn-cta-secondary">
                <Play size={15} />
                <span>Découvrir la démo</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
