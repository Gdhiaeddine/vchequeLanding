'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShieldCheck, RefreshCw, Key, CheckCircle2, AlertCircle, Copy, Lock, Mail, UserCheck } from 'lucide-react';

export default function AdminSecurityPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const [setupState, setSetupState] = useState<{ secret: string; qrCode: string } | null>(null);
  const [confirmCode, setConfirmCode] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Formulaire de modification d'identifiants
  const [credForm, setCredForm] = useState({
    newEmail: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [credLoading, setCredLoading] = useState(false);

  const fetchSecurityData = async () => {
    try {
      const res = await fetch('/api/admin/security');
      const json = await res.json();
      if (res.ok && json.success) {
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!credForm.currentPassword) {
      setMessage({ type: 'error', text: 'Veuillez saisir votre mot de passe actuel pour valider les modifications.' });
      return;
    }

    if (credForm.newPassword && credForm.newPassword !== credForm.confirmPassword) {
      setMessage({ type: 'error', text: 'La confirmation du mot de passe ne correspond pas au nouveau mot de passe.' });
      return;
    }

    if (credForm.newPassword && credForm.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Le nouveau mot de passe doit comporter au moins 8 caractères.' });
      return;
    }

    if (!credForm.newEmail && !credForm.newPassword) {
      setMessage({ type: 'error', text: 'Veuillez renseigner un nouvel email ou un nouveau mot de passe.' });
      return;
    }

    setCredLoading(true);
    try {
      const res = await fetch('/api/admin/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change_credentials',
          currentPassword: credForm.currentPassword,
          newEmail: credForm.newEmail ? credForm.newEmail.trim() : undefined,
          newPassword: credForm.newPassword ? credForm.newPassword.trim() : undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Erreur lors de la mise à jour des identifiants.');
      }

      setMessage({ type: 'success', text: json.message || 'Identifiants modifiés avec succès.' });
      setCredForm({ newEmail: '', currentPassword: '', newPassword: '', confirmPassword: '' });
      await fetchSecurityData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setCredLoading(false);
    }
  };

  const handleRegenerateCodes = async () => {
    if (!confirm('Régénérer vos codes de secours ? Les anciens codes seront invalidés.')) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'regenerate_recovery_codes' }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setRecoveryCodes(json.recoveryCodes);
        setMessage({ type: 'success', text: 'Nouveaux codes de secours générés avec succès.' });
        await fetchSecurityData();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartSetup = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start_setup' }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setSetupState(json);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupState || !confirmCode) return;
    setActionLoading(true);

    try {
      const res = await fetch('/api/admin/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'confirm_setup',
          secret: setupState.secret,
          code: confirmCode,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Code invalide');

      setSetupState(null);
      setRecoveryCodes(json.recoveryCodes);
      setMessage({ type: 'success', text: 'Authentification 2FA reconfigurée avec succès !' });
      await fetchSecurityData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-[#86928b]">
        Chargement des paramètres de sécurité...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e2dcce] shadow-sm">
        <div>
          <h2 className="text-3xl font-serif text-[#102C25] font-normal tracking-tight">Sécurité & Authentification 2FA</h2>
          <p className="text-xs text-[#6b7c74] mt-0.5">
            Protection du portail administrateur par TOTP et codes de récupération d&apos;urgence
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-[#f4f0e6] text-[#122620] font-semibold flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-700" />
            <span>2FA Obligatoire</span>
          </span>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* 2FA Status Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#e2dcce] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#f4f0e6]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#122620] text-[#b99a5a] flex items-center justify-center shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="text-lg font-serif text-[#102C25] font-normal tracking-tight">
                Authentification à deux facteurs (TOTP)
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-[#6b7c74]">Statut :</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                  Activée &amp; Obligatoire
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled={actionLoading}
            onClick={handleStartSetup}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f4f0e6] text-[#122620] font-semibold hover:bg-[#b99a5a] hover:text-white transition-all text-xs"
          >
            Reconfigurer l’application 2FA
          </button>
        </div>

        {/* QR Code Setup Flow */}
        {setupState && (
          <div className="p-6 rounded-xl bg-[#fcfaf5] border border-[#b99a5a] space-y-4">
            <h4 className="font-serif text-base text-[#102C25] font-normal tracking-tight">
              Scanner le QR code dans Google Authenticator ou Microsoft Authenticator
            </h4>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="bg-white p-3 rounded-xl border border-[#e2dcce] shadow-sm">
                <img
                  src={setupState.qrCode}
                  alt="QR Code 2FA"
                  width={180}
                  height={180}
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-3 text-xs w-full sm:flex-1">
                <div>
                  <span className="text-[10px] text-[#86928b] uppercase font-semibold block mb-1">
                    Clé secrète de secours :
                  </span>
                  <div className="font-mono font-bold text-[#122620] text-sm bg-white p-2.5 rounded-xl border border-[#e2dcce] select-all">
                    {setupState.secret}
                  </div>
                </div>

                <form onSubmit={handleConfirmSetup} className="space-y-2 pt-2">
                  <label className="block text-xs font-semibold uppercase text-[#35433d]">
                    Entrez le code à 6 chiffres pour valider :
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="123456"
                      className="px-4 py-2 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] font-mono font-bold text-center w-32 text-base text-[#122620] focus:border-[#b99a5a] focus:outline-none transition-all"
                      value={confirmCode}
                      onChange={(e) => setConfirmCode(e.target.value)}
                    />
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#122620] text-white hover:bg-[#1a382f] text-xs font-bold shadow-sm transition-all disabled:opacity-50"
                    >
                      Confirmer
                    </button>
                    <button
                      type="button"
                      onClick={() => setSetupState(null)}
                      className="px-3 py-2 rounded-xl text-xs font-semibold text-[#6b7c74] hover:bg-[#f4f0e6] hover:text-[#122620] transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Recovery Codes Section */}
        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-serif text-[#102C25] font-normal tracking-tight flex items-center gap-2">
              <Key size={16} className="text-[#b99a5a]" />
              <span>Codes de secours d’urgence</span>
            </h4>
            <p className="text-xs text-[#6b7c74] mt-0.5">
              {data?.recoveryCodesCount || 0} code(s) restant(s) pour accéder au portail en cas d&apos;indisponibilité de votre mobile
            </p>
          </div>

          <button
            type="button"
            disabled={actionLoading}
            onClick={handleRegenerateCodes}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#122620] text-white hover:bg-[#1a382f] text-xs font-bold shadow-sm transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} className={actionLoading ? 'animate-spin' : ''} />
            <span>Régénérer 8 nouveaux codes</span>
          </button>
        </div>

        {/* Display generated recovery codes */}
        {recoveryCodes && (
          <div className="p-6 rounded-xl bg-[#fdfbf7] border border-[#e2dcce] space-y-3">
            <h5 className="font-bold text-[#122620] text-xs uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-700" />
              <span>Enregistrez immédiatement vos nouveaux codes de secours :</span>
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs font-bold text-[#122620]">
              {recoveryCodes.map((code, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-white border border-[#e2dcce] text-center font-mono font-bold text-xs text-[#122620] tracking-wider select-all shadow-xs hover:border-[#b99a5a] transition-colors"
                >
                  {code}
                </div>
              ))}
            </div>
            <p className="text-[11px] text-[#6b7c74] mt-1">
              Chaque code est à usage unique. Conservez-les dans un gestionnaire de mots de passe sécurisé.
            </p>
          </div>
        )}
      </div>

      {/* Modification Email & Mot de Passe Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#e2dcce] shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-[#f4f0e6]">
          <div className="w-12 h-12 rounded-xl bg-[#122620] text-[#b99a5a] flex items-center justify-center shrink-0">
            <Lock size={24} />
          </div>
          <div>
            <h3 className="text-lg font-serif text-[#102C25] font-normal tracking-tight">
              Identifiants de Connexion Administrateur
            </h3>
            <p className="text-xs text-[#6b7c74] mt-0.5">
              Modifiez votre adresse email de connexion ou votre mot de passe maître
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdateCredentials} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#35433d] mb-1.5">
                Adresse email actuelle
              </label>
              <input
                type="text"
                disabled
                value={data?.email || ''}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2dcce] bg-[#f4f0e6]/50 text-xs text-[#6b7c74] font-medium cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#35433d] mb-1.5">
                Nouvelle adresse email <span className="text-[#86928b] font-normal lowercase">(optionnel)</span>
              </label>
              <input
                type="email"
                placeholder="Ex: nouveau-mail@virtanis.net"
                value={credForm.newEmail}
                onChange={(e) => setCredForm((prev) => ({ ...prev, newEmail: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] text-xs text-[#122620] focus:border-[#b99a5a] focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-[#f4f0e6]">
            <label className="block text-xs font-semibold uppercase text-[#35433d] mb-1.5">
              Mot de passe actuel <span className="text-red-700">* (requis pour confirmer)</span>
            </label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={credForm.currentPassword}
              onChange={(e) => setCredForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
              className="w-full max-w-md px-4 py-2.5 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] text-xs text-[#122620] focus:border-[#b99a5a] focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#35433d] mb-1.5">
                Nouveau mot de passe <span className="text-[#86928b] font-normal lowercase">(optionnel, min. 8 car.)</span>
              </label>
              <input
                type="password"
                placeholder="Nouveau mot de passe fort"
                value={credForm.newPassword}
                onChange={(e) => setCredForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] text-xs text-[#122620] focus:border-[#b99a5a] focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#35433d] mb-1.5">
                Confirmer le nouveau mot de passe
              </label>
              <input
                type="password"
                placeholder="Répéter le nouveau mot de passe"
                value={credForm.confirmPassword}
                onChange={(e) => setCredForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] text-xs text-[#122620] focus:border-[#b99a5a] focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={credLoading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#122620] text-white hover:bg-[#1a382f] text-xs font-bold shadow-sm transition-all disabled:opacity-50"
            >
              <Lock size={14} className={credLoading ? 'animate-spin' : ''} />
              <span>{credLoading ? 'Enregistrement en cours...' : 'Enregistrer les modifications'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
