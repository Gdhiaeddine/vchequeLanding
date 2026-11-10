'use client';

import React, { useState, useEffect } from 'react';
import { Video, Upload, Trash2, CheckCircle2, Play, AlertCircle } from 'lucide-react';

export default function AdminDemonstrationPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/admin/demonstration');
      const data = await res.json();
      if (res.ok && data.success) {
        setVideos(data.videos);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !title) return;

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', title);
      formData.append('description', description);

      const res = await fetch('/api/admin/demonstration', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      setMessage({ type: 'success', text: 'Vidéo téléversée avec succès.' });
      setTitle('');
      setDescription('');
      setSelectedFile(null);
      await fetchVideos();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setUploading(false);
    }
  };

  const handleAction = async (videoId: number, action: 'activate' | 'delete') => {
    try {
      const res = await fetch('/api/admin/demonstration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, videoId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      await fetchVideos();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e2dcce] shadow-sm">
        <div>
          <h2 className="text-3xl font-serif text-[#102C25] font-normal tracking-tight">Vidéo de Démonstration</h2>
          <p className="text-xs text-[#6b7c74] mt-0.5">
            Gestion du média vidéo diffusé publiquement sur la page /demonstration
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-[#f4f0e6] text-[#122620] font-semibold">
            {videos.length} vidéo(s) enregistrée(s)
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

      {/* Upload Form Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#e2dcce] shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#f4f0e6]">
          <div className="w-10 h-10 rounded-xl bg-[#122620] text-[#b99a5a] flex items-center justify-center shrink-0">
            <Video size={20} />
          </div>
          <div>
            <h3 className="text-lg font-serif text-[#102C25] font-normal tracking-tight">
              Téléverser une vidéo (.mp4)
            </h3>
            <p className="text-xs text-[#6b7c74]">
              Démonstration officielle du logiciel, tutoriels et guides visuels
            </p>
          </div>
        </div>

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#35433d] mb-1.5">
                Fichier vidéo MP4 <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="video/mp4"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] text-xs text-[#122620] focus:border-[#b99a5a] focus:outline-none transition-all"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#35433d] mb-1.5">
                Titre de la vidéo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Démonstration officielle VCheque 2026"
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] text-xs sm:text-sm text-[#122620] placeholder-[#86928b] focus:border-[#b99a5a] focus:outline-none transition-all"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[#35433d] mb-1.5">
              Description / Notes
            </label>
            <textarea
              rows={3}
              placeholder="Ex: Tutoriel complet de remplissage et calibrage sur imprimante HP..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] text-xs sm:text-sm text-[#122620] placeholder-[#86928b] focus:border-[#b99a5a] focus:outline-none transition-all"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={uploading || !selectedFile || !title}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#122620] text-white hover:bg-[#1a382f] text-xs font-bold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload size={15} />
              <span>{uploading ? 'Téléversement en cours...' : 'Téléverser la vidéo'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Videos List Table Card */}
      <div className="bg-white rounded-2xl border border-[#e2dcce] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#e2dcce] flex items-center justify-between">
          <div>
            <h3 className="text-lg font-serif text-[#102C25] font-normal tracking-tight">Vidéos enregistrées</h3>
            <p className="text-xs text-[#6b7c74] mt-0.5">
              Sélectionnez la vidéo active diffusée sur le lecteur public
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#fcfaf5] text-[#86928b] uppercase border-b border-[#e2dcce]">
                <th className="p-4 font-bold">Titre</th>
                <th className="p-4 font-bold">Fichier</th>
                <th className="p-4 font-bold">Taille</th>
                <th className="p-4 font-bold">Statut</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f0e6]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-xs text-[#6b7c74]">
                    Chargement des vidéos...
                  </td>
                </tr>
              ) : videos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-xs text-[#86928b]">
                    Aucune vidéo enregistrée pour le moment.
                  </td>
                </tr>
              ) : (
                videos.map((vid: any) => (
                  <tr key={vid.id} className="hover:bg-[#fdfbf7] transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-xs sm:text-sm text-[#122620]">{vid.title}</div>
                      {vid.description && (
                        <div className="text-[11px] text-[#6b7c74] line-clamp-1 mt-0.5">
                          {vid.description}
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-mono text-[11px] text-[#6b7c74]">{vid.filename}</td>
                    <td className="p-4 text-[#6b7c74]">
                      {(vid.file_size / (1024 * 1024)).toFixed(1)} Mo
                    </td>
                    <td className="p-4">
                      {vid.is_active ? (
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
                      {!vid.is_active && (
                        <button
                          type="button"
                          onClick={() => handleAction(vid.id, 'activate')}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold hover:bg-emerald-100 transition-all text-[11px]"
                        >
                          Activer
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Supprimer la vidéo "${vid.title}" ?`)) {
                            handleAction(vid.id, 'delete');
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
