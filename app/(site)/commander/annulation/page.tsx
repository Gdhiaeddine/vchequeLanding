import React from 'react';
import Link from 'next/link';
import { XCircle, ArrowLeft } from 'lucide-react';

export default function CheckoutCancelPage() {
  return (
    <div className="py-20 bg-[#fdfbf7]">
      <div className="container max-w-xl mx-auto px-6 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#e2dcce] shadow-xl">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-6">
            <XCircle size={36} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#122620] mb-3">
            Paiement non finalisé
          </h1>
          <p className="text-sm text-[#4f5f58] mb-8 leading-relaxed">
            La transaction a été annulée ou interrompue. Votre compte n'a pas été débité. Vous pouvez réessayer à tout moment ou choisir une autre formule.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/commander"
              className="btn btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold w-full sm:w-auto"
            >
              <span>Réessayer la commande</span>
            </Link>
            <Link
              href="/"
              className="px-6 py-3 rounded-xl text-sm font-semibold border border-[#e2dcce] text-[#122620] hover:bg-[#fcfaf5] w-full sm:w-auto"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
