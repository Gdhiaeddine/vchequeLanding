'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Plus, Eye, Clock, CheckCircle2, Trash2, Edit } from 'lucide-react';

export default function AdminBlogsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e2dcce] shadow-sm">
        <div>
          <h2 className="text-2xl font-bold font-serif text-[#122620]">Gestion des Articles de Blog</h2>
          <p className="text-xs text-[#6b7c74] mt-0.5">
            Rédaction, publication et mise en avant des conseils et règles bancaires
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
              {posts.map((p) => (
                <tr key={p.id} className="hover:bg-[#fdfbf7]">
                  <td className="p-4">
                    <div className="font-bold text-sm text-[#122620]">{p.title}</div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#f4f0e6] text-[#6b7c74] font-semibold uppercase mt-1 inline-block">
                      {p.category}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-[11px] text-[#6b7c74]">{p.slug}</td>
                  <td className="p-4 font-semibold text-[#122620]">{p.views_count}</td>
                  <td className="p-4 text-[#6b7c74]">{p.reading_time} min</td>
                  <td className="p-4">
                    <button
                      type="button"
                      onClick={() => handleToggle(p.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase cursor-pointer ${
                        p.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {p.status === 'published' ? 'Publié' : 'Brouillon'}
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Link
                      href={`/blog/${p.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg text-[#122620] hover:bg-[#f4f0e6] inline-block"
                      title="Voir sur le site"
                    >
                      <Eye size={16} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id)}
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
