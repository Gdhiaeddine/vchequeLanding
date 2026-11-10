import React from 'react';

export default function Compatibility() {
  const banks = [
    { code: 'BNA', name: 'Banque Nationale d’Algérie', logo: '/assets/bna-logo.webp' },
    { code: 'BEA', name: 'Banque Extérieure d’Algérie', logo: '/assets/bea-logo.webp' },
    { code: 'CPA', name: 'Crédit Populaire d’Algérie', logo: '/assets/cpa-logo.webp' },
    { code: 'BADR', name: 'Banque de l’Agriculture & du Dév. Rural', logo: '/assets/badr-logo.webp' },
    { code: 'BDL', name: 'Banque de Développement Local', logo: '/assets/bdl-logo.webp' },
    { code: 'CNEP', name: 'CNEP Banque', logo: '/assets/cnep-logo.webp' },
    { code: 'AL BARAKA', name: 'Banque Al Baraka d’Algérie', logo: '/assets/albaraka-logo.webp' },
    { code: 'SGA', name: 'Société Générale Algérie', logo: '/assets/sga-logo.webp' },
    { code: 'BNP', name: 'BNP Paribas El Djazaïr', logo: '/assets/bnp-logo.webp' },
    { code: 'AGB', name: 'Gulf Bank Algeria', logo: '/assets/agb-logo.webp' },
    { code: 'FRANSABANK', name: 'Fransabank El Djazaïr', logo: '/assets/fransa-bank-logo.webp' },
    { code: 'NATIXIS', name: 'Natixis Algérie', logo: '/assets/natixis-logo.webp' },
    { code: 'ABC', name: 'Arab Banking Corporation (Bank ABC)', logo: '/assets/abc-logo.webp' },
    { code: 'HOUSING', name: 'Housing Bank Algeria', logo: '/assets/housing-bank.webp' },
    { code: 'TRUST', name: 'Trust Bank Algeria', logo: '/assets/trust-logo.webp' },
    { code: 'ALSALAM', name: 'Al Salam Bank Algeria', logo: '/assets/salam-logo.webp' },
    { code: 'CCP', name: 'Algérie Poste (Chèques Postaux)', logo: '/assets/ccp-logo.webp' },
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

      {/* Bande défilante continue sans rectangle de fond */}
      <div className="marquee-wrapper" aria-label="Liste des banques algériennes compatibles">
        <div className="marquee-track">
          {marqueeList.map((b, idx) => (
            <div
              key={`${b.code}-${idx}`}
              className="bank-logo-item"
              title={`${b.name} (${b.code})`}
              aria-label={`${b.name} (${b.code})`}
            >
              <img
                src={b.logo}
                alt={`${b.name} (${b.code})`}
                className="bank-logo-img"
                loading="lazy"
                decoding="async"
                width={120}
                height={50}
              />
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
