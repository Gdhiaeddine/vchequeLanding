import React from 'react';

export default function MentionsLegalesPage() {
  return (
    <div className="py-16 bg-[#fdfbf7]">
      <div className="container max-w-4xl mx-auto px-6">
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#122620] mb-8">
          Mentions Légales
        </h1>

        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-[#e2dcce] shadow-sm space-y-6 text-[#35433d] text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-[#122620] mb-2 font-serif">1. Éditeur du site</h2>
            <p>
              Le site <strong>VCheque</strong> (ci-après « le Site ») et la distribution du logiciel VCheque sont édités par la société Virtanis Solutions EURL, société de droit algérien.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Siège social : Alger, Algérie</li>
              <li>Email de contact : contact@virtanis.dz</li>
              <li>Directeur de publication : Virtanis Solutions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#122620] mb-2 font-serif">2. Propriété intellectuelle</h2>
            <p>
              L'ensemble des contenus, marques, logos, graphismes, textes et logiciels composant le site et la solution VCheque sont protégés par les lois algériennes et internationales relatives à la propriété intellectuelle. Toute reproduction non autorisée est strictement interdite.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#122620] mb-2 font-serif">3. Hébergement</h2>
            <p>
              Le site web et ses services API de vérification de licence sont hébergés sur des infrastructures serveurs hautement sécurisées, conformément aux normes de protection des données en vigueur.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
