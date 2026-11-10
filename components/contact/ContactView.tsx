'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Clock,
  ShieldCheck,
  Building2,
  MessageSquare,
  User,
  Mail,
  Phone,
  HelpCircle,
  Tag,
  Lock,
  Send,
  CheckCircle2,
  AlertTriangle,
  Globe,
  MapPin,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject_type: string;
  subject: string;
  message: string;
  contact_hp: string;
}

const INITIAL_FORM: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  subject_type: 'commercial',
  subject: '',
  message: '',
  contact_hp: '',
};

export default function ContactView() {
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  // FAQ Accordion State (Q1 open by default)
  const [openFaq, setOpenFaq] = useState<Record<number, boolean>>({
    0: true,
    1: false,
    2: false,
  });

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const validateField = (field: keyof ContactFormData, value: string) => {
    let err = '';
    const trimmed = value.trim();

    if (field === 'name') {
      if (!trimmed || trimmed.length < 2) {
        err = 'Veuillez indiquer votre nom et prénom (au moins 2 caractères).';
      }
    } else if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!trimmed || !emailRegex.test(trimmed)) {
        err = 'Veuillez saisir une adresse email professionnelle valide (ex: contact@societe.dz).';
      }
    } else if (field === 'phone') {
      if (trimmed) {
        const cleanPhone = trimmed.replace(/[\s\-\.\(\)]/g, '');
        const dzPhoneRegex = /^(?:\+213|00213|0)(?:5|6|7|2[0-9]|3[0-9]|4[0-9])[0-9]{7,8}$/;
        if (!dzPhoneRegex.test(cleanPhone)) {
          err = 'Format de numéro algérien invalide (ex: 0550 12 34 56 ou +213 550 12 34 56).';
        }
      }
    } else if (field === 'subject') {
      if (!trimmed || trimmed.length < 3) {
        err = "Veuillez préciser l'objet de votre demande (au moins 3 caractères).";
      }
    } else if (field === 'message') {
      if (!trimmed || trimmed.length < 10) {
        err = 'Votre message doit contenir au moins 10 caractères pour nous permettre de vous répondre.';
      }
    }

    setErrors((prev) => {
      const updated = { ...prev };
      if (err) updated[field] = err;
      else delete updated[field];
      return updated;
    });

    return !err;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      validateField(name as keyof ContactFormData, value);
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    validateField(name as keyof ContactFormData, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    // Validate all required fields
    const isNameValid = validateField('name', formData.name);
    const isEmailValid = validateField('email', formData.email);
    const isPhoneValid = validateField('phone', formData.phone);
    const isSubjectValid = validateField('subject', formData.subject);
    const isMessageValid = validateField('message', formData.message);

    if (!isNameValid || !isEmailValid || !isPhoneValid || !isSubjectValid || !isMessageValid) {
      setServerError('Veuillez corriger les champs signalés en rouge ci-dessous avant d’envoyer.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.errors) {
          setErrors(data.errors);
        }
        throw new Error(data.error || "Une erreur est survenue lors de l'envoi de votre message.");
      }

      setSuccessMessage(
        data.message ||
          'Votre message a été transmis avec succès. Notre équipe prendra contact avec vous sous 24h ouvrées.'
      );
      setFormData(INITIAL_FORM);
      setErrors({});

      // Scroll smoothly to the message alert
      const cardEl = document.querySelector('.contact-card');
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (err: any) {
      setServerError(err.message || 'Impossible de joindre le serveur. Veuillez vérifier votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 1. HERO HEADER IMMERSIF */}
      <header className="contact-hero" aria-labelledby="contact-heading">
        <div className="contact-hero-grid-mesh" aria-hidden="true" />
        <div className="contact-hero-glow" aria-hidden="true" />

        <div className="max-w-4xl mx-auto text-center relative z-10 px-4">
          {/* Eyebrow simple */}
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#B99A5A] mb-3">
            ASSISTANCE &amp; RELATIONS PROFESSIONNELLES
          </p>

          {/* Grand Titre H1 */}
          <h1 id="contact-heading" className="contact-hero-title">
            Contacter Virtanis & l&apos;Équipe VCheque
          </h1>

          {/* Descriptif d'accompagnement */}
          <p className="contact-hero-lede">
            Une question commerciale, un besoin de déploiement multi-postes pour votre entreprise ou
            une assistance pour l&apos;activation de votre licence ? Nos spécialistes en Algérie vous
            répondent avec réactivité.
          </p>

          {/* Trio de badges de réassurance */}
          <div className="contact-hero-badges" role="list" aria-label="Engagements de service">
            <div className="contact-hero-badge" role="listitem">
              <Clock size={16} aria-hidden="true" />
              <span>
                <strong>Réponse sous 24h ouvrées</strong>
              </span>
            </div>

            <div className="contact-hero-badge" role="listitem">
              <ShieldCheck size={16} aria-hidden="true" />
              <span>
                <strong>Support Technique Officiel Algérie</strong>
              </span>
            </div>

            <div className="contact-hero-badge" role="listitem">
              <Building2 size={16} aria-hidden="true" />
              <span>
                <strong>Déploiements PME & Cabinets</strong>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. ZONE PRINCIPALE EN 2 COLONNES (1.45fr / 1fr) */}
      <main className="contact-section">
        <div className="contact-container">
          <div className="contact-layout">
            {/* COLONNE GAUCHE (60%) : FORMULAIRE DE CONTACT PROFESSIONNEL */}
            <section className="contact-main" aria-label="Formulaire d'échange">
              <div className="contact-card">
                {/* En-tête de la carte */}
                <div className="contact-card-header">
                  <div className="contact-card-icon-box" aria-hidden="true">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <h2 className="contact-card-title">Envoyez-nous un message</h2>
                    <p className="contact-card-subtitle">
                      Renseignez vos coordonnées, notre équipe technique ou commerciale prendra
                      contact avec vous rapidement.
                    </p>
                  </div>
                </div>

                {/* Alerte Succès */}
                {successMessage && (
                  <div
                    className="contact-alert contact-alert-success"
                    role="status"
                    aria-live="polite"
                  >
                    <CheckCircle2 size={22} className="contact-alert-icon" aria-hidden="true" />
                    <div>
                      <p className="font-bold text-[#065F46] text-sm mb-0.5">
                        Message transmis avec succès
                      </p>
                      <p className="text-xs text-[#047857]">{successMessage}</p>
                    </div>
                  </div>
                )}

                {/* Alerte Erreur Globale */}
                {serverError && (
                  <div className="contact-alert contact-alert-danger" role="alert">
                    <AlertTriangle size={22} className="contact-alert-icon" aria-hidden="true" />
                    <div>
                      <p className="font-bold text-[#991B1B] text-sm mb-0.5">
                        Attention : transmission interrompue
                      </p>
                      <p className="text-xs text-[#B91C1C]">{serverError}</p>
                    </div>
                  </div>
                )}

                {/* Formulaire */}
                <form onSubmit={handleSubmit} noValidate>
                  {/* Piège anti-robot Honeypot invisible */}
                  <div
                    style={{
                      display: 'none !important',
                      opacity: 0,
                      position: 'absolute',
                      left: '-9999px',
                    }}
                    aria-hidden="true"
                  >
                    <label htmlFor="contact_hp">Ne pas remplir ce champ de sécurité :</label>
                    <input
                      id="contact_hp"
                      type="text"
                      name="contact_hp"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.contact_hp}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Grille 2 colonnes pour Nom, Email, Téléphone, Entreprise */}
                  <div className="contact-form-grid">
                    {/* Nom et Prénom */}
                    <div className="contact-field-group">
                      <label htmlFor="name" className="contact-label">
                        Nom et Prénom <span className="contact-label-required">*</span>
                      </label>
                      <div className="contact-input-wrapper">
                        <User size={16} className="contact-input-icon" aria-hidden="true" />
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          placeholder="Ex: Mohamed Benali"
                          className={`contact-input ${errors.name ? 'is-invalid' : ''}`}
                          value={formData.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? 'name-error' : undefined}
                        />
                      </div>
                      {errors.name && (
                        <p id="name-error" className="contact-field-error">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email professionnel */}
                    <div className="contact-field-group">
                      <label htmlFor="email" className="contact-label">
                        Email professionnel <span className="contact-label-required">*</span>
                      </label>
                      <div className="contact-input-wrapper">
                        <Mail size={16} className="contact-input-icon" aria-hidden="true" />
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="Ex: m.benali@entreprise.dz"
                          className={`contact-input ${errors.email ? 'is-invalid' : ''}`}
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? 'email-error' : undefined}
                        />
                      </div>
                      {errors.email && (
                        <p id="email-error" className="contact-field-error">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Numéro de téléphone (Optionnel) */}
                    <div className="contact-field-group">
                      <label htmlFor="phone" className="contact-label">
                        Numéro de téléphone <span className="text-[#8C9993] text-[10px] font-normal lowercase">(Optionnel)</span>
                      </label>
                      <div className="contact-input-wrapper">
                        <Phone size={16} className="contact-input-icon" aria-hidden="true" />
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="Ex: 0550 12 34 56"
                          className={`contact-input ${errors.phone ? 'is-invalid' : ''}`}
                          value={formData.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          aria-invalid={!!errors.phone}
                          aria-describedby={errors.phone ? 'phone-error' : undefined}
                        />
                      </div>
                      {errors.phone && (
                        <p id="phone-error" className="contact-field-error">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Entreprise / Société (Optionnel) */}
                    <div className="contact-field-group">
                      <label htmlFor="company" className="contact-label">
                        Entreprise / Société <span className="text-[#8C9993] text-[10px] font-normal lowercase">(Optionnel)</span>
                      </label>
                      <div className="contact-input-wrapper">
                        <Building2 size={16} className="contact-input-icon" aria-hidden="true" />
                        <input
                          id="company"
                          name="company"
                          type="text"
                          placeholder="Ex: SARL Industrie & Négoce"
                          className="contact-input"
                          value={formData.company}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Champs pleine largeur */}
                  <div className="space-y-4">
                    {/* Type de demande */}
                    <div className="contact-field-group">
                      <label htmlFor="subject_type" className="contact-label">
                        Type de demande <span className="contact-label-required">*</span>
                      </label>
                      <div className="contact-input-wrapper">
                        <HelpCircle size={16} className="contact-input-icon" aria-hidden="true" />
                        <select
                          id="subject_type"
                          name="subject_type"
                          required
                          className="contact-select"
                          value={formData.subject_type}
                          onChange={handleChange}
                        >
                          <option value="commercial">Renseignement Commercial & Tarifs</option>
                          <option value="multi_postes">
                            Devis Déploiement Multi-Postes (Entreprise / Agences)
                          </option>
                          <option value="support">
                            Assistance Technique & Activation de Licence
                          </option>
                          <option value="proforma">
                            Demande de Facture Proforma (Règlement DZD)
                          </option>
                          <option value="autre">Autre question</option>
                        </select>
                      </div>
                    </div>

                    {/* Objet de votre message */}
                    <div className="contact-field-group">
                      <label htmlFor="subject" className="contact-label">
                        Objet de votre message <span className="contact-label-required">*</span>
                      </label>
                      <div className="contact-input-wrapper">
                        <Tag size={16} className="contact-input-icon" aria-hidden="true" />
                        <input
                          id="subject"
                          name="subject"
                          type="text"
                          required
                          placeholder="Ex: Devis pour 5 postes comptables ou question sur imprimante"
                          className={`contact-input ${errors.subject ? 'is-invalid' : ''}`}
                          value={formData.subject}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          aria-invalid={!!errors.subject}
                          aria-describedby={errors.subject ? 'subject-error' : undefined}
                        />
                      </div>
                      {errors.subject && (
                        <p id="subject-error" className="contact-field-error">
                          {errors.subject}
                        </p>
                      )}
                    </div>

                    {/* Votre message détaillé */}
                    <div className="contact-field-group">
                      <label htmlFor="message" className="contact-label">
                        Votre message détaillé <span className="contact-label-required">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        placeholder="Précisez votre demande, le nombre de postes envisagé, le modèle de vos imprimantes ou vos besoins spécifiques pour votre cabinet ou société..."
                        className={`contact-textarea ${errors.message ? 'is-invalid' : ''}`}
                        value={formData.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? 'message-error' : undefined}
                      />
                      {errors.message && (
                        <p id="message-error" className="contact-field-error">
                          {errors.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Pied du formulaire */}
                  <div className="contact-form-footer">
                    {/* Mention légale & sécurité anti-spam à gauche */}
                    <div className="contact-privacy-note">
                      <Lock size={15} aria-hidden="true" />
                      <span>
                        Données protégées conformément à la <strong>Loi 18-07</strong>. Protection anti-spam active (max. 5 messages par heure).
                      </span>
                    </div>

                    {/* Bouton d'envoi à droite */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="contact-submit-btn"
                    >
                      {loading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Transmission en cours...</span>
                        </>
                      ) : (
                        <>
                          <Send size={16} aria-hidden="true" />
                          <span>Transmettre mon message</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </section>

            {/* COLONNE DROITE (40%) : BARRE LATÉRALE D'INFORMATIONS DIRECTES */}
            <aside className="contact-sidebar" aria-label="Canaux et informations complémentaires">
              {/* CARTE 1 : CANAUX DIRECTS */}
              <div className="contact-side-card">
                <span className="contact-side-tag">SUPPORT OFFICIEL</span>
                <h3 className="contact-side-title">Canaux Directs</h3>

                <div className="contact-direct-list">
                  {/* Courriel d'assistance */}
                  <div className="contact-direct-item">
                    <div className="contact-direct-icon-box" aria-hidden="true">
                      <Mail size={18} />
                    </div>
                    <div>
                      <div className="contact-direct-label">Courriel d&apos;assistance</div>
                      <a
                        href="mailto:contact@virtanis.dz"
                        className="contact-direct-value block"
                      >
                        contact@virtanis.dz
                      </a>
                    </div>
                  </div>

                  {/* Portail officiel */}
                  <div className="contact-direct-item">
                    <div className="contact-direct-icon-box" aria-hidden="true">
                      <Globe size={18} />
                    </div>
                    <div>
                      <div className="contact-direct-label">Portail officiel</div>
                      <a
                        href="https://virtanis.net"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-direct-value block"
                      >
                        virtanis.net
                      </a>
                    </div>
                  </div>

                  {/* Horaires d'assistance */}
                  <div className="contact-direct-item">
                    <div className="contact-direct-icon-box" aria-hidden="true">
                      <Clock size={18} />
                    </div>
                    <div>
                      <div className="contact-direct-label">Horaires d&apos;assistance</div>
                      <div className="contact-direct-value">Dimanche au Jeudi</div>
                      <div className="text-[12px] text-[#65756E] mt-0.5">
                        08h30 – 17h00 (Heure d&apos;Alger)
                      </div>
                    </div>
                  </div>

                  {/* Implantation */}
                  <div className="contact-direct-item">
                    <div className="contact-direct-icon-box" aria-hidden="true">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <div className="contact-direct-label">Implantation</div>
                      <div className="contact-direct-value">Alger, République Algérienne</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARTE 2 : DÉPLOIEMENT MULTI-POSTES (VIP GOLD CARD) */}
              <div className="contact-side-card-gold">
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles size={13} className="text-[#B99A5A]" aria-hidden="true" />
                  <span className="contact-side-tag !mb-0">ENTREPRISES & GRANDS COMPTES</span>
                </div>
                <h3 className="contact-side-title">Déploiement Multi-Postes</h3>

                <p className="text-xs leading-relaxed text-[#556660] mb-5">
                  Vous gérez la comptabilité de plusieurs agences ou souhaitez équiper plusieurs
                  postes de travail ? Bénéficiez d&apos;une licence entreprise avec gestion de quota
                  centralisée (2 à 50+ PC) et facturation réglementaire en Dinar Algérien (DZD).
                </p>

                <Link
                  href="/commander"
                  className="inline-flex items-center justify-center w-full px-5 py-3 rounded-full bg-[#102C25] hover:bg-[#16382E] text-[#F7F4EC] hover:text-[#FFFFFF] text-xs font-bold tracking-wide uppercase border border-[#B99A5A]/40 hover:border-[#B99A5A] transition-all shadow-sm hover:shadow-md"
                >
                  Commander une licence en ligne
                </Link>
              </div>

              {/* CARTE 3 : FAQ EXPRESS */}
              <div className="contact-side-card">
                <span className="contact-side-tag">FAQ EXPRESS</span>
                <h3 className="contact-side-title">Questions fréquentes</h3>

                <div className="contact-faq-list">
                  {/* Q1 */}
                  <div className="contact-faq-item">
                    <button
                      type="button"
                      className="contact-faq-question"
                      onClick={() => toggleFaq(0)}
                      aria-expanded={openFaq[0]}
                      aria-controls="faq-ans-0"
                    >
                      <span>Quand reçois-je ma clé de licence ?</span>
                      <ChevronDown
                        size={16}
                        className={`text-[#B99A5A] shrink-0 transition-transform duration-200 ${
                          openFaq[0] ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    {openFaq[0] && (
                      <div id="faq-ans-0" className="contact-faq-answer">
                        Dès validation de votre commande, la clé vous est envoyée instantanément par
                        email avec votre facture PDF et le guide de démarrage rapide.
                      </div>
                    )}
                  </div>

                  {/* Q2 */}
                  <div className="contact-faq-item">
                    <button
                      type="button"
                      className="contact-faq-question"
                      onClick={() => toggleFaq(1)}
                      aria-expanded={openFaq[1]}
                      aria-controls="faq-ans-1"
                    >
                      <span>Puis-je changer d&apos;ordinateur plus tard ?</span>
                      <ChevronDown
                        size={16}
                        className={`text-[#B99A5A] shrink-0 transition-transform duration-200 ${
                          openFaq[1] ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    {openFaq[1] && (
                      <div id="faq-ans-1" className="contact-faq-answer">
                        Oui, l&apos;administrateur peut autoriser le transfert ou libérer le poste
                        défectueux pour réattribuer le slot à votre nouvelle machine en toute
                        simplicité.
                      </div>
                    )}
                  </div>

                  {/* Q3 */}
                  <div className="contact-faq-item">
                    <button
                      type="button"
                      className="contact-faq-question"
                      onClick={() => toggleFaq(2)}
                      aria-expanded={openFaq[2]}
                      aria-controls="faq-ans-2"
                    >
                      <span>Le logiciel nécessite-t-il Internet ?</span>
                      <ChevronDown
                        size={16}
                        className={`text-[#B99A5A] shrink-0 transition-transform duration-200 ${
                          openFaq[2] ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    {openFaq[2] && (
                      <div id="faq-ans-2" className="contact-faq-answer">
                        Non, seule la première activation s&apos;effectue en ligne. L&apos;impression, la
                        conversion des montants et l&apos;utilisation quotidienne sont 100% hors-ligne.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
