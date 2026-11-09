import React from 'react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero">
      {/* Filet architectural doré de 3px */}
      <div className="hero-rule" aria-hidden="true" />

      <div className="container hero-inner">
        {/* ================================================================
            Colonne gauche : Copywriting & Call-to-Action
            ================================================================ */}
        <div className="hero-copy">
          {/* Sur-titre (Eyebrow) avec trait horizontal doré de 34px généré en CSS */}
          <p className="eyebrow">Logiciel professionnel de gestion de chèques</p>

          {/* Titre principal H1 avec accent doré/italique */}
          <h1 className="hero-title">
            Remplissez et imprimez vos{' '}
            <span className="accent italic">chèques algériens</span> en toute
            simplicité
          </h1>

          {/* Texte explicatif (Lede) */}
          <p className="hero-lede">
            VCheque est le logiciel Windows conçu pour les PME, commerçants et
            comptables en Algérie afin de remplir les chèques en quelques secondes,
            convertir instantanément les montants en lettres françaises conformes
            et calibrer au millimètre près l&apos;impression selon les gabarits de
            toutes les banques algériennes (BNA, CPA, BEA, BADR, BDL, Al Baraka).
          </p>

          {/* Groupe de boutons CTA */}
          <div className="hero-ctas">
            <Link className="btn btn-primary" href="/checkout">
              <svg
                className="btn-icon"
                width="17"
                height="17"
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

            <Link className="btn btn-outline" href="/demonstration">
              <svg
                className="hero-play"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 5.5v13a1 1 0 0 0 1.53.85l10-6.5a1 1 0 0 0 0-1.7l-10-6.5A1 1 0 0 0 8 5.5Z" />
              </svg>
              <span>Découvrir la démo</span>
            </Link>
          </div>

          {/* Liste horizontale de réassurance : 3 pastilles avec puce circulaire et icône fine */}
          <ul className="hero-badges">
            <li className="hero-badge">
              <span className="badge-dot" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 20l3.5-.9a1 1 0 0 0 .5-.3L19 7.8a2 2 0 0 0-2.8-2.8L5.2 16a1 1 0 0 0-.3.5L4 20Z" />
                  <path d="M14.5 6.5 17.5 9.5" />
                </svg>
              </span>
              <span>Remplissage simplifié</span>
            </li>

            <li className="hero-badge">
              <span className="badge-dot" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2.5" y="8" width="19" height="7.5" rx="1.5" />
                  <path d="M6 8v3M9 8v2.2M12 8v3M15 8v2.2M18 8v3" />
                </svg>
              </span>
              <span>Calibrage en millimètres</span>
            </li>

            <li className="hero-badge">
              <span className="badge-dot" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4.5" width="18" height="12.5" rx="1.6" />
                  <path d="M9 20.5h6M12 17v3.5" />
                </svg>
              </span>
              <span>Conçu pour Windows</span>
            </li>
          </ul>
        </div>

        {/* ================================================================
            Colonne droite : Maquette logicielle pure HTML/CSS
            ================================================================ */}
        <div className="hero-visual">
          {/* Réglette millimétrique graduée verticale */}
          <span className="mm-scale" aria-hidden="true" />

          {/* Fenêtre logicielle Windows avec ombre portée haut de gamme */}
          <div className="app-window">
            {/* Barre supérieure de fenêtre (.win-bar) */}
            <div className="win-bar">
              <span className="win-title">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="win-logo"
                  src="/img/vcheque-icon-32.png"
                  alt="VCheque logo"
                  width={16}
                  height={16}
                  decoding="async"
                />
                VCheque — Saisie de chèque
              </span>
              <span className="win-controls" aria-hidden="true">
                <span title="Réduire" />
                <span title="Agrandir" />
                <span title="Fermer" />
              </span>
            </div>

            {/* Corps de la fenêtre divisé en 3 volets */}
            <div className="win-body">
              {/* Volet a) : Sidebar sombre (.nc-sidebar) */}
              <aside className="nc-sidebar">
                <span className="nc-brand">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 5l7 14L19 5" />
                  </svg>
                  V<b>Cheque</b>
                </span>

                <div className="nc-nav">
                  <span className="nc-item is-active">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M4 11 12 4l8 7" />
                      <path d="M6 10v9h12v-9" />
                    </svg>
                    Accueil
                  </span>

                  <span className="nc-item">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M3 10 4.5 4h15L21 10" />
                      <path d="M5 10v9h14v-9" />
                      <path d="M9.5 19v-5h5v5" />
                    </svg>
                    Modèles bancaires
                  </span>

                  <span className="nc-item">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="8" />
                      <path d="M12 8v4l2.5 2.5" />
                    </svg>
                    Historique
                  </span>

                  <span className="nc-item">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="9" cy="8.5" r="3" />
                      <path d="M3.5 19c.7-3 2.8-4.5 5.5-4.5S13.8 16 14.5 19" />
                      <path d="M16 8.5a3 3 0 1 1 4 3.6M17 15c2 .5 3.3 1.8 3.8 4" />
                    </svg>
                    Bénéficiaires
                  </span>

                  <span className="nc-item">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19 12a7 7 0 0 0-.2-1.6l2-1.6-2-3.4-2.3 1a7 7 0 0 0-2.7-1.6L13.6 2h-3.2l-.2 2.8a7 7 0 0 0-2.7 1.6l-2.3-1-2 3.4 2 1.6A7 7 0 0 0 5 12" />
                    </svg>
                    Paramètres
                  </span>
                </div>

                <div className="nc-footer">v0.1.0 · Desktop Edition</div>
              </aside>

              {/* Volet b) : Zone de saisie centrale (.nc-main) */}
              <div className="nc-main">
                <p className="nc-main-title">Remplir un chèque</p>
                <p className="nc-main-sub">L&apos;aperçu se met à jour à chaque saisie</p>

                <div className="nc-fields">
                  <div className="nc-field nc-field--full">
                    <span className="nc-fieldlabel">Montant (DZD)</span>
                    <span className="nc-input">
                      125 450,75 <span className="suffix">DZD</span>
                    </span>
                  </div>

                  <div className="nc-field nc-field--full">
                    <span className="nc-fieldlabel">Montant en lettres</span>
                    <span className="nc-words">
                      <span className="chip">Conversion automatique</span>
                      <br />
                      Cent vingt-cinq mille quatre cent cinquante dinars et soixante-quinze centimes
                    </span>
                  </div>

                  <div className="nc-field nc-field--full">
                    <span className="nc-fieldlabel">Bénéficiaire</span>
                    <span className="nc-input">Entreprise Exemple SARL</span>
                  </div>

                  <div className="nc-field">
                    <span className="nc-fieldlabel">Lieu</span>
                    <span className="nc-input">Alger</span>
                  </div>

                  <div className="nc-field">
                    <span className="nc-fieldlabel">Date</span>
                    <span className="nc-input">19/10/2026</span>
                  </div>
                </div>

                <span className="nc-printbtn select-none cursor-pointer">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M7 8V4h10v4M5.5 8h13a1.5 1.5 0 0 1 1.5 1.5V16h-4" />
                    <path d="M18 16H5.5A1.5 1.5 0 0 1 4 14.5V9.5A1.5 1.5 0 0 1 5.5 8" />
                    <rect x="8" y="14" width="8" height="6" rx="0.6" />
                  </svg>
                  Imprimer le chèque
                </span>
              </div>

              {/* Volet c) : Volet d'aperçu & de calibrage (.nc-side) */}
              <div className="nc-side">
                <div className="nc-sidetitle">
                  <span>Aperçu</span>
                  <span className="nc-chip">Modèle : BNA / Algérie</span>
                </div>

                {/* Reproduction réaliste d'un chèque bancaire algérien */}
                <div className="cheque-paper cheque-cross">
                  <div className="cheque-top">
                    <span className="cheque-bankname">BANQUE NATIONALE D&apos;ALGÉRIE — BNA</span>
                    <span className="cheque-amountbox">
                      <span className="cur">DA</span>
                      <span className="box"># 125 450,75 #</span>
                    </span>
                  </div>

                  <span className="cheque-label">Payez contre ce chèque non endossable</span>
                  <span className="cheque-line" />

                  <p className="cheque-words">
                    Cent vingt-cinq mille quatre cent cinquante dinars et soixante-quinze centimes
                  </p>

                  <p className="cheque-ordertext">
                    À l&apos;ordre de : <strong>Entreprise Exemple SARL</strong>
                  </p>

                  <div className="cheque-place-row">
                    <span>Alger</span>
                    <span>Le 19/10/2026</span>
                  </div>
                </div>

                {/* Panneau de calibrage technique */}
                <div className="nc-sidetitle">
                  <span>Calibrage</span>
                  <span className="nc-chip">en mm</span>
                </div>

                <div className="nc-calib">
                  <span className="cal">
                    <small>X</small>
                    <b>12,5 mm</b>
                  </span>
                  <span className="cal">
                    <small>Y</small>
                    <b>8,0 mm</b>
                  </span>
                  <span className="cal">
                    <small>Police</small>
                    <b>11 pt</b>
                  </span>
                  <span className="cal">
                    <small>Zoom</small>
                    <b>100 %</b>
                  </span>

                  <span className="nc-calibhi">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <circle cx="6" cy="12" r="2" />
                      <circle cx="12" cy="12" r="2" />
                      <circle cx="18" cy="12" r="2" />
                    </svg>
                    Repères et grille visibles
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
