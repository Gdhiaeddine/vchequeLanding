import React from 'react';

export default function CgvPage() {
  return (
    <div className="py-16 bg-[#fdfbf7]">
      <div className="container max-w-4xl mx-auto px-6">
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#122620] mb-8">
          Conditions Générales de Vente (CGV)
        </h1>

        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-[#e2dcce] shadow-sm space-y-6 text-[#35433d] text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-[#122620] mb-2 font-serif">1. Objet</h2>
            <p>
              Les présentes Conditions Générales de Vente régissent la vente de licences logicielles d'utilisation de la solution VCheque conclue entre Virtanis Solutions et tout acheteur professionnel ou particulier.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#122620] mb-2 font-serif">2. Modalités des licences</h2>
            <p>
              L'achat confère une licence d'utilisation permanente (paiement unique) pour le nombre de postes PC souscrits lors de la commande. Les licences sont nominatives et protégées par signature cryptographique Ed25519.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#122620] mb-2 font-serif">3. Tarifs et paiement</h2>
            <p>
              Les prix sont indiqués en Dinars Algériens (DZD). Le règlement s'effectue en ligne via la passerelle agréée SlickPay (cartes CIB et Edahabia) ou par virement bancaire sur demande de proforma. La délivrance de la clé de licence s'effectue dès confirmation de transaction.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#122620] mb-2 font-serif">4. Support et assistance</h2>
            <p>
              Chaque licence comprend l'assistance technique par email et WhatsApp pour l'installation, le calibrage d'imprimante et le transfert éventuel de licence en cas de changement de machine.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
