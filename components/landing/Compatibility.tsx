import React from 'react';

export default function Compatibility() {
  const banks = [
    { code: 'BNA', name: 'Banque Nationale d’Algérie' },
    { code: 'BEA', name: 'Banque Extérieure d’Algérie' },
    { code: 'CPA', name: 'Crédit Populaire d’Algérie' },
    { code: 'BADR', name: 'Banque de l’Agriculture & du Dév. Rural' },
    { code: 'BDL', name: 'Banque de Développement Local' },
    { code: 'CNEP', name: 'CNEP Banque' },
    { code: 'AL BARAKA', name: 'Banque Al Baraka d’Algérie' },
    { code: 'SGA', name: 'Société Générale Algérie' },
    { code: 'BNP', name: 'BNP Paribas El Djazaïr' },
    { code: 'AGB', name: 'Gulf Bank Algeria' },
    { code: 'FRANSABANK', name: 'Fransabank El Djazaïr' },
    { code: 'NATIXIS', name: 'Natixis Algérie' },
    { code: 'ABC', name: 'Arab Banking Corporation' },
    { code: 'HOUSING', name: 'Housing Bank Algeria' },
    { code: 'TRUST', name: 'Trust Bank Algeria' },
    { code: 'ALSALAM', name: 'Al Salam Bank Algeria' },
  ];

  // Duplication de la liste pour assurer un défilement infini sans coupure
  const marqueeList = [...banks, ...banks];

  return (
    <section className="section scroll-mt-10" id="banques" aria-labelledby="banques-heading">
      <span id="compatibilite" className="relative -top-24 block pointer-events-none" aria-hidden="true" />
      <div className="container">
        {/* En-tête centré aux normes du design system */}
        <div className="section-head section-head--center">
          <p className="eyebrow">Interbancaire Algérien</p>
          <h2 id="banques-heading" className="section-title">
            100% compatible avec les banques publiques et privées
          </h2>
          <p className="section-lede">
            Chaque établissement dispose d’un format de carnet spécifique. VCheque intègre
            leurs gabarits exacts et vous permet d’en créer de nouveaux pour vos comptes sur mesure.
          </p>
        </div>
      </div>

      {/* Bande défilante continue sur une seule ligne (marquee allant vers la gauche) */}
      <div className="marquee-wrapper" aria-label="Liste des banques algériennes compatibles">
        <div className="marquee-track">
          {marqueeList.map((b, idx) => (
            <div key={`${b.code}-${idx}`} className="bank-card">
              <span className="bank-badge" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 10 4.5 4h15L21 10" />
                  <path d="M5 10v9h14v-9" />
                  <path d="M9.5 19v-5h5v5" />
                </svg>
              </span>
              <div className="bank-info">
                <span className="bank-code">{b.code}</span>
                <span className="bank-name">{b.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Note de réassurance sous la bande défilante */}
      <div className="container">
        <div className="compat-note" role="note" style={{ marginInline: 'auto' }}>
          <strong>Calibrage universel :</strong> Vous utilisez une banque spécifique ou un chéquier particulier ?
          Notre outil de réglage millimétrique vous permet d’ajuster n’importe quel format en 2 minutes.
        </div>
      </div>
    </section>
  );
}
