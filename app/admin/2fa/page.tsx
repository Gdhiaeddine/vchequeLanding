'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';

export default function TwoFactorChallengePage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/auth/2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Code 2FA invalide.');
      }

      router.push(data.redirect || '/admin');
    } catch (err: any) {
      setError(err.message || 'Erreur de vérification.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#e2dcce] shadow-2xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <ShieldCheck size={36} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif text-[#102C25] font-normal tracking-tight mb-2">
          Vérification à deux facteurs
        </h1>
        <p className="text-xs text-[#6b7c74] mb-8 leading-relaxed">
          Entrez le code à 6 chiffres généré par votre application d'authentification (Google Authenticator, Microsoft Authenticator) ou un code de secours.
        </p>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 text-left">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              autoFocus
              required
              maxLength={12}
              placeholder="123 456"
              className="w-full text-center tracking-widest text-2xl font-mono py-3.5 rounded-xl border-2 border-[#b99a5a] bg-[#fdfbf7] text-[#122620] font-bold focus:outline-none"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-3.5 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Vérification...' : 'Valider et continuer'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#f4f0e6] text-xs text-[#86928b]">
          Un problème d'accès ? Contactez l'administrateur système pour réinitialiser vos facteurs de sécurité.
        </div>
      </div>
    </div>
  </div>
);
}
