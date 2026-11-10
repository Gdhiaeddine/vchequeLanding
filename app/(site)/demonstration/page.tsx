import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import {
  Play,
  ShieldCheck,
  Printer,
  Calendar,
  Eye,
  ShoppingCart,
  MessageSquare,
  Sparkles,
  Layers,
  Sliders,
  CheckCircle2,
  Video,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Démonstration Vidéo VCheque — Découvrez le Logiciel en Action en Algérie',
  description:
    'Regardez comment remplir, convertir en toutes lettres et imprimer un chèque bancaire professionnel en moins de 3 minutes sur n’importe quelle imprimante de bureau.',
  keywords: [
    'démonstration VCheque',
    'vidéo impression chèque Algérie',
    'tutoriel chèque bancaire Algérie',
    'logiciel chèque BNA CPA BEA BADR',
    'conversion chiffres en lettres DZD',
  ],
  openGraph: {
    title: 'Démonstration VCheque : Découvrez le Logiciel d’Impression de Chèques en Action',
    description:
      'Tutoriel vidéo complet : remplissage, conversion instantanée et impression millimétrique sur chèques bancaires algériens.',
    url: 'https://vcheque.com/demonstration',
    siteName: 'VCheque par Virtanis',
    locale: 'fr_DZ',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Démonstration Vidéo VCheque',
    description:
      'Découvrez comment sécuriser et imprimer vos chèques bancaires algériens avec VCheque.',
  },
  alternates: {
    canonical: 'https://vcheque.com/demonstration',
  },
};

export default async function DemonstrationPage() {
  const activeVideo = await prisma.demoVideo.findFirst({
    where: { is_active: true },
    orderBy: { created_at: 'desc' },
  });

  const formattedDate = activeVideo?.created_at
    ? new Intl.DateTimeFormat('fr-DZ', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(new Date(activeVideo.created_at))
    : null;

  // Structured Data (JSON-LD)
  const jsonLd = activeVideo
    ? {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: activeVideo.title,
        description:
          activeVideo.description ||
          'Démonstration pratique du logiciel d’impression et d’édition de chèques bancaires VCheque pour l’Algérie.',
        thumbnailUrl: activeVideo.thumbnail_path
          ? [activeVideo.thumbnail_path]
          : ['https://vcheque.com/images/demo-placeholder.jpg'],
        uploadDate: activeVideo.created_at
          ? new Date(activeVideo.created_at).toISOString()
          : new Date().toISOString(),
        contentUrl: `https://vcheque.com/api/demonstration/video/${activeVideo.id}`,
        embedUrl: `https://vcheque.com/demonstration`,
        interactionStatistic: {
          '@type': 'InteractionCounter',
          interactionType: { '@type': 'WatchAction' },
          userInteractionCount: activeVideo.views_count,
        },
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Démonstration Officielle VCheque',
        description:
          'Présentation interactive et démonstration des fonctionnalités du logiciel d’impression de chèques VCheque.',
        url: 'https://vcheque.com/demonstration',
      };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. HERO HEADER DÉMONSTRATION */}
      <header className="demo-hero" aria-labelledby="demo-heading">
        <div className="demo-hero-grid-mesh" aria-hidden="true" />
        <div className="demo-hero-glow" aria-hidden="true" />

        <div className="max-w-4xl mx-auto text-center relative z-10 px-4">
          {/* Eyebrow simple */}
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#B99A5A] mb-3">
            PRÉSENTATION VIDÉO OFFICIELLE
          </p>

          {/* Grand Titre H1 */}
          <h1 id="demo-heading" className="demo-hero-title">
            Démonstration de VCheque : Découvrez le Logiciel en Action
          </h1>

          {/* Lede / Sous-titre */}
          <p className="demo-hero-lede">
            Regardez comment remplir, convertir et imprimer un chèque bancaire professionnel en
            moins de 3 minutes sur n&apos;importe quelle imprimante de bureau.
          </p>

          {/* Trio de badges de confiance */}
          <div className="demo-hero-badges" role="list" aria-label="Points forts de la démonstration">
            <div className="demo-hero-badge" role="listitem">
              <Video size={16} aria-hidden="true" />
              <span>
                <strong>Démonstration Pratique</strong>
              </span>
            </div>

            <div className="demo-hero-badge" role="listitem">
              <ShieldCheck size={16} aria-hidden="true" />
              <span>
                <strong>Banques Algériennes Intégrées</strong>
              </span>
            </div>

            <div className="demo-hero-badge" role="listitem">
              <Printer size={16} aria-hidden="true" />
              <span>
                <strong>Impression Millimétrique</strong>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. CONTENEUR PRINCIPAL */}
      <main className="demo-content-section">
        <div className="demo-container">
          {/* CADRE CINÉMA LECTEUR VIDÉO */}
          <section className="demo-video-container" aria-label="Lecteur vidéo de démonstration">
            {activeVideo ? (
              /* CAS 1 : VIDÉO DISPONIBLE & DÉPLOYÉE */
              <div>
                <div className="demo-player-box">
                  <video
                    controls
                    playsInline
                    preload="metadata"
                    poster={activeVideo.thumbnail_path || undefined}
                    aria-label={activeVideo.title}
                  >
                    <source
                      src={`/api/demonstration/video/${activeVideo.id}`}
                      type={activeVideo.mime_type || 'video/mp4'}
                    />
                    <track kind="captions" />
                    Votre navigateur ne prend pas en charge la lecture de vidéos HTML5.
                  </video>
                </div>

                {/* Barre d'informations sous la vidéo */}
                <div className="demo-video-info">
                  <div className="demo-video-info-header">
                    <div>
                      <span className="demo-video-tag">VIDÉO OFFICIELLE</span>
                      <h2 className="demo-video-title">{activeVideo.title}</h2>
                    </div>

                    <div className="demo-video-meta">
                      {formattedDate && (
                        <div className="demo-video-meta-item">
                          <Calendar size={15} aria-hidden="true" />
                          <span>Publiée le {formattedDate}</span>
                        </div>
                      )}
                      <div className="demo-video-meta-item">
                        <Eye size={15} aria-hidden="true" />
                        <span>{activeVideo.views_count.toLocaleString('fr-FR')} visionnages</span>
                      </div>
                    </div>
                  </div>

                  {activeVideo.description && (
                    <p className="demo-video-desc">{activeVideo.description}</p>
                  )}
                </div>
              </div>
            ) : (
              /* CAS 2 : PLACEHOLDER D'ATTENTE (SI AUCUNE VIDÉO TÉLÉVERSÉE) */
              <div className="demo-placeholder-box">
                {/* Bouton Play central animé avec onde pulsante */}
                <div className="placeholder-icon-wrap" aria-hidden="true">
                  <div className="placeholder-pulse-ring" />
                  <div className="placeholder-play-circle">
                    <Play size={30} />
                  </div>
                </div>

                <h2 className="placeholder-title">
                  Vidéo de démonstration en cours de déploiement
                </h2>

                <p className="placeholder-text">
                  L&apos;équipe technique prépare actuellement la vidéo officielle de présentation de la
                  version Windows. Elle sera disponible ici très prochainement.
                </p>

                {/* Boutons d'action immédiats */}
                <div className="placeholder-actions">
                  <Link
                    href="/commander"
                    className="btn-cta-primary"
                  >
                    <ShoppingCart size={16} aria-hidden="true" />
                    <span>Acheter maintenant</span>
                  </Link>

                  <Link
                    href="/contact"
                    className="btn-cta-secondary !text-[#102C25] !bg-white !border-[#E5E0D5] hover:!border-[#B99A5A]"
                  >
                    <MessageSquare size={16} aria-hidden="true" />
                    <span>Nous contacter</span>
                  </Link>
                </div>
              </div>
            )}
          </section>

          {/* 3. CARTE DES 4 FONCTIONNALITÉS DÉMONTRÉES */}
          <section className="demo-features-card" aria-labelledby="features-heading">
            <div className="demo-features-header">
              <span className="demo-features-tag">PILIER FONCTIONNELS</span>
              <h2 id="features-heading" className="demo-features-title">
                Ce que vous découvrez dans cette démonstration
              </h2>
              <p className="demo-features-subtitle">
                VCheque a été spécialement conçu pour répondre aux contraintes du système bancaire et
                comptable en Algérie.
              </p>
            </div>

            <div className="features-grid">
              {/* Étape 1 */}
              <article className="feature-box">
                <span className="feature-number" aria-hidden="true">
                  01
                </span>
                <h3 className="feature-title">Conversion instantanée en lettres</h3>
                <p className="feature-desc">
                  Saisie simple en chiffres (ex: <em>350 000 DZD</em>), retranscription instantanée en
                  toutes lettres françaises conformément aux exigences bancaires algériennes sans
                  risque d&apos;erreur.
                </p>
              </article>

              {/* Étape 2 */}
              <article className="feature-box">
                <span className="feature-number" aria-hidden="true">
                  02
                </span>
                <h3 className="feature-title">Gabarits de toutes les banques</h3>
                <p className="feature-desc">
                  Sélection en 1 clic de votre banque (BNA, BEA, CPA, BADR, BDL, Al Baraka, Société
                  Générale, etc.) avec formats et coordonnées pré-configurés au millimètre près.
                </p>
              </article>

              {/* Étape 3 */}
              <article className="feature-box">
                <span className="feature-number" aria-hidden="true">
                  03
                </span>
                <h3 className="feature-title">Calibrage d&apos;impression au millimètre</h3>
                <p className="feature-desc">
                  Utilisation de la mire de calibrage interactive pour aligner les champs au
                  millimètre près sur tout bac d&apos;imprimante de bureau (laser ou jet d&apos;encre).
                </p>
              </article>

              {/* Étape 4 */}
              <article className="feature-box">
                <span className="feature-number" aria-hidden="true">
                  04
                </span>
                <h3 className="feature-title">Barrement & Sécurisation</h3>
                <p className="feature-desc">
                  Application automatique des deux traits obliques de barrement et de la mention
                  légale « Non Endossable » pour interdire toute falsification ou encaissement frauduleux.
                </p>
              </article>
            </div>
          </section>

          {/* 4. BANDEAU DE CONVERSION FINAL */}
          <section className="demo-cta-card" aria-labelledby="cta-heading">
            <div className="demo-cta-mesh" aria-hidden="true" />

            <div className="demo-cta-content">
              <h2 id="cta-heading" className="demo-cta-title">
                Convaincu par la démonstration ?
              </h2>
              <p className="demo-cta-desc">
                Équipez votre entreprise de VCheque dès aujourd&apos;hui. Licence permanente sans
                abonnement mensuel avec support technique officiel en Algérie.
              </p>
            </div>

            <div className="demo-cta-buttons">
              <Link href="/commander" className="btn-cta-primary">
                <ShoppingCart size={18} aria-hidden="true" />
                <span>Acheter maintenant</span>
              </Link>

              <Link href="/contact" className="btn-cta-secondary">
                <MessageSquare size={18} aria-hidden="true" />
                <span>Poser une question</span>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
