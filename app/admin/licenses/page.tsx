import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { KeyRound, Plus, Search, Filter, ExternalLink } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminLicensesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;

  const whereClause: any = {};
  if (status && status !== 'all') {
    whereClause.status = status;
  }
  if (q && q.trim() !== '') {
    const search = q.trim();
    whereClause.OR = [
      { license_key: { contains: search } },
      { licensee_name: { contains: search } },
      { licensee_email: { contains: search } },
      { company: { contains: search } },
    ];
  }

  const licenses = await prisma.license.findMany({
    where: whereClause,
    orderBy: { created_at: 'desc' },
    include: {
      activations: { where: { status: 'active' } },
    },
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e2dcce] shadow-sm">
        <div>
          <h2 className="text-3xl font-serif text-[#102C25] font-normal tracking-tight">Gestion des Licences</h2>
          <p className="text-xs text-[#6b7c74] mt-0.5">
            {licenses.length} licence(s) répertoriée(s) dans le moteur cryptographique
          </p>
        </div>
        <Link
          href="/admin/licenses/create"
          className="btn btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm"
        >
          <Plus size={16} />
          <span>Émettre une licence</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#e2dcce] flex flex-col sm:flex-row items-center justify-between gap-4">
        <form method="GET" className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 text-[#86928b]" size={16} />
            <input
              type="text"
              name="q"
              defaultValue={q || ''}
              placeholder="Rechercher par clé, titulaire, email, société..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#e2dcce] bg-[#fdfbf7] text-xs text-[#122620] placeholder-[#86928b] focus:border-[#b99a5a] focus:outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#122620] !text-white text-xs font-semibold rounded-lg hover:bg-[#1a382f] transition-colors cursor-pointer"
          >
            Filtrer
          </button>
        </form>

        <div className="flex items-center gap-2 text-xs">
          <Link
            href="/admin/licenses"
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              !status || status === 'all'
                ? 'bg-[#122620] !text-white'
                : 'bg-[#f4f0e6] !text-[#122620] hover:bg-[#e2dcce]'
            }`}
          >
            Toutes
          </Link>
          <Link
            href="/admin/licenses?status=active"
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              status === 'active' ? 'bg-[#122620] !text-white' : 'bg-[#f4f0e6] !text-[#122620] hover:bg-[#e2dcce]'
            }`}
          >
            Actives
          </Link>
          <Link
            href="/admin/licenses?status=revoked"
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              status === 'revoked' ? 'bg-[#122620] !text-white' : 'bg-[#f4f0e6] !text-[#122620] hover:bg-[#e2dcce]'
            }`}
          >
            Révoquées
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#e2dcce] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#fcfaf5] text-[#86928b] uppercase border-b border-[#e2dcce]">
                <th className="p-4 font-bold">Clé de Licence</th>
                <th className="p-4 font-bold">Titulaire & Société</th>
                <th className="p-4 font-bold">Édition</th>
                <th className="p-4 font-bold">Quota Actif</th>
                <th className="p-4 font-bold">Machine ID Liée</th>
                <th className="p-4 font-bold">Statut</th>
                <th className="p-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f0e6]">
              {licenses.map((lic) => {
                const activeCount = lic.activations.length;
                return (
                  <tr key={lic.id} className="hover:bg-[#fdfbf7] transition-colors">
                    <td className="p-4 font-mono font-bold text-[#122620]">
                      <Link
                        href={`/admin/licenses/${lic.id}`}
                        className="!text-[#122620] hover:!text-[#b99a5a] transition-colors"
                      >
                        {lic.license_key}
                      </Link>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-[#122620]">{lic.licensee_name}</div>
                      <div className="text-[11px] text-[#6b7c74]">
                        {lic.company ? `${lic.company} • ` : ''}
                        {lic.licensee_email}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-gray-100 font-medium text-gray-800 text-[10px]">
                        {lic.edition}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`font-semibold ${
                          activeCount >= lic.max_activations ? 'text-amber-700' : 'text-emerald-700'
                        }`}
                      >
                        {activeCount} / {lic.max_activations} PC
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-[#6b7c74]">
                      {lic.current_machine_id ? (
                        <span className="truncate max-w-[120px] inline-block">
                          {lic.current_machine_id}
                        </span>
                      ) : (
                        <span className="italic text-[#86928b]">Non liée</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          lic.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {lic.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/licenses/${lic.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#f4f0e6] !text-[#122620] font-semibold hover:bg-[#b99a5a] hover:!text-white transition-all text-[11px]"
                      >
                        <span>Détails</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
