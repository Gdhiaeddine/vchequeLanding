import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { LicenseManager } from '@/lib/licensing/license-manager';
import {
  Check,
  CheckCircle2,
  Download,
  ArrowLeft,
  ShieldCheck,
  FileText,
  CreditCard,
  User,
  ShoppingBag,
} from 'lucide-react';
import CopyButton from '@/components/CopyButton';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Confirmation de Commande — Licence VCheque Prête',
  description:
    'Votre paiement a été validé avec succès via SlickPay. Votre clé d’activation VCheque est prête.',
  robots: {
    index: false,
    follow: false,
  },
};

interface CheckoutSuccessPageProps {
  searchParams: Promise<{
    ref?: string;
    simulated?: string;
  }>;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const { ref, simulated } = await searchParams;

  // 1. Redirection si référence absente
  if (!ref || ref.trim() === '') {
    redirect('/commander');
  }

  // 2. Recherche de la commande
  const order = await prisma.order.findUnique({
    where: { reference: ref.trim() },
    include: { license: true },
  });

  if (!order) {
    return (
      <div className="py-24 bg-[#F7F4EC] min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-[#E5E0D5] rounded-2xl p-8 text-center shadow-md">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <ShoppingBag size={28} />
          </div>
          <h1 className="text-2xl font-serif text-[#102C25] font-normal mb-2">
            Commande introuvable
          </h1>
          <p className="text-xs text-[#556660] leading-relaxed mb-6">
            Aucun enregistrement ne correspond à la référence transmise. Veuillez vérifier votre
            lien ou contacter notre équipe d&apos;assistance.
          </p>
          <Link
            href="/commander"
            className="inline-flex items-center justify-center w-full px-6 py-3 rounded-full bg-[#102C25] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#16382E] transition-all"
          >
            Retour au bon de commande
          </Link>
        </div>
      </div>
    );
  }

  let licenseKey = order.license_key;

  // 3. Si la licence n'est pas encore attribuée, création atomique sécurisée
  if (!licenseKey) {
    licenseKey = LicenseManager.generateKey();
    let maxActivations = 1;
    if (order.metadata) {
      try {
        const meta = JSON.parse(order.metadata);
        if (meta.maxActivations && typeof meta.maxActivations === 'number') {
          maxActivations = meta.maxActivations;
        }
      } catch {}
    }

    await prisma.$transaction(async (tx) => {
      // 1. Création de la licence (satisfait la clé étrangère orders_license_key_fkey)
      const createdLicense = await tx.license.create({
        data: {
          license_key: licenseKey!,
          licensee_name: order.nom,
          licensee_email: order.email,
          company: order.entreprise || null,
          edition: 'COMMERCIAL',
          max_activations: maxActivations,
          status: 'active',
          current_machine_id: null,
          notes: `Généré automatiquement pour la commande ${order.reference}`,
        },
      });

      // 2. Mise à jour du statut de la commande
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: 'completed',
          paid_at: new Date(),
          license_key: licenseKey,
        },
      });

      // 3. Journalisation de l'audit
      await tx.licenseAuditLog.create({
        data: {
          license_id: createdLicense.id,
          action: 'KEY_GENERATED_ONLINE_ORDER',
          actor: 'CHECKOUT_SYSTEM',
          details: JSON.stringify({
            order_reference: order.reference,
            amount: order.amount,
            simulated: simulated === 'true',
          }),
        },
      });
    });
  }

  // Formatage du montant en Dinars Algériens (DZD)
  const formattedAmount = new Intl.NumberFormat('fr-DZ', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(order.amount);

  return (
    <>
      {/* 1. HERO HEADER DE CONFIRMATION */}
      <header className="checkout-hero" aria-labelledby="success-heading">
        <div className="checkout-hero-inner max-w-4xl mx-auto text-center px-4 flex flex-col items-center justify-center">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#B99A5A] mb-3 font-sans">
            CONFIRMATION
          </p>

          <h1 id="success-heading" className="checkout-hero-title text-center">
            Merci pour votre commande !
          </h1>

          <p className="checkout-hero-lede !mx-auto !text-center">
            Votre paiement a été traité avec succès via SlickPay. Votre licence VCheque est prête.
          </p>
        </div>
      </header>

      {/* 2. CONTENEUR CENTRAL DES CARTES (MAX-WIDTH: 860PX) */}
      <main className="bg-[#F7F4EC] min-h-[75vh]">
        <div className="success-container">
          {/* CARTE 1 : CLÉ D'ACTIVATION PRINCIPALE */}
          <article className="success-card success-card--key" aria-labelledby="key-title">
            {/* Badge d'accomplissement émeraude doux */}
            <div className="success-badge-circle" aria-hidden="true">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#102C25"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h2 id="key-title" className="success-card-title">
              Votre clé d&apos;activation VCheque
            </h2>

            <p className="success-card-subtitle">
              Conservez précieusement cette clé, elle vous sera demandée lors du premier démarrage
              du logiciel.
            </p>

            {/* Boîte d'affichage de la Clé Cryptographique */}
            <div className="success-key-box" role="region" aria-label="Clé de licence générée">
              <code className="success-key-code">{licenseKey}</code>
              <CopyButton text={licenseKey!} />
            </div>

            {/* Information email */}
            <p className="success-email-notice">
              Un email de confirmation contenant votre clé et votre reçu a également été envoyé à{' '}
              <strong>{order.email}</strong>.
            </p>
          </article>

          {/* CARTE 2 : DÉTAILS DE LA TRANSACTION */}
          <article className="success-card" aria-labelledby="details-title">
            <h3 id="details-title" className="success-section-title">
              Détails de la transaction
            </h3>

            <dl className="success-summary-list">
              {/* Référence commande */}
              <div className="success-summary-item">
                <dt>Référence commande</dt>
                <dd>
                  <strong className="text-[#102C25] font-mono tracking-wider">
                    {order.reference}
                  </strong>
                </dd>
              </div>

              {/* Produit */}
              <div className="success-summary-item">
                <dt>Produit</dt>
                <dd>VCheque — Licence professionnelle Windows</dd>
              </div>

              {/* Client */}
              <div className="success-summary-item">
                <dt>Client</dt>
                <dd>{order.nom}</dd>
              </div>

              {/* Mode de règlement */}
              <div className="success-summary-item">
                <dt>Mode de règlement</dt>
                <dd>Carte CIB / Edahabia (SlickPay)</dd>
              </div>

              {/* Statut du paiement */}
              <div className="success-summary-item">
                <dt>Statut du paiement</dt>
                <dd>
                  <span className="success-status-badge">
                    <Check size={13} aria-hidden="true" />
                    <span>Payé &amp; validé</span>
                  </span>
                </dd>
              </div>

              {/* Montant total réglé */}
              <div className="success-summary-item success-summary-item--total">
                <dt>Montant total réglé</dt>
                <dd>
                  <span>{formattedAmount}</span>
                  <span className="text-[#B99A5A] text-sm ml-1.5 font-bold">DZD</span>
                </dd>
              </div>
            </dl>
          </article>

          {/* CARTE 3 : COMMENT INSTALLER VCHEQUE SUR VOTRE PC ? */}
          <article className="success-card" aria-labelledby="install-title">
            <h3 id="install-title" className="success-section-title">
              Comment installer VCheque sur votre PC ?
            </h3>

            <ol className="success-steps-list">
              {/* Étape 1 */}
              <li className="success-step-item">
                <span className="success-step-number" aria-hidden="true">
                  01
                </span>
                <div className="success-step-content">
                  <strong>Téléchargez l&apos;application :</strong>
                  <span>
                    Récupérez le fichier d&apos;installation officiel pour Windows 11 / 10 / 8 / 7.
                  </span>
                </div>
              </li>

              {/* Étape 2 */}
              <li className="success-step-item">
                <span className="success-step-number" aria-hidden="true">
                  02
                </span>
                <div className="success-step-content">
                  <strong>Installez le programme :</strong>
                  <span>Lancez l&apos;installateur et suivez les instructions simples à l&apos;écran.</span>
                </div>
              </li>

              {/* Étape 3 */}
              <li className="success-step-item">
                <span className="success-step-number" aria-hidden="true">
                  03
                </span>
                <div className="success-step-content">
                  <strong>Activez votre licence :</strong>
                  <span>
                    Au premier lancement, copiez-collez votre clé d&apos;activation ci-dessus.
                  </span>
                </div>
              </li>
            </ol>

            {/* Groupe de boutons d'action */}
            <div className="success-actions-group">
              <a
                href="/telecharger/fichier"
                className="btn-download-primary"
              >
                <Download size={18} aria-hidden="true" />
                <span>Télécharger pour Windows</span>
              </a>

              <Link
                href="/"
                className="btn-back-secondary"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                <span>Retour au site principal</span>
              </Link>
            </div>
          </article>
        </div>
      </main>
    </>
  );
}
