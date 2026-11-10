import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, RefreshCw, HelpCircle, ShieldAlert, PhoneCall } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Paiement Non Finalisé — VCheque',
  description:
    'La transaction n’a pas pu être finalisée. Aucun débit n’a été effectué sur votre compte bancaire.',
  robots: {
    index: false,
    follow: false,
  },
};

interface CheckoutCancelPageProps {
  searchParams: Promise<{
    ref?: string;
    reason?: string;
  }>;
}

export default async function CheckoutCancelPage({
  searchParams,
}: CheckoutCancelPageProps) {
  const { ref, reason } = await searchParams;

  return (
    <>
      {/* 1. HERO HEADER INSTITUTIONNEL */}
      <header className="checkout-hero" aria-labelledby="cancel-heading">
        <div className="checkout-hero-inner max-w-4xl mx-auto text-center px-4 flex flex-col items-center justify-center">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#B99A5A] mb-3 font-sans">
            TRANSACTION NON FINALISÉE
          </p>

          <h1 id="cancel-heading" className="checkout-hero-title text-center">
            Paiement non débité
          </h1>

          <p className="checkout-hero-lede !mx-auto !text-center">
            Votre tentative de règlement par carte bancaire (CIB / Edahabia) n&apos;a pas abouti.
            Aucun débit n&apos;a été effectué sur votre compte.
          </p>
        </div>
      </header>

      {/* 2. CONTENEUR PRINCIPAL */}
      <main className="bg-[#F7F4EC] min-h-[70vh] py-12 px-4">
        <div className="max-w-[760px] mx-auto">
          <article className="bg-white border border-[#E5E0D5] rounded-2xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
            {/* Liseré supérieur or noble */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#B99A5A] via-[#E5D2A4] to-[#B99A5A]" />

            {/* Pastille visuelle d'alerte bienveillante */}
            <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto mb-6">
              <ShieldAlert size={32} />
            </div>

            <h2 className="text-xl sm:text-2xl font-serif text-[#102C25] font-normal text-center mb-3">
              Que s&apos;est-il passé ?
            </h2>

            <p className="text-sm text-[#556660] text-center max-w-xl mx-auto leading-relaxed mb-8">
              La transaction a été interrompue ou refusée par la passerelle de paiement SlickPay / SATIM.
              Cela peut survenir suite à l&apos;annulation volontaire, au dépassement du délai de saisie du code SMS (OTP), ou à un plafond temporaire sur votre carte.
            </p>

            {/* Référence de commande si disponible */}
            {ref && (
              <div className="bg-[#F7F4EC] border border-[#E5E0D5] rounded-xl p-4 mb-8 text-center">
                <span className="text-xs text-[#556660] uppercase tracking-wider block mb-1">
                  Référence de votre dossier
                </span>
                <span className="font-mono text-base font-bold text-[#102C25] tracking-wide">
                  {ref}
                </span>
              </div>
            )}

            {/* Causes fréquentes */}
            <div className="border-t border-b border-[#EDE8DF] py-6 mb-8">
              <h3 className="text-xs font-bold text-[#102C25] uppercase tracking-wider mb-4 flex items-center gap-2">
                <HelpCircle size={15} className="text-[#B99A5A]" />
                Causes fréquentes d&apos;interruption :
              </h3>
              <ul className="text-xs text-[#556660] space-y-2.5 pl-5 list-disc leading-relaxed">
                <li>Délai de validation du mot de passe à usage unique (SMS OTP) dépassé.</li>
                <li>Plafond d&apos;achats en ligne atteint sur votre carte CIB ou Edahabia.</li>
                <li>Fermeture inopinée de la page de la passerelle SATIM avant la fin du traitement.</li>
                <li>Service de paiement en ligne non activé sur votre compte postal ou bancaire.</li>
              </ul>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/commander"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#102C25] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#16382E] transition-all shadow-md"
              >
                <RefreshCw size={15} />
                <span>Recommencer le paiement</span>
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 rounded-full bg-white text-[#102C25] border border-[#E5E0D5] text-xs font-bold uppercase tracking-wider hover:bg-[#F7F4EC] transition-all"
              >
                <PhoneCall size={15} />
                <span>Assistance technique</span>
              </Link>
            </div>

            <div className="text-center mt-6">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-[#7A8B84] hover:text-[#102C25] transition-colors"
              >
                <ArrowLeft size={14} />
                <span>Retour à l&apos;accueil VCheque</span>
              </Link>
            </div>
          </article>
        </div>
      </main>
    </>
  );
}
