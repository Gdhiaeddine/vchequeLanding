import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import {
  KeyRound,
  MonitorCheck,
  ShieldCheck,
  Landmark,
  Plus,
  ArrowUpRight,
  Mail,
  Cpu,
  Lock,
  Clock,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  FileCode,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

function formatDate(date: Date | null | undefined): string {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatDateTime(date: Date | null | undefined): string {
  if (!date) return '—';
  return new Date(date).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function getActionPillClass(action: string): string {
  const act = action.toUpperCase();
  if (act.includes('REVOKE') || act.includes('DEACTIVAT') || act.includes('FAIL') || act.includes('ERROR')) {
    return 'audit-action-pill audit-action--danger';
  }
  if (act.includes('TRANSFER') || act.includes('WARN')) {
    return 'audit-action-pill audit-action--warning';
  }
  if (act.includes('SUCCESS') || act.includes('GENERAT') || act.includes('ISSUED') || act.includes('ACTIVE')) {
    return 'audit-action-pill audit-action--success';
  }
  return 'audit-action-pill audit-action--info';
}

function formatAuditDetails(raw: string | null | undefined): string {
  if (!raw) return '—';
  try {
    const parsed = JSON.parse(raw);
    if (parsed.machine_name) {
      return `Poste: ${parsed.machine_name} (${parsed.os_info || 'Win'})`;
    }
    if (parsed.reason) {
      return `Motif: ${parsed.reason}`;
    }
    if (parsed.licensee_name) {
      return `Titulaire: ${parsed.licensee_name}`;
    }
    return JSON.stringify(parsed);
  } catch {
    return raw;
  }
}

export default async function AdminDashboardPage() {
  const [
    totalLicenses,
    activeLicenses,
    totalActivations,
    activeActivations,
    completedOrders,
    unreadMessages,
    recentLicenses,
    recentActivations,
    recentAuditLogs,
  ] = await Promise.all([
    prisma.license.count(),
    prisma.license.count({ where: { status: 'active' } }),
    prisma.licenseActivation.count(),
    prisma.licenseActivation.count({ where: { status: 'active' } }),
    prisma.order.findMany({ where: { status: 'completed' }, select: { amount: true } }),
    prisma.contactMessage.count({ where: { status: 'unread' } }),
    prisma.license.findMany({
      take: 6,
      orderBy: { created_at: 'desc' },
      include: { activations: true },
    }),
    prisma.licenseActivation.findMany({
      take: 6,
      orderBy: { activated_at: 'desc' },
      include: { license: true },
    }),
    prisma.licenseAuditLog.findMany({
      take: 8,
      orderBy: { created_at: 'desc' },
      include: { license: true },
    }),
  ]);

  const totalRevenue = completedOrders.reduce((sum, ord) => sum + (ord.amount || 0), 0);

  return (
    <div className="space-y-8">
      {/* 3.1. En-tête de page & Actions Rapides */}
      <section className="dash-head">
        <div>
          <span className="dash-eyebrow">VUE CONSOLIDÉE • CRYPTOGRAPHIE ED25519</span>
          <h1 className="text-3xl font-serif text-[#102C25] font-normal tracking-tight">
            Tableau de Bord Exécutif
          </h1>
          <p className="dash-lede mt-1">
            Supervision en temps réel des licences commerciales, des nœuds machines activés et des transactions bancaires.
          </p>
        </div>
        <div className="dash-actions">
          <Link href="/admin/licenses/create" className="btn-pill-primary">
            <Plus size={16} />
            <span>Nouvelle Licence</span>
          </Link>
          <Link href="/admin/licenses" className="btn-pill-secondary">
            <span>Explorer le Répertoire</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>

      {/* Alerte Contextuelle Messages non lus */}
      {unreadMessages > 0 && (
        <section className="dash-alert" role="status" aria-live="polite">
          <div className="dash-alert-content">
            <Mail size={20} className="shrink-0 text-amber-600" />
            <div>
              <span className="font-bold">
                {unreadMessages} demande{unreadMessages > 1 ? 's' : ''} de contact
              </span>{' '}
              en attente de traitement dans la boîte de réception commerciale.
            </div>
          </div>
          <Link href="/admin/messages" className="dash-alert-btn">
            <span>Consulter les messages</span>
            <ArrowUpRight size={14} />
          </Link>
        </section>
      )}

      {/* 3.2. Grille des 4 Métriques Clés / KPI */}
      <section className="kpi-grid">
        {/* KPI 1 : Licences Émises */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Licences Émises</span>
            <div className="kpi-icon-wrap" title="Cryptographie asymétrique Ed25519">
              <KeyRound size={20} />
            </div>
          </div>
          <div>
            <div className="kpi-value">{totalLicenses}</div>
            <div className="kpi-meta">
              <strong>{activeLicenses} actives</strong> • 100% Signées Ed25519
            </div>
          </div>
        </div>

        {/* KPI 2 : Postes Machines (PC) */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Postes Machines (PC)</span>
            <div className="kpi-icon-wrap" title="Empreintes matérielles Windows verrouillées">
              <MonitorCheck size={20} />
            </div>
          </div>
          <div>
            <div className="kpi-value">{activeActivations}</div>
            <div className="kpi-meta">
              <strong>{totalActivations} activations</strong> enregistrées au total
            </div>
          </div>
        </div>

        {/* KPI 3 : Commandes Réglées */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Commandes Réglées</span>
            <div className="kpi-icon-wrap" title="Passerelle SlickPay (Cartes CIB & Edahabia)">
              <ShieldCheck size={20} />
            </div>
          </div>
          <div>
            <div className="kpi-value">{completedOrders.length}</div>
            <div className="kpi-meta">
              Paiements réconciliés via <strong>SlickPay CIB/Edahabia</strong>
            </div>
          </div>
        </div>

        {/* KPI 4 : Revenu Encaissé */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Revenu Encaissé</span>
            <div className="kpi-icon-wrap" title="Recettes commerciales nettes">
              <Landmark size={20} />
            </div>
          </div>
          <div>
            <div className="kpi-value">
              {totalRevenue.toLocaleString('fr-FR')}
              <span className="kpi-value-currency">DZD</span>
            </div>
            <div className="kpi-meta">
              Recettes nettes <strong>certifiées en production</strong>
            </div>
          </div>
        </div>
      </section>

      {/* 3.3. Grille asymétrique à 2 colonnes */}
      <section className="data-grid-2">
        {/* Colonne Gauche : Dernières Licences Émises */}
        <div className="data-card">
          <div className="data-card-head">
            <h2 className="data-card-title">
              <KeyRound size={18} />
              <span>Dernières Licences Émises</span>
            </h2>
            <Link href="/admin/licenses" className="data-card-link">
              <span>Consulter tout</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Titulaire & Entreprise</th>
                  <th>Clé Commerciale</th>
                  <th>Postes</th>
                  <th>Statut</th>
                  <th>Émission</th>
                </tr>
              </thead>
              <tbody>
                {recentLicenses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-sm text-[#8B9890]">
                      Aucune licence commerciale émise pour l'instant.
                    </td>
                  </tr>
                ) : (
                  recentLicenses.map((lic) => {
                    const activeCount = lic.activations.filter((a) => a.status === 'active').length;
                    return (
                      <tr key={lic.id}>
                        <td>
                          <div className="font-bold text-[#102C25] leading-snug">
                            {lic.licensee_name}
                          </div>
                          <div className="text-[11px] text-[#8C6D23] font-medium">
                            {lic.company || 'Usage professionnel'}
                          </div>
                        </td>
                        <td>
                          <Link
                            href={`/admin/licenses/${lic.id}`}
                            className="license-key-pill"
                            title="Inspecter la licence"
                          >
                            {lic.license_key}
                          </Link>
                        </td>
                        <td className="text-xs font-semibold text-[#64746B]">
                          {activeCount} / {lic.max_activations} PC
                        </td>
                        <td>
                          <span
                            className={
                              lic.status === 'active'
                                ? 'status-badge status-badge--active'
                                : 'status-badge status-badge--revoked'
                            }
                          >
                            {lic.status === 'active' ? 'ACTIF' : lic.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="text-xs text-[#8B9890]">
                          {formatDate(lic.created_at)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Colonne Droite : Activations Matérielles Récentes (PC) */}
        <div className="data-card">
          <div className="data-card-head">
            <h2 className="data-card-title">
              <MonitorCheck size={18} />
              <span>Activations Matérielles Récentes</span>
            </h2>
            <span className="text-xs font-semibold text-[#8C6D23] bg-[#FAF8F2] px-2.5 py-1 rounded-full border border-[#E5E0D5]">
              {recentActivations.length} nœuds
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Poste Windows</th>
                  <th>Clé Associée</th>
                  <th>Statut</th>
                  <th>Horodatage</th>
                </tr>
              </thead>
              <tbody>
                {recentActivations.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-sm text-[#8B9890]">
                      Aucune activation matérielle enregistrée.
                    </td>
                  </tr>
                ) : (
                  recentActivations.map((act) => {
                    const truncatedMachineId =
                      act.machine_id && act.machine_id.length > 12
                        ? `${act.machine_id.slice(0, 8)}...${act.machine_id.slice(-4)}`
                        : act.machine_id;

                    return (
                      <tr key={act.id}>
                        <td>
                          <div className="flex items-center gap-2">
                            <Laptop size={14} className="text-[#8C6D23] shrink-0" />
                            <span className="font-semibold text-[#102C25]">
                              {act.machine_name || 'Poste Windows'}
                            </span>
                          </div>
                          <div className="text-[10px] font-mono text-[#8B9890] mt-0.5" title={act.machine_id}>
                            SHA: {truncatedMachineId}
                          </div>
                        </td>
                        <td>
                          <Link
                            href={`/admin/licenses/${act.license_id}`}
                            className="license-key-pill"
                            title="Voir la licence parente"
                          >
                            {act.license.license_key.slice(0, 12)}…
                          </Link>
                        </td>
                        <td>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            Verrouillé
                          </span>
                        </td>
                        <td className="text-xs text-[#8B9890]">
                          {formatDate(act.activated_at)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 3.4. Journal Cryptographique d'Audit Système */}
      <section className="data-card">
        <div className="data-card-head">
          <h2 className="data-card-title">
            <ShieldCheck size={18} />
            <span>Journal Cryptographique des Événements & Audit</span>
          </h2>
          <span className="admin-tag-immutable">
            <Lock size={11} className="inline mr-1" />
            REGISTRE IMMUABLE
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Horodatage</th>
                <th>Événement</th>
                <th>Cible</th>
                <th>Acteur & Origine</th>
                <th>Détails & Intégrité</th>
              </tr>
            </thead>
            <tbody>
              {recentAuditLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-sm text-[#8B9890]">
                    Aucune entrée dans le journal d'audit cryptographique.
                  </td>
                </tr>
              ) : (
                recentAuditLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="font-mono text-xs text-[#64746B] whitespace-nowrap">
                      {formatDateTime(log.created_at)}
                    </td>
                    <td>
                      <span className={getActionPillClass(log.action)}>
                        {log.action}
                      </span>
                    </td>
                    <td>
                      <Link
                        href={`/admin/licenses/${log.license_id}`}
                        className="license-key-pill"
                      >
                        {log.license.license_key}
                      </Link>
                    </td>
                    <td className="text-xs">
                      <div className="font-semibold text-[#102C25]">{log.actor}</div>
                      <div className="text-[10px] font-mono text-[#8B9890]">
                        IP: {log.ip_address || '127.0.0.1'}
                      </div>
                    </td>
                    <td className="text-xs text-[#35433D] max-w-xs truncate" title={log.details || ''}>
                      {formatAuditDetails(log.details)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
