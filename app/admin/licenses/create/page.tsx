'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { KeyRound, ArrowLeft, PlusCircle, AlertCircle } from 'lucide-react';

export default function CreateLicensePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    license_key: '',
    licensee_name: '',
    licensee_email: '',
    company: '',
    edition: 'COMMERCIAL',
    max_activations: 1,
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/licenses/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de la création de la licence.');
      }

      router.push(`/admin/licenses/${data.license.id}`);
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/admin/licenses"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#6b7c74] hover:text-[#122620]"
      >
        <ArrowLeft size={16} />
        <span>Retour aux licences</span>
      </Link>

      <div className="p-8 rounded-3xl bg-white border border-[#e2dcce] shadow-xl">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#f4f0e6]">
          <div className="w-12 h-12 rounded-xl bg-[#122620] text-[#b99a5a] flex items-center justify-center">
            <KeyRound size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-serif text-[#102C25] font-normal tracking-tight">
              Émettre une nouvelle licence
            </h2>
            <p className="text-xs text-[#6b7c74]">
              Génération manuelle avec signature cryptographique Ed25519
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#35433d] mb-1.5">
                Nom du titulaire / Contact <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Ahmed Benmoussa"
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] text-sm focus:border-[#b99a5a] focus:outline-none"
                value={formData.licensee_name}
                onChange={(e) => setFormData({ ...formData, licensee_name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#35433d] mb-1.5">
                Email de notification <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="Ex: client@entreprise.dz"
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] text-sm focus:border-[#b99a5a] focus:outline-none"
                value={formData.licensee_email}
                onChange={(e) => setFormData({ ...formData, licensee_email: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#35433d] mb-1.5">
                Entreprise / Établissement
              </label>
              <input
                type="text"
                placeholder="Ex: SARL Pharmacie Centrale"
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] text-sm focus:border-[#b99a5a] focus:outline-none"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#35433d] mb-1.5">
                Quota de postes autorisés (PC)
              </label>
              <input
                type="number"
                min={1}
                max={50}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] text-sm focus:border-[#b99a5a] focus:outline-none"
                value={formData.max_activations}
                onChange={(e) =>
                  setFormData({ ...formData, max_activations: parseInt(e.target.value, 10) || 1 })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#35433d] mb-1.5">
                Clé personnalisée (Optionnel)
              </label>
              <input
                type="text"
                placeholder="Laissez vide pour auto-génération VCHQ-XXXX-..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] text-sm font-mono focus:border-[#b99a5a] focus:outline-none uppercase"
                value={formData.license_key}
                onChange={(e) => setFormData({ ...formData, license_key: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#35433d] mb-1.5">
                Édition de licence
              </label>
              <div className="w-full px-4 py-2.5 rounded-xl border border-[#e2dcce] bg-[#fcfaf5] text-sm text-[#122620] flex items-center justify-between">
                <span className="font-semibold">Licence Commerciale Permanente</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                  Unique
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[#35433d] mb-1.5">
              Notes internes / Référence bon de commande
            </label>
            <textarea
              rows={3}
              placeholder="Ex: Chèque reçu le 09/11/2026, bon de commande N°456"
              className="w-full px-4 py-2.5 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] text-sm focus:border-[#b99a5a] focus:outline-none"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="pt-4 border-t border-[#f4f0e6] flex items-center justify-end gap-3">
            <Link
              href="/admin/licenses"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-[#e2dcce] text-[#122620] hover:bg-[#fcfaf5]"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary px-6 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-2"
            >
              <PlusCircle size={16} />
              <span>{loading ? 'Création en cours...' : 'Générer et Enregistrer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
