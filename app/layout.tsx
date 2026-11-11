import type { Metadata } from 'next';
import './globals.css';

const siteUrl = 'https://vcheque.virtanis.net';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Remplir et Imprimer un Chèque Bancaire Facilement — Logiciel VCheque',
    template: '%s | VCheque',
  },
  description:
    'Logiciel Windows pour remplir chèque et imprimer sur le chèque bancaire avec une imprimante ordinaire. Remplissage automatique en lettres françaises, gabarits conformes banques algériennes (BNA, CPA, BEA, BADR, BDL, CCP).',
  keywords: [
    'remplir cheque',
    'imprimer cheque',
    'imprimer sur le cheque',
    'impression le cheque',
    'impression cheque',
    'logiciel pour imprimer sur cheque',
    'comment imprimer un cheque',
    'remplir un cheque en ligne',
    'logiciel impression cheque algerie',
    'imprimer sur un cheque bancaire',
    'ecrire sur un cheque',
    'remplir cheque bna',
    'remplir cheque cpa',
    'remplir cheque bea',
    'remplir cheque ccp algerie',
    'conversion montant cheque en lettres',
    'calibrage imprimante cheque',
  ],
  authors: [{ name: 'Virtanis Algérie', url: 'https://virtanis.net' }],
  creator: 'Virtanis',
  publisher: 'Virtanis',
  applicationName: 'VCheque',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: '/img/vcheque-icon-32.png',
    apple: '/img/vcheque-icon-256.png',
  },
  openGraph: {
    title: 'Remplir et Imprimer un Chèque Bancaire — Logiciel VCheque',
    description:
      'Remplissez vos chèques en 10 secondes et imprimez directement sur le chèque avec votre imprimante bureautique. Zéro rature, montants convertis en lettres automatiquement.',
    url: siteUrl,
    siteName: 'VCheque par Virtanis',
    locale: 'fr_DZ',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/img/vcheque-icon-256.png`,
        width: 256,
        height: 256,
        alt: 'Logiciel VCheque pour remplir et imprimer les chèques',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Remplir et Imprimer un Chèque Bancaire — VCheque',
    description:
      'Logiciel pour remplir et imprimer sur le chèque bancaire avec votre imprimante ordinaire.',
    images: [`${siteUrl}/img/vcheque-icon-256.png`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'VCheque',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Windows 11, Windows 10 (64-bit)',
        offers: {
          '@type': 'Offer',
          price: '8500',
          priceCurrency: 'DZD',
          availability: 'https://schema.org/InStock',
        },
        description:
          'Logiciel professionnel pour remplir et imprimer sur le chèque bancaire. Calibrage millimétrique et conversion des montants en lettres pour toutes les banques.',
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          ratingCount: '128',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Virtanis',
          url: 'https://virtanis.net',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'VCheque — Impression et Remplissage de Chèques',
        description:
          'Solution complète pour remplir un chèque et imprimer sur le chèque avec une imprimante classique.',
        inLanguage: 'fr-DZ',
      },
    ],
  };

  return (
    <html lang="fr" className="js">
      <head>
        <link
          rel="preload"
          href="/fonts/space-grotesk-latin-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/dm-serif-display-latin-w0xu1co7.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
