import PDFDocument from 'pdfkit';

export interface InvoiceParams {
  orderRef: string;
  customerName: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  address?: string | null;
  ville?: string | null;
  wilaya?: string | null;
  amount: number;
  licenseKey: string;
  paidAt?: Date | null;
  transactionId?: string | null;
  planTitle?: string;
}

/**
 * Génère le document officiel de facture acquittée A4 au format PDF
 * selon la charte Luxury Banking & Enterprise Security et la Loi 18-05.
 */
export async function generateInvoicePdf(params: InvoiceParams): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: {
          top: 56.7, // 20mm
          bottom: 56.7,
          left: 42.5, // 15mm
          right: 42.5,
        },
        info: {
          Title: `Facture-${params.orderRef}`,
          Author: 'Virtanis Technologies',
          Subject: 'Facture Officielle VCheque Acquittée',
          Keywords: 'VCheque, Facture, Virtanis, Licence, Algérie',
        },
      });

      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      const pageWidth = 595.28;
      const marginX = 42.5;
      const contentWidth = 510.28;
      const rightX = marginX + contentWidth;

      // Palette Luxury Banking
      const COLOR_GREEN_DARK = '#102C25';
      const COLOR_GOLD = '#B99A5A';
      const COLOR_GOLD_DARK = '#7A5F2E';
      const COLOR_IVORY = '#F7F4EC';
      const COLOR_BORDER = '#E5DFD3';
      const COLOR_TEXT_MUTED = '#556660';
      const COLOR_TEXT_FAINT = '#7A8B84';
      const COLOR_SUCCESS_BG = '#F1F8F4';
      const COLOR_SUCCESS_TXT = '#137333';

      const paymentDate = params.paidAt || new Date();
      const dateStr = paymentDate.toLocaleDateString('fr-DZ', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      const formattedAmount = new Intl.NumberFormat('fr-DZ', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(params.amount);

      // ==========================================
      // SECTION A : EN-TÊTE INSTITUTIONNEL
      // ==========================================
      const headerY = 56.7;

      // Logo VCheque
      doc.font('Helvetica-Bold').fontSize(22).fillColor(COLOR_GREEN_DARK);
      doc.text('V', marginX, headerY, { continued: true });
      doc.fillColor(COLOR_GOLD).text('Cheque');

      doc
        .font('Helvetica')
        .fontSize(8.5)
        .fillColor(COLOR_TEXT_MUTED)
        .text("Solution d'Impression Bancaire Professionnelle — Par Virtanis", marginX, headerY + 28);

      // Bloc Titre & Référence à Droite
      doc
        .font('Helvetica-Bold')
        .fontSize(16)
        .fillColor(COLOR_GREEN_DARK)
        .text('FACTURE ACQUITTÉE', marginX, headerY, {
          align: 'right',
          width: contentWidth,
        });

      doc
        .font('Helvetica-Bold')
        .fontSize(9.5)
        .fillColor(COLOR_GREEN_DARK)
        .text(`Réf. Commande : ${params.orderRef}`, marginX, headerY + 22, {
          align: 'right',
          width: contentWidth,
        });

      doc
        .font('Helvetica')
        .fontSize(9)
        .fillColor(COLOR_TEXT_MUTED)
        .text(`Date d'encaissement : ${dateStr}`, marginX, headerY + 36, {
          align: 'right',
          width: contentWidth,
        });

      // Badge vert pastel "✓ RÈGLEMENT REÇU"
      const badgeWidth = 118;
      const badgeHeight = 17;
      const badgeX = rightX - badgeWidth;
      const badgeY = headerY + 52;

      doc
        .roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 4)
        .fillAndStroke(COLOR_SUCCESS_BG, '#C3E6CB');

      doc
        .font('Helvetica-Bold')
        .fontSize(8)
        .fillColor(COLOR_SUCCESS_TXT)
        .text('✓  RÈGLEMENT REÇU', badgeX, badgeY + 4, {
          width: badgeWidth,
          align: 'center',
        });

      // ==========================================
      // SECTION B : CARTOUCHES D'IDENTIFICATION EN 2 COLONNES
      // ==========================================
      const cartoucheY = 138;
      const colWidth = (contentWidth - 14) / 2; // 248.14 pt
      const colHeight = 88;

      // Cartouche Émetteur (Gauche)
      doc
        .roundedRect(marginX, cartoucheY, colWidth, colHeight, 6)
        .fillAndStroke(COLOR_IVORY, COLOR_BORDER);

      doc
        .font('Helvetica-Bold')
        .fontSize(7.5)
        .fillColor(COLOR_GOLD_DARK)
        .text('ÉDITEUR / ÉMETTEUR', marginX + 12, cartoucheY + 10);

      doc
        .font('Helvetica-Bold')
        .fontSize(10)
        .fillColor(COLOR_GREEN_DARK)
        .text('Virtanis Technologies', marginX + 12, cartoucheY + 24);

      doc
        .font('Helvetica')
        .fontSize(8.5)
        .fillColor(COLOR_TEXT_MUTED)
        .text('Plateforme VCheque Algérie', marginX + 12, cartoucheY + 38)
        .text('virtanis.net  •  support@virtanis.dz', marginX + 12, cartoucheY + 51);

      doc
        .font('Helvetica-Oblique')
        .fontSize(7.5)
        .fillColor(COLOR_TEXT_FAINT)
        .text('Alger, Algérie — Conforme Loi 18-05 E-Commerce', marginX + 12, cartoucheY + 67);

      // Cartouche Client (Droite)
      const clientX = marginX + colWidth + 14;

      doc
        .roundedRect(clientX, cartoucheY, colWidth, colHeight, 6)
        .fillAndStroke(COLOR_IVORY, COLOR_BORDER);

      doc
        .font('Helvetica-Bold')
        .fontSize(7.5)
        .fillColor(COLOR_GOLD_DARK)
        .text('CLIENT / FACTURÉ À', clientX + 12, cartoucheY + 10);

      doc
        .font('Helvetica-Bold')
        .fontSize(10)
        .fillColor(COLOR_GREEN_DARK)
        .text(params.customerName, clientX + 12, cartoucheY + 24);

      if (params.company) {
        doc
          .font('Helvetica-Bold')
          .fontSize(8.5)
          .fillColor(COLOR_GREEN_DARK)
          .text(params.company, clientX + 12, cartoucheY + 38);
      }

      const clientContactY = params.company ? cartoucheY + 51 : cartoucheY + 38;
      const clientAddressY = params.company ? cartoucheY + 66 : cartoucheY + 53;

      doc
        .font('Helvetica')
        .fontSize(8.5)
        .fillColor(COLOR_TEXT_MUTED)
        .text(`${params.email}${params.phone ? `  •  ${params.phone}` : ''}`, clientX + 12, clientContactY);

      const addressStr = [params.address, params.ville, params.wilaya ? `(${params.wilaya})` : '']
        .filter(Boolean)
        .join('  •  ') || 'Alger, Algérie';

      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor(COLOR_TEXT_MUTED)
        .text(addressStr, clientX + 12, clientAddressY, {
          width: colWidth - 24,
          ellipsis: true,
        });

      // ==========================================
      // SECTION C : TABLEAU DES PRESTATIONS FACTURÉES
      // ==========================================
      const tableY = 244;
      const thHeight = 22;

      // Bandeau d'en-tête du tableau
      doc
        .rect(marginX, tableY, contentWidth, thHeight)
        .fill(COLOR_GREEN_DARK);

      doc.font('Helvetica-Bold').fontSize(8).fillColor('#FFFFFF');
      doc.text('DÉSIGNATION', marginX + 12, tableY + 7);
      doc.text('QTÉ', marginX + 285, tableY + 7, { width: 35, align: 'center' });
      doc.text('PRIX UNITAIRE HT', marginX + 325, tableY + 7, { width: 85, align: 'right' });
      doc.text('TOTAL DZD', marginX + 415, tableY + 7, { width: 85, align: 'right' });

      // Ligne de prestation
      const rowY = tableY + thHeight + 12;

      doc
        .font('Helvetica-Bold')
        .fontSize(9.5)
        .fillColor(COLOR_GREEN_DARK)
        .text(params.planTitle || 'Licence Commerciale VCheque (Perpétuelle)', marginX + 12, rowY);

      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor(COLOR_TEXT_MUTED)
        .text(
          'Licence permanente pour 1 poste de travail Windows. Préparation, mise en page et impression haute précision des chèques bancaires algériens (BNA, BEA, CPA, BDL, BADR, CNEP, Baraka, Al Salam, CCP).',
          marginX + 12,
          rowY + 15,
          { width: 265, lineGap: 2.5 }
        );

      // Badge Clé d'Activation
      const keyBadgeY = rowY + 52;
      const keyBadgeWidth = 265;
      const keyBadgeHeight = 18;

      doc
        .roundedRect(marginX + 12, keyBadgeY, keyBadgeWidth, keyBadgeHeight, 4)
        .fillAndStroke(COLOR_IVORY, COLOR_BORDER);

      doc
        .font('Courier-Bold')
        .fontSize(8.5)
        .fillColor(COLOR_GREEN_DARK)
        .text(`Clé : ${params.licenseKey}`, marginX + 18, keyBadgeY + 4, {
          width: keyBadgeWidth - 12,
        });

      // Quantité, Prix unitaire, Total
      doc
        .font('Helvetica')
        .fontSize(9.5)
        .fillColor(COLOR_GREEN_DARK)
        .text('1', marginX + 285, rowY + 6, { width: 35, align: 'center' });

      doc
        .font('Helvetica')
        .fontSize(9)
        .fillColor(COLOR_GREEN_DARK)
        .text(`${formattedAmount} DZD`, marginX + 325, rowY + 6, { width: 85, align: 'right' });

      doc
        .font('Helvetica-Bold')
        .fontSize(9.5)
        .fillColor(COLOR_GREEN_DARK)
        .text(`${formattedAmount} DZD`, marginX + 415, rowY + 6, { width: 85, align: 'right' });

      // Ligne séparatrice inférieure de tableau
      const tableBottomY = keyBadgeY + keyBadgeHeight + 14;
      doc
        .moveTo(marginX, tableBottomY)
        .lineTo(rightX, tableBottomY)
        .strokeColor(COLOR_BORDER)
        .lineWidth(1)
        .stroke();

      // ==========================================
      // SECTION D : RÈGLEMENT, CACHET & TOTAUX
      // ==========================================
      const bottomZoneY = tableBottomY + 16;
      const leftColWidth = 265;
      const rightColWidth = 225;
      const rightColX = rightX - rightColWidth;

      // 1. Bloc Informations de Paiement (Gauche)
      const payBoxHeight = 56;
      doc
        .roundedRect(marginX, bottomZoneY, leftColWidth, payBoxHeight, 6)
        .fillAndStroke(COLOR_IVORY, COLOR_BORDER);

      doc
        .font('Helvetica-Bold')
        .fontSize(7.5)
        .fillColor(COLOR_GOLD_DARK)
        .text('RÈGLEMENT SÉCURISÉ SLICKPAY', marginX + 12, bottomZoneY + 8);

      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor(COLOR_GREEN_DARK)
        .text('Passerelle : Carte CIB / Edahabia (SATIM)', marginX + 12, bottomZoneY + 21)
        .text(
          `ID Transaction : ${params.transactionId || params.orderRef}`,
          marginX + 12,
          bottomZoneY + 33
        );

      doc
        .font('Helvetica-Bold')
        .fontSize(8)
        .fillColor(COLOR_SUCCESS_TXT)
        .text('✓ Facture Soldée et Acquittée en ligne', marginX + 12, bottomZoneY + 44);

      // 2. Cachet Électronique Virtanis (Gauche)
      const sealY = bottomZoneY + payBoxHeight + 12;
      const sealHeight = 72;

      doc
        .roundedRect(marginX, sealY, leftColWidth, sealHeight, 6)
        .fillAndStroke('#FFFFFF', COLOR_GOLD);

      // Bordure intérieure fine or
      doc
        .roundedRect(marginX + 3, sealY + 3, leftColWidth - 6, sealHeight - 6, 4)
        .strokeColor('#E0DACB')
        .lineWidth(0.8)
        .stroke();

      doc
        .font('Helvetica-Bold')
        .fontSize(8)
        .fillColor(COLOR_GREEN_DARK)
        .text('CACHET ÉLECTRONIQUE VIRTANIS', marginX, sealY + 10, {
          width: leftColWidth,
          align: 'center',
        });

      doc
        .font('Helvetica-Bold')
        .fontSize(9)
        .fillColor(COLOR_GOLD)
        .text(`★  ACQUITTÉ LE ${dateStr}  ★`, marginX, sealY + 23, {
          width: leftColWidth,
          align: 'center',
        });

      doc
        .font('Helvetica')
        .fontSize(7.5)
        .fillColor(COLOR_TEXT_MUTED)
        .text('Signature Numérique & Intégrité Certifiées', marginX, sealY + 38, {
          width: leftColWidth,
          align: 'center',
        });

      doc
        .font('Helvetica-Bold')
        .fontSize(6.5)
        .fillColor(COLOR_TEXT_FAINT)
        .text('VIRTANIS TECHNOLOGIES ALGERIA  •  AUTHENTICITÉ GARANTIE', marginX, sealY + 52, {
          width: leftColWidth,
          align: 'center',
        });

      // 3. Tableau des Totaux (Droite)
      let curTotY = bottomZoneY + 4;

      // Ligne Total HT
      doc
        .font('Helvetica')
        .fontSize(8.5)
        .fillColor(COLOR_TEXT_MUTED)
        .text('Total Hors Taxes (HT)', rightColX, curTotY);
      doc
        .font('Helvetica-Bold')
        .fontSize(9)
        .fillColor(COLOR_GREEN_DARK)
        .text(`${formattedAmount} DZD`, rightColX, curTotY, { width: rightColWidth, align: 'right' });

      curTotY += 18;
      doc
        .moveTo(rightColX, curTotY)
        .lineTo(rightX, curTotY)
        .strokeColor(COLOR_BORDER)
        .lineWidth(0.5)
        .stroke();

      curTotY += 8;
      // Ligne TVA
      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor(COLOR_TEXT_MUTED)
        .text('TVA (Exonération Logiciel)', rightColX, curTotY);
      doc
        .font('Helvetica')
        .fontSize(8.5)
        .fillColor(COLOR_TEXT_MUTED)
        .text('0,00 DZD', rightColX, curTotY, { width: rightColWidth, align: 'right' });

      curTotY += 18;
      doc
        .moveTo(rightColX, curTotY)
        .lineTo(rightX, curTotY)
        .strokeColor(COLOR_BORDER)
        .lineWidth(0.5)
        .stroke();

      curTotY += 12;

      // Bloc NET À PAYER Vert Impérial & Or
      const totalBoxHeight = 44;
      doc
        .roundedRect(rightColX, curTotY, rightColWidth, totalBoxHeight, 6)
        .fill(COLOR_GREEN_DARK);

      doc
        .font('Helvetica-Bold')
        .fontSize(8)
        .fillColor('#FFFFFF')
        .text('NET À PAYER (TTC)', rightColX + 12, curTotY + 10);

      doc
        .font('Helvetica-Bold')
        .fontSize(13)
        .fillColor(COLOR_GOLD)
        .text(`${formattedAmount} DZD`, rightColX + 12, curTotY + 8, {
          width: rightColWidth - 24,
          align: 'right',
        });

      doc
        .font('Helvetica')
        .fontSize(7)
        .fillColor('#F5E8C7')
        .text('Facture entièrement acquittée par carte bancaire', rightColX + 12, curTotY + 27, {
          width: rightColWidth - 24,
          align: 'right',
        });

      // ==========================================
      // SECTION E : PIED DE PAGE RÉGLEMENTAIRE
      // ==========================================
      const footerY = 752;

      doc
        .moveTo(marginX, footerY)
        .lineTo(rightX, footerY)
        .strokeColor(COLOR_BORDER)
        .lineWidth(0.8)
        .stroke();

      doc
        .font('Helvetica')
        .fontSize(7.5)
        .fillColor(COLOR_TEXT_MUTED)
        .text(
          'Virtanis — Éditeur de solutions logicielles professionnelles — virtanis.net — contact@virtanis.dz',
          marginX,
          footerY + 8,
          { width: contentWidth, align: 'center' }
        );

      doc
        .font('Helvetica')
        .fontSize(7)
        .fillColor(COLOR_TEXT_FAINT)
        .text(
          'Facture émise par voie électronique en conformité avec la Loi n° 18-05 relative au commerce électronique en Algérie.',
          marginX,
          footerY + 20,
          { width: contentWidth, align: 'center' }
        );

      doc
        .font('Helvetica-Oblique')
        .fontSize(7)
        .fillColor(COLOR_TEXT_FAINT)
        .text(
          'Cette facture constitue votre titre de propriété de la licence logicielle VCheque.',
          marginX,
          footerY + 31,
          { width: contentWidth, align: 'center' }
        );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
