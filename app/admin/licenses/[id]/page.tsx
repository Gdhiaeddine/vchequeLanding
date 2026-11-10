'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  KeyRound,
  ArrowLeft,
  Download,
  Shield,
  RotateCw,
  Ban,
  CheckCircle2,
  XCircle,
  Copy,
  Sliders,
  History,
  Monitor,
} from 'lucide-react';
import CopyButton from '@/components/CopyButton';

export default function LicenseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [license, setLicense] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [newQuota, setNewQuota] = useState<number>(1);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchLicense = async () => {
    try {
      const res = await fetch(`/api/v1/license/history/${id}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setLicense(data.data);
        setNewQuota(data.data.license.max_activations || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLicense();
  }, [id]);

  const handleAction = async (action: string, extraData: any = {}) => {
    setActionLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/licenses/${license.license.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...extraData }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de l’opération.');
      }

      setMessage({ type: 'success', text: 'Opération effectuée avec succès.' });
      await fetchLicense();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-sm text-[#6b7c74]">Chargement des détails de la licence...</div>;
  }

  if (!license || !license.license) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-2xl font-serif text-[#102C25] font-normal tracking-tight">Licence introuvable</h2>
        <Link href="/admin/licenses" className="btn btn-primary mt-4 inline-block">
          Retour aux licences
        </Link>
      </div>
    );
  }

  const lic = license.license;
  const activations = license.activations || [];
  const auditLogs = license.audit_logs || [];
  const activeCount = activations.filter((a: any) => a.status === 'active').length;

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/licenses"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#6b7c74] hover:text-[#122620]"
        >
          <ArrowLeft size={16} />
          <span>Retour à la liste des licences</span>
        </Link>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Main License Card */}
      <div className="p-8 rounded-3xl bg-white border border-[#e2dcce] shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-[#f4f0e6]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#122620] text-[#b99a5a] flex items-center justify-center shrink-0 shadow-md">
              <KeyRound size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold font-mono text-[#122620]">{lic.license_key}</h2>
                <CopyButton text={lic.license_key} />
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    lic.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {lic.status}
                </span>
              </div>
              <p className="text-xs text-[#6b7c74] mt-1">
                Édition <strong className="text-[#122620]">{lic.edition}</strong> • Émise le{' '}
                {new Date(lic.created_at).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`/api/admin/licenses/${lic.id}/offline`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#f4f0e6] text-[#122620] text-xs font-bold hover:bg-[#b99a5a] hover:text-white transition-all shadow-xs"
            >
              <Download size={15} />
              <span>Télécharger fichier .lic (Hors-ligne)</span>
            </a>

            {lic.status === 'active' ? (
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => {
                  if (confirm('Voulez-vous vraiment révoquer définitivement cette licence ?')) {
                    handleAction('revoke', { reason: 'Révocation manuelle administrateur' });
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-50 text-red-700 text-xs font-bold border border-red-200 hover:bg-red-100 transition-all"
              >
                <Ban size={15} />
                <span>Révoquer</span>
              </button>
            ) : null}

            <button
              type="button"
              disabled={actionLoading}
              onClick={() => {
                if (confirm('Autoriser le transfert vers un nouveau PC ? L’ancien poste sera délié.')) {
                  handleAction('transfer', { reason: 'Transfert autorisé par admin' });
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 hover:bg-amber-100 transition-all"
            >
              <RotateCw size={15} />
              <span>Autoriser transfert</span>
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-6 text-xs">
          <div className="p-4 rounded-xl bg-[#fcfaf5] border border-[#e2dcce]">
            <div className="text-[#86928b] uppercase font-semibold">Titulaire</div>
            <div className="font-bold text-[#122620] text-sm mt-1">{lic.licensee_name}</div>
          </div>

          <div className="p-4 rounded-xl bg-[#fcfaf5] border border-[#e2dcce]">
            <div className="text-[#86928b] uppercase font-semibold">Email</div>
            <div className="font-bold text-[#122620] text-sm mt-1">{lic.licensee_email}</div>
          </div>

          <div className="p-4 rounded-xl bg-[#fcfaf5] border border-[#e2dcce]">
            <div className="text-[#86928b] uppercase font-semibold">Entreprise</div>
            <div className="font-bold text-[#122620] text-sm mt-1">{lic.company || 'Non renseignée'}</div>
          </div>

          <div className="p-4 rounded-xl bg-[#fcfaf5] border border-[#e2dcce]">
            <div className="text-[#86928b] uppercase font-semibold">Machine active actuelle</div>
            <div className="font-mono font-bold text-[#122620] text-xs mt-1 truncate">
              {lic.current_machine_id || 'Aucune machine liée'}
            </div>
          </div>
        </div>

        {/* Quota modifier */}
        <div className="mt-6 pt-6 border-t border-[#f4f0e6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sliders size={18} className="text-[#b99a5a]" />
            <div>
              <div className="font-bold text-sm text-[#122620]">
                Quota d’activations autorisées : {activeCount} / {lic.max_activations} PC
              </div>
              <div className="text-xs text-[#6b7c74]">
                Permet d’augmenter le nombre de machines pouvant utiliser simultanément cette licence.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={50}
              className="w-20 px-3 py-1.5 rounded-lg border border-[#e2dcce] text-xs font-bold text-center"
              value={newQuota}
              onChange={(e) => setNewQuota(parseInt(e.target.value, 10) || 1)}
            />
            <button
              type="button"
              disabled={actionLoading || newQuota === lic.max_activations}
              onClick={() => handleAction('update_quota', { quota: newQuota })}
              className="px-4 py-1.5 rounded-lg bg-[#122620] text-white text-xs font-bold hover:bg-[#1a382f]"
            >
              Mettre à jour le quota
            </button>
          </div>
        </div>
      </div>

      {/* Activations Section */}
      <div className="p-8 rounded-3xl bg-white border border-[#e2dcce] shadow-md">
        <h3 className="text-lg font-bold font-serif text-[#122620] mb-4 flex items-center gap-2">
          <Monitor size={18} className="text-emerald-700" />
          <span>Postes de travail (Machines activées)</span>
        </h3>

        {activations.length === 0 ? (
          <p className="text-xs text-[#86928b] italic">Aucune activation enregistrée pour le moment.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#fcfaf5] text-[#86928b] uppercase border-b border-[#e2dcce]">
                  <th className="p-3">Machine ID</th>
                  <th className="p-3">Nom du poste</th>
                  <th className="p-3">OS</th>
                  <th className="p-3">Adresse IP</th>
                  <th className="p-3">Date d'activation</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4f0e6]">
                {activations.map((act: any) => (
                  <tr key={act.id} className="hover:bg-[#fdfbf7]">
                    <td className="p-3 font-mono font-bold text-[#122620]">{act.machine_id}</td>
                    <td className="p-3">{act.machine_name || 'PC Windows'}</td>
                    <td className="p-3 text-[#6b7c74]">{act.os_info || 'Windows'}</td>
                    <td className="p-3 text-[#86928b]">{act.ip_address || '—'}</td>
                    <td className="p-3 text-[#6b7c74]">
                      {new Date(act.activated_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          act.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {act.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {act.status === 'active' && (
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => {
                            if (confirm('Libérer ce poste pour récupérer un slot de quota ?')) {
                              handleAction('deactivate_machine', { activationId: act.id });
                            }
                          }}
                          className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200 hover:bg-amber-100"
                        >
                          Détacher
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Audit Trail Section */}
      <div className="p-8 rounded-3xl bg-white border border-[#e2dcce] shadow-md">
        <h3 className="text-lg font-bold font-serif text-[#122620] mb-4 flex items-center gap-2">
          <History size={18} className="text-[#b99a5a]" />
          <span>Journal d'audit et traçabilité</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#fcfaf5] text-[#86928b] uppercase border-b border-[#e2dcce]">
                <th className="p-3">Date</th>
                <th className="p-3">Action</th>
                <th className="p-3">Acteur</th>
                <th className="p-3">IP</th>
                <th className="p-3">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f0e6]">
              {auditLogs.map((log: any) => (
                <tr key={log.id} className="hover:bg-[#fdfbf7]">
                  <td className="p-3 text-[#6b7c74] whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString('fr-FR')}
                  </td>
                  <td className="p-3 font-semibold text-[#122620]">{log.action}</td>
                  <td className="p-3 text-[#35433d]">{log.actor}</td>
                  <td className="p-3 text-[#86928b]">{log.ip_address || '—'}</td>
                  <td className="p-3 font-mono text-[10px] text-[#6b7c74] max-w-xs truncate">
                    {log.details || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
