import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  AlertTriangle,
  Mail,
  ShoppingBag,
  ExternalLink,
  Lock,
  FileText,
  Landmark,
  Scale,
  Cpu,
  CreditCard,
  UserCheck,
  Server,
  HelpCircle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mentions Légales & Cadre Réglementaire — VCheque Algérie',
  description:
    'Informations légales, cadre réglementaire algérien (Lois 18-05 et 18-07), propriété intellectuelle, système de licence Ed25519 et conditions d’utilisation de VCheque.',
  keywords: [
    'mentions légales VCheque',
    'éditeur Virtanis Algérie',
    'loi 18-05 commerce électronique',
    'loi 18-07 protection données ANPDP',
    'licence logiciel chèque Algérie',
    'chèque bancaire CIB Edahabia',
  ],
  alternates: {
    canonical: 'https://vcheque.com/mentions-legales',
  },
};

const BANK_LIST = [
  { name: "BNA", label: "Banque Nationale d'Algérie" },
  { name: "BEA", label: "Banque Extérieure d'Algérie" },
  { name: "CPA", label: "Crédit Populaire d'Algérie" },
  { name: "BDL", label: "Banque de Développement Local" },
  { name: "BADR", label: "Banque de l'Agriculture et du D.R." },
  { name: "CNEP", label: "CNEP Banque" },
  { name: "Al Baraka", label: "Banque Al Baraka d'Algérie" },
  { name: "AGB", label: "Gulf Bank Algérie" },
  { name: "Société Générale", label: "Société Générale Algérie" },
  { name: "BNP Paribas", label: "BNP Paribas El Djazaïr" },
  { name: "Natixis", label: "Natixis Algérie" },
  { name: "Fransabank / Housing", label: "Housing Bank / Fransabank" },
  { name: "Algérie Poste", label: "Chèques Postaux (CCP)" },
];

export default function MentionsLegalesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Mentions Légales — VCheque',
    description:
      'Cadre légale et réglementaire régissant l’édition, la commercialisation et l’utilisation du logiciel VCheque en Algérie.',
    publisher: {
      '@type': 'Organization',
      name: 'Virtanis Technologies',
      url: 'https://virtanis.net',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. HERO HEADER JURIDIQUE */}
      <header className="legal-hero" aria-labelledby="legal-main-title">
        <div className="legal-hero-inner">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#B99A5A] mb-2 font-sans">
            CADRE JURIDIQUE &amp; RÉGLEMENTAIRE
          </p>

          <h1 id="legal-main-title" className="legal-hero-title">
            Mentions Légales
          </h1>

          <p className="legal-hero-lede">
            Informations légales relatives à l&apos;éditeur du site, aux conditions d&apos;utilisation du logiciel{' '}
            <strong className="text-[#102C25]">VCheque</strong> et aux dispositions réglementaires régissant nos
            activités en <strong className="text-[#102C25]">République Algérienne Démocratique et Populaire</strong>.
          </p>

          <div className="legal-hero-meta">
            <span className="legal-meta-badge">
              <ShieldCheck size={16} className="text-[#102C25]" aria-hidden="true" />
              <span>Lois n° 18-05 &amp; 18-07</span>
            </span>

            <span className="legal-meta-dot" aria-hidden="true">•</span>

            <span>Dernière mise à jour : 28 Octobre 2026</span>

            <span className="legal-meta-dot" aria-hidden="true">•</span>

            <span>Juridiction : Alger, Algérie</span>
          </div>
        </div>
      </header>

      {/* 2. GRILLE PRINCIPALE (SOMMAIRE ADHÉRENT + 10 ARTICLES) */}
      <div className="legal-layout-wrap">
        <div className="legal-layout">
          {/* COLONNE GAUCHE : SOMMAIRE ADHÉRENT (STICKY) */}
          <aside className="legal-toc-wrapper" aria-label="Navigation dans les mentions légales">
            <nav className="legal-toc">
              <h2 className="legal-toc-title">SOMMAIRE DES ARTICLES</h2>
              <ol className="legal-toc-list">
                <li>
                  <a href="#article-1" className="legal-toc-link">
                    1. Éditeur de la Solution
                  </a>
                </li>
                <li>
                  <a href="#article-2" className="legal-toc-link">
                    2. Cadre Légal Algérien
                  </a>
                </li>
                <li>
                  <a href="#article-3" className="legal-toc-link">
                    3. Nature &amp; Responsabilité
                  </a>
                </li>
                <li>
                  <a href="#article-4" className="legal-toc-link">
                    4. Propriété Intellectuelle
                  </a>
                </li>
                <li>
                  <a href="#article-5" className="legal-toc-link">
                    5. Licences &amp; Ed25519
                  </a>
                </li>
                <li>
                  <a href="#article-6" className="legal-toc-link">
                    6. Transactions &amp; DZD
                  </a>
                </li>
                <li>
                  <a href="#article-7" className="legal-toc-link">
                    7. Données Personnelles (18-07)
                  </a>
                </li>
                <li>
                  <a href="#article-8" className="legal-toc-link">
                    8. Hébergement &amp; Sécurité
                  </a>
                </li>
                <li>
                  <a href="#article-9" className="legal-toc-link">
                    9. Droit &amp; Juridiction
                  </a>
                </li>
                <li>
                  <a href="#article-10" className="legal-toc-link">
                    10. Contact &amp; Assistance
                  </a>
                </li>
              </ol>
            </nav>
          </aside>

          {/* COLONNE DROITE : CONTENU DES 10 ARTICLES */}
          <main className="legal-content">
            {/* AVERTISSEMENT PRÉLIMINAIRE BANCAIRE */}
            <aside className="legal-notice-box" role="note" aria-label="Avertissement bancaire important">
              <AlertTriangle size={24} className="legal-notice-icon" aria-hidden="true" />
              <div className="legal-notice-text">
                <strong>Rappel bancaire essentiel :</strong> Le logiciel <em>VCheque</em> constitue exclusivement un
                outil bureautique d&apos;assistance mécanique au calibrage d&apos;impression et à la transcription en
                lettres des montants. Conformément au Code de commerce algérien, l&apos;existence de la provision
                préalable et disponible, ainsi que l&apos;apposition de la signature manuscrite authentique sur chaque
                formule de chèque, relèvent de la responsabilité personnelle, civile et pénale exclusive du tireur.
              </div>
            </aside>

            {/* ARTICLE 1 : ÉDITEUR DE LA SOLUTION */}
            <section id="article-1" className="legal-section">
              <header className="legal-section-header">
                <span className="legal-article-num">01</span>
                <h2 className="legal-section-title">Éditeur de la Solution VCheque</h2>
              </header>
              <div className="legal-section-body">
                <p>
                  Le site internet accessible à l&apos;adresse <strong>https://vcheque.com</strong> (ci-après « le Site »)
                  ainsi que le logiciel applicatif bureautique pour Windows <strong>VCheque</strong> sont conçus, développés,
                  édités et exploités par la structure professionnelle <strong>Virtanis</strong>.
                </p>

                <div className="legal-info-card">
                  <div className="legal-info-row">
                    <span className="legal-info-label">Dénomination commerciale :</span>
                    <span className="legal-info-val">Virtanis Technologies</span>
                  </div>
                  <div className="legal-info-row">
                    <span className="legal-info-label">Nature de l&apos;activité :</span>
                    <span className="legal-info-val">Conception, édition, développement et distribution de logiciels</span>
                  </div>
                  <div className="legal-info-row">
                    <span className="legal-info-label">Implantation :</span>
                    <span className="legal-info-val">Alger, République Algérienne Démocratique et Populaire</span>
                  </div>
                  <div className="legal-info-row">
                    <span className="legal-info-label">Portail institutionnel :</span>
                    <span className="legal-info-val">
                      <a href="https://virtanis.net" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[#102C25] hover:text-[#B99A5A] transition-colors">
                        <span>https://virtanis.net</span>
                        <ExternalLink size={12} aria-hidden="true" />
                      </a>
                    </span>
                  </div>
                  <div className="legal-info-row">
                    <span className="legal-info-label">Adresse électronique de contact :</span>
                    <span className="legal-info-val">
                      <a href="mailto:contact@virtanis.net" className="text-[#102C25] hover:text-[#B99A5A] transition-colors">
                        contact@virtanis.net
                      </a>
                    </span>
                  </div>
                </div>

                <p>
                  La direction de la publication et la responsabilité éditoriale de la plateforme sont assurées par
                  l&apos;équipe de direction technique de Virtanis.
                </p>
              </div>
            </section>

            {/* ARTICLE 2 : CADRE LÉGAL & RÉGLEMENTATION ALGÉRIENNE */}
            <section id="article-2" className="legal-section">
              <header className="legal-section-header">
                <span className="legal-article-num">02</span>
                <h2 className="legal-section-title">Cadre Légal &amp; Réglementation Algérienne</h2>
              </header>
              <div className="legal-section-body">
                <p>
                  L&apos;ensemble des prestations d&apos;édition logicielle, de distribution en ligne et de services associés
                  proposés par Virtanis s&apos;exécute en stricte conformité avec le corpus législatif et réglementaire
                  en vigueur en Algérie :
                </p>

                <ul className="legal-gold-list">
                  <li className="legal-gold-item">
                    <span className="legal-gold-bullet" aria-hidden="true" />
                    <div>
                      <strong className="text-[#102C25]">Loi n° 18-05 du 10 mai 2018 relative au commerce électronique :</strong> Régissant
                      l&apos;activité d&apos;e-fournisseur, la transparence des offres commerciales en ligne, la protection du cyberconsommateur,
                      la facturation électronique et les règlements par instruments monétiques certifiés en monnaie nationale (Dinars Algériens).
                    </div>
                  </li>
                  <li className="legal-gold-item">
                    <span className="legal-gold-bullet" aria-hidden="true" />
                    <div>
                      <strong className="text-[#102C25]">Loi n° 18-07 du 10 juin 2018 relative à la protection des personnes physiques dans le traitement des données à caractère personnel :</strong> Garantissant
                      les droits fondamentaux des utilisateurs, la licéité des traitements et le respect des directives de l&apos;Autorité Nationale de Protection des Données à Caractère Personnel (ANPDP).
                    </div>
                  </li>
                  <li className="legal-gold-item">
                    <span className="legal-gold-bullet" aria-hidden="true" />
                    <div>
                      <strong className="text-[#102C25]">Ordonnance n° 03-05 du 19 juillet 2003 relative aux droits d&apos;auteur et aux droits voisins :</strong> Protégeant
                      les créations de l&apos;esprit, les codes sources, architectures logicielles et documentations associées sous le contrôle de l&apos;Office National des Droits d&apos;Auteur et des Droits Voisins (ONDA).
                    </div>
                  </li>
                  <li className="legal-gold-item">
                    <span className="legal-gold-bullet" aria-hidden="true" />
                    <div>
                      <strong className="text-[#102C25]">Code de commerce algérien (Ordonnance n° 75-59 modifiée et complétée) :</strong> Notamment
                      ses articles 472 et suivants, définissant les mentions obligatoires, les règles impératives de création, de validité,
                      de provision et d&apos;endossement des chèques bancaires et postaux.
                    </div>
                  </li>
                </ul>
              </div>
            </section>

            {/* ARTICLE 3 : NATURE DU LOGICIEL & RESPONSABILITÉ BANCAIRE */}
            <section id="article-3" className="legal-section">
              <header className="legal-section-header">
                <span className="legal-article-num">03</span>
                <h2 className="legal-section-title">Nature du Logiciel &amp; Responsabilité Bancaire</h2>
              </header>
              <div className="legal-section-body">
                <p>
                  <strong>VCheque</strong> est un logiciel bureautique professionnel conçu pour fonctionner sous environnement
                  Microsoft Windows. Sa fonction exclusive réside dans l&apos;assistance mécanique à l&apos;alignement millimétrique,
                  au positionnement des champs textuels et à la conversion automatique des montants chiffrés en toutes lettres
                  (en langue française et arabe) sur les formules de chèques et bordereaux d&apos;encaissement fournis par les établissements
                  financiers algériens.
                </p>

                <h3 className="text-sm font-bold text-[#102C25] uppercase tracking-wider mt-4 mb-2">
                  Établissements bancaires et postaux pris en charge :
                </h3>

                <div className="legal-banks-grid" role="list">
                  {BANK_LIST.map((bank, index) => (
                    <div key={index} className="legal-bank-pill" role="listitem">
                      <Landmark size={15} className="legal-bank-icon" aria-hidden="true" />
                      <div>
                        <span className="block text-[#102C25] font-bold">{bank.name}</span>
                        <span className="text-[11px] text-[#556660] font-normal leading-tight">{bank.label}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-4">
                  <strong>Clause d&apos;absence de substitution bancaire :</strong> Virtanis n&apos;est en aucun cas un établissement
                  de crédit, une banque ou un intermédiaire en opérations bancaires. Le logiciel VCheque n&apos;interagit avec aucun compte
                  bancaire, ne télétransmet aucun ordre de virement et ne valide aucune opération de compensation. L&apos;utilisateur
                  assume l&apos;entière responsabilité du contrôle de l&apos;exactitude des données saisies avant impression physique,
                  de l&apos;approvisionnement préalable du compte débité et de la sécurité physique de ses chéquiers.
                </p>
              </div>
            </section>

            {/* ARTICLE 4 : PROPRIÉTÉ INTELLECTUELLE & DROITS D'AUTEUR */}
            <section id="article-4" className="legal-section">
              <header className="legal-section-header">
                <span className="legal-article-num">04</span>
                <h2 className="legal-section-title">Propriété Intellectuelle &amp; Droits d&apos;Auteur</h2>
              </header>
              <div className="legal-section-body">
                <p>
                  L&apos;ensemble des éléments constitutifs du site web et du logiciel VCheque — incluant sans limitation les codes sources
                  (Rust, TypeScript, C++, PHP), les binaires exécutables, les gabarits vectoriels de chèques bancaires, les algorithmes de
                  calibrage, les bases de données, l&apos;identité visuelle, les logos, la documentation technique et les guides d&apos;utilisation —
                  sont la propriété intellectuelle exclusive de <strong>Virtanis</strong> et sont protégés par la législation algérienne
                  (ONDA) et les conventions internationales régissant la propriété littéraire et artistique.
                </p>

                <p>
                  L&apos;acquisition d&apos;une licence VCheque confère exclusivement à l&apos;acheteur un <strong>droit d&apos;utilisation personnel,
                  permanent, non-exclusif et non-transférable</strong> sur le nombre de postes de travail spécifié lors de la souscription.
                </p>

                <p>
                  Sont strictement prohibés sous peine de poursuites civiles et pénales : toute décompilation, désassemblage, ingénierie inverse,
                  modification non autorisée des binaires, contournement des protections cryptographiques, reproduction non autorisée, mise à
                  disposition du public, revente ou sous-licenciation sans l&apos;accord exprès écrit de Virtanis.
                </p>
              </div>
            </section>

            {/* ARTICLE 5 : SYSTÈME DE LICENCES & SIGNATURE ED25519 */}
            <section id="article-5" className="legal-section">
              <header className="legal-section-header">
                <span className="legal-article-num">05</span>
                <h2 className="legal-section-title">Système de Licences &amp; Signature Cryptographique Ed25519</h2>
              </header>
              <div className="legal-section-body">
                <p>
                  L&apos;authenticité, la pérennité et la sécurité de chaque copie de VCheque sont garanties par un moteur de licence
                  asymétrique de haute sécurité reposant sur la courbe cryptographique <strong>Edwards25519 (Ed25519)</strong> :
                </p>

                <ul className="legal-gold-list">
                  <li className="legal-gold-item">
                    <span className="legal-gold-bullet" aria-hidden="true" />
                    <div>
                      <strong className="text-[#102C25]">Liaison matérielle (Machine ID) :</strong> Lors de la première activation,
                      une empreinte cryptographique unidirectionnelle (hachage SHA-256) des composants matériels de la machine hôte
                      est calculée afin d&apos;associer la clé de licence au poste de travail autorisé, prévenant toute duplication frauduleuse.
                    </div>
                  </li>
                  <li className="legal-gold-item">
                    <span className="legal-gold-bullet" aria-hidden="true" />
                    <div>
                      <strong className="text-[#102C25]">Fonctionnement 100% hors-ligne (Air-Gapped) :</strong> Une fois la licence
                      validée, le logiciel fonctionne en totale autonomie sans requérir aucune connexion à Internet. Aucune télémétrie
                      périodique n&apos;est exigée, garantissant un usage pérenne même sur des postes bancaires isolés du réseau.
                    </div>
                  </li>
                  <li className="legal-gold-item">
                    <span className="legal-gold-bullet" aria-hidden="true" />
                    <div>
                      <strong className="text-[#102C25]">Procédure de transfert de poste :</strong> En cas de renouvellement de parc,
                      de panne matérielle ou de réinstallation du système d&apos;exploitation, le client peut solliciter auprès de l&apos;assistance
                      Virtanis la réinitialisation de son empreinte machine sur présentation de sa facture officielle acquittée.
                    </div>
                  </li>
                </ul>
              </div>
            </section>

            {/* ARTICLE 6 : TRANSACTIONS & PAIEMENT ÉLECTRONIQUE EN DZD */}
            <section id="article-6" className="legal-section">
              <header className="legal-section-header">
                <span className="legal-article-num">06</span>
                <h2 className="legal-section-title">Transactions &amp; Paiement Électronique en DZD</h2>
              </header>
              <div className="legal-section-body">
                <p>
                  Conformément à la Loi n° 18-05 relative au commerce électronique, l&apos;ensemble des prix et transactions
                  sur la plateforme VCheque est libellé et facturé exclusivement en <strong>Dinars Algériens (DZD)</strong>,
                  toutes taxes comprises (TTC).
                </p>

                <p>
                  Les règlements en ligne sont traités par l&apos;intermédiaire de passerelles de paiement certifiées par le GIE Monétique
                  et la société SATIM (via la plateforme de paiement en ligne <strong>SlickPay</strong>), acceptant les cartes interbancaires
                  algériennes (<strong>CIB</strong>) et la carte <strong>Edahabia</strong> d&apos;Algérie Poste. Les règlements par virement
                  bancaire ou chèque d&apos;entreprise sont également disponibles sur devis proforma pour les personnes morales.
                </p>

                <p>
                  La transmission des données bancaires s&apos;effectue via des protocoles de chiffrement haute sécurité (TLS 1.3).
                  Virtanis ne conserve et n&apos;a accès à aucun moment aux numéros complets de cartes bancaires ou codes secrets des clients.
                </p>
              </div>
            </section>

            {/* ARTICLE 7 : PROTECTION DES DONNÉES PERSONNELLES (LOI 18-07) */}
            <section id="article-7" className="legal-section">
              <header className="legal-section-header">
                <span className="legal-article-num">07</span>
                <h2 className="legal-section-title">Protection des Données Personnelles (Loi 18-07)</h2>
              </header>
              <div className="legal-section-body">
                <p>
                  Virtanis accorde une importance primordiale au respect de la vie privée de ses clients et utilisateurs.
                  Les traitements de données mis en œuvre sur le Site et au sein des services en ligne sont strictement régis
                  par les dispositions de la <strong>Loi n° 18-07 du 10 juin 2018</strong> sous le contrôle de l&apos;ANPDP :
                </p>

                <ul className="legal-gold-list">
                  <li className="legal-gold-item">
                    <span className="legal-gold-bullet" aria-hidden="true" />
                    <div>
                      <strong className="text-[#102C25]">Données de facturation et de commande :</strong> Les informations recueillies
                      (nom, prénom, raison sociale, adresse électronique, numéro de téléphone, wilaya) sont collectées aux seules fins
                      d&apos;exécution du contrat de licence, d&apos;émission de la facture légale et d&apos;assistance technique.
                    </div>
                  </li>
                  <li className="legal-gold-item">
                    <span className="legal-gold-bullet" aria-hidden="true" />
                    <div>
                      <strong className="text-[#102C25]">Garantie de confidentialité locale absolue :</strong> Toutes les données bancaires
                      relatives aux chèques rédigés (identités des bénéficiaires, montants émis, historiques d&apos;impression) demeurent
                      stockées <strong className="text-[#102C25]">exclusivement et localement sur l&apos;ordinateur de l&apos;utilisateur</strong>.
                      Aucune donnée financière confidentielle n&apos;est transmise, sauvegardée ou accessible par Virtanis.
                    </div>
                  </li>
                  <li className="legal-gold-item">
                    <span className="legal-gold-bullet" aria-hidden="true" />
                    <div>
                      <strong className="text-[#102C25]">Exercice de vos droits :</strong> Conformément aux articles 32 à 35 de la
                      Loi 18-07, tout client bénéficie d&apos;un droit d&apos;accès, de rectification, d&apos;opposition et de suppression
                      des données le concernant. Ces droits peuvent être exercés en adressant une demande écrite à :{' '}
                      <a href="mailto:contact@virtanis.net" className="text-[#102C25] font-bold hover:text-[#B99A5A]">contact@virtanis.net</a>.
                    </div>
                  </li>
                </ul>
              </div>
            </section>

            {/* ARTICLE 8 : HÉBERGEMENT & SÉCURITÉ DES DONNÉES */}
            <section id="article-8" className="legal-section">
              <header className="legal-section-header">
                <span className="legal-article-num">08</span>
                <h2 className="legal-section-title">Hébergement &amp; Sécurité des Données</h2>
              </header>
              <div className="legal-section-body">
                <p>
                  Les infrastructures serveur hébergeant le site web officiel VCheque, les dépôts d&apos;installateurs et l&apos;API de
                  délivrance des clés de licence sont déployées au sein de centres de données hautement sécurisés bénéficiant de certifications
                  industrielles de premier plan (ISO/IEC 27001, SOC 2 Type II).
                </p>

                <p>
                  Les dispositifs de protection intègrent un filtrage anti-DDoS permanent, une isolation réseau stricte, un chiffrement
                  au repos (AES-256) de la base de données PostgreSQL, ainsi qu&apos;une politique d&apos;accès à privilèges moindres
                  verrouillée par authentification multifacteur à double facteur (2FA TOTP RFC 6238).
                </p>
              </div>
            </section>

            {/* ARTICLE 9 : DROIT APPLICABLE & JURIDICTION COMPÉTENTE */}
            <section id="article-9" className="legal-section">
              <header className="legal-section-header">
                <span className="legal-article-num">09</span>
                <h2 className="legal-section-title">Droit Applicable &amp; Juridiction Compétente</h2>
              </header>
              <div className="legal-section-body">
                <p>
                  Les présentes mentions légales, les conditions d&apos;utilisation du site ainsi que tout contrat de licence afférent
                  au logiciel VCheque sont exclusivement régis et interprétés conformément aux <strong>lois et règlements de la
                  République Algérienne Démocratique et Populaire</strong>.
                </p>

                <p>
                  En cas de litige, réclamation ou différend relatif à la validité, l&apos;interprétation ou l&apos;exécution des présentes,
                  les parties s&apos;engagent à rechercher préalablement une solution amiable dans un délai de trente (30) jours ouvrés.
                </p>

                <p>
                  À défaut de règlement amiable, compétence exclusive et expresse est attribuée aux{' '}
                  <strong className="text-[#102C25]">juridictions compétentes territorialement et matériellement relevant de la
                  Cour d&apos;Alger (Algérie)</strong>, nonobstant pluralité de défendeurs ou appel en garantie.
                </p>
              </div>
            </section>

            {/* ARTICLE 10 : CONTACT & ASSISTANCE RÉGLEMENTAIRE */}
            <section id="article-10" className="legal-section">
              <header className="legal-section-header">
                <span className="legal-article-num">10</span>
                <h2 className="legal-section-title">Contact &amp; Assistance Réglementaire</h2>
              </header>
              <div className="legal-section-body">
                <p>
                  Pour toute interrogation relative aux présentes mentions légales, à la conformité de vos déploiements
                  ou pour solliciter une facture proforma certifiée, nos conseillers et juristes restent à votre entière disposition :
                </p>

                <div className="legal-action-group">
                  <Link
                    href="/commander"
                    className="legal-btn-primary"
                  >
                    <ShoppingBag size={16} aria-hidden="true" />
                    <span>Commander une licence VCheque</span>
                  </Link>

                  <Link
                    href="/contact"
                    className="legal-btn-secondary"
                  >
                    <Mail size={16} aria-hidden="true" />
                    <span>Contacter</span>
                  </Link>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
