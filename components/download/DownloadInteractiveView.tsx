'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Download,
  Copy,
  Check,
  Shield,
  FileCode,
  Sparkles,
  ShoppingBag,
  HelpCircle,
  Clock,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';

export interface AppReleaseData {
  id: number;
  version: string;
  filename: string;
  file_size: number;
  sha256?: string | null;
}

interface DownloadInteractiveViewProps {
  release: AppReleaseData | null;
}

export default function DownloadInteractiveView({ release }: DownloadInteractiveViewProps) {
  const [countdown, setCountdown] = useState<number>(2);
  const [progress, setProgress] = useState<number>(0);
  const [downloadTriggered, setDownloadTriggered] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const hasTriggeredRef = useRef<boolean>(false);

  // Décompte automatique de 2 secondes et barre de progression fluide
  useEffect(() => {
    if (!release) return;

    const startTime = Date.now();
    const duration = 2000; // 2 secondes

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      const remainingSec = Math.max(0, Math.ceil((duration - elapsed) / 1000));
      setCountdown(remainingSec);

      if (elapsed >= duration && !hasTriggeredRef.current) {
        hasTriggeredRef.current = true;
        setDownloadTriggered(true);
        clearInterval(interval);

        // Déclenchement automatique via iframe invisible (sans recharger la page)
        try {
          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          iframe.src = '/telecharger/fichier';
          document.body.appendChild(iframe);
          setTimeout(() => {
            try {
              if (iframe.parentNode) {
                iframe.parentNode.removeChild(iframe);
              }
            } catch {}
          }, 30000);
        } catch (e) {
          console.warn('Auto-download trigger notice:', e);
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, [release]);

  // Déclenchement manuel via le bouton de secours
  const handleManualDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const a = document.createElement('a');
      a.href = '/telecharger/fichier';
      a.download = release?.filename || 'vcheque-setup.exe';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      window.location.assign('/telecharger/fichier');
    }
  };

  // Copie de l'empreinte de sécurité SHA-256 avec retour visuel 2.5s
  const handleCopySha = async () => {
    if (!release?.sha256) return;
    try {
      await navigator.clipboard.writeText(release.sha256);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback si navigator.clipboard est restreint
      const input = document.createElement('input');
      input.value = release.sha256;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // =========================================================================
  // 5. GESTION DE L'ÉTAT "INSTALLATEUR INDISPONIBLE" (FALLBACK 404)
  // =========================================================================
  if (!release) {
    return (
      <div className="download-page-bg">
        <div className="download-container">
          <div className="download-unavailable-card" role="region" aria-labelledby="unavailable-title">
            <div className="unavailable-icon" aria-hidden="true">
              <Clock size={32} />
            </div>

            <h1 id="unavailable-title" className="unavailable-title">
              Nouvelle version en cours de déploiement
            </h1>

            <p className="unavailable-text">
              L&apos;installateur officiel sera disponible au téléchargement dans quelques instants.
              Si vous avez déjà validé votre commande, votre clé de licence reste active et permanente.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="support-btn-primary"
                style={{ width: 'auto', minWidth: '180px' }}
              >
                <ArrowLeft size={16} />
                <span>Retour à l&apos;accueil</span>
              </Link>
              <Link
                href="/contact"
                className="support-btn-outline"
                style={{ width: 'auto', minWidth: '180px' }}
              >
                <HelpCircle size={16} />
                <span>Contacter le support</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const rawFilename = release.filename || 'vcheque-setup.exe';
  const sizeMb = (release.file_size / (1024 * 1024)).toFixed(1);
  const formattedSize = release.file_size > 0 ? `Env. ${sizeMb} Mo` : 'Env. 10 Mo';

  return (
    <div className="download-page-bg">
      <div className="download-container">
        {/* ===================================================================
            B. CARTE MAÎTRESSE : TÉLÉCHARGEMENT & STATUT
            =================================================================== */}
        <section className="download-main-card" aria-labelledby="download-card-title">
          {/* 1. Icône Animée de Téléchargement */}
          <div className="download-icon-wrapper" aria-hidden="true">
            <div className="download-pulse-ring" />
            <div className="download-icon-center">
              <Download size={34} strokeWidth={2.2} />
            </div>
          </div>

          {/* 2. Titre principal H2 */}
          <h2 id="download-card-title" className="download-main-title">
            Votre téléchargement est prêt
          </h2>

          {/* 3. Boîte de Statut Automatique */}
          <div className="download-status-box" role="status" aria-live="polite">
            <div className="download-status-text">
              <span className="status-dot" aria-hidden="true" />
              <span>
                {downloadTriggered ? (
                  <>✓ Téléchargement lancé ! Si rien ne se passe, cliquez ci-dessous :</>
                ) : (
                  <>
                    Le téléchargement va démarrer automatiquement dans{' '}
                    <strong>{countdown}</strong>s...
                  </>
                )}
              </span>
            </div>

            {/* Barre de progression avec attributs d'accessibilité ARIA */}
            <div
              className="download-progress-track"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progression du déclenchement du téléchargement"
            >
              <div
                className="download-progress-bar"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* 4. Bouton d'Action Manuel */}
          <div>
            <a
              href="/telecharger/fichier"
              onClick={handleManualDownload}
              className="btn-download-cta"
              title="Lancer manuellement le téléchargement de l'exécutable"
            >
              <Download size={18} strokeWidth={2.2} />
              <span>Cliquez ici si le téléchargement ne démarre pas automatiquement</span>
            </a>
            <p className="download-cta-subtext">
              Si votre navigateur bloque l&apos;ouverture automatique, cliquez sur le bouton ci-dessus pour lancer le téléchargement manuellement.
            </p>
          </div>

          {/* 5. Fiche Technique du Binaire */}
          <div className="download-file-specs">
            <div className="download-specs-header">
              <div className="download-specs-icon" aria-hidden="true">
                <FileCode size={20} />
              </div>
              <div>
                <h3 className="download-specs-title">Fichier officiel à télécharger</h3>
                <p className="download-specs-subtitle">Installateur certifié pour poste de travail Windows</p>
              </div>
            </div>

            {/* Grille descriptive à 4 attributs */}
            <div className="download-specs-grid">
              <div>
                <div className="specs-item-label">Nom du fichier</div>
                <div className="specs-item-value specs-filename">{rawFilename}</div>
              </div>

              <div>
                <div className="specs-item-label">Version actuelle</div>
                <div className="specs-item-value">
                  <span className="specs-badge-pill">v{release.version}</span>
                </div>
              </div>

              <div>
                <div className="specs-item-label">Taille du fichier</div>
                <div className="specs-item-value">{formattedSize}</div>
              </div>

              <div>
                <div className="specs-item-label">Système d&apos;exploitation</div>
                <div className="specs-item-value">Windows 11 / 10 / 8 / 7 (64-bit)</div>
              </div>
            </div>

            {/* Ligne Pleine Largeur Empreinte SHA-256 */}
            {release.sha256 && (
              <div className="download-sha-row">
                <div className="sha-label">Empreinte de sécurité SHA-256</div>
                <div className="sha-box">
                  <code className="sha-code" title={release.sha256}>
                    {release.sha256}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopySha}
                    className="btn-copy-sha"
                    aria-label="Copier l'empreinte de sécurité SHA-256"
                    title="Copier le hash SHA-256 dans le presse-papier"
                  >
                    {copied ? (
                      <>
                        <Check size={14} className="text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copié !</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>Copier</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ===================================================================
            C. CARTE « QUE FAIRE APRÈS LE TÉLÉCHARGEMENT ? »
            =================================================================== */}
        <section className="download-steps-card" aria-labelledby="steps-title">
          <h3 id="steps-title" className="download-steps-title">
            Que faire après le téléchargement ?
          </h3>
          <p className="download-steps-subtitle">
            Suivez ces 3 étapes rapides pour installer et démarrer l&apos;impression de vos chèques en toute simplicité.
          </p>

          {/* Grille responsive des 3 étapes */}
          <div className="download-steps-grid">
            {/* Étape 1 */}
            <div className="step-card">
              <div className="step-number" aria-hidden="true">1</div>
              <h4 className="step-card-title">Exécutez le fichier</h4>
              <p className="step-card-text">
                Double-cliquez sur <code className="text-[#102C25] font-semibold">{rawFilename}</code> depuis votre dossier Téléchargements.
              </p>
            </div>

            {/* Étape 2 */}
            <div className="step-card">
              <div className="step-number" aria-hidden="true">2</div>
              <h4 className="step-card-title">Suivez l&apos;assistant</h4>
              <p className="step-card-text">
                Installation en quelques secondes, polices d&apos;écriture et gabarits algériens configurés immédiatement.
              </p>
            </div>

            {/* Étape 3 */}
            <div className="step-card">
              <div className="step-number" aria-hidden="true">3</div>
              <h4 className="step-card-title">Activez votre licence</h4>
              <p className="step-card-text">
                Au premier lancement, collez votre clé d&apos;activation permanente reçue par email.
              </p>
            </div>
          </div>

          {/* Encart de réassurance Conseil Windows SmartScreen */}
          <div className="smartscreen-tip" role="note">
            <div className="smartscreen-tip-icon" aria-hidden="true">
              <Shield size={22} />
            </div>
            <p className="smartscreen-tip-text">
              <strong>Conseil Windows SmartScreen :</strong> Si Windows affiche le message « Windows a protégé votre ordinateur », cliquez simplement sur <em>« Informations complémentaires »</em> puis sur <em>« Exécuter quand même »</em>.
            </p>
          </div>
        </section>

        {/* ===================================================================
            D. GRILLE INFÉRIEURE D'ASSISTANCE & ACHAT
            =================================================================== */}
        <section className="download-support-grid" aria-label="Services complémentaires et assistance">
          {/* Carte 1 : Achat de Licence */}
          <article className="support-card" aria-labelledby="buy-license-title">
            <div>
              <div className="support-card-header">
                <div className="support-card-icon" aria-hidden="true">
                  <ShoppingBag size={20} />
                </div>
                <h3 id="buy-license-title" className="support-card-title">
                  Vous n&apos;avez pas encore votre licence ?
                </h3>
              </div>
              <p className="support-card-text">
                Commandez votre clé définitive en Dinar Algérien (DZD) par carte Edahabia ou CIB avec livraison instantanée.
              </p>
            </div>

            <Link href="/commander" className="support-btn-primary">
              <span>Acheter une licence</span>
              <ChevronRight size={15} />
            </Link>
          </article>

          {/* Carte 2 : Support Technique */}
          <article className="support-card" aria-labelledby="tech-support-title">
            <div>
              <div className="support-card-header">
                <div className="support-card-icon support-card-icon--emerald" aria-hidden="true">
                  <HelpCircle size={20} />
                </div>
                <h3 id="tech-support-title" className="support-card-title">
                  Besoin d&apos;aide pour l&apos;installation ?
                </h3>
              </div>
              <p className="support-card-text">
                Notre équipe technique en Algérie est à votre disposition pour vous assister dans le calibrage de votre imprimante.
              </p>
            </div>

            <Link href="/contact" className="support-btn-outline">
              <span>Contacter le support</span>
              <ChevronRight size={15} />
            </Link>
          </article>
        </section>
      </div>
    </div>
  );
}
