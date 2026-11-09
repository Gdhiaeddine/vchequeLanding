import React from 'react';

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="py-16 bg-[#fdfbf7]">
      <div className="container max-w-4xl mx-auto px-6">
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#122620] mb-8">
          Politique de Confidentialité
        </h1>

        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-[#e2dcce] shadow-sm space-y-6 text-[#35433d] text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-[#122620] mb-2 font-serif">1. Collecte des données personnelles</h2>
            <p>
              Nous collectons uniquement les informations indispensables à la gestion commerciale et à l'activation des licences : nom, adresse email professionnelle, nom de société, numéro de téléphone et identifiant matériel (Hardware ID) de l'ordinateur activé.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#122620] mb-2 font-serif">2. Confidentialité des données financières</h2>
            <p className="font-semibold text-[#122620]">
              Le logiciel VCheque fonctionne en local sur votre ordinateur.
            </p>
            <p>
              Les montants de chèques saisis, les noms de vos bénéficiaires, vos coordonnées bancaires et vos historiques d'impression ne sont jamais transmis à nos serveurs. Ils demeurent strictement confidentiels sur votre poste de travail.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#122620] mb-2 font-serif">3. Vos droits</h2>
            <p>
              Conformément à la réglementation relative à la protection des personnes physiques dans le traitement des données à caractère personnel, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles sur simple demande par email à contact@virtanis.dz.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
