import React from 'react';

export default function TrustStrip() {
  const items = [
    {
      title: 'Montants en lettres',
      text: 'Conversion des montants en français.',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-[19px] h-[19px]"
          aria-hidden="true"
        >
          <path d="M4 6.5h7M7.5 6.5V5M4 14h9M8 14v-1.6" />
          <path d="m14 14.5 3.5-9h2.5l3.5 9M15.6 11.6h4.6" />
        </svg>
      ),
    },
    {
      title: 'Calibrage précis',
      text: 'Réglage des positions en millimètres.',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          className="w-[19px] h-[19px]"
          aria-hidden="true"
        >
          <rect x="2.5" y="8" width="19" height="7.5" rx="1.5" />
          <path d="M6 8v3M9 8v2.2M12 8v3M15 8v2.2M18 8v3" />
        </svg>
      ),
    },
    {
      title: 'Modèles bancaires',
      text: 'Configuration adaptée aux formats de chèques.',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-[19px] h-[19px]"
          aria-hidden="true"
        >
          <rect x="3.5" y="4" width="17" height="6" rx="1.2" />
          <rect x="3.5" y="14" width="10" height="6" rx="1.2" />
          <path d="M17.5 14h3v6h-3z" />
        </svg>
      ),
    },
    {
      title: 'Application Windows',
      text: 'Utilisation sur ordinateur.',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          className="w-[19px] h-[19px]"
          aria-hidden="true"
        >
          <rect x="3" y="4.5" width="18" height="12.5" rx="1.6" />
          <path d="M9 20.5h6M12 17v3.5" />
        </svg>
      ),
    },
  ];

  return (
    <section className="trust-strip" aria-label="Atouts principaux de VCheque">
      <div className="container trust-grid">
        {items.map((item, index) => (
          <div key={index} className="trust-item">
            <span className="trust-icon" aria-hidden="true">
              {item.icon}
            </span>
            <div>
              <span className="trust-title">{item.title}</span>
              <span className="trust-text">{item.text}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
