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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e2dcce] shadow-sm">
        <div>
          <h2 className="text-2xl font-bold font-serif text-[#122620]">Vidéo de Démonstration</h2>
          <p className="text-xs text-[#6b7c74] mt-0.5">
            Gestion du média vidéo diffusé publiquement sur la page /demonstration
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

      {/* Upload Box */}
      <div className="p-8 rounded-3xl bg-white border border-[#e2dcce] shadow-md">
        <h3 className="text-lg font-bold font-serif text-[#122620] mb-4 flex items-center gap-2">
          <Upload size={18} className="text-[#b99a5a]" />
          <span>Téléverser une vidéo (.mp4)</span>
        </h3>

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
                className="w-full px-4 py-2 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] text-xs"
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
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] text-sm"
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
              rows={2}
              placeholder="Ex: Tutoriel complet de remplissage et calibrage sur imprimante HP"
              className="w-full px-4 py-2.5 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={uploading || !selectedFile || !title}
              className="btn btn-primary px-6 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-2"
            >
              <Upload size={15} />
              <span>{uploading ? 'Téléversement en cours...' : 'Téléverser la vidéo'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Videos List */}
      <div className="p-8 rounded-3xl bg-white border border-[#e2dcce] shadow-md">
        <h3 className="text-lg font-bold font-serif text-[#122620] mb-4">Vidéos enregistrées</h3>

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
              {videos.map((vid: any) => (
                <tr key={vid.id} className="hover:bg-[#fdfbf7]">
                  <td className="p-4 font-bold text-[#122620]">{vid.title}</td>
                  <td className="p-4 font-mono text-[11px] text-[#6b7c74]">{vid.filename}</td>
                  <td className="p-4 text-[#6b7c74]">
                    {(vid.file_size / (1024 * 1024)).toFixed(1)} Mo
                  </td>
                  <td className="p-4">
                    {vid.is_active ? (
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
                    {!vid.is_active && (
                      <button
                        type="button"
                        onClick={() => handleAction(vid.id, 'activate')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100"
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
