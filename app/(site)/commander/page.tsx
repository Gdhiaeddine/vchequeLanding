'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { calculateDiscountBadge } from '@/lib/pricing';

const WILAYAS = [
  '01 - Adrar',
  '02 - Chlef',
  '03 - Laghouat',
  '04 - Oum El Bouaghi',
  '05 - Batna',
  '06 - Béjaïa',
  '07 - Biskra',
  '08 - Béchar',
  '09 - Blida',
  '10 - Bouira',
  '11 - Tamanrasset',
  '12 - Tébessa',
  '13 - Tlemcen',
  '14 - Tiaret',
  '15 - Tizi Ouzou',
  '16 - Alger',
  '17 - Djelfa',
  '18 - Jijel',
  '19 - Sétif',
  '20 - Saïda',
  '21 - Skikda',
  '22 - Sidi Bel Abbès',
  '23 - Annaba',
  '24 - Guelma',
  '25 - Constantine',
  '26 - Médéa',
  '27 - Mostaganem',
  '28 - M\'Sila',
  '29 - Mascara',
  '30 - Ouargla',
  '31 - Oran',
  '32 - El Bayadh',
  '33 - Illizi',
  '34 - Bordj Bou Arreridj',
  '35 - Boumerdès',
  '36 - El Tarf',
  '37 - Tindouf',
  '38 - Tissemsilt',
  '39 - El Oued',
  '40 - Khenchela',
  '41 - Souk Ahras',
  '42 - Tipaza',
  '43 - Mila',
  '44 - Aïn Defla',
  '45 - Naâma',
  '46 - Aïn Témouchent',
  '47 - Ghardaïa',
  '48 - Relizane',
  '49 - Timimoun',
  '50 - Bordj Badji Mokhtar',
  '51 - Ouled Djellal',
  '52 - Béni Abbès',
  '53 - In Salah',
  '54 - In Guezzam',
  '55 - Touggourt',
  '56 - Djanet',
  '57 - El M\'Ghair',
  '58 - El Meniaa',
];

function CheckoutContent() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    entreprise: '',
    adresse: '',
    code_postal: '',
    ville: 'Alger',
    wilaya: '16 - Alger',
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Détermination du prix et des informations de licence depuis les variables d'environnement
  const envPrice = process.env.NEXT_PUBLIC_PRICE || '8500';
  const envPriceBefore = process.env.NEXT_PUBLIC_PRICE_BEFORE || '12000';
  const currency = process.env.NEXT_PUBLIC_CURRENCY || 'DZD';
  // Calcul automatique du badge de réduction à partir des prix
  const discountBadge = calculateDiscountBadge(envPrice, envPriceBefore);

  let amountNum = 8500;
  let formattedPrice = '8 500,00';
  let formattedPriceBefore: string | null = '12 000,00';
  const deviceLabel = '1 poste de travail Windows (clé cryptographique permanente)';

  const num = Number(envPrice.replace(/\s/g, ''));
  if (!isNaN(num)) {
    amountNum = num;
    formattedPrice = num
      .toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      .replace(/\u202F/g, ' ');
  }
  const numBefore = Number(envPriceBefore.replace(/\s/g, ''));
  if (!isNaN(numBefore)) {
    formattedPriceBefore = numBefore
      .toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      .replace(/\u202F/g, ' ');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Protection anti-robot honeypot
    if (honeypot) {
      return;
    }

    if (!acceptedTerms) {
      setError('Veuillez accepter les Conditions Générales de Vente et la Politique de Confidentialité.');
      return;
    }

    if (!formData.nom.trim() || !formData.email.trim()) {
      setError('Le nom complet et l’adresse email sont obligatoires pour générer votre commande.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/checkout/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          plan: 'single',
          amount: amountNum,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de la validation de la commande.');
      }

      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        throw new Error('Lien de redirection de paiement indisponible.');
      }
    } catch (err: any) {
      setError(err.message || 'Impossible de se connecter à la passerelle SlickPay.');
      setLoading(false);
    }
  };

  return (
    <>
      {/* 1. HERO DE COMMANDE */}
      <section className="checkout-hero" aria-labelledby="checkout-hero-title">
        <div className="container checkout-hero-inner">
          <p className="eyebrow eyebrow--gold">COMMANDE</p>
          <h1 id="checkout-hero-title" className="checkout-hero-title">
            Finalisez votre commande
          </h1>
          <p className="checkout-hero-lede">
            Complétez vos informations pour procéder au paiement sécurisé de votre licence VCheque.
          </p>
        </div>
      </section>

      {/* 2. GRILLE PRINCIPALE (FORMULAIRE + RÉCAPITULATIF) */}
      <div className="container">
        <div className="checkout-layout">
          {/* Colonne gauche (60% - .checkout-form) */}
          <main className="checkout-card checkout-form">
            {/* Barre de progression accessible */}
            <ol className="checkout-steps" aria-label="Étapes du tunnel de commande">
              <li className="checkout-step is-active" aria-current="step">
                <span className="step-num" aria-hidden="true">1</span>
                <span className="step-label">Informations</span>
              </li>
              <li className="checkout-step">
                <span className="step-num" aria-hidden="true">2</span>
                <span className="step-label">Paiement</span>
              </li>
              <li className="checkout-step">
                <span className="step-num" aria-hidden="true">3</span>
                <span className="step-label">Confirmation</span>
              </li>
            </ol>

            {/* Zone d'alerte / notification */}
            {error && (
              <div className="checkout-alert" role="alert" aria-live="polite">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#96763D"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ flexShrink: 0, marginTop: '2px' }}
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <div>
                    <strong>Attention :</strong> {error}
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Champ piège anti-spam honeypot */}
              <div className="hp-field" aria-hidden="true">
                <label htmlFor="hp_website">Ne pas remplir ce champ si vous êtes humain</label>
                <input
                  type="text"
                  id="hp_website"
                  name="hp_website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {/* BLOC 1 : VOS INFORMATIONS */}
              <fieldset className="checkout-block" style={{ border: 0, padding: 0, margin: 0 }}>
                <legend className="sr-only">Vos informations</legend>
                <div className="checkout-blockhead">
                  <div className="block-icon" aria-hidden="true">
                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="checkout-h2">Vos informations</h2>
                    <p className="checkout-blocklede">
                      Renseignez vos coordonnées pour recevoir votre commande et votre licence.
                    </p>
                  </div>
                </div>

                <div className="field-row">
                  <div className="field">
                    <label className="field-label" htmlFor="nom">
                      Nom complet <span>*</span>
                    </label>
                    <div className="field-control">
                      <span className="field-icon" aria-hidden="true">
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        id="nom"
                        name="nom"
                        required
                        aria-required="true"
                        autoComplete="name"
                        placeholder="Ex. : Mourad Benali"
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label className="field-label" htmlFor="email">
                      Email <span>*</span>
                    </label>
                    <div className="field-control">
                      <span className="field-icon" aria-hidden="true">
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                      </span>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        aria-required="true"
                        autoComplete="email"
                        placeholder="contact@entreprise.dz"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <p className="field-hint">La clé de licence y sera envoyée.</p>
                  </div>
                </div>

                <div className="field">
                  <label className="field-label" htmlFor="entreprise">
                    Nom de l&apos;entreprise (optionnel)
                  </label>
                  <div className="field-control">
                    <span className="field-icon" aria-hidden="true">
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
                        <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                        <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
                        <path d="M10 6h4" />
                        <path d="M10 10h4" />
                        <path d="M10 14h4" />
                        <path d="M10 18h4" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      id="entreprise"
                      name="entreprise"
                      autoComplete="organization"
                      placeholder="SARL VCheque Algérie ou Profession Libérale"
                      value={formData.entreprise}
                      onChange={(e) => setFormData({ ...formData, entreprise: e.target.value })}
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="field-label" htmlFor="telephone">
                    Téléphone (optionnel)
                  </label>
                  <div className="field-control">
                    <span className="field-icon" aria-hidden="true">
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </span>
                    <input
                      type="tel"
                      id="telephone"
                      name="telephone"
                      autoComplete="tel"
                      placeholder="+213 6 12 34 56 78"
                      value={formData.telephone}
                      onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    />
                  </div>
                  <p className="field-hint">Format algérien, ex. : +213 6 12 34 56 78</p>
                </div>
              </fieldset>

              <hr className="checkout-divider" />

              {/* BLOC 2 : ADRESSE DE FACTURATION */}
              <fieldset className="checkout-block" style={{ border: 0, padding: 0, margin: 0 }}>
                <legend className="sr-only">Adresse de facturation</legend>
                <div className="checkout-blockhead">
                  <div className="block-icon" aria-hidden="true">
                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="checkout-h2">Adresse de facturation</h2>
                    <p className="checkout-blocklede">
                      Cette information est nécessaire pour l&apos;établissement de votre facture.
                    </p>
                  </div>
                </div>

                <div className="field">
                  <label className="field-label" htmlFor="adresse">
                    Adresse
                  </label>
                  <div className="field-control">
                    <span className="field-icon" aria-hidden="true">
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      id="adresse"
                      name="adresse"
                      autoComplete="street-address"
                      placeholder="12, Rue Didouche Mourad"
                      value={formData.adresse}
                      onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                    />
                  </div>
                </div>

                <div className="field-row">
                  <div className="field">
                    <label className="field-label" htmlFor="code_postal">
                      Code postal
                    </label>
                    <div className="field-control">
                      <span className="field-icon" aria-hidden="true">
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="21 8 21 21 3 21 3 8" />
                          <rect width="22" height="5" x="1" y="3" />
                          <line x1="10" y1="12" x2="14" y2="12" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        id="code_postal"
                        name="code_postal"
                        inputMode="numeric"
                        autoComplete="postal-code"
                        placeholder="16000"
                        value={formData.code_postal}
                        onChange={(e) => setFormData({ ...formData, code_postal: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label className="field-label" htmlFor="ville">
                      Ville
                    </label>
                    <div className="field-control">
                      <span className="field-icon" aria-hidden="true">
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="20" x2="18" y2="10" />
                          <line x1="12" y1="20" x2="12" y2="4" />
                          <line x1="6" y1="20" x2="6" y2="14" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        id="ville"
                        name="ville"
                        autoComplete="address-level2"
                        placeholder="Alger"
                        value={formData.ville}
                        onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="field">
                  <label className="field-label" htmlFor="wilaya">
                    Wilaya
                  </label>
                  <div className="field-control">
                    <span className="field-icon" aria-hidden="true">
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                      </svg>
                    </span>
                    <select
                      id="wilaya"
                      name="wilaya"
                      value={formData.wilaya}
                      onChange={(e) => setFormData({ ...formData, wilaya: e.target.value })}
                    >
                      {WILAYAS.map((w) => (
                        <option key={w} value={w}>
                          {w}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </fieldset>

              {/* BLOC CONSENTEMENT & CGV */}
              <div className="checkout-terms">
                <label className="terms-label" htmlFor="terms">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    required
                    aria-required="true"
                  />
                  <span>
                    J&apos;accepte les{' '}
                    <a href="/conditions-generales-de-vente" target="_blank" rel="noopener noreferrer">
                      Conditions générales de vente
                    </a>{' '}
                    et la{' '}
                    <a href="/politique-de-confidentialite" target="_blank" rel="noopener noreferrer">
                      Politique de confidentialité
                    </a>{' '}
                    <span style={{ color: '#8C3A2B', fontWeight: 'bold' }}>*</span>
                    <span aria-hidden="true" style={{ marginTop: '0.35rem', display: 'block' }}>
                      Conformément à la Loi 18-05 relative au commerce électronique, vos coordonnées sont strictement réservées au traitement de votre commande et à la génération de votre licence.
                    </span>
                  </span>
                </label>
              </div>

              {/* BOUTON D'ACTION PRINCIPAL */}
              <button
                type="submit"
                id="checkout-submit-btn"
                className={`btn btn-primary checkout-submit ${loading ? 'is-loading' : ''}`}
                disabled={loading}
                data-loading-label="Connexion à SlickPay…"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="btn-icon"
                  aria-hidden="true"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>{loading ? 'Connexion à SlickPay…' : 'Payer par carte CIB / Edahabia'}</span>
                <span className="btn-arrow" aria-hidden="true">→</span>
              </button>

              <div className="checkout-secure-notice">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
                <span>Cartes CIB et Edahabia acceptées via la plateforme sécurisée SlickPay</span>
              </div>

              <div className="checkout-back">
                <Link href="/">← Retour à la boutique</Link>
              </div>
            </form>
          </main>

          {/* Colonne droite (40% - .checkout-summary) */}
          <aside className="checkout-card checkout-summary" style={{ position: 'sticky', top: '1.5rem' }}>
            <h2 className="checkout-h2">Récapitulatif de votre commande</h2>

            <div className="summary-product">
              <Image
                src="/img/vcheque-icon-128.png"
                alt="VCheque"
                width={52}
                height={52}
                className="summary-logo"
              />
              <div>
                <h3 className="summary-name">VCheque</h3>
                <p className="summary-desc">
                  Logiciel professionnel de remplissage, prévisualisation et impression de chèques en Algérie.
                </p>
              </div>
            </div>

            <dl className="summary-rows">
              <div className="summary-row">
                <dt>Licence</dt>
                <dd>Licence commerciale Windows</dd>
              </div>
              <div className="summary-row">
                <dt>Durée</dt>
                <dd>Définitive (sans abonnement récurrent)</dd>
              </div>
              <div className="summary-row">
                <dt>Postes autorisés</dt>
                <dd>{deviceLabel}</dd>
              </div>
              <div className="summary-row">
                <dt>Mises à jour</dt>
                <dd>Incluses</dd>
              </div>
              <div className="summary-row">
                <dt>Support</dt>
                <dd>Assistance par email &amp; documentation</dd>
              </div>
              <div className="summary-row">
                <dt>Prix unitaire</dt>
                <dd className="is-price">
                  {formattedPriceBefore && (
                    <del style={{ color: 'var(--text-faint)', marginRight: '0.45rem', fontSize: '0.84rem' }}>
                      {formattedPriceBefore} {currency}
                    </del>
                  )}
                  {discountBadge && (
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '0.1rem 0.4rem',
                        marginRight: '0.45rem',
                        background: 'rgba(185, 154, 90, 0.15)',
                        color: 'var(--gold-text)',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      {discountBadge}
                    </span>
                  )}
                  {formattedPrice} <span className="summary-currency">{currency}</span>
                </dd>
              </div>
              <div className="summary-row summary-row--total">
                <dt>Total à payer</dt>
                <dd className="is-price">
                  {formattedPrice} <span className="summary-currency">{currency}</span>
                </dd>
              </div>
            </dl>

            <div className="summary-secure">
              <div className="secure-icon" aria-hidden="true">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <div>
                <h4 className="secure-title">Paiement sécurisé</h4>
                <p className="secure-desc">
                  Vos informations sont protégées et traitées de manière sécurisée.
                </p>
              </div>
            </div>

            <ul className="summary-benefits">
              <li>
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Confirmation immédiate de commande par email.</span>
              </li>
              <li>
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Paiement sécurisé CIB / Edahabia via SlickPay.</span>
              </li>
              <li>
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Clé d&apos;activation officielle délivrée après validation du paiement.</span>
              </li>
              <li>
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Guide d&apos;installation et d&apos;alignement pas à pas.</span>
              </li>
              <li>
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Support technique dédié.</span>
              </li>
            </ul>
          </aside>
        </div>
      </div>

      {/* 3. BANDEAU DE RÉASSURANCE INFÉRIEUR */}
      <section className="checkout-trust" aria-label="Garanties de commande">
        <div className="container">
          <div className="checkout-trust-grid">
            <div className="checkout-trust-item">
              <div className="checkout-trust-icon" aria-hidden="true">
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <div>
                <h4 className="checkout-trust-title">Paiement sécurisé</h4>
                <p className="checkout-trust-desc">Transactions protégées et fiables.</p>
              </div>
            </div>

            <div className="checkout-trust-item">
              <div className="checkout-trust-icon" aria-hidden="true">
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <div>
                <h4 className="checkout-trust-title">Livraison par email</h4>
                <p className="checkout-trust-desc">Lien de téléchargement et clé d&apos;activation.</p>
              </div>
            </div>

            <div className="checkout-trust-item">
              <div className="checkout-trust-icon" aria-hidden="true">
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <div>
                <h4 className="checkout-trust-title">Accès immédiat</h4>
                <p className="checkout-trust-desc">Après confirmation du paiement.</p>
              </div>
            </div>

            <div className="checkout-trust-item">
              <div className="checkout-trust-icon" aria-hidden="true">
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <h4 className="checkout-trust-title">Support client</h4>
                <p className="checkout-trust-desc">Notre équipe est à votre écoute.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: '4rem 1.5rem', textAlign: 'center', color: '#64746B' }}>
          Chargement de la page de commande...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
