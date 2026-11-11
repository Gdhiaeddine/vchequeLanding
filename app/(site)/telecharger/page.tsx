import React from 'react';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import DownloadInteractiveView, { AppReleaseData } from '@/components/download/DownloadInteractiveView';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Télécharger VCheque pour Windows — Distribution Officielle en Algérie',
  description:
    'Téléchargez l’installateur officiel certifié du logiciel d’impression de chèques bancaires VCheque pour Windows 11 / 10 (64-bit). Déploiement rapide et sécurisé édité par Virtanis en Algérie.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  openGraph: {
    title: 'Télécharger VCheque pour Windows — Logiciel d’Impression de Chèques en Algérie',
    description:
      'Installateur certifié pour PC Windows 11 / 10 (64-bit). Déclenchement automatique du téléchargement et guide de mise en route rapide.',
    url: 'https://vcheque.virtanis.net/telecharger',
    siteName: 'VCheque par Virtanis',
    locale: 'fr_DZ',
    type: 'website',
  },
  alternates: {
    canonical: 'https://vcheque.virtanis.net/telecharger',
  },
};

export default async function DownloadPage() {
  // 1. Recherche de la version active (ou de la plus récente en base)
  let activeRelease = await prisma.appRelease.findFirst({
    where: { is_active: true },
    orderBy: { created_at: 'desc' },
  });

  if (!activeRelease) {
    activeRelease = await prisma.appRelease.findFirst({
      orderBy: { created_at: 'desc' },
    });
  }

  // 2. Structuration des données pour le composant interactif
  const releaseData: AppReleaseData | null = activeRelease
    ? {
        id: activeRelease.id,
        version: activeRelease.version,
        filename: activeRelease.filename,
        file_size: activeRelease.file_size,
        sha256: activeRelease.sha256,
      }
    : null;

  return (
    <>
      {/* =====================================================================
          1. HERO HEADER DÉPLOIEMENT (.checkout-hero)
          ===================================================================== */}
      <header className="checkout-hero" aria-labelledby="download-hero-title">
        <div className="checkout-hero-inner max-w-4xl mx-auto text-center px-4 flex flex-col items-center justify-center">
          <p className="eyebrow eyebrow--gold uppercase tracking-widest text-xs sm:text-sm font-bold mb-3 font-sans">
            INSTALLATION & DÉPLOIEMENT WINDOWS
          </p>

          <h1 id="download-hero-title" className="checkout-hero-title text-center">
            Téléchargement de VCheque pour Windows
          </h1>

          <p className="checkout-hero-lede !mx-auto !text-center">
            Merci d&apos;avoir choisi VCheque. Votre installateur officiel est prêt à être téléchargé sur votre ordinateur.
          </p>
        </div>
      </header>

      {/* =====================================================================
          2. VUE INTERACTIVE (COMPTE À REBOURS, FICHE BINAIRE & GUIDE ÉTAPES)
          ===================================================================== */}
      <DownloadInteractiveView release={releaseData} />
    </>
  );
}
