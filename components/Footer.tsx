import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        {/* Grille principale à 4 colonnes asymétriques */}
        <div className="footer-grid">
          {/* Colonne 1 : Marque & Mission (4fr) */}
          <div className="footer-col footer-col--brand">
            <Link
              href="/"
              className="brand flex items-center gap-3 no-underline hover:no-underline focus:no-underline"
              aria-label="Accueil VCheque"
            >
              <Image
                src="/img/vcheque-icon-128.png"
                alt="VCheque"
                width={40}
                height={40}
                className="brand-mark rounded-[10px]"
              />
              <span className="brand-text">
                <span className="brand-agency font-bold text-xl text-[#122620]">VCheque</span>
              </span>
            </Link>
            <p className="footer-desc">
              VCheque est un logiciel Windows destiné à faciliter la préparation, la personnalisation et l&apos;impression des chèques professionnels.
            </p>
          </div>

          {/* Colonne 2 : Navigation (2fr) */}
          <div className="footer-col">
            <h4 className="footer-title">NAVIGATION</h4>
            <ul>
              <li>
                <Link href="/#fonctionnalites">Fonctionnalités</Link>
              </li>
              <li>
                <Link href="/#compatibilite">Compatibilité</Link>
              </li>
              <li>
                <Link href="/demonstration">Démonstration vidéo</Link>
              </li>
              <li>
                <Link href="/blog">Blog &amp; Actualités</Link>
              </li>
              <li>
                <Link href="/#tarifs">Tarifs</Link>
              </li>
              <li>
                <Link href="/#faq">FAQ</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Assistance (2fr) */}
          <div className="footer-col">
            <h4 className="footer-title">ASSISTANCE</h4>
            <ul>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <Link href="/#faq">Questions fréquentes</Link>
              </li>
              <li>
                <Link href="/#achat">Achat et livraison</Link>
              </li>
              <li>
                <Link href="/#fonctionnement">Mode d&apos;emploi</Link>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Informations Légales (2.4fr) */}
          <div className="footer-col">
            <h4 className="footer-title">INFORMATIONS LÉGALES</h4>
            <ul>
              <li>
                <Link href="/mentions-legales">Mentions légales</Link>
              </li>
              <li>
                <Link href="/politique-de-confidentialite">Politique de confidentialité</Link>
              </li>
              <li>
                <Link href="/conditions-generales-de-vente">Conditions générales de vente</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Barre inférieure de copyright et mentions rapides */}
        <div className="footer-bottom">
          <p className="footer-bottom-copy">
            © {currentYear} Virtanis — Tous droits réservés. •{' '}
            <a
              href="https://virtanis.net"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-bottom-link-virtanis"
            >
              virtanis.net
            </a>
          </p>
          <ul className="footer-bottom-links">
            <li>
              <Link href="/mentions-legales">Mentions légales</Link>
            </li>
            <li>
              <Link href="/politique-de-confidentialite">Confidentialité</Link>
            </li>
            <li>
              <Link href="/conditions-generales-de-vente">CGV</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
