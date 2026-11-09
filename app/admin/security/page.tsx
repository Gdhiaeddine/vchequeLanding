'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShieldCheck, RefreshCw, Key, CheckCircle2, AlertCircle, Copy } from 'lucide-react';

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
    return <div className="p-12 text-center text-xs text-[#86928b]">Chargement des paramètres de sécurité...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e2dcce] shadow-sm">
        <div>
          <h2 className="text-2xl font-bold font-serif text-[#122620]">Sécurité & Authentification 2FA</h2>
          <p className="text-xs text-[#6b7c74] mt-0.5">
            Protection du portail administrateur par TOTP et codes de récupération d'urgence
          </p>
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
      <div className="p-8 rounded-3xl bg-white border border-[#e2dcce] shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-6 border-b border-[#f4f0e6]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif text-[#122620]">
                Authentification à deux facteurs (TOTP)
              </h3>
              <p className="text-xs text-[#6b7c74]">
                Statut actuel : <strong className="text-emerald-700">Activée et obligatoire</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={actionLoading}
            onClick={handleStartSetup}
            className="px-4 py-2 rounded-xl bg-[#f4f0e6] text-[#122620] text-xs font-bold hover:bg-[#b99a5a] hover:text-white transition-all"
          >
            Reconfigurer l’application 2FA
          </button>
        </div>

        {/* QR Code Setup Modal / Flow */}
        {setupState && (
          <div className="p-6 rounded-2xl bg-[#fcfaf5] border-2 border-[#b99a5a] space-y-4">
            <h4 className="font-bold text-sm text-[#122620]">
              Scanner le QR code dans Google Authenticator ou Microsoft Authenticator
            </h4>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="bg-white p-2 rounded-xl border border-[#e2dcce] shadow-sm">
                <img
                  src={setupState.qrCode}
                  alt="QR Code 2FA"
                  width={180}
                  height={180}
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[#86928b]">Clé secrète de secours :</span>
                  <div className="font-mono font-bold text-[#122620] text-sm bg-white p-2 rounded border border-[#e2dcce] select-all">
                    {setupState.secret}
                  </div>
                </div>

                <form onSubmit={handleConfirmSetup} className="space-y-2">
                  <label className="block text-[11px] font-bold text-[#35433d] uppercase">
                    Entrez le code à 6 chiffres pour valider :
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="123456"
                      className="px-3 py-1.5 rounded-lg border border-[#e2dcce] bg-white font-mono font-bold text-center w-28 text-base"
                      value={confirmCode}
                      onChange={(e) => setConfirmCode(e.target.value)}
                    />
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="btn btn-primary px-4 py-1.5 rounded-lg text-xs font-bold"
                    >
                      Confirmer
                    </button>
                    <button
                      type="button"
                      onClick={() => setSetupState(null)}
                      className="px-3 py-1.5 rounded-lg text-xs text-[#6b7c74] hover:bg-gray-100"
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
            <h4 className="font-bold text-sm text-[#122620] flex items-center gap-2">
              <Key size={16} className="text-[#b99a5a]" />
              <span>Codes de secours d’urgence</span>
            </h4>
            <p className="text-xs text-[#6b7c74] mt-0.5">
              {data?.recoveryCodesCount || 0} code(s) de récupération restant(s) pour accéder en cas de perte de votre téléphone.
            </p>
          </div>

          <button
            type="button"
            disabled={actionLoading}
            onClick={handleRegenerateCodes}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#122620] text-white text-xs font-bold hover:bg-[#1a382f] shadow-sm"
          >
            <RefreshCw size={14} />
            <span>Régénérer 8 nouveaux codes</span>
          </button>
        </div>

        {/* Display generated recovery codes */}
        {recoveryCodes && (
          <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
            <h4 className="font-bold text-amber-900 text-xs uppercase tracking-wider">
              Enregistrez immédiatement vos nouveaux codes de secours :
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs font-bold text-[#122620]">
              {recoveryCodes.map((code, idx) => (
                <div key={idx} className="p-2 rounded bg-white border border-amber-200 text-center select-all">
                  {code}
                </div>
              ))}
            </div>
            <p className="text-[11px] text-amber-800">
              Chaque code est à usage unique. Conservez-les dans un gestionnaire de mots de passe sécurisé.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
