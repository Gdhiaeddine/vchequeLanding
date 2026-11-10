import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Cpu,
  RefreshCw,
  AlertCircle,
  FileText,
  Mail,
  HelpCircle,
  CreditCard,
  Building,
  Key,
  Scale,
  Zap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente (CGV) — VCheque Algérie',
  description:
    'Clauses contractuelles régissant la commande, les licences permanentes Ed25519 (1 PC/licence), les paiements DZD via SlickPay (CIB / Edahabia) et la Loi 18-05.',
  keywords: [
    'CGV VCheque',
    'conditions générales de vente logiciel chèque',
    'loi 18-05 commerce électronique Algérie',
    'licence permanente chèque DZD',
    'SlickPay CIB Edahabia',
  ],
  alternates: {
    canonical: 'https://vcheque.com/conditions-generales-de-vente',
  },
};

export default function CgvPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Conditions Générales de Vente — VCheque',
    description:
      'Conditions contractuelles régissant les commandes de licences d’exploitation du logiciel VCheque éditées par Virtanis en Algérie.',
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

      {/* 1. HERO HEADER CGV */}
      <header className="legal-hero" aria-labelledby="cgv-main-title">
        <div className="legal-hero-inner">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#B99A5A] mb-2 font-sans">
            CONDITIONS CONTRACTUELLES &amp; VENTE EN LIGNE
          </p>

          <h1 id="cgv-main-title" className="legal-hero-title">
            Conditions Générales de Vente
          </h1>

          <p className="legal-hero-lede">
            Régissant les commandes, la délivrance des licences d&apos;exploitation commerciales du logiciel{' '}
            <strong className="text-[#102C25]">VCheque</strong> et les règlements en monnaie nationale (DZD), conformément
            à la <strong className="text-[#102C25]">Loi n° 18-05</strong> relative au commerce électronique en Algérie.
          </p>

          <div className="legal-hero-meta">
            <span className="legal-meta-badge">
              <ShoppingBag size={16} className="text-[#102C25]" aria-hidden="true" />
              <span>Loi n° 18-05 Commerce Électronique</span>
            </span>

            <span className="legal-meta-dot" aria-hidden="true">•</span>

            <span>Dernière mise à jour : 28 Octobre 2026</span>

            <span className="legal-meta-dot" aria-hidden="true">•</span>

            <span className="font-semibold text-[#102C25]">
              Monnaie légale : Dinar Algérien (DZD)
            </span>
          </div>
        </div>
      </header>

      {/* 2. GRILLE PRINCIPALE (SOMMAIRE ADHÉRENT + 12 CLAUSES) */}
      <div className="legal-layout-wrap">
        <div className="legal-layout">
          {/* COLONNE GAUCHE : SOMMAIRE ADHÉRENT (STICKY) */}
          <aside className="legal-toc-wrapper" aria-label="Sommaire des clauses contractuelles">
            <nav className="legal-toc">
              <h2 className="legal-toc-title">SOMMAIRE DES CLAUSES</h2>
              <ol className="legal-toc-list">
                <li>
                  <a href="#cgv-1" className="legal-toc-link">
                    1. Dispositions &amp; E-Fournisseur
                  </a>
                </li>
                <li>
                  <a href="#cgv-2" className="legal-toc-link">
                    2. Objet &amp; Produit VCheque
                  </a>
                </li>
                <li>
                  <a href="#cgv-3" className="legal-toc-link">
                    3. Commande &amp; Double Clic
                  </a>
                </li>
                <li>
                  <a href="#cgv-4" className="legal-toc-link">
                    4. Prix en Dinars (DZD)
                  </a>
                </li>
                <li>
                  <a href="#cgv-5" className="legal-toc-link">
                    5. Paiement Sécurisé SlickPay
                  </a>
                </li>
                <li>
                  <a href="#cgv-6" className="legal-toc-link">
                    6. Délivrance &amp; Ed25519
                  </a>
                </li>
                <li>
                  <a href="#cgv-7" className="legal-toc-link">
                    7. Règle « 1 PC / Licence »
                  </a>
                </li>
                <li>
                  <a href="#cgv-8" className="legal-toc-link">
                    8. Transfert de Machine
                  </a>
                </li>
                <li>
                  <a href="#cgv-9" className="legal-toc-link">
                    9. Droit de Rétractation (Art. 17)
                  </a>
                </li>
                <li>
                  <a href="#cgv-10" className="legal-toc-link">
                    10. Garantie, Support &amp; Updates
                  </a>
                </li>
                <li>
                  <a href="#cgv-11" className="legal-toc-link">
                    11. Responsabilité &amp; Banques
                  </a>
                </li>
                <li>
                  <a href="#cgv-12" className="legal-toc-link">
                    12. Droit &amp; Juridiction Alger
                  </a>
                </li>
              </ol>
            </nav>
          </aside>

          {/* COLONNE DROITE : CONTENU DES 12 CLAUSES */}
          <main className="legal-content">
            {/* ENCADRÉ RÉCAPITULATIF DE LICENCE PERMANENTE */}
            <aside
              className="legal-notice-box"
              role="region"
              aria-label="Contrat de licence commerciale permanente"
            >
              <ShieldCheck size={26} className="legal-notice-icon" aria-hidden="true" />
              <div className="legal-notice-text">
                <strong className="block text-[#7A5F2E] font-bold text-base mb-1">
                  Contrat de Licence Commerciale Permanente VCheque :
                </strong>
                L&apos;acquisition d&apos;une licence confère un droit d&apos;usage perpétuel, scellé par signature
                cryptographique asymétrique Ed25519 liée au matériel du client (Machine ID).{' '}
                <strong className="text-[#102C25]">
                  Aucune redevance périodique cachée, aucun abonnement obligatoire : votre licence reste utilisable
                  hors-ligne indéfiniment.
                </strong>
              </div>
            </aside>

            {/* CLAUSE 1 : DISPOSITIONS GÉNÉRALES & IDENTIFICATION DE L'E-FOURNISSEUR */}
            <section id="cgv-1" className="legal-section">
              <header className="legal-section-header">
                <span className="legal-article-num">01</span>
                <h2 className="legal-section-title">Dispositions Générales &amp; Identification de l&apos;E-Fournisseur</h2>
              </header>
              <div className="legal-section-body">
                <p>
                  Les présentes Conditions Générales de Vente (ci-après « CGV ») constituent le socle contractuel unique
                  régissant les relations commerciales conclues à distance, par voie électronique, entre la structure
                  éditrice <strong>Virtanis</strong> (ci-après « l&apos;E-Fournisseur ») et toute personne physique ou
                  morale professionnelle acquérant une licence logicielle d&apos;exploitation (ci-après « le Client » ou
                  « l&apos;Acheteur »).
                </p>

                <div className="legal-info-card">
                  <div className="legal-info-row">
                    <span className="legal-info-label">Dénomination de l&apos;E-Fournisseur :</span>
                    <span className="legal-info-val">Virtanis Technologies</span>
                  </div>
                  <div className="legal-info-row">
                    <span className="legal-info-label">Nature de l&apos;activité :</span>
                    <span className="legal-info-val">Édition, développement et distribution de logiciels d&apos;entreprise</span>
                  </div>
                  <div className="legal-info-row">
                    <span className="legal-info-label">Siège d&apos;exploitation :</span>
                    <span className="legal-info-val">Alger, République Algérienne Démocratique et Populaire</span>
                  </div>
                  <div className="legal-info-row">
                    <span className="legal-info-label">Contact officiel &amp; Support :</span>
                    <span className="legal-info-val">contact@virtanis.net  •  support@virtanis.dz</span>
                  </div>
                </div>

                <p>
                  Conformément à l&apos;Article 10 de la <strong>Loi n° 18-05 du 10 mai 2018 relative au commerce électronique</strong>,
                  la passation de commande sur le site implique l&apos;adhésion pleine, entière et sans réserve du Client
                  aux présentes CGV, consultables en permanence et acceptées expressément avant tout paiement.
                </p>
              </div>
            </section>

            {/* CLAUSE 2 : OBJET DU CONTRAT & PRODUIT VCHEQUE */}
            <section id="cgv-2" className="legal-section">
              <header className="legal-section-header">
                <span className="legal-article-num">02</span>
                <h2 className="legal-section-title">Objet du Contrat &amp; Produit VCheque</h2>
              </header>
              <div className="legal-section-body">
                <p>
                  Le présent contrat a pour objet la concession d&apos;une <strong>licence d&apos;exploitation logicielle
                  permanente et non exclusive</strong> pour le logiciel bureautique professionnel <strong>VCheque</strong>,
                  compatible avec les systèmes d&apos;exploitation Microsoft Windows (Windows 11, 10, 8, 7).
                </p>

                <p>
                  VCheque assure l&apos;assistance mécanique à la préparation, à l&apos;alignement millimétrique sur imprimantes
                  bureautiques et à l&apos;impression sécurisée de chèques bancaires, de chèques postaux et de bordereaux
                  de remise de chèques émis par l&apos;ensemble des banques opérant en Algérie (BNA, BEA, CPA, BDL, BADR,
                  CNEP Banque, Banque Al Baraka, Gulf Bank Algérie, Société Générale Algérie, BNP Paribas El Djazaïr,
                  Natixis, Housing Bank / Fransabank, et Algérie Poste CCP).
                </p>

                <p>
                  Le logiciel intègre un module de transcription orthographique automatique des montants chiffrés en toutes
                  lettres (en français et en arabe) conforme aux usages du système bancaire algérien.
                </p>
              </div>
            </section>

            {/* CLAUSE 3 : PROCESSUS DE COMMANDE & CONCLUSION DU CONTRAT */}
            <section id="cgv-3" className="legal-section">
              <header className="legal-section-header">
                <span className="legal-article-num">03</span>
                <h2 className="legal-section-title">Processus de Commande &amp; Conclusion du Contrat (« Double Clic »)</h2>
              </header>
              <div className="legal-section-body">
                <p>
                  Conformément aux exigences de formation du contrat électronique posées par la Loi n° 18-05, le processus
                  de commande respecte le principe sécurisant du « double clic » :
                </p>

                <ul className="legal-gold-list">
                  <li className="legal-gold-item">
                    <span className="legal-gold-bullet" aria-hidden="true" />
                    <div>
                      <strong className="text-[#102C25]">Étape 1 — Sélection &amp; Identification :</strong> Le Client sélectionne
                      sa formule (licence 1 poste ou pack multi-postes entreprise) et renseigne ses informations d&apos;identification
                      (nom complet, entreprise, email, téléphone, wilaya).
                    </div>
                  </li>
                  <li className="legal-gold-item">
                    <span className="legal-gold-bullet" aria-hidden="true" />
                    <div>
                      <strong className="text-[#102C25]">Étape 2 — Vérification &amp; Récapitulatif :</strong> Un écran récapitulatif
                      présente le détail de la formule choisie, le prix ferme en Dinars Algériens (DZD) et permet de corriger
                      d&apos;éventuelles erreurs de saisie.
                    </div>
                  </li>
                  <li className="legal-gold-item">
                    <span className="legal-gold-bullet" aria-hidden="true" />
                    <div>
                      <strong className="text-[#102C25]">Étape 3 — Consentement &amp; Paiement :</strong> Le Client coche la case
                      d&apos;acceptation expresse des CGV et valide son paiement, marquant la conclusion formelle du contrat
                      électronique et le déclenchement de la délivrance de sa licence.
                    </div>
                  </li>
                </ul>
              </div>
            </section>

            {/* CLAUSE 4 : TARIFICATION & PRIX EN DINARS (DZD) */}
            <section id="cgv-4" className="legal-section">
              <header className="legal-section-header">
                <span className="legal-article-num">04</span>
                <h2 className="legal-section-title">Tarification &amp; Prix en Dinars Algériens (DZD)</h2>
              </header>
              <div className="legal-section-body">
                <p>
                  Conformément à la législation monétaire algérienne et à l&apos;Article 13 de la Loi n° 18-05, l&apos;intégralité
                  des tarifs affichés sur le site est libellée et exigible exclusivement en{' '}
                  <strong className="text-[#102C25]">Dinars Algériens (DZD)</strong>, toutes taxes comprises (TTC).
                </p>

                <p>
                  Le prix en vigueur est celui affiché au moment de l&apos;enregistrement de la commande. Virtanis garantit
                  qu&apos;aucun frais d&apos;abonnement récurrent, aucune commission cachée ni aucun coût périodique imprévu
                  ne sera facturé : l&apos;acquisition d&apos;une licence VCheque constitue un <strong>paiement unique et définitif</strong>.
                </p>

                <p>
                  Une facture officielle certifiée acquittée au format PDF (contenant les mentions légales de la Loi 18-05)
                  est délivrée automatiquement dès la validation du règlement.
                </p>
              </div>
            </section>

            {/* CLAUSE 5 : MODALITÉS DE PAIEMENT SÉCURISÉ */}
            <section id="cgv-5" className="legal-section">
              <header className="legal-section-header">
                <span className="legal-article-num">05</span>
                <h2 className="legal-section-title">Modalités de Paiement Sécurisé en Algérie</h2>
              </header>
              <div className="legal-section-body">
                <p>
                  Le règlement de la commande s&apos;effectue au choix de l&apos;Acheteur via les canaux officiels autorisés
                  en République Algérienne :
                </p>

                <div className="legal-info-card">
                  <div className="legal-info-row">
                    <span className="legal-info-label">Cartes Bancaires CIB &amp; Edahabia :</span>
                    <span className="legal-info-val">Passerelle certifiée SlickPay (SATIM &amp; GIE Monétique)</span>
                  </div>
                  <div className="legal-info-row">
                    <span className="legal-info-label">Virement Bancaire d&apos;Entreprise :</span>
                    <span className="legal-info-val">De compte à compte sur facture proforma réglementaire</span>
                  </div>
                  <div className="legal-info-row">
                    <span className="legal-info-label">Chèque de Banque Certifié :</span>
                    <span className="legal-info-val">Accepté pour les déploiements institutionnels multi-sites</span>
                  </div>
                  <div className="legal-info-row">
                    <span className="legal-info-label">Protocole de Sécurisation :</span>
                    <span className="legal-info-val">Chiffrement TLS 1.3 avec validation par mot de passe SMS (OTP)</span>
                  </div>
                </div>

                <p>
                  En application des normes strictes de cybersécurité bancaire, aucun numéro de carte, date de validité
                  ou cryptogramme ne transite par les serveurs de Virtanis.
                </p>
              </div>
            </section>

            {/* CLAUSE 6 : DÉLIVRANCE & ACTIVATION DE LA LICENCE */}
            <section id="cgv-6" className="legal-section">
              <header className="legal-section-header">
                <span className="legal-article-num">06</span>
                <h2 className="legal-section-title">Délivrance Numérique &amp; Activation Cryptographique</h2>
              </header>
              <div className="legal-section-body">
                <p>
                  VCheque est un produit logiciel entièrement dématérialisé. La délivrance s&apos;opère de manière{' '}
                  <strong>immédiate et automatique</strong> dès confirmation bancaire du règlement :
                </p>

                <ul className="legal-gold-list">
                  <li className="legal-gold-item">
                    <span className="legal-gold-bullet" aria-hidden="true" />
                    <div>
                      <strong className="text-[#102C25]">Transmission instantanée de la clé :</strong> La clé de licence cryptographique
                      unique (format <code className="font-mono text-xs bg-[#F7F4EC] px-1.5 py-0.5 rounded border border-[#E5DFD3] text-[#102C25]">VCHQ-XXXX-XXXX-XXXX-XXXX</code>),
                      le lien officiel de téléchargement de l&apos;installateur et la facture acquittée sont envoyés par email au Client et affichés sur la page de succès.
                    </div>
                  </li>
                  <li className="legal-gold-item">
                    <span className="legal-gold-bullet" aria-hidden="true" />
                    <div>
                      <strong className="text-[#102C25]">Activation en ligne via Ed25519 :</strong> Au premier démarrage du logiciel,
                      la saisie de la clé calcule une signature cryptographique asymétrique asymétrique <em>Edwards25519 (RFC 8032)</em> reliant
                      la clé à l&apos;empreinte machine hôte.
                    </div>
                  </li>
                  <li className="legal-gold-item">
                    <span className="legal-gold-bullet" aria-hidden="true" />
                    <div>
                      <strong className="text-[#102C25]">Activation hors-ligne (Air-Gapped) :</strong> Pour les postes bancaires
                      strictement déconnectés d&apos;Internet, Virtanis fournit sur demande un fichier certificat scellé{' '}
                      <code className="font-mono text-xs bg-[#F7F4EC] px-1.5 py-0.5 rounded border border-[#E5DFD3] text-[#102C25]">cheque-studio-license.lic</code> importable
                      manuellement sans aucune connexion requise.
                    </div>
                  </li>
                </ul>
              </div>
            </section>

            {/* CLAUSE 7 : DROITS D'USAGE & RÈGLE « 1 PC / LICENCE » */}
            <section id="cgv-7" className="legal-section">
              <header className="legal-section-header">
                <span className="legal-article-num">07</span>
                <h2 className="legal-section-title">Droits d&apos;Usage &amp; Règle « 1 PC / Licence »</h2>
              </header>
              <div className="legal-section-body">
                <p>
                  Sauf stipulation contraire expressément convenue dans un bon de commande multi-postes,{' '}
                  <strong className="text-[#102C25]">une licence VCheque est attribuée pour un poste de travail physique unique (1 PC)</strong>.
                </p>

                <p>
                  Le Client acquiert un droit d&apos;usage perpétuel pour les besoins exclusifs de son entreprise ou activité
                  professionnelle. Sont formellement interdits :
                </p>

                <ul className="legal-gold-list">
                  <li className="legal-gold-item">
                    <span className="legal-gold-bullet" aria-hidden="true" />
                    <div>
                      L&apos;installation simultanée de la même clé d&apos;activation sur plusieurs ordinateurs non autorisés.
                    </div>
                  </li>
                  <li className="legal-gold-item">
                    <span className="legal-gold-bullet" aria-hidden="true" />
                    <div>
                      La revente, la location, le prêt, la distribution publique ou la sous-licenciation de la clé.
                    </div>
                  </li>
                  <li className="legal-gold-item">
                    <span className="legal-gold-bullet" aria-hidden="true" />
                    <div>
                      Toute tentative d&apos;ingénierie inverse, de décompilation des binaires ou de contournement des protections cryptographiques.
                    </div>
                  </li>
                </ul>
              </div>
            </section>

            {/* CLAUSE 8 : POLITIQUE DE TRANSFERT VERS UN NOUVEAU POSTE */}
            <section id="cgv-8" className="legal-section">
              <header className="legal-section-header">
                <span className="legal-article-num">08</span>
                <h2 className="legal-section-title">Politique de Transfert vers un Nouveau Poste Machine</h2>
              </header>
              <div className="legal-section-body">
                <p>
                  Virtanis garantit la pérennité de votre investissement. En cas de renouvellement de matériel informatique,
                  de panne technique avérée du PC d&apos;origine, de formatage ou de réinstallation de Windows, le Client bénéficie
                  d&apos;une <strong>faculté de transfert de licence</strong> :
                </p>

                <p>
                  Sur simple demande adressée à <a href="mailto:contact@virtanis.net" className="text-[#102C25] font-bold hover:text-[#B99A5A]">contact@virtanis.net</a> mentionnant
                  la référence de commande ou la clé, l&apos;équipe technique procède à la libération du slot d&apos;activation
                  matériel. L&apos;ancienne machine est révoquée et la licence redevient immédiatement activable sur le nouvel
                  ordinateur, avec traçabilité intégrale dans le journal d&apos;audit de sécurité.
                </p>
              </div>
            </section>

            {/* CLAUSE 9 : DROIT DE RÉTRACTATION (LOI 18-05 ART. 17) */}
            <section id="cgv-9" className="legal-section">
              <header className="legal-section-header">
                <span className="legal-article-num">09</span>
                <h2 className="legal-section-title">Droit de Rétractation (Loi n° 18-05 Article 17)</h2>
              </header>
              <div className="legal-section-body">
                <p>
                  Conformément aux dispositions de l&apos;<strong>Article 17 de la Loi n° 18-05 du 10 mai 2018 relative au
                  commerce électronique</strong>, le droit légal de rétractation ne peut être exercé pour les contrats
                  de fourniture de contenus numériques dématérialisés non fournis sur support matériel, dès lors que l&apos;exécution
                  a commencé avec l&apos;accord préalable exprès du consommateur.
                </p>

                <div className="bg-[#F7F4EC] border border-[#E5DFD3] rounded-xl p-4 my-4">
                  <span className="block text-xs font-bold text-[#7A5F2E] uppercase tracking-wider mb-1">
                    Exclusion légale du droit de rétractation :
                  </span>
                  <p className="text-xs text-[#556660] leading-relaxed mb-0">
                    S&apos;agissant d&apos;une clé cryptographique délivrée numériquement de manière instantanée après paiement,
                    le Client renonce expressément à l&apos;exercice de tout droit de rétractation dès la réception ou l&apos;activation
                    de sa clé de licence.
                  </p>
                </div>

                <p>
                  Pour permettre une décision d&apos;achat parfaitement éclairée, Virtanis met à disposition du public des vidéos
                  de démonstration complètes, des documentations exhaustives et une assistance avant-vente par email et téléphone.
                </p>
              </div>
            </section>

            {/* CLAUSE 10 : GARANTIE, SUPPORT & MISES À JOUR */}
            <section id="cgv-10" className="legal-section">
              <header className="legal-section-header">
                <span className="legal-article-num">10</span>
                <h2 className="legal-section-title">Garantie, Support Technique &amp; Mises à Jour</h2>
              </header>
              <div className="legal-section-body">
                <p>
                  Virtanis garantit la conformité de VCheque avec ses spécifications techniques documentées et son aptitude
                  à l&apos;alignement sur les chèques des banques algériennes agréées :
                </p>

                <ul className="legal-gold-list">
                  <li className="legal-gold-item">
                    <span className="legal-gold-bullet" aria-hidden="true" />
                    <div>
                      <strong className="text-[#102C25]">Support technique inclus :</strong> Chaque titulaire de licence bénéficie
                      d&apos;une assistance technique réactive par courrier électronique (<a href="mailto:contact@virtanis.net" className="text-[#102C25] font-bold hover:text-[#B99A5A]">contact@virtanis.net</a>)
                      avec un délai de prise en charge contractuel sous 24h ouvrées.
                    </div>
                  </li>
                  <li className="legal-gold-item">
                    <span className="legal-gold-bullet" aria-hidden="true" />
                    <div>
                      <strong className="text-[#102C25]">Mises à jour de maintenance :</strong> Le Client bénéficie sans frais
                      supplémentaires des mises à jour correctives et des actualisations de gabarits bancaires de sa version.
                    </div>
                  </li>
                  <li className="legal-gold-item">
                    <span className="legal-gold-bullet" aria-hidden="true" />
                    <div>
                      <strong className="text-[#102C25]">Compatibilité matérielle :</strong> Le logiciel est conçu pour fonctionner
                      avec toute imprimante standard Windows (laser, jet d&apos;encre ou multifonction) acceptant le chargement
                      personnalisé d&apos;enveloppes ou de formats étroits.
                    </div>
                  </li>
                </ul>
              </div>
            </section>

            {/* CLAUSE 11 : LIMITATION DE RESPONSABILITÉ & OBLIGATIONS BANCAIRES */}
            <section id="cgv-11" className="legal-section">
              <header className="legal-section-header">
                <span className="legal-article-num">11</span>
                <h2 className="legal-section-title">Limitation de Responsabilité &amp; Obligations Bancaires</h2>
              </header>
              <div className="legal-section-body">
                <p>
                  <strong>Rôle technique strictement délimité :</strong> VCheque intervient exclusivement en qualité d&apos;instrument
                  d&apos;assistance bureautique à l&apos;impression. Virtanis n&apos;est partie à aucun flux financier, ne conserve
                  aucun fond et ne se substitue à aucun établissement bancaire ou postal.
                </p>

                <p>
                  Conformément au Code de commerce algérien (Ordonnance n° 75-59, articles 472 et suivants),{' '}
                  <strong className="text-[#102C25]">le tireur du chèque assume l&apos;entière et exclusive responsabilité civile et pénale</strong> :
                </p>

                <ul className="legal-gold-list">
                  <li className="legal-gold-item">
                    <span className="legal-gold-bullet" aria-hidden="true" />
                    <div>
                      De la vérification visuelle systématique des données imprimées avant détachement et remise du titre.
                    </div>
                  </li>
                  <li className="legal-gold-item">
                    <span className="legal-gold-bullet" aria-hidden="true" />
                    <div>
                      De l&apos;existence d&apos;une provision préalable, suffisante et disponible sur le compte bancaire débité.
                    </div>
                  </li>
                  <li className="legal-gold-item">
                    <span className="legal-gold-bullet" aria-hidden="true" />
                    <div>
                      De l&apos;apposition manuelle de la signature manuscrite authentique sur la formule de chèque.
                    </div>
                  </li>
                </ul>

                <p>
                  Virtanis ne saurait être tenue responsable des rejets bancaires résultant d&apos;une erreur de saisie de l&apos;utilisateur,
                  d&apos;un défaut de provision, ou d&apos;une mauvaise insertion physique de la feuille dans l&apos;imprimante.
                </p>
              </div>
            </section>

            {/* CLAUSE 12 : DROIT APPLICABLE & RÈGLEMENT DES DIFFÉRENDS */}
            <section id="cgv-12" className="legal-section">
              <header className="legal-section-header">
                <span className="legal-article-num">12</span>
                <h2 className="legal-section-title">Droit Applicable &amp; Règlement des Différends</h2>
              </header>
              <div className="legal-section-body">
                <p>
                  Les présentes Conditions Générales de Vente, les commandes qui en découlent et l&apos;ensemble des relations
                  contractuelles sont exclusivement régis par le <strong>Droit de la République Algérienne Démocratique et Populaire</strong>.
                </p>

                <p>
                  En cas de difficulté d&apos;interprétation ou d&apos;exécution, les parties s&apos;engagent à rechercher prioritairement
                  un règlement amiable sous un délai de trente (30) jours ouvrés.
                </p>

                <p>
                  À défaut d&apos;accord amiable, attribution expresse et exclusive de compétence est accordée aux{' '}
                  <strong className="text-[#102C25]">Tribunaux compétents relevant du ressort de la Cour d&apos;Alger (Algérie)</strong>,
                  seuls compétents nonobstant pluralité de défendeurs ou appel en garantie.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3.5 mt-6">
                  <Link
                    href="/commander"
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#102C25] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#16382E] transition-all shadow-sm"
                  >
                    <ShoppingBag size={16} aria-hidden="true" />
                    <span>Commander une licence VCheque</span>
                  </Link>

                  <a
                    href="mailto:contact@virtanis.net?subject=Question%20CGV%20-%20VCheque"
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-full bg-white text-[#102C25] border border-[#B99A5A] text-xs font-bold uppercase tracking-wider hover:bg-[#F7F4EC] transition-all"
                  >
                    <Mail size={16} className="text-[#B99A5A]" aria-hidden="true" />
                    <span>Poser une question sur les CGV</span>
                  </a>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
