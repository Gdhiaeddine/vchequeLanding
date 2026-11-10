'use client';

import React, { useState, useEffect } from 'react';
import { Download, Upload, Trash2, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminInstallerPage() {
  const [releases, setReleases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [version, setVersion] = useState('');
  const [releaseNotes, setReleaseNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchReleases = async () => {
    try {
      const res = await fetch('/api/admin/installer/list');
      const data = await res.json();
      if (res.ok && data.success) {
        setReleases(data.releases);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReleases();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !version) return;

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('version', version);
      formData.append('release_notes', releaseNotes);

      const res = await fetch('/api/admin/installer/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors du téléversement');
      }

      setMessage({ type: 'success', text: 'Nouvelle version téléversée avec succès.' });
      setVersion('');
      setReleaseNotes('');
      setSelectedFile(null);
      await fetchReleases();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setUploading(false);
    }
  };

  const handleAction = async (id: number, action: 'activate' | 'delete') => {
    try {
      const res = await fetch(`/api/admin/installer/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      await fetchReleases();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e2dcce] shadow-sm">
        <div>
          <h2 className="text-3xl font-serif text-[#102C25] font-normal tracking-tight">Gestion de l’Installateur Windows</h2>
          <p className="text-xs text-[#6b7c74] mt-0.5">
            Téléversement et déploiement des exécutables officiels (.exe / .msi)
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-[#f4f0e6] text-[#122620] font-semibold">
            {releases.length} version(s) répertoriée(s)
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

      {/* Uploader Form Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#e2dcce] shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#f4f0e6]">
          <div className="w-10 h-10 rounded-xl bg-[#122620] text-[#b99a5a] flex items-center justify-center shrink-0">
            <Upload size={20} />
          </div>
          <div>
            <h3 className="text-lg font-serif text-[#102C25] font-normal tracking-tight">
              Publier une nouvelle version de VCheque
            </h3>
            <p className="text-xs text-[#6b7c74]">
              Téléversement sécurisé, calcul d&apos;empreinte SHA-256 et mise en ligne du binaire
            </p>
          </div>
        </div>

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#35433d] mb-1.5">
                Fichier d&apos;installation (.exe, .msi) <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept=".exe,.msi"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] text-xs text-[#122620] focus:border-[#b99a5a] focus:outline-none transition-all"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#35433d] mb-1.5">
                Numéro de version (ex: 1.0.1) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="1.0.1"
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] text-xs sm:text-sm font-mono text-[#122620] placeholder-[#86928b] focus:border-[#b99a5a] focus:outline-none transition-all"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[#35433d] mb-1.5">
              Notes de publication (Changelog)
            </label>
            <textarea
              rows={3}
              placeholder="Ex: Correction de l'alignement sur imprimantes Epson, ajout du modèle BNA 2026..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] text-xs sm:text-sm text-[#122620] placeholder-[#86928b] focus:border-[#b99a5a] focus:outline-none transition-all"
              value={releaseNotes}
              onChange={(e) => setReleaseNotes(e.target.value)}
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={uploading || !selectedFile || !version}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#122620] text-white hover:bg-[#1a382f] text-xs font-bold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload size={15} />
              <span>{uploading ? 'Téléversement en cours...' : 'Téléverser et analyser'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Releases List Table Card */}
      <div className="bg-white rounded-2xl border border-[#e2dcce] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#e2dcce] flex items-center justify-between">
          <div>
            <h3 className="text-lg font-serif text-[#102C25] font-normal tracking-tight">Historique des versions</h3>
            <p className="text-xs text-[#6b7c74] mt-0.5">
              Liste des exécutables disponibles en téléchargement direct ou mises à jour
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#fcfaf5] text-[#86928b] uppercase border-b border-[#e2dcce]">
                <th className="p-4 font-bold">Version</th>
                <th className="p-4 font-bold">Nom du fichier</th>
                <th className="p-4 font-bold">Taille</th>
                <th className="p-4 font-bold">Téléchargements</th>
                <th className="p-4 font-bold">Statut</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f0e6]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-[#6b7c74]">
                    Chargement des versions...
                  </td>
                </tr>
              ) : releases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-[#86928b]">
                    Aucune version téléversée pour le moment.
                  </td>
                </tr>
              ) : (
                releases.map((rel: any) => (
                  <tr key={rel.id} className="hover:bg-[#fdfbf7] transition-colors">
                    <td className="p-4 font-mono font-bold text-[#122620]">
                      v{rel.version}
                    </td>
                    <td className="p-4 font-mono text-[11px] text-[#6b7c74]">{rel.filename}</td>
                    <td className="p-4 text-[#6b7c74]">
                      {(rel.file_size / (1024 * 1024)).toFixed(1)} Mo
                    </td>
                    <td className="p-4 font-semibold text-[#122620]">{rel.download_count}</td>
                    <td className="p-4">
                      {rel.is_active ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                          Active (En ligne)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-100 text-gray-700">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {!rel.is_active && (
                        <button
                          type="button"
                          onClick={() => handleAction(rel.id, 'activate')}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold hover:bg-emerald-100 transition-all text-[11px]"
                        >
                          Activer
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Supprimer définitivement la version v${rel.version} ?`)) {
                            handleAction(rel.id, 'delete');
                          }
                        }}
                        className="inline-flex items-center p-1.5 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-all"
                        title="Supprimer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
