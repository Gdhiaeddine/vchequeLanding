import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import licenseManager, { LicenseManager } from '@/lib/licensing/license-manager';
import { CheckCircle2, Copy, Download, ArrowRight, ShieldCheck } from 'lucide-react';
import CopyButton from '@/components/CopyButton';

export const dynamic = 'force-dynamic';

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;

  if (!ref) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold text-[#122620]">Référence de commande manquante.</h1>
        <Link href="/" className="btn btn-primary mt-4 inline-block">Retour à l'accueil</Link>
      </div>
    );
  }

  const order = await prisma.order.findUnique({
    where: { reference: ref },
    include: { license: true },
  });

  if (!order) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold text-[#122620]">Commande introuvable.</h1>
        <Link href="/" className="btn btn-primary mt-4 inline-block">Retour à l'accueil</Link>
      </div>
    );
  }

  let licenseKey = order.license_key;

  // If order is completed or simulated, ensure a license is generated
  if (!licenseKey) {
    licenseKey = LicenseManager.generateKey();
    let maxActivations = 1;
    if (order.metadata) {
      try {
        const meta = JSON.parse(order.metadata);
        if (meta.maxActivations) maxActivations = meta.maxActivations;
      } catch {}
    }

    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: 'completed',
          paid_at: new Date(),
          license_key: licenseKey,
        },
      });

      await tx.license.create({
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

      await tx.licenseAuditLog.create({
        data: {
          license_id: (await tx.license.findUnique({ where: { license_key: licenseKey! } }))!.id,
          action: 'KEY_GENERATED_ONLINE_ORDER',
          actor: 'CHECKOUT_SYSTEM',
          details: JSON.stringify({ order_reference: order.reference, amount: order.amount }),
        },
      });
    });
  }

  return (
    <div className="py-16 bg-[#fdfbf7]">
      <div className="container max-w-3xl mx-auto px-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#e2dcce] shadow-2xl text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle2 size={44} />
          </div>

          <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
            Paiement confirmé avec succès
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#122620] mb-3">
            Félicitations pour votre achat !
          </h1>
          <p className="text-sm text-[#4f5f58] max-w-md mx-auto mb-8">
            Votre commande <strong className="text-[#122620]">{order.reference}</strong> a été validée. Votre clé d'activation commerciale permanente est prête.
          </p>

          {/* License Key Card */}
          <div className="p-6 rounded-2xl bg-[#fcfaf5] border-2 border-[#b99a5a] mb-8 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#b99a5a]">
                Votre clé de licence permanente
              </span>
              <span className="text-xs font-medium text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                Active
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#e2dcce]">
              <code className="text-xl sm:text-2xl font-mono font-bold text-[#122620] tracking-wider select-all">
                {licenseKey}
              </code>
              <CopyButton text={licenseKey!} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-[#6b7c74]">
              <div>Titulaire : <strong className="text-[#122620]">{order.nom}</strong></div>
              <div>Email : <strong className="text-[#122620]">{order.email}</strong></div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a
              href="/telecharger/fichier"
              className="btn btn-primary inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
            >
              <Download size={18} />
              <span>Télécharger le logiciel VCheque</span>
            </a>
            <Link
              href="/"
              className="px-8 py-4 rounded-xl text-sm font-semibold border border-[#e2dcce] text-[#122620] hover:bg-[#fcfaf5] transition-all w-full sm:w-auto"
            >
              Retour au site
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-center gap-2">
            <ShieldCheck size={18} className="text-emerald-700 shrink-0" />
            <span>Un email de confirmation contenant votre clé et facture a été transmis à votre adresse email.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
