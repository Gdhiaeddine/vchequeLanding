'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, AlertCircle, CheckCircle2, FileEdit, Trash2, Eye } from 'lucide-react';

export default function EditBlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'conseils',
    excerpt: '',
    content: '',
    status: 'published',
  });
  const [existingCover, setExistingCover] = useState<string | null>(null);
  const [removeCover, setRemoveCover] = useState(false);
  const [newCoverFile, setNewCoverFile] = useState<File | null>(null);
  const [newCoverPreview, setNewCoverPreview] = useState<string | null>(null);

  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/admin/blogs/${id}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Impossible de charger cet article.');
        }

        const p = data.post;
        setFormData({
          title: p.title || '',
          slug: p.slug || '',
          category: p.category || 'conseils',
          excerpt: p.excerpt || '',
          content: p.content || '',
          status: p.status || 'published',
        });
        setExistingCover(p.cover_image_path || null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setNewCoverFile(file);
    if (file) {
      setRemoveCover(false);
      const objectUrl = URL.createObjectURL(file);
      setNewCoverPreview(objectUrl);
    } else {
      setNewCoverPreview(null);
    }
  };

  const handleRemoveExistingCover = () => {
    setRemoveCover(true);
    setNewCoverFile(null);
    setNewCoverPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('slug', formData.slug);
      form.append('category', formData.category);
      form.append('excerpt', formData.excerpt);
      form.append('content', formData.content);
      form.append('status', formData.status);
      form.append('remove_cover', removeCover ? 'true' : 'false');
      if (newCoverFile) {
        form.append('cover', newCoverFile);
      }

      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: 'PUT',
        body: form,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Une erreur est survenue lors de l'enregistrement.");
      }

      setSuccess(true);
      if (data.post) {
        setExistingCover(data.post.cover_image_path);
        setRemoveCover(false);
        setNewCoverFile(null);
        setNewCoverPreview(null);
        setFormData((prev) => ({
          ...prev,
          slug: data.post.slug,
        }));
      }

      setTimeout(() => {
        router.push('/admin/blogs');
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center text-xs text-[#6b7c74]">
        Chargement des informations de l&apos;article...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Navigation retour */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/blogs"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#6b7c74] hover:text-[#122620] transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Retour aux articles</span>
        </Link>

        {formData.slug && (
          <Link
            href={`/blog/${formData.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#102C25] hover:text-[#B99A5A] transition-colors"
          >
            <Eye size={14} />
            <span>Voir l&apos;article sur le site</span>
          </Link>
        )}
      </div>

      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#e2dcce] shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#f4f0e6]">
          <div className="w-10 h-10 rounded-xl bg-[#122620] text-[#b99a5a] flex items-center justify-center shrink-0">
            <FileEdit size={20} />
          </div>
          <div>
            <h2 className="text-3xl font-serif text-[#102C25] font-normal tracking-tight">
              Modifier l&apos;article
            </h2>
            <p className="text-xs text-[#6b7c74]">
              Édition du contenu, des métadonnées et de l&apos;image de couverture
            </p>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>Article mis à jour avec succès ! Redirection en cours...</span>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#35433d] mb-1.5">
                Titre de l&apos;article <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Comment aligner un chèque CPA"
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
                Slug URL (identifiant d&apos;accès)
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
                Statut de publication
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] text-xs sm:text-sm text-[#122620] focus:border-[#b99a5a] focus:outline-none transition-all"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="published">Publié (En ligne)</option>
                <option value="draft">Brouillon (Non visible)</option>
              </select>
            </div>
          </div>

          {/* Section Image de couverture */}
          <div>
            <label className="block text-xs font-semibold uppercase text-[#35433d] mb-1.5">
              Image de couverture
            </label>

            {/* Aperçu si existante ou nouvelle */}
            {newCoverPreview ? (
              <div className="mb-3 p-3 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-20 h-12 rounded-lg overflow-hidden border border-[#e2dcce]">
                    <img
                      src={newCoverPreview}
                      alt="Nouvelle couverture"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#122620]">Nouvelle image sélectionnée</p>
                    <p className="text-[11px] text-[#6b7c74]">Sera enregistrée à la validation</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setNewCoverFile(null);
                    setNewCoverPreview(null);
                  }}
                  className="text-xs text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                >
                  Annuler
                </button>
              </div>
            ) : existingCover && !removeCover ? (
              <div className="mb-3 p-3 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-20 h-12 rounded-lg overflow-hidden border border-[#e2dcce]">
                    <Image
                      src={`/api/blog/cover/${id}`}
                      alt={formData.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#122620]">Image de couverture actuelle</p>
                    <p className="text-[11px] text-[#6b7c74]">Actuellement en ligne sur le site</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveExistingCover}
                  className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                >
                  <Trash2 size={13} />
                  <span>Supprimer l&apos;image</span>
                </button>
              </div>
            ) : removeCover ? (
              <div className="mb-3 p-3 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-xs flex items-center justify-between">
                <span>L&apos;image actuelle sera retirée (le visuel Luxury Banking vert s&apos;affichera par défaut).</span>
                <button
                  type="button"
                  onClick={() => setRemoveCover(false)}
                  className="font-bold underline cursor-pointer"
                >
                  Rétablir
                </button>
              </div>
            ) : null}

            <input
              type="file"
              accept="image/*"
              className="w-full px-4 py-2 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] text-xs text-[#122620] focus:border-[#b99a5a] focus:outline-none transition-all cursor-pointer"
              onChange={handleFileChange}
            />
            <p className="text-[11px] text-[#86928b] mt-1">
              Format recommandé : 1200x630 (JPG, PNG ou WEBP). Si aucune image n&apos;est définie, le visuel officiel vert impérial et or sera utilisé.
            </p>
          </div>

          {/* Extrait court */}
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

          {/* Contenu Markdown */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase text-[#35433d]">
                Contenu de l&apos;article (Markdown supporté) <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-[#86928b]">
                Supporte ## Titres, **gras**, listes, blockquotes &gt;
              </span>
            </div>
            <textarea
              rows={14}
              required
              placeholder="Rédigez le contenu complet de votre article ici..."
              className="w-full px-4 py-3 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] font-mono text-xs sm:text-sm text-[#122620] placeholder-[#86928b] focus:border-[#b99a5a] focus:outline-none transition-all leading-relaxed"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[#f4f0e6] flex flex-col sm:flex-row items-center justify-end gap-3">
            <Link
              href="/admin/blogs"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#e2dcce] bg-[#fdfbf7] text-[#122620] hover:bg-[#f4f0e6] font-semibold text-xs text-center transition-all"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto btn btn-primary inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50 !text-white"
            >
              <Save size={16} />
              <span className="!text-white">{saving ? 'Enregistrement...' : 'Enregistrer les modifications'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
