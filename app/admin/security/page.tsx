'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShieldCheck, RefreshCw, Key, CheckCircle2, AlertCircle, Copy, Lock } from 'lucide-react';

export default function AdminSecurityPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const [setupState, setSetupState] = useState<{ secret: string; qrCode: string } | null>(null);
  const [confirmCode, setConfirmCode] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
    </div>
  );
}
