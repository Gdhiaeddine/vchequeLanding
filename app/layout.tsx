import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VCheque — Logiciel professionnel d’impression de chèques en Algérie',
  description:
    'Remplissez et imprimez vos chèques bancaires algériens (BNA, CPA, BEA, BADR, BDL...) en toute précision. Conversion automatique des montants en lettres françaises.',
  icons: {
    icon: '/img/vcheque-icon-32.png',
    apple: '/img/vcheque-icon-256.png',
  },
  openGraph: {
    title: 'VCheque — Logiciel d’impression de chèques en Algérie',
    description:
      'Gagnez du temps et évitez les erreurs de remplissage de chèques avec VCheque.',
    url: 'https://vcheque.virtanis.net',
    siteName: 'VCheque',
    locale: 'fr_DZ',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
