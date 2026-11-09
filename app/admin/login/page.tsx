'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, remember }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Identifiants administrateur incorrects.');
      }

      router.push(data.redirect || '/admin');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la connexion au portail.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* 1. EN-TÊTE MINIMALISTE FIXE */}
      <header className="auth-header" role="banner">
        <div className="container auth-header-inner">
          <Link href="/" className="auth-header-brand" aria-label="Accueil VCheque">
            <Image
              src="/img/vcheque-icon-128.png"
              alt="VCheque"
              width={38}
              height={38}
              priority
            />
            <span className="auth-header-brand-name">VCheque</span>
          </Link>
          <Link href="/" className="auth-header-btn">
            <span aria-hidden="true">←</span>
            <span>Retour au site vitrine</span>
          </Link>
        </div>
      </header>

      {/* 2. ZONE CENTRALE DE CENTRAGE AVEC HALO LUMINEUX */}
      <main className="auth-container">
        <div className="auth-card">
          {/* En-tête de la carte */}
          <div className="auth-card-head">
            <div className="auth-brand-logo" aria-hidden="true">
              <Image
                src="/img/vcheque-icon-128.png"
                alt="VCheque"
                width={38}
                height={38}
                priority
              />
            </div>
            <span className="eyebrow--gold">PORTAIL ADMINISTRATEUR</span>
            <h1 className="auth-card-title">Connexion sécurisée</h1>
            <p className="auth-card-lede">
              Identifiez-vous pour gérer les licences, les postes clients et superviser les commandes.
            </p>
          </div>

          {/* Alertes d'erreur */}
          {error && (
            <div className="auth-alert auth-alert--danger" role="alert" aria-live="polite">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                style={{ flexShrink: 0, marginTop: '2px' }}
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>
                <strong>Erreur de connexion :</strong> {error}
              </span>
            </div>
          )}

          {/* Formulaire d'authentification */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label className="auth-label" htmlFor="email">
                Identifiant / Email professionnel
              </label>
              <div className="auth-control">
                <span className="auth-control-icon" aria-hidden="true">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  aria-required="true"
                  autoFocus
                  autoComplete="email"
                  placeholder="admin@virtanis.dz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="password">
                Mot de passe administrateur
              </label>
              <div className="auth-control">
                <span className="auth-control-icon" aria-hidden="true">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  aria-required="true"
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="auth-options">
              <label className="auth-checkbox-label" htmlFor="remember">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>Conserver la session</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="auth-submit-btn"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>{loading ? 'Connexion en cours...' : 'Se connecter au portail'}</span>
            </button>
          </form>

          {/* 3. BANDEAU DE RÉASSURANCE CRYPTOGRAPHIQUE */}
          <div className="auth-trust-strip" aria-label="Garanties de sécurité">
            <div className="auth-trust-badge">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              </svg>
              <span>
                <strong>2FA</strong> RFC 6238
              </span>
            </div>
            <div className="auth-trust-badge">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span>
                <strong>Signature</strong> Ed25519
              </span>
            </div>
            <div className="auth-trust-badge">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
              <span>
                <strong>Anti-Brute</strong> Force
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* 4. PIED DE PAGE SOBRE */}
      <footer className="auth-footer" role="contentinfo">
        <p style={{ margin: 0 }}>
          © {currentYear} VCheque • Tous droits réservés • Solution bancaire certifiée
        </p>
      </footer>
    </div>
  );
}
