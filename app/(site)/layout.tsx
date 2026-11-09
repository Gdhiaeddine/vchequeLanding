import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a className="skip-link sr-only focus:not-sr-only focus:p-4 focus:bg-white focus:text-black focus:absolute focus:z-50" href="#contenu">
        Aller au contenu principal
      </a>
      <Navbar />
      <main id="contenu" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
