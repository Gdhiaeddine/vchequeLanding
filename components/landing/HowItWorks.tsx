import React from 'react';

export default function HowItWorks() {
  const steps = [
    {
      step: '1',
      title: 'Saisissez les informations',
      text: 'Le montant en dinars, le bénéficiaire, le lieu et la date se saisissent dans une seule fenêtre, sans fichier annexe.',
    },
    {
      step: '2',
      title: 'Vérifiez le montant en lettres',
      text: 'La formulation française du montant est générée automatiquement : relisez-la avant de continuer, centimes compris.',
    },
    {
      step: '3',
      title: 'Configurez le modèle',
      text: 'Choisissez le modèle correspondant à votre carnet, et si nécessaire ajustez les positions des champs en millimètres.',
    },
    {
      step: '4',
      title: 'Prévisualisez et imprimez',
      text: 'Contrôlez l\'aperçu complet puis imprimez : commencez par un essai sur papier classique pour vérifier l\'alignement de votre imprimante.',
    },
  ];

  return (
    <section className="section section--alt" id="fonctionnement" aria-labelledby="how-heading">
      <div className="container">
        {/* En-tête de section */}
        <div className="section-head">
          <p className="eyebrow">Mode d&apos;emploi</p>
          <h2 id="how-heading" className="section-title">
            Comment remplir un chèque et imprimer sur le chèque avec VCheque ?
          </h2>
          <p className="section-lede">
            Quatre étapes rapides, de la saisie automatique du montant à l&apos;impression directe sur votre chèque bancaire.
          </p>
        </div>

        {/* Grille des 4 Étapes Horizontales */}
        <ol className="steps">
          {steps.map((s) => (
            <li key={s.step} className="step">
              <span className="step-n" aria-hidden="true">
                {s.step}
              </span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>

        {/* Note d'avertissement professionnelle */}
        <p className="section-note">
          L&apos;alignement dépend du format du chèque et de l&apos;imprimante : un
          essai d&apos;impression préalable reste indispensable avant chaque mise
          en service d&apos;un gabarit.
        </p>
      </div>
    </section>
  );
}
