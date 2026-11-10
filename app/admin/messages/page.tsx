'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Mail, CheckCircle2, Archive, Trash2, Clock, User, Phone, Building2, Search } from 'lucide-react';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/admin/messages?status=${statusFilter}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setMessages(data.messages);
        if (data.messages.length > 0 && !selectedMessage) {
          setSelectedMessage(data.messages[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [statusFilter]);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await fetch('/api/admin/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'update_status', status }),
      });
      await fetchMessages();
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, status });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer définitivement ce message ?')) return;
    try {
      await fetch('/api/admin/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'delete' }),
      });
      setSelectedMessage(null);
      await fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages;
    const q = searchQuery.toLowerCase().trim();
    return messages.filter(
      (m) =>
        m.name?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        m.subject?.toLowerCase().includes(q) ||
        m.company?.toLowerCase().includes(q) ||
        m.message?.toLowerCase().includes(q)
    );
  }, [messages, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e2dcce] shadow-sm">
        <div>
          <h2 className="text-3xl font-serif text-[#102C25] font-normal tracking-tight">Boîte de Réception</h2>
          <p className="text-xs text-[#6b7c74] mt-0.5">
            {messages.length} message(s) et demande(s) de devis reçus depuis le formulaire public
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-[#f4f0e6] text-[#122620] font-semibold">
            {messages.filter((m) => m.status === 'unread').length} non lu(s)
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#e2dcce] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3.5 top-2.5 text-[#86928b]" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom, email, société, sujet..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#e2dcce] bg-[#fdfbf7] text-xs text-[#122620] placeholder-[#86928b] focus:border-[#b99a5a] focus:outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 text-xs w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Tous' },
            { id: 'unread', label: 'Non lus' },
            { id: 'replied', label: 'Traités' },
            { id: 'archived', label: 'Archivés' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Messages List Column */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#e2dcce] shadow-sm overflow-hidden">
          <div className="p-4 bg-[#fcfaf5] border-b border-[#e2dcce] font-bold text-xs text-[#86928b] uppercase tracking-wider flex items-center justify-between">
            <span>Messages ({filteredMessages.length})</span>
            {searchQuery && (
              <span className="text-[10px] text-[#6b7c74] font-normal lowercase">
                filtré sur &ldquo;{searchQuery}&rdquo;
              </span>
            )}
          </div>

          <div className="divide-y divide-[#f4f0e6] max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-xs text-[#6b7c74]">Chargement des messages...</div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#86928b]">Aucun message trouvé.</div>
            ) : (
              filteredMessages.map((m) => {
                const isSelected = selectedMessage?.id === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      setSelectedMessage(m);
                      if (m.status === 'unread') handleStatusChange(m.id, 'read');
                    }}
                    className={`p-4 cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#fcfaf5] border-l-4 border-[#b99a5a]' : 'hover:bg-[#fdfbf7]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs sm:text-sm text-[#122620] truncate">{m.name}</span>
                      <span className="font-mono text-[10px] text-[#86928b]">
                        {new Date(m.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-[#b99a5a] truncate mb-1">
                      {m.subject}
                    </div>
                    <p className="text-xs text-[#6b7c74] line-clamp-2">{m.message}</p>
                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#f4f0e6] text-[#122620] uppercase font-medium">
                        {m.subject_type || 'Général'}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          m.status === 'unread'
                            ? 'bg-amber-100 text-amber-800'
                            : m.status === 'replied'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {m.status === 'unread' ? 'Non lu' : m.status === 'replied' ? 'Traité' : m.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Message Viewer Column */}
        <div className="lg:col-span-7">
          {selectedMessage ? (
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#e2dcce] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#f4f0e6]">
                <div>
                  <h3 className="text-xl font-serif text-[#102C25] font-normal tracking-tight mb-1">
                    {selectedMessage.subject}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#6b7c74]">
                    <span>Reçu le {new Date(selectedMessage.created_at).toLocaleString('fr-FR')}</span>
                    <span>• Type : <strong className="text-[#122620]">{selectedMessage.subject_type}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedMessage.id, 'replied')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-all"
                    title="Marquer comme traité"
                  >
                    <CheckCircle2 size={15} />
                    <span>Traité</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedMessage.id, 'archived')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f4f0e6] text-[#122620] text-xs font-semibold hover:bg-[#e2dcce] transition-all"
                    title="Archiver"
                  >
                    <Archive size={15} />
                    <span>Archiver</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-semibold hover:bg-red-100 transition-all"
                    title="Supprimer"
                  >
                    <Trash2 size={15} />
                    <span>Supprimer</span>
                  </button>
                </div>
              </div>

              {/* Sender Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs p-4 rounded-xl bg-[#fcfaf5] border border-[#e2dcce]">
                <div className="flex items-center gap-2.5 text-[#35433d]">
                  <User size={15} className="text-[#b99a5a] shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#86928b] uppercase block font-semibold">Nom</span>
                    <span className="font-bold text-[#122620]">{selectedMessage.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-[#35433d]">
                  <Mail size={15} className="text-[#b99a5a] shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#86928b] uppercase block font-semibold">Email</span>
                    <a href={`mailto:${selectedMessage.email}`} className="font-bold text-[#122620] hover:text-[#b99a5a] transition-colors">
                      {selectedMessage.email}
                    </a>
                  </div>
                </div>
                {selectedMessage.phone && (
                  <div className="flex items-center gap-2.5 text-[#35433d]">
                    <Phone size={15} className="text-[#b99a5a] shrink-0" />
                    <div>
                      <span className="text-[10px] text-[#86928b] uppercase block font-semibold">Téléphone</span>
                      <span className="font-mono font-bold text-[#122620]">{selectedMessage.phone}</span>
                    </div>
                  </div>
                )}
                {selectedMessage.company && (
                  <div className="flex items-center gap-2.5 text-[#35433d]">
                    <Building2 size={15} className="text-[#b99a5a] shrink-0" />
                    <div>
                      <span className="text-[10px] text-[#86928b] uppercase block font-semibold">Entreprise</span>
                      <span className="font-bold text-[#122620]">{selectedMessage.company}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div>
                <h4 className="text-xs uppercase font-bold text-[#86928b] tracking-wider mb-2">Contenu du message :</h4>
                <div className="p-6 rounded-xl bg-[#fdfbf7] border border-[#e2dcce] text-xs sm:text-sm text-[#122620] leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Reply Action */}
              <div className="pt-4 border-t border-[#f4f0e6] flex justify-end">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#122620] text-white hover:bg-[#1a382f] text-xs font-bold shadow-sm transition-all"
                >
                  <Mail size={15} />
                  <span>Répondre par email</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-[#86928b] bg-white rounded-2xl border border-[#e2dcce] shadow-sm">
              Sélectionnez un message à gauche pour afficher son contenu.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
