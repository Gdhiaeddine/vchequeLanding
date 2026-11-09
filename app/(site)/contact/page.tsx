'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject_type: 'achat',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Une erreur est survenue lors de l'envoi.");
      }

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject_type: 'achat',
        subject: '',
        message: '',
      });
    } catch (err: any) {
      setError(err.message || "Erreur de connexion avec le serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 bg-[#fdfbf7]">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-wider text-[#b99a5a] mb-2">
            Service Client & Support
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#122620] font-serif mb-4">
            Contactez l’équipe VCheque
          </h1>
          <p className="text-[#4f5f58] text-base leading-relaxed">
            Une question technique, une demande de devis multi-postes ou un accompagnement pour vos banques ? Nous vous répondons sous 24h.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-2xl bg-white border border-[#e2dcce] shadow-sm">
              <h3 className="text-xl font-bold text-[#122620] mb-6 font-serif">Coordonnées directes</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#fcfaf5] border border-[#e2dcce] flex items-center justify-center shrink-0">
                    <Mail className="text-[#b99a5a]" size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-[#86928b] font-medium uppercase">Email commercial & support</div>
                    <a href="mailto:contact@virtanis.dz" className="text-sm font-semibold text-[#122620] hover:text-[#b99a5a]">
                      contact@virtanis.dz
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#fcfaf5] border border-[#e2dcce] flex items-center justify-center shrink-0">
                    <Phone className="text-[#b99a5a]" size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-[#86928b] font-medium uppercase">Téléphone & WhatsApp</div>
                    <div className="text-sm font-semibold text-[#122620]">+213 (0) 550 00 00 00</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#fcfaf5] border border-[#e2dcce] flex items-center justify-center shrink-0">
                    <MapPin className="text-[#b99a5a]" size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-[#86928b] font-medium uppercase">Localisation</div>
                    <div className="text-sm font-semibold text-[#122620]">Alger, Algérie</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#122620] text-white">
              <h4 className="font-bold text-[#fbf9f4] mb-2 font-serif">Horaires d'assistance</h4>
              <p className="text-xs text-[#c5cdc8] leading-relaxed">
                Du Dimanche au Jeudi : 08h30 – 17h00. Les tickets de support envoyés le week-end sont traités en priorité le dimanche matin.
              </p>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-2xl bg-white border border-[#e2dcce] shadow-xl">
              {success ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#122620] mb-2 font-serif">Message envoyé !</h3>
                  <p className="text-sm text-[#4f5f58] max-w-md mx-auto mb-6">
                    Merci pour votre message. Un conseiller VCheque prendra contact avec vous dans les plus brefs délais.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className="btn btn-primary px-6 py-2.5 rounded-lg text-sm font-semibold"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
                      <AlertCircle size={18} className="shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-[#35433d] mb-1.5">
                        Nom complet <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-[#e2dcce] bg-[#fdfbf7] text-sm focus:border-[#b99a5a] focus:outline-none"
                        placeholder="Karim Meziane"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-[#35433d] mb-1.5">
                        Adresse email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-[#e2dcce] bg-[#fdfbf7] text-sm focus:border-[#b99a5a] focus:outline-none"
                        placeholder="k.meziane@entreprise.dz"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-[#35433d] mb-1.5">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        className="w-full px-4 py-2.5 rounded-lg border border-[#e2dcce] bg-[#fdfbf7] text-sm focus:border-[#b99a5a] focus:outline-none"
                        placeholder="0550 12 34 56"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-[#35433d] mb-1.5">
                        Entreprise / Société
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 rounded-lg border border-[#e2dcce] bg-[#fdfbf7] text-sm focus:border-[#b99a5a] focus:outline-none"
                        placeholder="SARL Bâtiment & Travaux"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-[#35433d] mb-1.5">
                        Nature de la demande
                      </label>
                      <select
                        className="w-full px-4 py-2.5 rounded-lg border border-[#e2dcce] bg-[#fdfbf7] text-sm focus:border-[#b99a5a] focus:outline-none"
                        value={formData.subject_type}
                        onChange={(e) => setFormData({ ...formData, subject_type: e.target.value })}
                      >
                        <option value="achat">Achat ou devis commercial</option>
                        <option value="support">Support technique ou activation</option>
                        <option value="banque">Demande de modèle bancaire spécifique</option>
                        <option value="partenariat">Partenariat ou distribution</option>
                        <option value="autre">Autre renseignement</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-[#35433d] mb-1.5">
                        Objet <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-[#e2dcce] bg-[#fdfbf7] text-sm focus:border-[#b99a5a] focus:outline-none"
                        placeholder="Ex: Demande de facture proforma pour 3 postes"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#35433d] mb-1.5">
                      Votre message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      className="w-full px-4 py-2.5 rounded-lg border border-[#e2dcce] bg-[#fdfbf7] text-sm focus:border-[#b99a5a] focus:outline-none"
                      placeholder="Détaillez votre question ou votre besoin spécifique..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full py-3.5 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2"
                  >
                    <Send size={16} />
                    <span>{loading ? 'Envoi en cours...' : 'Envoyer mon message'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
