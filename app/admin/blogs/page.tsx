'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { FileText, Plus, Eye, Clock, CheckCircle2, Trash2, Edit, Search } from 'lucide-react';

export default function AdminBlogsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/admin/blogs');
      const data = await res.json();
      if (res.ok && data.success) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleToggle = async (id: number) => {
    try {
      await fetch(`/api/admin/blogs/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_status' }),
      });
      await fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer définitivement cet article ?')) return;
    try {
      await fetch(`/api/admin/blogs/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete' }),
      });
      await fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchesStatus =
        statusFilter === 'all' || p.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        p.title?.toLowerCase().includes(q) ||
        p.slug?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [posts, statusFilter, searchQuery]);

  const totalViews = useMemo(() => {
    return posts.reduce((sum, p) => sum + (p.views_count || 0), 0);
  }, [posts]);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e2dcce] shadow-sm">
        <div>
          <h2 className="text-3xl font-serif text-[#102C25] font-normal tracking-tight">Gestion des Articles de Blog</h2>
          <p className="text-xs text-[#6b7c74] mt-0.5">
            {posts.length} article(s) • {totalViews.toLocaleString('fr-FR')} lecture(s) réelle(s) enregistrée(s)
          </p>
        </div>
        <Link
          href="/admin/blogs/create"
          className="btn btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm"
        >
          <Plus size={16} />
          <span>Nouvel article</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#e2dcce] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3.5 top-2.5 text-[#86928b]" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par titre, slug, catégorie..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#e2dcce] bg-[#fdfbf7] text-xs text-[#122620] placeholder-[#86928b] focus:border-[#b99a5a] focus:outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
          {[
            { id: 'all', label: 'Tous' },
            { id: 'published', label: 'Publiés' },
            { id: 'draft', label: 'Brouillons' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-[#122620] !text-white'
                  : 'bg-[#f4f0e6] !text-[#122620] hover:bg-[#e2dcce]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-[#e2dcce] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#fcfaf5] text-[#86928b] uppercase border-b border-[#e2dcce]">
                <th className="p-4 font-bold">Titre & Catégorie</th>
                <th className="p-4 font-bold">Slug</th>
                <th className="p-4 font-bold">Vues</th>
                <th className="p-4 font-bold">Temps de lecture</th>
                <th className="p-4 font-bold">Statut</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f0e6]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-[#6b7c74]">
                    Chargement des articles...
                  </td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-[#86928b]">
                    Aucun article trouvé.
                  </td>
                </tr>
              ) : (
                filteredPosts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#fdfbf7] transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-xs sm:text-sm text-[#122620]">{p.title}</div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#f4f0e6] text-[#122620] font-medium uppercase mt-1 inline-block">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-[#6b7c74]">{p.slug}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 font-bold text-xs text-[#102C25] bg-[#fdfbf7] px-2.5 py-1 rounded-md border border-[#e2dcce]">
                        <Eye size={13} className="text-[#B99A5A]" />
                        <span>{(p.views_count || 0).toLocaleString('fr-FR')}</span>
                      </span>
                    </td>
                    <td className="p-4 text-[#6b7c74]">{p.reading_time} min</td>
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => handleToggle(p.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-opacity hover:opacity-80 cursor-pointer ${
                          p.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                        title="Cliquer pour changer le statut"
                      >
                        {p.status === 'published' ? 'Publié' : 'Brouillon'}
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                      <Link
                        href={`/blog/${p.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#f4f0e6] !text-[#122620] font-semibold hover:bg-[#e2dcce] transition-all text-[11px]"
                        title="Voir sur le site"
                      >
                        <Eye size={13} className="text-[#6b7c74]" />
                        <span className="!text-[#122620]">Voir</span>
                      </Link>
                      <Link
                        href={`/admin/blogs/${p.id}/edit`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#102C25] !text-white font-semibold hover:bg-[#b99a5a] hover:!text-white transition-all text-[11px] shadow-xs cursor-pointer"
                        title="Modifier l'article"
                      >
                        <Edit size={13} className="text-[#B99A5A]" />
                        <span className="!text-white">Modifier</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        className="inline-flex items-center p-1.5 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-all cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 size={14} />
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
