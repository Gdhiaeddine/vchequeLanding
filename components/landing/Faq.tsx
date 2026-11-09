'use client';

import React, { useState } from 'react';

export default function Faq() {
  // Permet d'ouvrir plusieurs questions simultanément grâce à un ensemble (Set) d'indices
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set([0]));

  const faqItems = [
    {
      q: 'Qu\'est-ce que VCheque ?',
      a: 'VCheque est une application Windows conçue pour simplifier la préparation des chèques : saisie du montant en dinars algériens, conversion du montant en lettres françaises, renseignement du bénéficiaire, du lieu et de la date, choix d\'un modèle de mise en page, calibrage en millimètres et impression.',
    },
    {
      q: 'VCheque convertit-il les montants en lettres françaises ?',
      a: 'Oui. À partir du montant saisi, l\'application génère la formulation en lettres, centimes compris, conformes à l\'usage des banques. Comme pour toute opération bancaire, la formulation doit être relue attentivement avant l\'impression du chèque.',
    },
    {
      q: 'Est-il compatible avec toutes les banques algériennes ?',
      a: 'Nous ne l\'affirmons pas : la mise en page des chèques varie selon les banques et les formats de carnets. VCheque fournit un modèle générique de chèque standard (180 × 80 mm) ainsi que des modèles configurables. Vérifiez la disponibilité d\'un gabarit adapté à votre banque et à votre format, et contrôlez l\'alignement par un essai d\'impression avec votre propre chèque.',
    },
    {
      q: 'Peut-on ajuster les positions d\'impression ?',
      a: 'Oui. Pour les gabarits pris en charge, chaque champ (montant en chiffres, montant en lettres, ordre, lieu, date) dispose de réglages horizontaux et verticaux en millimètres et d\'une taille de police ajustable. L\'alignement réel doit ensuite être testé sur votre imprimante, par exemple avec une feuille de papier classique avant d\'utiliser un chèque.',
    },
    {
      q: 'Peut-on voir un aperçu avant d\'imprimer ?',
      a: 'Oui. L\'aperçu affiche le chèque complété avec vos données — montant, formulation en lettres, bénéficiaire, lieu et date — et se met à jour à la saisie. Vous pouvez corriger les informations avant d\'envoyer le chèque à l\'imprimante.',
    },
    {
      q: 'Existe-t-il une version macOS ou Linux ?',
      a: 'Non. VCheque est développé exclusivement pour Windows. Ce choix est assumé : l\'application cible le parc d\'ordinateurs Windows utilisé par les entreprises, commerçants et comptables.',
    },
    {
      q: 'Comment recevoir le logiciel après l\'achat ?',
      a: 'Après confirmation de votre commande et vérification du paiement côté serveur, vous recevez un email contenant le lien de téléchargement direct de l\'installateur et votre clé de licence.',
    },
    {
      q: 'Comment activer ma licence ?',
      a: 'La clé d\'activation et les instructions correspondantes sont fournies dans l\'email de livraison. Il suffit de copier la clé dans le logiciel lors de son premier démarrage.',
    },
    {
      q: 'Comment contacter l\'assistance Virtanis ?',
      a: 'Écrivez-nous depuis la page de contact officielle (/contact). Notre équipe technique répond par email pour toute question d\'installation ou de calibrage d\'imprimante.',
    },
  ];

  const toggle = (index: number) => {
    setOpenIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <section className="section" id="faq" aria-labelledby="faq-heading">
      <div className="container">
        {/* En-tête centré */}
        <div className="section-head section-head--center">
          <p className="eyebrow">Aide</p>
          <h2 id="faq-heading" className="section-title">
            Questions fréquentes sur VCheque
          </h2>
          <p className="section-lede">
            Des réponses concrètes sur le remplissage, le calibrage, la compatibilité
            et l&apos;acquisition du logiciel.
          </p>
        </div>

        {/* Structure de l'accordéon accessible WAI-ARIA avec animation fluide */}
        <div className="faq-list">
          {faqItems.map((item, idx) => {
            const isOpen = openIndices.has(idx);
            return (
              <div key={idx} className="faq-item">
                <h3 className="faq-q">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${idx}`}
                    id={`faq-btn-${idx}`}
                    onClick={() => toggle(idx)}
                  >
                    <span>{item.q}</span>
                    <svg
                      className="faq-chevron"
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
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                </h3>
                <div
                  className={`faq-panel ${isOpen ? 'is-open' : ''}`}
                  id={`faq-panel-${idx}`}
                  role="region"
                  aria-labelledby={`faq-btn-${idx}`}
                >
                  <div className="faq-answer">
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
