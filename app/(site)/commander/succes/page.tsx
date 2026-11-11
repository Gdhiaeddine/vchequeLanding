import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { LicenseManager } from '@/lib/licensing/license-manager';
import slickPayService from '@/lib/payments/slickpay';
import mailerService from '@/lib/mail/mailer';
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
  Mail,
} from 'lucide-react';
import CopyButton from '@/components/CopyButton';

export const runtime = 'nodejs';
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
    resend?: string;
  }>;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const { ref, simulated, resend } = await searchParams;

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

  // 3. Si la commande n'a pas encore été validée, vérification stricte du paiement
  if (order.status !== 'completed' || !licenseKey) {
    let isPaymentConfirmed = false;

    // Simulation autorisée uniquement en environnement mock/test local
    if (simulated === 'true' && slickPayService.isMockMode()) {
      isPaymentConfirmed = true;
    } else if (order.slickpay_invoice_id) {
      // Interrogation directe de l'API SlickPay pour vérifier la validation réelle du paiement
      const invoiceCheck = await slickPayService.getInvoice(order.slickpay_invoice_id);
      if (invoiceCheck.completed) {
        isPaymentConfirmed = true;
      }
    }

    // Si le paiement n'est pas certifié par la banque ou SlickPay, interdire l'accès et rediriger vers annulation
    if (!isPaymentConfirmed) {
      redirect(`/commander/annulation?ref=${encodeURIComponent(order.reference)}&reason=unpaid`);
    }

    // 4. Génération atomique de la licence une fois le paiement authentifié
    licenseKey = LicenseManager.generateKey();
    let maxActivations = 1;
    let planTitle = 'Licence Commerciale VCheque (Perpétuelle)';

    if (order.metadata) {
      try {
        const meta = JSON.parse(order.metadata);
        if (meta.maxActivations && typeof meta.maxActivations === 'number') {
          maxActivations = meta.maxActivations;
        }
        if (meta.plan === 'duo') planTitle = 'Licence Commerciale VCheque Duo (2 Postes)';
        if (meta.plan === 'enterprise') planTitle = 'Licence Commerciale VCheque Entreprise (5 Postes)';
      } catch {}
    }

    const paidDate = new Date();

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
          notes: `Généré automatiquement suite au règlement SlickPay de la commande ${order.reference}`,
        },
      });

      // 2. Mise à jour du statut de la commande à 'completed'
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: 'completed',
          paid_at: paidDate,
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
            simulated: simulated === 'true' && slickPayService.isMockMode(),
            slickpay_invoice_id: order.slickpay_invoice_id,
          }),
        },
      });
    });

    // 5. Expédition automatique de l'email de confirmation avec la clé de licence ET la facture PDF acquittée
    await mailerService.sendLicenseConfirmationEmail({
      to: order.email,
      customerName: order.nom,
      orderRef: order.reference,
      licenseKey: licenseKey!,
      amount: order.amount,
      company: order.entreprise,
      phone: order.telephone,
      address: order.adresse,
      ville: order.ville,
      wilaya: order.wilaya,
      planTitle,
      maxActivations,
      paidAt: paidDate,
      transactionId: order.slickpay_invoice_id,
    });
  }

  let emailResent = false;
  if (order.status === 'completed' && resend === 'true' && licenseKey) {
    let maxActivations = 1;
    let planTitle = 'Licence Commerciale VCheque (Perpétuelle)';

    if (order.metadata) {
      try {
        const meta = JSON.parse(order.metadata);
        if (meta.maxActivations && typeof meta.maxActivations === 'number') {
          maxActivations = meta.maxActivations;
        }
        if (meta.plan === 'duo') planTitle = 'Licence Commerciale VCheque Duo (2 Postes)';
        if (meta.plan === 'enterprise') planTitle = 'Licence Commerciale VCheque Entreprise (5 Postes)';
      } catch {}
    }

    emailResent = await mailerService.sendLicenseConfirmationEmail({
      to: order.email,
      customerName: order.nom,
      orderRef: order.reference,
      licenseKey,
      amount: order.amount,
      company: order.entreprise,
      phone: order.telephone,
      address: order.adresse,
      ville: order.ville,
      wilaya: order.wilaya,
      planTitle,
      maxActivations,
      paidAt: order.paid_at || new Date(),
      transactionId: order.slickpay_invoice_id,
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

            {/* Information email & Facture PDF */}
            <p className="success-email-notice">
              Un email de confirmation contenant votre clé et votre facture officielle PDF acquittée en pièce jointe
              a été envoyé à <strong>{order.email}</strong>.
            </p>

            {emailResent && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 text-center font-medium">
                ✓ L&apos;email de confirmation avec la facture PDF acquittée en pièce jointe vient d&apos;être renvoyé avec succès à <strong>{order.email}</strong>.
              </div>
            )}

            <div className="mt-3 flex items-center justify-center">
              <a
                href={`/commander/succes?ref=${encodeURIComponent(order.reference)}&resend=true`}
                className="inline-flex items-center gap-1.5 text-xs text-[#556660] hover:text-[#102C25] underline transition-colors"
                title="Renvoyer l'email avec la facture PDF acquittée"
              >
                <Mail size={13} className="text-[#B99A5A]" />
                <span>Renvoyer l&apos;email avec la facture PDF</span>
              </a>
            </div>
          </article>

          {/* CARTE 2 : DÉTAILS DE LA TRANSACTION */}
          <article className="success-card" aria-labelledby="details-title">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h3 id="details-title" className="success-section-title mb-0">
                Détails de la transaction
              </h3>
              <a
                href={`/api/checkout/invoice/${encodeURIComponent(order.reference)}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#102C25] hover:text-[#B99A5A] transition-colors"
                title="Télécharger la facture PDF acquittée"
              >
                <FileText size={15} className="text-[#B99A5A]" />
                <span>Télécharger la Facture PDF</span>
              </a>
            </div>

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
                    Récupérez le fichier d&apos;installation officiel pour Windows 11 / 10 (64-bit).
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
              <Link
                href="/telecharger"
                className="btn-download-primary"
              >
                <Download size={18} aria-hidden="true" />
                <span>Télécharger pour Windows</span>
              </Link>

              <a
                href={`/api/checkout/invoice/${encodeURIComponent(order.reference)}`}
                className="btn-back-secondary !bg-white !border-[#B99A5A] !text-[#102C25] hover:!bg-[#F7F4EC]"
              >
                <FileText size={16} className="text-[#B99A5A]" aria-hidden="true" />
                <span>Facture PDF acquittée</span>
              </a>

              <Link
                href="/"
                className="btn-back-secondary"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                <span>Retour à l&apos;accueil</span>
              </Link>
            </div>
          </article>
        </div>
      </main>
    </>
  );
}
