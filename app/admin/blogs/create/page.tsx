'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, PlusCircle, AlertCircle } from 'lucide-react';

export default function CreateBlogPostPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'conseils',
    excerpt: '',
    content: '',
    status: 'published',
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('slug', formData.slug);
      form.append('category', formData.category);
      form.append('excerpt', formData.excerpt);
      form.append('content', formData.content);
      form.append('status', formData.status);
      if (coverFile) form.append('cover', coverFile);

      const res = await fetch('/api/admin/blogs', {
        method: 'POST',
        body: form,
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      router.push('/admin/blogs');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href="/admin/blogs"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#6b7c74] hover:text-[#122620]"
      >
        <ArrowLeft size={16} />
        <span>Retour aux articles</span>
      </Link>

      <div className="p-8 rounded-3xl bg-white border border-[#e2dcce] shadow-xl">
        <h2 className="text-2xl font-bold font-serif text-[#122620] mb-6 pb-4 border-b border-[#f4f0e6]">
          Rédiger un nouvel article
        </h2>

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
                Titre de l'article <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Les 5 pièges à éviter lors de l'impression de chèques CPA"
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] text-sm"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#35433d] mb-1.5">
                Catégorie
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] text-sm"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="conseils">Conseils & Astuces</option>
                <option value="reglementation">Réglementation & Droit</option>
                <option value="tutoriels">Tutoriels Logiciel</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#35433d] mb-1.5">
                Slug URL (Optionnel)
              </label>
              <input
                type="text"
                placeholder="auto-généré si vide"
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] text-sm font-mono"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#35433d] mb-1.5">
                Image de couverture (JPG/PNG/WEBP)
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full px-4 py-2 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] text-xs"
                onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[#35433d] mb-1.5">
              Extrait court (Résumé)
            </label>
            <textarea
              rows={2}
              placeholder="Bref résumé accrocheur pour la liste des articles..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] text-sm"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[#35433d] mb-1.5">
              Contenu de l'article (Markdown) <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={12}
              required
              placeholder="Utilisez ## pour les sous-titres, > pour les citations et - pour les listes..."
              className="w-full px-4 py-3 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] text-sm font-mono leading-relaxed"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          <div className="pt-4 border-t border-[#f4f0e6] flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-semibold text-[#122620] cursor-pointer">
              <input
                type="checkbox"
                checked={formData.status === 'published'}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.checked ? 'published' : 'draft' })
                }
                className="rounded"
              />
              <span>Publier immédiatement sur le site</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary px-6 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-2"
            >
              <PlusCircle size={16} />
              <span>{loading ? 'Enregistrement...' : 'Enregistrer l’article'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
