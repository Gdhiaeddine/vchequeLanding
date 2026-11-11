'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  KeyRound,
  Download,
  Video,
  Mail,
  FileText,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Cpu,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [adminUser, setAdminUser] = useState<{ email: string; name: string } | null>(null);

  // Skip sidebar & topbar for login and 2FA auth challenge pages
  const isAuthPage =
    pathname === '/admin/login' ||
    pathname === '/admin/2fa' ||
    pathname === '/admin/2fa/setup';

  useEffect(() => {
    if (isAuthPage) return;
    let isMounted = true;

    async function loadAdminUser() {
      try {
        const res = await fetch('/api/admin/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.success && data.user) {
            setAdminUser(data.user);
          }
        }
      } catch {
        // Silently tolerate if fetch fails
      }
    }

    async function loadUnreadCount() {
      try {
        const res = await fetch('/api/admin/messages?status=unread');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.success && Array.isArray(data.messages)) {
            setUnreadCount(data.messages.length);
          }
        }
      } catch {
        // Silently tolerate if fetch fails
      }
    }

    loadAdminUser();
    loadUnreadCount();
    return () => {
      isMounted = false;
    };
  }, [pathname, isAuthPage]);

  if (isAuthPage) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } catch {
      // Proceed with redirect regardless
    }
    router.push('/admin/login');
  };

  const navSupervision = [
    {
      label: 'Tableau de bord',
      href: '/admin',
      icon: <LayoutDashboard size={18} />,
      exact: true,
    },
    {
      label: 'Licences Émises',
      href: '/admin/licenses',
      icon: <KeyRound size={18} />,
      exact: false,
    },
    {
      label: 'Messages Reçus',
      href: '/admin/messages',
      icon: <Mail size={18} />,
      badge: unreadCount > 0 ? unreadCount : undefined,
      exact: false,
    },
  ];

  const navSecurite = [
    {
      label: 'Installateur & Binaires',
      href: '/admin/installer',
      icon: <Download size={18} />,
      exact: false,
    },
    {
      label: 'Démonstrations & Médias',
      href: '/admin/demonstration',
      icon: <Video size={18} />,
      exact: false,
    },
    {
      label: 'Publications & Blog',
      href: '/admin/blogs',
      icon: <FileText size={18} />,
      exact: false,
    },
    {
      label: 'Clés Ed25519 & 2FA',
      href: '/admin/security',
      icon: <ShieldCheck size={18} />,
      exact: false,
    },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar 280px fixe */}
      <aside className="admin-sidebar" aria-label="Menu principal administrateur">
        {/* Brand */}
        <Link href="/admin" className="sidebar-brand">
          <Image
            src="/img/vcheque-icon-128.png"
            alt="VCheque"
            width={34}
            height={34}
            className="brightness-110 shrink-0"
            priority
          />
          <div>
            <h2 className="sidebar-brand-title">VCheque</h2>
            <span className="sidebar-brand-sub">ÉDITION COMMERCIALE</span>
          </div>
        </Link>

        {/* Navigation Catégorisée */}
        <nav className="sidebar-nav">
          <span className="sidebar-section-label">Supervision</span>
          {navSupervision.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${isActive ? 'is-active' : ''}`}
              >
                <div className="sidebar-link-content">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="sidebar-badge">{item.badge}</span>
                )}
              </Link>
            );
          })}

          <span className="sidebar-section-label" style={{ marginTop: '0.75rem' }}>
            Sécurité & Système
          </span>
          {navSecurite.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${isActive ? 'is-active' : ''}`}
              >
                <div className="sidebar-link-content">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Pied de Sidebar */}
        <div className="sidebar-footer">
          <div className="flex items-center justify-between mb-2">
            <span className="sidebar-footer-title">SESSION ADMINISTRATEUR</span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              TLS 1.3
            </span>
          </div>
          <div className="sidebar-footer-name">{adminUser?.name || 'Virtanis Systems'}</div>
          <div
            className="sidebar-footer-email truncate"
            title={adminUser?.email || 'admin@virtanis.dz'}
          >
            {adminUser?.email || 'admin@virtanis.dz'}
          </div>
        </div>
      </aside>

      {/* Zone Principale & Topbar */}
      <div className="admin-main">
        {/* Topbar 70px */}
        <header className="admin-topbar">
          <div className="flex items-center gap-3">
            <h1 className="admin-topbar-title">Console d'Administration</h1>
            <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              Moteur Ed25519 Opérationnel
            </span>
          </div>

          <div className="admin-topbar-actions">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-pill-badge"
              title="Ouvrir la vitrine publique dans un nouvel onglet"
            >
              <span>Vitrine publique</span>
              <ExternalLink size={13} />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="admin-logout-btn"
              title="Mettre fin à la session d'administration"
            >
              <LogOut size={14} />
              <span>Déconnexion</span>
            </button>
          </div>
        </header>

        {/* Contenu de page */}
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
