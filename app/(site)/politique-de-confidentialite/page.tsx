import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Database,
  Cpu,
  CreditCard,
  Clock,
  Key,
  Cookie,
  Scale,
  Mail,
  FileText,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité & Secret Bancaire — VCheque Algérie',
  description:
    'Engagement de confidentialité, architecture Zero-Knowledge (100% stockage local des chèques) et conformité stricte avec la Loi algérienne n° 18-07 (ANPDP).',
  keywords: [
    'politique de confidentialité VCheque',
    'loi 18-07 données personnelles Algérie',
    'ANPDP conformité Virtanis',
    'secret bancaire chèque Algérie',
    'zero-knowledge logiciel chèque',
  ],
  alternates: {
    canonical: 'https://vcheque.com/politique-de-confidentialite',
  },
};

export default function PolitiqueConfidentialitePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Politique de Confidentialité — VCheque',
    description:
      'Charte d’engagement de protection des données nominatives et garantie d’herméticité bancaire locale pour VCheque sous la Loi n° 18-07.',
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

      {/* 1. HERO HEADER CONFIDENTIALITÉ */}
      <header className="legal-hero" aria-labelledby="privacy-main-title">
        <div className="legal-hero-inner">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#B99A5A] mb-2 font-sans">
            PROTECTION DES DONNÉES &amp; VIE PRIVÉE
          </p>

          <h1 id="privacy-main-title" className="legal-hero-title">
            Politique de Confidentialité
          </h1>

          <p className="legal-hero-lede">
            Notre engagement solennel en matière de transparence, de sécurité des données nominatives et de respect du
            secret des affaires, conformément à la <strong className="text-[#102C25]">Loi n° 18-07</strong> de la
            République Algérienne Démocratique et Populaire.
          </p>

          <div className="legal-hero-meta">
            <span className="legal-meta-badge">
              <ShieldCheck size={16} className="text-[#102C25]" aria-hidden="true" />
              <span>Conforme Loi 18-07 &amp; ANPDP</span>
            </span>

            <span className="legal-meta-dot" aria-hidden="true">•</span>

            <span>Dernière mise à jour : 28 Octobre 2026</span>

            <span className="legal-meta-dot" aria-hidden="true">•</span>

            <span className="font-semibold text-[#102C25]">
              Principe : Zéro transmission des données chèques
            </span>
          </div>
        </div>
      </header>

      {/* 2. GRILLE PRINCIPALE (SOMMAIRE ADHÉRENT + 11 ENGAGEMENTS) */}
      <div className="legal-layout-wrap">
        <div className="legal-layout">
          {/* COLONNE GAUCHE : SOMMAIRE ADHÉRENT (STICKY) */}
          <aside className="legal-toc-wrapper" aria-label="Sommaire des engagements de confidentialité">
            <nav className="legal-toc">
              <h2 className="legal-toc-title">SOMMAIRE DES ENGAGEMENTS</h2>
              <ol className="legal-toc-list">
                <li>
                  <a href="#privacy-1" className="legal-toc-link">
                    1. Engagement &amp; Secret des Affaires
                  </a>
                </li>
                <li>
                  <a href="#privacy-2" className="legal-toc-link">
                    2. Données dans VCheque (Local)
                  </a>
                </li>
                <li>
                  <a href="#privacy-3" className="legal-toc-link">
                    3. Données de Commande (Loi 18-05)
                  </a>
                </li>
                <li>
                  <a href="#privacy-4" className="legal-toc-link">
                    4. Empreinte Machine (SHA-256)
                  </a>
                </li>
                <li>
                  <a href="#privacy-5" className="legal-toc-link">
                    5. Transactions &amp; Paiement DZD
                  </a>
                </li>
                <li>
                  <a href="#privacy-6" className="legal-toc-link">
                    6. Finalités des Traitements
                  </a>
                </li>
                <li>
                  <a href="#privacy-7" className="legal-toc-link">
                    7. Durées de Conservation
                  </a>
                </li>
                <li>
                  <a href="#privacy-8" className="legal-toc-link">
                    8. Mesures de Cybersécurité
                  </a>
                </li>
                <li>
                  <a href="#privacy-9" className="legal-toc-link">
                    9. Vos Droits sous la Loi 18-07
                  </a>
                </li>
                <li>
                  <a href="#privacy-10" className="legal-toc-link">
                    10. Cookies &amp; Traceurs
                  </a>
                </li>
                <li>
                  <a href="#privacy-11" className="legal-toc-link">
                    11. Autorité ANPDP &amp; Contact DPO
                  </a>
                </li>
              </ol>
            </nav>
          </aside>

          {/* COLONNE DROITE : CONTENU DES 11 ENGAGEMENTS */}
          <main className="legal-content">
            {/* ENCADRÉ D'ENGAGEMENT SOLENNEL "ZERO-KNOWLEDGE" */}
            <aside
              className="legal-notice-box legal-notice-box--emerald"
              role="region"
              aria-label="Garantie fondamentale de stockage local"
            >
              <Lock size={26} className="legal-notice-icon" aria-hidden="true" />
              <div className="legal-notice-text">
                <strong className="block text-[#102C25] font-bold text-base mb-1">
                  Garantie Fondamentale de Confidentialité Financière (Architecture Zero-Knowledge) :
                </strong>
                Le logiciel <em>VCheque</em> fonctionne selon un principe strict de <strong>stockage 100 % local</strong>.
                Vos montants de chèques, ordres de paiement, identités de bénéficiaires, coordonnées bancaires et historiques
                d&apos;impression ne quittent jamais votre ordinateur.{' '}
                <strong className="text-[#102C25]">
                  Aucune donnée financière ou bancaire n&apos;est transmise, synchronisée ou analysée sur les serveurs de Virtanis.
                </strong>
              </div>
            </aside>

            {/* ARTICLE 1 : ENGAGEMENT FONDAMENTAL & SECRET DES AFFAIRES */}
            <section id="privacy-1" className="legal-section">
              <header className="legal-section-header">
                <span className="legal-article-num">01</span>
                <h2 className="legal-section-title">Engagement Fondamental &amp; Secret des Affaires</h2>
              </header>
              <div className="legal-section-body">
                <p>
                  Dans le cadre de l&apos;exercice de leurs activités quotidiennes, les entreprises, directeurs financiers,
                  experts-comptables, commissaires aux comptes et commerçants algériens manipulent des informations
                  financières d&apos;une extrême sensibilité. Virtanis considère la protection de ces données et le respect
                  du secret des affaires comme un impératif éthique, technique et juridique inaliénable.
                </p>

                <p>
                  Notre organisation s&apos;engage à respecter scrupuleusement les dispositions de la{' '}
                  <strong className="text-[#102C25]">Loi n° 18-07 du 10 juin 2018 relative à la protection des personnes physiques dans le traitement des données à caractère personnel</strong>,
                  en appliquant les principes de licéité, de loyauté, de minimisation des données et de sécurité dès la conception
                  (<em>Privacy by Design</em> et <em>Privacy by Default</em>).
                </p>
              </div>
            </section>

            {/* ARTICLE 2 : DONNÉES TRAITÉES DANS LE LOGICIEL VCHEQUE (POSTE LOCAL) */}
            <section id="privacy-2" className="legal-section">
              <header className="legal-section-header">
                <span className="legal-article-num">02</span>
                <h2 className="legal-section-title">Données Traitées dans le Logiciel VCheque (Poste Local)</h2>
              </header>
              <div className="legal-section-body">
                <p>
                  Le logiciel VCheque installé sous Microsoft Windows a été conçu avec une herméticité absolue vis-à-vis
                  des réseaux externes :
                </p>

                <ul className="legal-gold-list">
                  <li className="legal-gold-item">
                    <span className="legal-gold-bullet" aria-hidden="true" />
                    <div>
                      <strong className="text-[#102C25]">Stockage strictement circonscrit à la machine hôte :</strong>{' '}
                      L&apos;ensemble des informations saisies — notamment les montants chiffrés, montants transcrits en lettres,
                      noms ou raisons sociales des bénéficiaires, dates d&apos;émission, lieux d&apos;émission, choix des banques
                      tirées et historiques d&apos;impression — est consigné exclusivement dans une base de données locale
                      hébergée sur le disque dur du poste de travail de l&apos;utilisateur.
                    </div>
                  </li>
                  <li className="legal-gold-item">
                    <span className="legal-gold-bullet" aria-hidden="true" />
                    <div>
                      <strong className="text-[#102C25]">Absence intégrale de télémétrie financière :</strong>{' '}
                      Aucune fonction du logiciel n&apos;émet de requête en arrière-plan transmettant des données de chèques vers
                      nos serveurs ou vers des prestataires tiers. Le logiciel est pleinement opérationnel sur des postes isolés
                      physiquement d&apos;Internet (environnement <em>Air-Gapped</em>).
                    </div>
                  </li>
                  <li className="legal-gold-item">
                    <span className="legal-gold-bullet" aria-hidden="true" />
                    <div>
                      <strong className="text-[#102C25]">Maîtrise exclusive de vos sauvegardes :</strong>{' '}
                      L&apos;exportation, la sauvegarde et l&apos;archivage des historiques d&apos;impression relèvent exclusivement
                      de la compétence et de la politique interne de sécurité informatique de l&apos;entreprise utilisatrice.
                    </div>
                  </li>
                </ul>
              </div>
            </section>

            {/* ARTICLE 3 : DONNÉES COLLECTÉES LORS DE LA COMMANDE D'UNE LICENCE */}
            <section id="privacy-3" className="legal-section">
              <header className="legal-section-header">
                <span className="legal-article-num">03</span>
                <h2 className="legal-section-title">Données Collectées lors de la Commande d&apos;une Licence</h2>
              </header>
              <div className="legal-section-body">
                <p>
                  Lorsque vous souscrivez une licence VCheque sur notre portail en ligne, seules les données strictement
                  nécessaires à la formalisation du contrat de vente électronique (Loi n° 18-05), à la génération de la clé
                  cryptographique et à la délivrance de la facture fiscale acquittée sont collectées :
                </p>

                <div className="legal-info-card">
                  <div className="legal-info-row">
                    <span className="legal-info-label">Données d&apos;identité civile :</span>
                    <span className="legal-info-val">Nom et prénom du titulaire de la commande</span>
                  </div>
                  <div className="legal-info-row">
                    <span className="legal-info-label">Données professionnelles :</span>
                    <span className="legal-info-val">Raison sociale de l&apos;entreprise / cabinet (facultatif)</span>
                  </div>
                  <div className="legal-info-row">
                    <span className="legal-info-label">Coordonnées de communication :</span>
                    <span className="legal-info-val">Adresse email (délivrance de licence) &amp; Téléphone mobile</span>
                  </div>
                  <div className="legal-info-row">
                    <span className="legal-info-label">Données de localisation fiscale :</span>
                    <span className="legal-info-val">Adresse, Ville, Wilaya de rattachement en Algérie</span>
                  </div>
                  <div className="legal-info-row">
                    <span className="legal-info-label">Données transactionnelles :</span>
                    <span className="legal-info-val">Référence commande unique (ex: VC-YYYYMMDD-XXXXX), montant en DZD</span>
                  </div>
                </div>

                <p>
                  Ces informations sont traitées dans le strict respect du principe de minimisation édicté par l&apos;Article 5
                  de la Loi n° 18-07.
                </p>
              </div>
            </section>

            {/* ARTICLE 4 : EMPREINTE MATÉRIELLE & ACTIVATION (MACHINE ID) */}
            <section id="privacy-4" className="legal-section">
              <header className="legal-section-header">
                <span className="legal-article-num">04</span>
                <h2 className="legal-section-title">Empreinte Matérielle &amp; Activation (Machine ID)</h2>
              </header>
              <div className="legal-section-body">
                <p>
                  Afin de garantir le modèle d&apos;exploitation contractuel (1 licence commerciale = 1 PC Windows) et de
                  prévenir les falsifications, le système d&apos;activation met en œuvre un mécanisme d&apos;empreinte matérielle
                  pseudonymisée :
                </p>

                <p>
                  Lors de l&apos;activation en ligne ou hors-ligne, un hachage cryptographique unidirectionnel irréversible{' '}
                  <strong className="text-[#102C25] font-mono">SHA-256</strong> est calculé à partir de données matérielles
                  anonymes du poste (identifiant matériel de la carte mère et identifiant d&apos;installation Windows).{' '}
                  <strong>Cette empreinte ne permet en aucun cas d&apos;identifier l&apos;utilisateur personne physique ni de remonter à des documents privés.</strong>
                </p>

                <p>
                  La signature de licence résultante est forgée via l&apos;algorithme standardisé{' '}
                  <strong>Ed25519</strong>. En cas de changement légitime de poste ou de crash matériel, cette empreinte
                  peut être réinitialisée par notre support technique sur justificatif d&apos;achat.
                </p>
              </div>
            </section>

            {/* ARTICLE 5 : TRANSACTIONS & DONNÉES BANCAIRES DE PAIEMENT EN DZD */}
            <section id="privacy-5" className="legal-section">
              <header className="legal-section-header">
                <span className="legal-article-num">05</span>
                <h2 className="legal-section-title">Transactions &amp; Données Bancaires de Paiement en DZD</h2>
              </header>
              <div className="legal-section-body">
                <p>
                  Les paiements par carte bancaire interbancaire (<strong>CIB</strong>) et carte <strong>Edahabia</strong> (Algérie Poste)
                  sont intégralement délégués à la passerelle de télépaiement sécurisée <strong>SlickPay</strong>, opérant
                  sous l&apos;agrément du GIE Monétique et le réseau national interbancaire de la SATIM.
                </p>

                <div className="bg-[#F7F4EC] border border-[#E5DFD3] rounded-xl p-4 my-4">
                  <span className="block text-xs font-bold text-[#7A5F2E] uppercase tracking-wider mb-1">
                    Garantie d&apos;absence de conservation :
                  </span>
                  <p className="text-xs text-[#556660] leading-relaxed mb-0">
                    Virtanis ne collecte, ne traite et ne stocke <strong>aucun numéro de carte à 16 chiffres, aucune date d&apos;expiration, ni cryptogramme visuel (CVV2)</strong>.
                    Les transactions sont authentifiées par mot de passe à usage unique (SMS OTP) directement entre le porteur et sa banque.
                    Virtanis reçoit uniquement la notification de validation avec l&apos;identifiant de transaction pour la comptabilité.
                  </p>
                </div>
              </div>
            </section>

            {/* ARTICLE 6 : FINALITÉS LÉGITIMES DES TRAITEMENTS */}
            <section id="privacy-6" className="legal-section">
              <header className="legal-section-header">
                <span className="legal-article-num">06</span>
                <h2 className="legal-section-title">Finalités Légitimes des Traitements</h2>
              </header>
              <div className="legal-section-body">
                <p>
                  Conformément à l&apos;Article 7 de la Loi n° 18-07, tout traitement de données nominatives opéré par Virtanis
                  repose sur une base légale déterminée, explicite et légitime :
                </p>

                <ul className="legal-gold-list">
                  <li className="legal-gold-item">
                    <span className="legal-gold-bullet" aria-hidden="true" />
                    <div>
                      <strong className="text-[#102C25]">Exécution contractuelle :</strong> Délivrance de la clé de licence VCheque,
                      authentification de la machine autorisée, et mise à disposition des installeurs officiels.
                    </div>
                  </li>
                  <li className="legal-gold-item">
                    <span className="legal-gold-bullet" aria-hidden="true" />
                    <div>
                      <strong className="text-[#102C25]">Obligation légale et fiscale :</strong> Émission et conservation des
                      factures électroniques réglementaires en Dinars Algériens (Loi 18-05 et Code de commerce algérien).
                    </div>
                  </li>
                  <li className="legal-gold-item">
                    <span className="legal-gold-bullet" aria-hidden="true" />
                    <div>
                      <strong className="text-[#102C25]">Support technique &amp; relations clients :</strong> Assistance par email,
                      WhatsApp ou téléphone pour le calibrage d&apos;imprimante et les demandes de devis multi-postes.
                    </div>
                  </li>
                </ul>

                <p className="mt-3">
                  <strong className="text-[#102C25]">Engagement absolu de non-commercialisation :</strong> Virtanis ne commercialise,
                  ne loue, ne cède et n&apos;échange aucune donnée personnelle ou professionnelle à des tiers à des fins publicitaires.
                </p>
              </div>
            </section>

            {/* ARTICLE 7 : DURÉES DE CONSERVATION DES DONNÉES */}
            <section id="privacy-7" className="legal-section">
              <header className="legal-section-header">
                <span className="legal-article-num">07</span>
                <h2 className="legal-section-title">Durées de Conservation des Données</h2>
              </header>
              <div className="legal-section-body">
                <p>
                  Les données à caractère personnel sont conservées pour une durée strictement proportionnée aux finalités
                  pour lesquelles elles ont été collectées, conformément à la réglementation :
                </p>

                <div className="legal-info-card">
                  <div className="legal-info-row">
                    <span className="legal-info-label">Licences commerciales permanentes :</span>
                    <span className="legal-info-val">Durée de vie de la licence (garantie d&apos;usage perpétuel &amp; réactivation)</span>
                  </div>
                  <div className="legal-info-row">
                    <span className="legal-info-label">Factures &amp; pièces comptables :</span>
                    <span className="legal-info-val">Dix (10) ans (prescription du Code de commerce algérien)</span>
                  </div>
                  <div className="legal-info-row">
                    <span className="legal-info-label">Journaux d&apos;audit de sécurité :</span>
                    <span className="legal-info-val">Un (1) an glissant (prévention des fraudes et intrusions)</span>
                  </div>
                  <div className="legal-info-row">
                    <span className="legal-info-label">Demandes de contact &amp; devis sans suite :</span>
                    <span className="legal-info-val">Trois (3) ans maximum après le dernier contact émis</span>
                  </div>
                </div>
              </div>
            </section>

            {/* ARTICLE 8 : MESURES TECHNIQUES & ORGANISATIONNELLES DE SÉCURITÉ */}
            <section id="privacy-8" className="legal-section">
              <header className="legal-section-header">
                <span className="legal-article-num">08</span>
                <h2 className="legal-section-title">Mesures Techniques &amp; Organisationnelles de Sécurité</h2>
              </header>
              <div className="legal-section-body">
                <p>
                  En application de l&apos;Article 41 de la Loi n° 18-07, Virtanis déploie un ensemble de contre-mesures
                  techniques et organisationnelles rigoureuses pour préserver l&apos;intégrité et la confidentialité des données :
                </p>

                <ul className="legal-gold-list">
                  <li className="legal-gold-item">
                    <span className="legal-gold-bullet" aria-hidden="true" />
                    <div>
                      <strong className="text-[#102C25]">Chiffrement en transit (TLS 1.3) :</strong> L&apos;ensemble des échanges
                      entre votre navigateur et nos serveurs est protégé par certificat SSL/TLS moderne interdisant toute écoute clandestine.
                    </div>
                  </li>
                  <li className="legal-gold-item">
                    <span className="legal-gold-bullet" aria-hidden="true" />
                    <div>
                      <strong className="text-[#102C25]">Chiffrement au repos (AES-256) :</strong> Les bases de données hébergeant
                      les enregistrements de licences sont chiffrées au repos selon les meilleurs standards de l&apos;industrie.
                    </div>
                  </li>
                  <li className="legal-gold-item">
                    <span className="legal-gold-bullet" aria-hidden="true" />
                    <div>
                      <strong className="text-[#102C25]">Contrôle d&apos;accès strict &amp; 2FA TOTP :</strong> Les consoles d&apos;administration
                      sont isolées et protégées par authentification multifacteur obligatoire (RFC 6238 TOTP) et limitation de débit (Rate Limiting).
                    </div>
                  </li>
                </ul>
              </div>
            </section>

            {/* ARTICLE 9 : VOS DROITS SOUS LA LOI ALGÉRIENNE N° 18-07 */}
            <section id="privacy-9" className="legal-section">
              <header className="legal-section-header">
                <span className="legal-article-num">09</span>
                <h2 className="legal-section-title">Vos Droits sous la Loi Algérienne n° 18-07</h2>
              </header>
              <div className="legal-section-body">
                <p>
                  En application des dispositions du Chapitre V de la Loi n° 18-07, toute personne physique dispose de prérogatives
                  légales étendues sur ses données personnelles traitées par Virtanis :
                </p>

                <ul className="legal-gold-list">
                  <li className="legal-gold-item">
                    <span className="legal-gold-bullet" aria-hidden="true" />
                    <div>
                      <strong className="text-[#102C25]">Droit d&apos;accès (Article 34) :</strong> Obtenir confirmation que des données
                      vous concernant sont ou ne sont pas traitées, ainsi qu&apos;une copie intégrale de ces données.
                    </div>
                  </li>
                  <li className="legal-gold-item">
                    <span className="legal-gold-bullet" aria-hidden="true" />
                    <div>
                      <strong className="text-[#102C25]">Droit de rectification (Article 35) :</strong> Exiger la mise à jour, la
                      rectification ou l&apos;actualisation de coordonnées inexactes ou incomplètes.
                    </div>
                  </li>
                  <li className="legal-gold-item">
                    <span className="legal-gold-bullet" aria-hidden="true" />
                    <div>
                      <strong className="text-[#102C25]">Droit d&apos;effacement &amp; Droit d&apos;opposition (Article 36) :</strong>{' '}
                      Demander la suppression de vos données pour des motifs légitimes, sous réserve du respect des obligations légales
                      de conservation des pièces comptables (Code de commerce).
                    </div>
                  </li>
                </ul>

                <p className="mt-4">
                  Pour exercer l&apos;un de ces droits, adressez votre demande accompagnée d&apos;un justificatif d&apos;identité à :{' '}
                  <a href="mailto:contact@virtanis.net" className="text-[#102C25] font-bold hover:text-[#B99A5A]">
                    contact@virtanis.net
                  </a>. Une réponse circonstanciée vous sera adressée dans un délai maximal de <strong>trente (30) jours ouvrés</strong>.
                </p>
              </div>
            </section>

            {/* ARTICLE 10 : POLITIQUE RELATIVE AUX COOKIES & TRACEURS */}
            <section id="privacy-10" className="legal-section">
              <header className="legal-section-header">
                <span className="legal-article-num">10</span>
                <h2 className="legal-section-title">Politique Relative aux Cookies &amp; Traceurs</h2>
              </header>
              <div className="legal-section-body">
                <p>
                  Le site web VCheque applique une politique d&apos;extrême sobriété technique en matière de cookies :
                </p>

                <p>
                  Sont exclusivement employés des <strong>cookies techniques de session strictement indispensables</strong> au
                  fonctionnement de la plateforme (maintien de la session d&apos;authentification de l&apos;espace d&apos;administration,
                  protection CSRF contre les attaques inter-sites).
                </p>

                <p>
                  <strong>Absence de traceurs publicitaires intrusifs :</strong> Aucun pixel espion, balise de reciblage commercial
                  (type Google Ads, Meta Pixel, TikTok ou régies publicitaires tierces) n&apos;est injecté sur le Site.
                  Votre navigation demeure respectueuse de votre tranquillité numérique.
                </p>
              </div>
            </section>

            {/* ARTICLE 11 : AUTORITÉ DE RÉGULATION & CONTACT DÉLÉGUÉ */}
            <section id="privacy-11" className="legal-section">
              <header className="legal-section-header">
                <span className="legal-article-num">11</span>
                <h2 className="legal-section-title">Autorité de Régulation &amp; Contact Délégué</h2>
              </header>
              <div className="legal-section-body">
                <p>
                  L&apos;autorité administrative indépendante chargée de veiller au respect de la protection des données
                  à caractère personnel en Algérie est l&apos;<strong>Autorité Nationale de Protection des Données à Caractère
                  Personnel (ANPDP)</strong>, instituée auprès du Président de la République.
                </p>

                <p>
                  Pour toute question relative à l&apos;application de notre politique de confidentialité, ou en cas de réclamation
                  non résolue à l&apos;amiable, vous pouvez joindre notre délégué à la protection des données ou consulter
                  nos mentions légales :
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3.5 mt-6">
                  <a
                    href="mailto:contact@virtanis.net?subject=Demande%20DPO%20-%20VCheque"
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#102C25] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#16382E] transition-all shadow-sm"
                  >
                    <Mail size={16} aria-hidden="true" />
                    <span>Contacter le Délégué aux Données (DPO)</span>
                  </a>

                  <Link
                    href="/mentions-legales"
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-full bg-white text-[#102C25] border border-[#B99A5A] text-xs font-bold uppercase tracking-wider hover:bg-[#F7F4EC] transition-all"
                  >
                    <FileText size={16} className="text-[#B99A5A]" aria-hidden="true" />
                    <span>Consulter les Mentions Légales</span>
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
