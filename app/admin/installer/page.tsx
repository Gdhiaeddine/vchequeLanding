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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e2dcce] shadow-sm">
        <div>
          <h2 className="text-2xl font-bold font-serif text-[#122620]">Gestion de l’Installateur Windows</h2>
          <p className="text-xs text-[#6b7c74] mt-0.5">
            Téléversement et déploiement des exécutables officiels (.exe / .msi)
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

      {/* Uploader Form */}
      <div className="p-8 rounded-3xl bg-white border border-[#e2dcce] shadow-md">
        <h3 className="text-lg font-bold font-serif text-[#122620] mb-4 flex items-center gap-2">
          <Upload size={18} className="text-[#b99a5a]" />
          <span>Publier une nouvelle version de VCheque</span>
        </h3>

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#35433d] mb-1.5">
                Fichier d'installation (.exe) <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept=".exe,.msi"
                required
                className="w-full px-4 py-2 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] text-xs"
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
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] text-sm font-mono"
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
              rows={2}
              placeholder="Ex: Correction de l'alignement sur imprimantes Epson, ajout du modèle BNA 2026..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] text-sm"
              value={releaseNotes}
              onChange={(e) => setReleaseNotes(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={uploading || !selectedFile || !version}
              className="btn btn-primary px-6 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-2"
            >
              <Upload size={15} />
              <span>{uploading ? 'Téléversement en cours...' : 'Téléverser et analyser'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Releases List Table */}
      <div className="p-8 rounded-3xl bg-white border border-[#e2dcce] shadow-md">
        <h3 className="text-lg font-bold font-serif text-[#122620] mb-4">Historique des versions</h3>

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
              {releases.map((rel: any) => (
                <tr key={rel.id} className="hover:bg-[#fdfbf7]">
                  <td className="p-4 font-mono font-bold text-base text-[#122620]">
                    v{rel.version}
                  </td>
                  <td className="p-4 font-mono text-[11px] text-[#35433d]">{rel.filename}</td>
                  <td className="p-4 text-[#6b7c74]">
                    {(rel.file_size / (1024 * 1024)).toFixed(1)} Mo
                  </td>
                  <td className="p-4 font-bold text-[#122620]">{rel.download_count}</td>
                  <td className="p-4">
                    {rel.is_active ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                        Active (En ligne)
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-wider">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {!rel.is_active && (
                      <button
                        type="button"
                        onClick={() => handleAction(rel.id, 'activate')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100"
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
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
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
