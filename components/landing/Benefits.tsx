import React from 'react';

export default function Benefits() {
  const benefits = [
    {
      title: 'Gain de temps',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-[21px] h-[21px]"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="8" />
          <path d="M12 7.5V12l3 2" />
        </svg>
      ),
      paragraphs: [
        "Bénéficiaires réutilisables, conversion automatique des montants en lettres et modèles déjà enregistrés : les gestes répétitifs de préparation diminuent d'un chèque à l'autre, y compris pour les centimes.",
        "Vous reprenez un modèle, vous ajustez le montant et l'ordre, puis vous imprimez — sans ressaisir ce qui ne change pas.",
      ],
    },
    {
      title: 'Réduction des erreurs de saisie',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-[21px] h-[21px]"
          aria-hidden="true"
        >
          <path d="M4 12a8 8 0 0 1 13.6-5.7L20 8.6" />
          <path d="M20 4v4.6h-4.6" />
          <path d="M20 12a8 8 0 0 1-13.6 5.7L4 15.4" />
          <path d="M4 20v-4.6h4.6" />
        </svg>
      ),
      paragraphs: [
        "Avant l'impression, le montant en chiffres, le montant en lettres, le bénéficiaire et la date sont présentés côte à côte : la relecture devient plus rapide et plus fiable.",
        "L'aperçu ne remplace pas votre contrôle — il le facilite, pour lever les coquilles avant qu'elles n'atterrissent sur le chèque.",
      ],
    },
    {
      title: 'Impression personnalisable',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-[21px] h-[21px]"
          aria-hidden="true"
        >
          <path d="M7 8V4h10v4M5.5 8h13a1.5 1.5 0 0 1 1.5 1.5V16h-4" />
          <path d="M18 16H5.5A1.5 1.5 0 0 1 4 14.5v-5A1.5 1.5 0 0 1 5.5 8" />
          <rect x="8" y="14" width="8" height="6" rx="0.6" />
        </svg>
      ),
      paragraphs: [
        "La position horizontale et verticale de chaque champ se règle en millimètres, avec la taille de police correspondante, pour s'aligner sur les lignes réelles de votre carnet de chèques.",
        "Les marges physiques de l'imprimante et les compensations se configurent une fois, puis se réutilisent à chaque chèque.",
      ],
    },
    {
      title: 'Organisation professionnelle',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-[21px] h-[21px]"
          aria-hidden="true"
        >
          <rect x="3" y="4.5" width="16" height="15" rx="1.8" />
          <path d="M7 8.5h9M7 12h9M7 15.5h5.5" />
          <path d="m14.5 14.5 4.5-4.5M15.5 9.5h4" />
        </svg>
      ),
      paragraphs: [
        "Vos modèles de mise en page restent enregistrés avec leurs réglages : les chèques se préparent de façon homogène, d'un cahier à l'autre et d'un mois à l'autre.",
        "La routine de préparation devient documentée dans l'application elle-même, plus de feuille de calcul à côté.",
      ],
    },
  ];

  return (
    <section className="section" aria-labelledby="benefits-heading">
      <div className="container">
        {/* En-tête de Section */}
        <div className="section-head">
          <p className="eyebrow">Bénéfices</p>
          <h2 id="benefits-heading" className="section-title">
            Une gestion des chèques plus simple et plus précise
          </h2>
          <p className="section-lede">
            VCheque centralise les informations de vos chèques et facilite leur
            préparation, leur vérification et leur impression depuis votre
            ordinateur Windows.
          </p>
        </div>

        {/* Grille de 4 Cartes de Valeur */}
        <div className="cards-grid benefits-grid">
          {benefits.map((item, index) => (
            <article key={index} className="card">
              <div className="card-icon" aria-hidden="true">
                {item.icon}
              </div>
              <h3 className="card-title">{item.title}</h3>
              <div className="card-body">
                {item.paragraphs.map((para, pIdx) => (
                  <p key={pIdx}>{para}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
