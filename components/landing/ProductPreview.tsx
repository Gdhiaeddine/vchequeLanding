import React from 'react';

export default function ProductPreview() {
  return (
    <section className="section" id="apercu" aria-labelledby="preview-heading">
      <div className="container">
        {/* En-tête de section */}
        <div className="section-head">
          <p className="eyebrow">Vitrine produit</p>
          <h2 id="preview-heading" className="section-title">
            Découvrez VCheque en situation
          </h2>
          <p className="section-lede">
            Voici comment l&apos;application se présente au quotidien : le formulaire
            de saisie à gauche, l&apos;aperçu du chèque et ses réglages de
            calibrage à droite.
          </p>
        </div>

        {/* Mise en scène de la grande fenêtre logicielle */}
        <div className="showcase">
          {/* Réglette millimétrique graduée latérale */}
          <span className="mm-scale" aria-hidden="true" />

          <div className="app-window showcase-window">
            {/* Barre Windows supérieure */}
            <div className="win-bar">
              <span className="win-title">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="win-logo"
                  src="/img/vcheque-icon-32.png"
                  alt="VCheque logo"
                  width={16}
                  height={16}
                  loading="lazy"
                  decoding="async"
                />
                VCheque — Remplir un chèque
              </span>
              <span className="win-controls" aria-hidden="true">
                <span title="Réduire" />
                <span title="Agrandir" />
                <span title="Fermer" />
              </span>
            </div>

            {/* Corps de l'application à 3 volets */}
            <div className="win-body">
              {/* Volet gauche : Navigation latérale */}
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

              {/* Volet central : Zone de saisie */}
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
                      Cent vingt-cinq mille quatre cent cinquante dinars algériens et soixante-quinze centimes
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

              {/* Volet droit : Aperçu & calibrage */}
              <div className="nc-side">
                <div className="nc-sidetitle">
                  <span>Aperçu</span>
                  <span className="nc-chip">Chèque 180 × 80 mm</span>
                </div>

                {/* Reproduction réaliste d'un chèque bancaire algérien */}
                <div className="cheque-paper cheque-cross showcase-cheque">
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
                    Cent vingt-cinq mille quatre cent cinquante dinars algériens et soixante-quinze centimes
                  </p>

                  <p className="cheque-ordertext">
                    À l&apos;ordre de : <strong>Entreprise Exemple SARL</strong>
                  </p>

                  <div className="cheque-place-row">
                    <span>Alger</span>
                    <span>Le 19/10/2026</span>
                  </div>
                </div>

                {/* Sélecteur de gabarits */}
                <div className="nc-sidetitle">
                  <span>Modèle</span>
                  <span className="nc-chip">Gabarits</span>
                </div>
                <div className="tpl-row tpl-row--wrap" aria-hidden="true">
                  <span className="tpl-chip is-active">Générique</span>
                  <span className="tpl-chip">180 × 80 mm</span>
                  <span className="tpl-chip">Personnalisé</span>
                  <span className="tpl-chip">Dupliqué</span>
                </div>

                {/* Bloc de calibrage technique */}
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
                </div>
              </div>
            </div>
          </div>

          <p className="showcase-caption">
            Prévisualisez votre chèque et ajustez les positions avant l&apos;impression.
          </p>
        </div>
      </div>
    </section>
  );
}
