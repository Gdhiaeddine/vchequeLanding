import React from 'react';
import type { Metadata } from 'next';
import ContactView from '@/components/contact/ContactView';

export const metadata: Metadata = {
  title: 'Contactez Virtanis & l’Équipe VCheque — Support & Devis Professionnels en Algérie',
  description:
    'Assistance technique, demande de devis multi-postes pour entreprises et cabinets comptables, ou facturation proforma en Dinars Algériens (DZD). Réponse garantie sous 24h ouvrées.',
  keywords: [
    'contact VCheque',
    'support logiciel chèque Algérie',
    'devis multi-postes VCheque',
    'facture proforma VCheque DZD',
    'Virtanis contact',
    'assistance chèque CIB CPA BNA BEA',
  ],
  openGraph: {
    title: 'Contacter Virtanis & l’Équipe VCheque — Support Officiel Algérie',
    description:
      'Une question commerciale, un besoin de déploiement multi-postes ou une assistance technique ? Nos spécialistes vous répondent sous 24h ouvrées.',
    url: 'https://vcheque.com/contact',
    siteName: 'VCheque par Virtanis',
    locale: 'fr_DZ',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contacter Virtanis & l’Équipe VCheque',
    description:
      'Assistance technique et demandes de devis multi-postes en Algérie pour le logiciel d’impression de chèques VCheque.',
  },
  alternates: {
    canonical: 'https://vcheque.com/contact',
  },
};

export default function ContactPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Virtanis & VCheque Algérie',
    description:
      'Assistance technique et relations professionnelles pour le logiciel d’impression de chèques et bordereaux VCheque.',
    url: 'https://vcheque.com/contact',
    mainEntity: {
      '@type': 'Organization',
      name: 'Virtanis Technologies',
      url: 'https://virtanis.net',
      logo: 'https://vcheque.com/icon.svg',
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: 'contact@virtanis.dz',
          availableLanguage: ['French', 'Arabic'],
          hoursAvailable: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
              'Sunday',
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
            ],
            opens: '08:30',
            closes: '17:00',
          },
          areaServed: {
            '@type': 'Country',
            name: 'Algeria',
          },
        },
        {
          '@type': 'ContactPoint',
          contactType: 'sales',
          email: 'contact@virtanis.dz',
          availableLanguage: ['French', 'Arabic'],
          areaServed: 'DZ',
        },
      ],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Alger',
        addressCountry: 'DZ',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactView />
    </>
  );
}
