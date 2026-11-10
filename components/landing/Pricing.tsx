import React from 'react';
import Link from 'next/link';
import { parseAndFormatPrice, calculateDiscountBadge } from '@/lib/pricing';

export default function Pricing() {
  // Récupération dynamique depuis les variables d'environnement (.env / .env.local)
  const priceRaw = process.env.NEXT_PUBLIC_PRICE || '8500';
  const priceBeforeRaw = process.env.NEXT_PUBLIC_PRICE_BEFORE || '12000';
  const currency = process.env.NEXT_PUBLIC_CURRENCY || 'DZD';

  const price = parseAndFormatPrice(priceRaw, '8 500,00');
  const priceBefore = parseAndFormatPrice(priceBeforeRaw, '12 000,00');
  // Calcul automatique du badge de réduction
  const discountBadge = calculateDiscountBadge(priceRaw, priceBeforeRaw);

  const features = [
    'Saisie des montants en dinars algériens avec centimes',
    'Conversion automatique des montants en lettres françaises',
    'Aperçu fidèle du chèque à l\'écran avant impression',
    'Modèles bancaires pris en charge et personnalisables',
    'Calibrage d\'impression en millimètres sur axes X et Y',
    'Utilisation autonome optimisée pour Windows',
  ];

  const conditions = [
    'Licence permanente à vie sans frais mensuels',
    'Activation sur poste de travail Windows (Windows 11, 10, 8, 7)',
    'Mises à jour de maintenance et corrections incluses',
    'Support technique pour l\'installation et la configuration des imprimantes',
  ];

  const trustGuarantees = [
    {
      title: 'Paiement en ligne',
      desc: 'Commande vérifiée côté serveur via la plateforme officielle (Edahabia / CIB / SlickPay)',
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      ),
    },
    {
      title: 'Livraison par email',
      desc: 'Lien de téléchargement et clé transmis immédiatement après confirmation',
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
    },
    {
      title: 'Instructions d\'activation',
      desc: 'Guide pas à pas inclus pour activer votre poste Windows',
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      title: 'Support client',
      desc: 'Assistance dédiée pour l\'installation et le calibrage de vos modèles',
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="section section--deep section-pricing" id="tarifs" aria-labelledby="pricing-heading">
      <div className="container">
        {/* En-tête centré */}
        <div className="section-head section-head--center">
          <p className="eyebrow">Tarif &amp; Licence</p>
          <h2 id="pricing-heading" className="section-title">
            Licence Commerciale VCheque
          </h2>
          <p className="section-lede">
            Une licence perpétuelle complète sans abonnement pour automatiser et fiabiliser toutes vos impressions bancaires.
          </p>
        </div>

        <div className="pricing-wrap">
          {/* Carte Tarifaire Majeure */}
          <article className="pricing-card pricing-card--single">
            {/* Header de la carte */}
            <div className="pricing-card-header">
              <div className="pricing-badge-row">
                <span className="pricing-badge">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  <span>Licence commerciale Windows</span>
                </span>
                <span className="pricing-edition-tag">LICENCE COMMERCIALE PERMANENTE</span>
              </div>

              <h3 className="pricing-name">VCheque</h3>

              <p className="pricing-desc">
                Logiciel de remplissage de chèques en Algérie conçu pour automatiser vos impressions,
                fiabiliser la formulation en lettres et calibrer vos modèles au millimètre.
              </p>
            </div>

            {/* Bloc Prix dynamique depuis .env */}
            <div className="pricing-price-box">
              {priceBefore && (
                <div className="pricing-price-before-row">
                  <span className="pricing-before-prefix">Au lieu de</span>
                  <del className="pricing-amount-before">
                    {priceBefore} {currency}
                  </del>
                  {discountBadge && (
                    <span className="pricing-discount-badge">{discountBadge}</span>
                  )}
                </div>
              )}

              <div className="pricing-price-main">
                <span className="pricing-amount">{price}</span>
                <span className="pricing-currency">{currency}</span>
              </div>

              <span className="pricing-period">
                Paiement unique · Licence permanente sans abonnement récurrent
              </span>
            </div>

            {/* Grille Intérieure 2 Colonnes */}
            <div className="pricing-details-grid">
              {/* Colonne 1 : Fonctionnalités incluses */}
              <div className="pricing-col pricing-col--features">
                <h4 className="pricing-block-title">Fonctionnalités incluses</h4>
                <ul className="pricing-features-list">
                  {features.map((feature, i) => (
                    <li key={i}>
                      <span className="pricing-check-icon" aria-hidden="true">
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Colonne 2 : Modalités de la licence */}
              <div className="pricing-col pricing-col--conditions">
                <h4 className="pricing-block-title">Modalités de la licence</h4>
                <div className="pricing-conditions-panel">
                  <ul className="pricing-conditions-list">
                    {conditions.map((item, i) => (
                      <li key={i}>
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="m4.5 12.5 4.5 4.5L19.5 7" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="pricing-fallback">
                    Activation instantanée avec support d&apos;installation personnalisé pour votre entreprise.
                  </p>
                </div>
              </div>
            </div>

            {/* Bouton d'Action */}
            <div className="pricing-actions">
              <Link
                className="btn btn-primary pricing-cta-btn inline-flex items-center justify-center gap-2"
                href="/checkout"
                aria-label="Acheter la licence VCheque"
              >
                <svg
                  className="btn-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path d="M6 7h12l-1.3 11.2a2 2 0 0 1-2 1.8H9.3a2 2 0 0 1-2-1.8L6 7Z" />
                  <path d="M9 10V6a3 3 0 1 1 6 0v4" strokeLinecap="round" />
                </svg>
                <span>Acheter maintenant</span>
              </Link>
              <p className="pricing-cta-sub">
                Activation par clé individuelle · Commande en ligne sécurisée
              </p>
            </div>
          </article>

          {/* Bandeau de 4 Garanties de Confiance */}
          <div className="pricing-trust-strip" aria-label="Garanties et modalités d'acquisition">
            {trustGuarantees.map((item, i) => (
              <div key={i} className="pricing-trust-item">
                <span className="pricing-trust-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <div className="pricing-trust-content">
                  <h4 className="pricing-trust-title">{item.title}</h4>
                  <p className="pricing-trust-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
