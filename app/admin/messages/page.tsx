'use client';

import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, Archive, Trash2, Clock, User, Phone, Building2 } from 'lucide-react';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e2dcce] shadow-sm">
        <div>
          <h2 className="text-2xl font-bold font-serif text-[#122620]">Boîte de Réception</h2>
          <p className="text-xs text-[#6b7c74] mt-0.5">
            Messages et demandes de devis envoyés depuis le formulaire public /contact
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {['all', 'unread', 'replied', 'archived'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold capitalize ${
                statusFilter === st
                  ? 'bg-[#122620] text-white'
                  : 'bg-[#f4f0e6] text-[#122620] hover:bg-[#e9e4d7]'
              }`}
            >
              {st === 'all'
                ? 'Tous'
                : st === 'unread'
                ? 'Non lus'
                : st === 'replied'
                ? 'Traités'
                : 'Archivés'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Messages List Column */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#e2dcce] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#f4f0e6] font-bold text-xs text-[#86928b] uppercase tracking-wider">
            {messages.length} message(s)
          </div>

          <div className="divide-y divide-[#f4f0e6] max-h-[600px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#86928b]">Aucun message trouvé.</div>
            ) : (
              messages.map((m) => {
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
                      <span className="font-bold text-sm text-[#122620] truncate">{m.name}</span>
                      <span className="text-[10px] text-[#86928b]">
                        {new Date(m.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-[#b99a5a] truncate mb-1">
                      {m.subject}
                    </div>
                    <p className="text-xs text-[#6b7c74] line-clamp-2">{m.message}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#f4f0e6] text-[#35433d] uppercase font-bold">
                        {m.subject_type}
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
                        {m.status}
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
            <div className="p-8 rounded-2xl bg-white border border-[#e2dcce] shadow-sm space-y-6">
              <div className="flex items-start justify-between pb-6 border-b border-[#f4f0e6]">
                <div>
                  <h3 className="text-xl font-bold font-serif text-[#122620] mb-1">
                    {selectedMessage.subject}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#6b7c74]">
                    <span>Reçu le {new Date(selectedMessage.created_at).toLocaleString('fr-FR')}</span>
                    <span>• Type : <strong>{selectedMessage.subject_type}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedMessage.id, 'replied')}
                    className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    title="Marquer comme traité"
                  >
                    <CheckCircle2 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedMessage.id, 'archived')}
                    className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                    title="Archiver"
                  >
                    <Archive size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Sender Details */}
              <div className="grid grid-cols-2 gap-4 text-xs p-4 rounded-xl bg-[#fcfaf5] border border-[#e2dcce]">
                <div className="flex items-center gap-2 text-[#35433d]">
                  <User size={15} className="text-[#b99a5a]" />
                  <span><strong>Nom :</strong> {selectedMessage.name}</span>
                </div>
                <div className="flex items-center gap-2 text-[#35433d]">
                  <Mail size={15} className="text-[#b99a5a]" />
                  <a href={`mailto:${selectedMessage.email}`} className="text-[#122620] hover:underline">
                    {selectedMessage.email}
                  </a>
                </div>
                {selectedMessage.phone && (
                  <div className="flex items-center gap-2 text-[#35433d]">
                    <Phone size={15} className="text-[#b99a5a]" />
                    <span><strong>Tél :</strong> {selectedMessage.phone}</span>
                  </div>
                )}
                {selectedMessage.company && (
                  <div className="flex items-center gap-2 text-[#35433d]">
                    <Building2 size={15} className="text-[#b99a5a]" />
                    <span><strong>Entreprise :</strong> {selectedMessage.company}</span>
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div>
                <h4 className="text-xs uppercase font-bold text-[#86928b] mb-2">Contenu du message :</h4>
                <div className="p-6 rounded-xl bg-[#fdfbf7] border border-[#e2dcce] text-sm text-[#122620] leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Reply Action */}
              <div className="pt-4 border-t border-[#f4f0e6] flex justify-end">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                  className="btn btn-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold"
                >
                  <Mail size={15} />
                  <span>Répondre par email</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-[#86928b] bg-white rounded-2xl border border-[#e2dcce]">
              Sélectionnez un message à gauche pour afficher son contenu.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
