import React from 'react';
import Link from 'next/link';

export default function FinalCta() {
  return (
    <section className="cta-banner" aria-labelledby="final-cta-heading">
      <div className="container cta-banner-inner">
        {/* Titre monumental H2 */}
        <h2 id="final-cta-heading" className="cta-title">
          Préparez vos chèques avec plus de précision
        </h2>

        {/* Chapeau explicatif */}
        <p className="cta-lede">
          Découvrez VCheque, le logiciel Windows conçu pour simplifier la
          préparation et l&apos;impression de vos chèques professionnels.
        </p>

        {/* Double bouton d'action */}
        <div className="cta-actions">
          {/* Bouton Achat */}
          <Link
            className="btn btn-light inline-flex items-center justify-center gap-2"
            href="/checkout"
            style={{ minWidth: '180px' }}
          >
            <svg
              className="btn-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 7h12l-1.3 11.2a2 2 0 0 1-2 1.8H9.3a2 2 0 0 1-2-1.8L6 7Z" />
              <path d="M9 10V6a3 3 0 1 1 6 0v4" strokeLinecap="round" />
            </svg>
            <span>Acheter</span>
          </Link>

          {/* Bouton Contact */}
          <Link
            className="btn btn-ghost-light inline-flex items-center justify-center gap-2"
            href="/contact"
            style={{ minWidth: '180px' }}
          >
            <svg
              className="btn-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3.5 7 8.5 6 8.5-6" />
            </svg>
            <span>Contacter</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
