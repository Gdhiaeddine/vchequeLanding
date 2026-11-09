import React from 'react';

export default function Features() {
  return (
    <section className="section section--alt" id="fonctionnalites" aria-labelledby="features-heading">
      <div className="container">
        {/* En-tête de section */}
        <div className="section-head">
          <p className="eyebrow">Fonctionnalités</p>
          <h2 id="features-heading" className="section-title">
            Les fonctionnalités de VCheque
          </h2>
          <p className="section-lede">
            Un parcours complet, de la saisie du montant jusqu&apos;à l&apos;impression
            calibrée, dans une seule application Windows.
          </p>
        </div>

        {/* Liste des 6 blocs alternés en zig-zag */}
        <div className="features-list">
          {/* 1. Saisie du montant (Gauche: Texte, Droite: Input UI) */}
          <div className="feature-row">
            <div className="feature-copy">
              <h3>Saisie du montant</h3>
              <p>
                Entrez le montant en dinars algériens : le champ prend en charge
                les centimes et affiche la valeur exacte qui sera convertie en
                toutes lettres, comme sur l&apos;exemple ci-contre.
              </p>
            </div>
            <div className="fx-panel fx-panel--field" aria-hidden="true">
              <span className="nc-fieldlabel">Montant (DZD)</span>
              <span className="fx-input">
                125 450,75 <span className="suffix">DZD</span>
              </span>
            </div>
          </div>

          {/* 2. Conversion en lettres françaises (Gauche: Encart UI, Droite: Texte - inversé) */}
          <div className="feature-row feature-row--flip">
            <div className="feature-copy">
              <h3>Conversion en lettres françaises</h3>
              <p>
                Le montant saisi est automatiquement converti, centimes compris, selon
                les règles françaises utilisées par les banques algériennes. À partir
                de l&apos;exemple, VCheque génère :
              </p>
              <p className="feature-quote">
                « Cent vingt-cinq mille quatre cent cinquante dinars algériens et
                soixante-quinze centimes. »
              </p>
            </div>
            <div className="fx-panel" aria-hidden="true">
              <span className="nc-words fx-words">
                <span className="chip">Montant en lettres</span>
                <br />
                Cent vingt-cinq mille quatre cent cinquante dinars algériens et
                soixante-quinze centimes
              </span>
            </div>
          </div>

          {/* 3. Informations du bénéficiaire (Gauche: Texte, Droite: Formulaire compact) */}
          <div className="feature-row">
            <div className="feature-copy">
              <h3>Informations du bénéficiaire</h3>
              <p>
                Renseignez l&apos;ordre du chèque, le lieu et la date dans un
                formulaire compact. Les champs restent regroupés pour limiter les
                allers-retours entre la paperasse et l&apos;écran.
              </p>
            </div>
            <div className="fx-panel fx-panel--form">
              <div className="fx-mini-field">
                <span className="fx-mini-label">Bénéficiaire</span>
                <span className="fx-mini-input">Entreprise Exemple SARL</span>
              </div>
              <div className="fx-mini-cols" aria-hidden="true">
                <div className="fx-mini-field">
                  <span className="fx-mini-label">Lieu</span>
                  <span className="fx-mini-input">Alger</span>
                </div>
                <div className="fx-mini-field">
                  <span className="fx-mini-label">Date</span>
                  <span className="fx-mini-input">19/10/2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Aperçu avant impression (Gauche: Aperçu chèque, Droite: Texte - inversé) */}
          <div className="feature-row feature-row--flip">
            <div className="feature-copy">
              <h3>Aperçu avant impression</h3>
              <p>
                Contrôlez le chèque rempli — montant, formulation en lettres, ordre,
                lieu et date — tel qu&apos;il sortira de votre imprimante. Vous
                corrigez avant l&apos;édition, pas après.
              </p>
            </div>
            <div className="fx-panel" aria-hidden="true">
              <div className="cheque-paper cheque-cross fx-cheque">
                <div className="cheque-top">
                  <span className="cheque-bankname">VOTRE BANQUE — AGENCE</span>
                  <span className="cheque-amountbox">
                    <span className="cur">DA</span>
                    <span className="box">125 450,75</span>
                  </span>
                </div>
                <span className="cheque-label">Payez contre ce chèque non endossable</span>
                <span className="cheque-line" />
                <p className="cheque-words">
                  Cent vingt-cinq mille quatre cent cinquante dinars algériens et
                  soixante-quinze centimes
                </p>
                <p className="cheque-ordertext">À l&apos;ordre de : Entreprise Exemple SARL</p>
                <div className="cheque-place-row">
                  <span>Alger</span>
                  <span>Le 19/10/2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Modèles bancaires personnalisables (Gauche: Texte, Droite: Sélecteur de gabarits) */}
          <div className="feature-row">
            <div className="feature-copy">
              <h3>Modèles bancaires personnalisables</h3>
              <p>
                La mise en page d&apos;un chèque varie selon la banque et le carnet.
                L&apos;application conserve des modèles configurables : positions des
                champs, dimensions du papier, options comme le chèque barré. Là où
                aucun modèle préconfiguré n&apos;est prévu, le modèle générique se calibre
                manuellement pour votre format.
              </p>
            </div>
            <div className="fx-panel fx-panel--templates" aria-hidden="true">
              <div className="tpl-row">
                <span className="tpl-chip is-active">Modèle générique</span>
                <span className="tpl-chip">Format 180 × 80 mm</span>
                <span className="tpl-chip">Format personnalisé</span>
                <span className="tpl-chip">Profil dupliqué</span>
              </div>
              <span className="fx-panel-note">
                Le modèle actif est celui utilisé pour l&apos;aperçu et l&apos;impression.
              </span>
            </div>
          </div>

          {/* 6. Calibrage en millimètres (Gauche: Grille de coordonnées, Droite: Texte - inversé) */}
          <div className="feature-row feature-row--flip">
            <div className="feature-copy">
              <h3>Calibrage en millimètres</h3>
              <p>
                Déplacez chaque champ horizontalement et verticalement, millimètre par
                millimètre, et ajustez la taille de la police. La grille et les
                repères visibles dans l&apos;aperçu aident à confronter ce qui s&apos;affiche
                aux lignes réelles de votre chèque.
              </p>
            </div>
            <div className="fx-panel fx-panel--calib" aria-hidden="true">
              <div className="fx-calib-grid">
                <span className="fx-calib">
                  <small>Position X — Ordre</small>
                  <b>12,5 mm</b>
                </span>
                <span className="fx-calib">
                  <small>Position Y — Ordre</small>
                  <b>8,0 mm</b>
                </span>
                <span className="fx-calib">
                  <small>Taille de police</small>
                  <b>11 pt</b>
                </span>
                <span className="fx-calib">
                  <small>Zoom de l&apos;aperçu</small>
                  <b>100 %</b>
                </span>
              </div>
              <span className="fx-panel-note">
                Repères de l&apos;aperçu : chaque champ est identifiable au millimètre près.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
