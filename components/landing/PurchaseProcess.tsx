import React from 'react';

export default function PurchaseProcess() {
  const steps = [
    {
      step: '1',
      title: 'Commandez votre licence',
      text: 'Accédez au formulaire officiel pour renseigner vos coordonnées et valider votre commande.',
    },
    {
      step: '2',
      title: 'Effectuez le paiement',
      text: 'Réglez votre commande avec l\'un des moyens de paiement disponibles au moment de l\'achat. Le paiement est vérifié côté serveur, jamais interprété depuis votre navigateur.',
    },
    {
      step: '3',
      title: 'Recevez votre email',
      text: 'Une fois le paiement confirmé par le système de commande, vous recevez un email contenant le lien de téléchargement et vos informations de licence.',
    },
    {
      step: '4',
      title: 'Installez et activez VCheque',
      text: 'Téléchargez l\'installateur Windows, puis suivez les instructions d\'activation fournies avec votre licence.',
    },
  ];

  return (
    <section className="section section--alt" id="achat" aria-labelledby="journey-heading">
      <div className="container">
        {/* En-tête de section */}
        <div className="section-head">
          <p className="eyebrow">Achat &amp; livraison</p>
          <h2 id="journey-heading" className="section-title">
            De l&apos;achat à l&apos;activation de votre logiciel
          </h2>
          <p className="section-lede">
            Le parcours d&apos;acquisition est supervisé de bout en bout par le backend de
            Virtanis : commande, paiement, clé et installation.
          </p>
        </div>

        {/* Grille des 4 Étapes du Parcours */}
        <ol className="steps steps--journey">
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

        {/* Note de réassurance inférieure */}
        <p className="section-note">
          La commande, la vérification des paiements, la génération des clés d&apos;activation et
          l&apos;envoi des emails sont gérés exclusivement côté serveur.
        </p>
      </div>
    </section>
  );
}
