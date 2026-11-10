'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, PlusCircle, AlertCircle, FileText } from 'lucide-react';

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
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#6b7c74] hover:text-[#122620] transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Retour aux articles</span>
      </Link>

      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#e2dcce] shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#f4f0e6]">
          <div className="w-10 h-10 rounded-xl bg-[#122620] text-[#b99a5a] flex items-center justify-center shrink-0">
            <FileText size={20} />
          </div>
          <div>
            <h2 className="text-3xl font-serif text-[#102C25] font-normal tracking-tight">
              Rédiger un nouvel article
            </h2>
            <p className="text-xs text-[#6b7c74]">
              Rédaction et mise en forme de contenus éditoriaux et guides bancaires
            </p>
          </div>
        </div>

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
                Titre de l&apos;article <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Les 5 pièges à éviter lors de l'impression de chèques CPA"
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] text-xs sm:text-sm text-[#122620] placeholder-[#86928b] focus:border-[#b99a5a] focus:outline-none transition-all"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#35433d] mb-1.5">
                Catégorie
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] text-xs sm:text-sm text-[#122620] focus:border-[#b99a5a] focus:outline-none transition-all"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="conseils">Conseils Pratiques</option>
                <option value="reglementation">Réglementation Bancaire</option>
                <option value="comptabilite">Comptabilité & PME</option>
                <option value="actualites">Actualités VCheque</option>
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
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] text-xs sm:text-sm font-mono text-[#122620] placeholder-[#86928b] focus:border-[#b99a5a] focus:outline-none transition-all"
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
                className="w-full px-4 py-2 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] text-xs text-[#122620] focus:border-[#b99a5a] focus:outline-none transition-all"
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
              className="w-full px-4 py-2.5 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] text-xs sm:text-sm text-[#122620] placeholder-[#86928b] focus:border-[#b99a5a] focus:outline-none transition-all"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[#35433d] mb-1.5">
              Contenu de l&apos;article (Markdown) <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={12}
              required
              placeholder="Utilisez ## pour les sous-titres, > pour les citations et - pour les listes..."
              className="w-full px-4 py-3 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] text-xs sm:text-sm font-mono leading-relaxed text-[#122620] placeholder-[#86928b] focus:border-[#b99a5a] focus:outline-none transition-all"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          <div className="pt-4 border-t border-[#f4f0e6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <label className="flex items-center gap-2 text-xs font-semibold text-[#122620] cursor-pointer">
              <input
                type="checkbox"
                checked={formData.status === 'published'}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.checked ? 'published' : 'draft' })
                }
                className="rounded accent-[#122620]"
              />
              <span>Publier immédiatement sur le site</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all disabled:opacity-50"
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
