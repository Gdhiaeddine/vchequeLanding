import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';

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
 * Nettoie toute séquence de type "nombre / nombre" pour éviter les barres obliques entre chiffres
 * ex: "10/11/2026" -> "10 - 11 - 2026"
 */
function removeSlashBetweenNumbers(value: string | null | undefined): string {
  if (!value) return '';
  return String(value).replace(/(\d+)\s*\/\s*(\d+)/g, '$1 - $2');
}

/**
 * Formate un montant en Dinars Algériens (DZD) avec des espaces ASCII standard (0x20)
 * pour séparer les milliers et une virgule décimale.
 * Garantit l'absence totale du caractère Unicode U+202F (Narrow No-Break Space)
 * qui était converti en slash (" /") par l'encodage WinAnsi de PDFKit.
 */
function formatCurrencyDZD(amount: number): string {
  const num = Math.round(Number(amount || 0) * 100) / 100;
  const parts = num.toFixed(2).split('.');
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const decPart = parts[1];
  return `${intPart},${decPart}`;
}

/**
 * Génère le document officiel de facture acquittée A4 au format PDF
 * en style monochrome noir & blanc minimaliste, haute fidélité financière,
 * exactement sur 1 page unique, avec la typographie officielle de la marque VCheque.
 */
export async function generateInvoicePdf(params: InvoiceParams): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      // Configuration de la page A4 (595.28 x 841.89 pt) avec marges contrôlées
      const doc = new PDFDocument({
        size: 'A4',
        autoFirstPage: true,
        margins: {
          top: 36,
          bottom: 30,
          left: 40,
          right: 40,
        },
        info: {
          Title: `Facture-${removeSlashBetweenNumbers(params.orderRef)}`,
          Author: 'Virtanis Technologies',
          Subject: 'Facture Officielle VCheque Acquittée',
          Keywords: 'VCheque, Facture, Virtanis, Licence, Algérie',
        },
      });

      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // Chargement de la police de la marque (DM Serif Display - identique au site)
      const fontTtfPath = path.join(process.cwd(), 'public', 'fonts', 'DMSerifDisplay-Regular.ttf');
      let brandFont = 'Times-Bold';
      if (fs.existsSync(fontTtfPath)) {
        try {
          doc.registerFont('BrandSerif', fontTtfPath);
          brandFont = 'BrandSerif';
        } catch {
          brandFont = 'Times-Bold';
        }
      }

      const marginX = 40;
      const contentWidth = 515.28; // 595.28 - 80
      const rightX = marginX + contentWidth;

      // Palette Monochrome (Noir, Blanc et Niveaux de Gris Professionnels)
      const COLOR_BLACK = '#000000';
      const COLOR_BODY = '#222222';
      const COLOR_MUTED = '#555555';
      const COLOR_FAINT = '#777777';
      const COLOR_BORDER = '#D1D5DB';
      const COLOR_BORDER_LIGHT = '#E5E7EB';
      const COLOR_BG_LIGHT = '#F8F9FA';

      // Formatage de la date en toutes lettres pour éliminer tout slash entre chiffres
      const MONTHS_FR = [
        'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
        'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
      ];
      const paymentDate = params.paidAt ? new Date(params.paidAt) : new Date();
      const dayStr = String(paymentDate.getDate()).padStart(2, '0');
      const monthStr = MONTHS_FR[paymentDate.getMonth()] || '';
      const yearStr = paymentDate.getFullYear();
      const dateStr = `${dayStr} ${monthStr} ${yearStr}`;

      // Montant formaté en Dinars Algériens (ex: 25 000,00 DZD) sans caractère unicode masqué
      const formattedAmount = formatCurrencyDZD(params.amount);

      const cleanOrderRef = removeSlashBetweenNumbers(params.orderRef);
      const cleanTransactionId = removeSlashBetweenNumbers(params.transactionId || params.orderRef);
      const cleanPhone = removeSlashBetweenNumbers(params.phone);
      const cleanAddress = removeSlashBetweenNumbers(params.address);
      const cleanVille = removeSlashBetweenNumbers(params.ville);
      const cleanWilaya = removeSlashBetweenNumbers(params.wilaya);

      // ==========================================
      // 1. EN-TÊTE ÉPURÉ (MONOCHROME NOIR & BLANC)
      // ==========================================
      const headerY = 38;

      // Nom de marque VCheque dans la police du site (DM Serif Display)
      doc.font(brandFont).fontSize(26).fillColor(COLOR_BLACK);
      doc.text('VCheque', marginX, headerY);

      doc
        .font('Helvetica')
        .fontSize(8.5)
        .fillColor(COLOR_MUTED)
        .text("Solution d'Impression & Gestion de Chèques Bancaires — Édité par Virtanis", marginX, headerY + 30);

      doc
        .font('Helvetica')
        .fontSize(7.5)
        .fillColor(COLOR_FAINT)
        .text('www.virtanis.net • support@virtanis.dz', marginX, headerY + 44);

      // Bloc de droite : Facture, Référence, Date & Statut
      // Titre Facture Acquittée
      doc
        .font(brandFont)
        .fontSize(16)
        .fillColor(COLOR_BLACK)
        .text('FACTURE ACQUITTÉE', marginX, headerY + 2, {
          align: 'right',
          width: contentWidth,
        });

      doc
        .font('Helvetica-Bold')
        .fontSize(9.5)
        .fillColor(COLOR_BLACK)
        .text(`N° Commande : ${cleanOrderRef}`, marginX, headerY + 24, {
          align: 'right',
          width: contentWidth,
        });

      doc
        .font('Helvetica')
        .fontSize(8.5)
        .fillColor(COLOR_MUTED)
        .text(`Date d'émission : ${dateStr}`, marginX, headerY + 38, {
          align: 'right',
          width: contentWidth,
        });

      // Statut simple sans rectangle lourd
      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor(COLOR_BODY)
        .text('Règlement reçu en ligne (SlickPay — CIB, Edahabia)', marginX, headerY + 52, {
          align: 'right',
          width: contentWidth,
        });

      // Espace augmenté sous VCheque et Facture Acquittée (aération demandée)
      const lineY1 = headerY + 82;
      doc
        .moveTo(marginX, lineY1)
        .lineTo(rightX, lineY1)
        .strokeColor(COLOR_BLACK)
        .lineWidth(1)
        .stroke();

      // ==========================================
      // 2. CARTOUCHES PARTENAIRES (ÉDITEUR & CLIENT)
      // ==========================================
      const partyY = lineY1 + 16;
      const colWidth = (contentWidth - 16) / 2;
      const clientX = marginX + colWidth + 16;
      const boxHeight = 74;

      // Cartouche Éditeur (Gauche)
      doc
        .roundedRect(marginX, partyY, colWidth, boxHeight, 4)
        .strokeColor(COLOR_BORDER_LIGHT)
        .lineWidth(0.75)
        .stroke();

      doc
        .font('Helvetica-Bold')
        .fontSize(7.5)
        .fillColor(COLOR_FAINT)
        .text('ÉDITEUR & PRESTATAIRE', marginX + 10, partyY + 8);

      doc
        .font('Helvetica-Bold')
        .fontSize(9.5)
        .fillColor(COLOR_BLACK)
        .text('Virtanis Technologies', marginX + 10, partyY + 20);

      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor(COLOR_MUTED)
        .text('Plateforme VCheque Algérie', marginX + 10, partyY + 33)
        .text('Alger, Algérie • Conforme Loi 18-05 E-Commerce', marginX + 10, partyY + 45)
        .text('support@virtanis.dz • www.virtanis.net', marginX + 10, partyY + 57);

      // Cartouche Client (Droite)
      doc
        .roundedRect(clientX, partyY, colWidth, boxHeight, 4)
        .strokeColor(COLOR_BORDER_LIGHT)
        .lineWidth(0.75)
        .stroke();

      doc
        .font('Helvetica-Bold')
        .fontSize(7.5)
        .fillColor(COLOR_FAINT)
        .text('CLIENT & DESTINATAIRE', clientX + 10, partyY + 8);

      doc
        .font('Helvetica-Bold')
        .fontSize(9.5)
        .fillColor(COLOR_BLACK)
        .text(params.customerName, clientX + 10, partyY + 20);

      let clientSubY = partyY + 33;
      if (params.company) {
        doc
          .font('Helvetica-Bold')
          .fontSize(8)
          .fillColor(COLOR_BODY)
          .text(params.company, clientX + 10, clientSubY);
        clientSubY += 12;
      }

      const clientContact = [params.email, cleanPhone].filter(Boolean).join(' • ');
      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor(COLOR_MUTED)
        .text(clientContact, clientX + 10, clientSubY);

      clientSubY += 12;
      const clientLocation = [cleanAddress, cleanVille, cleanWilaya ? `(${cleanWilaya})` : '']
        .filter(Boolean)
        .join(' • ') || 'Algérie';

      doc
        .font('Helvetica')
        .fontSize(7.5)
        .fillColor(COLOR_MUTED)
        .text(clientLocation, clientX + 10, clientSubY, {
          width: colWidth - 20,
          ellipsis: true,
        });

      // ==========================================
      // 3. TABLEAU DES PRESTATIONS FACTURÉES
      // ==========================================
      const tableY = partyY + boxHeight + 14;
      const thHeight = 20;

      // En-tête du tableau : bandeau noir pur avec texte blanc
      doc
        .rect(marginX, tableY, contentWidth, thHeight)
        .fill(COLOR_BLACK);

      doc.font('Helvetica-Bold').fontSize(8).fillColor('#FFFFFF');
      doc.text('DÉSIGNATION DU LOGICIEL', marginX + 10, tableY + 6);
      doc.text('QTÉ', marginX + 295, tableY + 6, { width: 30, align: 'center' });
      doc.text('PRIX UNITAIRE HT', marginX + 335, tableY + 6, { width: 85, align: 'right' });
      doc.text('TOTAL DZD', marginX + 425, tableY + 6, { width: 80, align: 'right' });

      // Ligne de prestation
      const rowY = tableY + thHeight + 10;

      doc
        .font('Helvetica-Bold')
        .fontSize(9)
        .fillColor(COLOR_BLACK)
        .text(params.planTitle || 'Licence Commerciale VCheque (Perpétuelle)', marginX + 10, rowY);

      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor(COLOR_MUTED)
        .text(
          'Licence permanente pour poste de travail Windows. Préparation, mise en page et impression haute précision des chèques bancaires algériens (BNA, BEA, CPA, BDL, BADR, CNEP, Al Baraka, Al Salam, CCP).',
          marginX + 10,
          rowY + 14,
          { width: 275, lineGap: 2 }
        );

      // Boîte simple de clé d'activation (monochrome)
      const keyBoxY = rowY + 50;
      const keyBoxWidth = 275;
      const keyBoxHeight = 18;

      doc
        .roundedRect(marginX + 10, keyBoxY, keyBoxWidth, keyBoxHeight, 3)
        .fillAndStroke(COLOR_BG_LIGHT, COLOR_BORDER);

      doc
        .font('Courier-Bold')
        .fontSize(8.5)
        .fillColor(COLOR_BLACK)
        .text(`Clé : ${removeSlashBetweenNumbers(params.licenseKey)}`, marginX + 16, keyBoxY + 4, {
          width: keyBoxWidth - 12,
        });

      // Quantité, Prix unitaire, Total
      doc
        .font('Helvetica')
        .fontSize(9)
        .fillColor(COLOR_BLACK)
        .text('1', marginX + 295, rowY + 6, { width: 30, align: 'center' });

      doc
        .font('Helvetica')
        .fontSize(9)
        .fillColor(COLOR_BLACK)
        .text(`${formattedAmount} DZD`, marginX + 335, rowY + 6, { width: 85, align: 'right' });

      doc
        .font('Helvetica-Bold')
        .fontSize(9)
        .fillColor(COLOR_BLACK)
        .text(`${formattedAmount} DZD`, marginX + 425, rowY + 6, { width: 80, align: 'right' });

      // Ligne séparatrice inférieure du tableau
      const tableBottomY = keyBoxY + keyBoxHeight + 12;
      doc
        .moveTo(marginX, tableBottomY)
        .lineTo(rightX, tableBottomY)
        .strokeColor(COLOR_BORDER)
        .lineWidth(0.75)
        .stroke();

      // ==========================================
      // 4. ZONE INFÉRIEURE : PAIEMENT, CACHET & TOTAUX
      // ==========================================
      const bottomZoneY = tableBottomY + 14;
      const leftColWidth = 265;
      const rightColWidth = 225;
      const rightColX = rightX - rightColWidth;

      // 1. Informations de Règlement (Gauche)
      const payBoxHeight = 52;
      doc
        .roundedRect(marginX, bottomZoneY, leftColWidth, payBoxHeight, 4)
        .fillAndStroke(COLOR_BG_LIGHT, COLOR_BORDER_LIGHT);

      doc
        .font('Helvetica-Bold')
        .fontSize(7.5)
        .fillColor(COLOR_FAINT)
        .text('RÈGLEMENT SÉCURISÉ SLICKPAY', marginX + 10, bottomZoneY + 7);

      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor(COLOR_BODY)
        .text('Passerelle : Carte CIB, Edahabia (SATIM)', marginX + 10, bottomZoneY + 19)
        .text(`ID Transaction : ${cleanTransactionId}`, marginX + 10, bottomZoneY + 30);

      doc
        .font('Helvetica-Bold')
        .fontSize(8)
        .fillColor(COLOR_BLACK)
        .text('Facture acquittée et soldée en ligne', marginX + 10, bottomZoneY + 41);

      // 2. Cachet Électronique Virtanis épuré (Gauche)
      const sealY = bottomZoneY + payBoxHeight + 10;
      const sealHeight = 62;

      // Double cadre sobre monochrome
      doc
        .roundedRect(marginX, sealY, leftColWidth, sealHeight, 4)
        .strokeColor(COLOR_BLACK)
        .lineWidth(0.75)
        .stroke();

      doc
        .roundedRect(marginX + 2.5, sealY + 2.5, leftColWidth - 5, sealHeight - 5, 2.5)
        .strokeColor(COLOR_BORDER_LIGHT)
        .lineWidth(0.5)
        .stroke();

      doc
        .font('Helvetica-Bold')
        .fontSize(7.5)
        .fillColor(COLOR_BLACK)
        .text('CACHET ÉLECTRONIQUE VIRTANIS', marginX, sealY + 8, {
          width: leftColWidth,
          align: 'center',
        });

      doc
        .font('Helvetica-Bold')
        .fontSize(8.5)
        .fillColor(COLOR_BLACK)
        .text(`ACQUITTÉ LE ${dateStr.toUpperCase()}`, marginX, sealY + 20, {
          width: leftColWidth,
          align: 'center',
        });

      doc
        .font('Helvetica')
        .fontSize(7)
        .fillColor(COLOR_MUTED)
        .text('Signature Numérique & Intégrité Certifiées', marginX, sealY + 33, {
          width: leftColWidth,
          align: 'center',
        });

      doc
        .font('Helvetica-Bold')
        .fontSize(6.5)
        .fillColor(COLOR_FAINT)
        .text('VIRTANIS TECHNOLOGIES ALGERIA • AUTHENTICITÉ GARANTIE', marginX, sealY + 46, {
          width: leftColWidth,
          align: 'center',
        });

      // 3. Tableau des Totaux (Droite)
      let curTotY = bottomZoneY + 2;

      // Total HT
      doc
        .font('Helvetica')
        .fontSize(8.5)
        .fillColor(COLOR_MUTED)
        .text('Total Hors Taxes (HT)', rightColX, curTotY);

      doc
        .font('Helvetica-Bold')
        .fontSize(9)
        .fillColor(COLOR_BLACK)
        .text(`${formattedAmount} DZD`, rightColX, curTotY, { width: rightColWidth, align: 'right' });

      curTotY += 16;
      doc
        .moveTo(rightColX, curTotY)
        .lineTo(rightX, curTotY)
        .strokeColor(COLOR_BORDER_LIGHT)
        .lineWidth(0.5)
        .stroke();

      curTotY += 6;
      // TVA
      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor(COLOR_MUTED)
        .text('TVA (Exonération Logiciel)', rightColX, curTotY);

      doc
        .font('Helvetica')
        .fontSize(8.5)
        .fillColor(COLOR_MUTED)
        .text('0,00 DZD', rightColX, curTotY, { width: rightColWidth, align: 'right' });

      curTotY += 16;
      doc
        .moveTo(rightColX, curTotY)
        .lineTo(rightX, curTotY)
        .strokeColor(COLOR_BORDER_LIGHT)
        .lineWidth(0.5)
        .stroke();

      curTotY += 10;
      // Bloc NET À PAYER (Monochrome : Noir plein avec texte blanc)
      const totalBoxHeight = 44;
      doc
        .roundedRect(rightColX, curTotY, rightColWidth, totalBoxHeight, 4)
        .fill(COLOR_BLACK);

      doc
        .font('Helvetica-Bold')
        .fontSize(8)
        .fillColor('#FFFFFF')
        .text('NET À PAYER (TTC)', rightColX + 10, curTotY + 9);

      doc
        .font('Helvetica-Bold')
        .fontSize(12.5)
        .fillColor('#FFFFFF')
        .text(`${formattedAmount} DZD`, rightColX + 10, curTotY + 8, {
          width: rightColWidth - 20,
          align: 'right',
        });

      doc
        .font('Helvetica')
        .fontSize(7)
        .fillColor('#D1D5DB')
        .text('Facture entièrement acquittée par carte bancaire', rightColX + 10, curTotY + 27, {
          width: rightColWidth - 20,
          align: 'right',
        });

      // ==========================================
      // 5. PIED DE PAGE RÉGLEMENTAIRE (STRICTEMENT 1 PAGE)
      // ==========================================
      const footerY = 745;

      doc
        .moveTo(marginX, footerY)
        .lineTo(rightX, footerY)
        .strokeColor(COLOR_BORDER)
        .lineWidth(0.75)
        .stroke();

      doc
        .font('Helvetica')
        .fontSize(7.5)
        .fillColor(COLOR_MUTED)
        .text(
          'Virtanis — Éditeur de solutions logicielles professionnelles — www.virtanis.net — contact@virtanis.dz',
          marginX,
          footerY + 8,
          { width: contentWidth, align: 'center' }
        );

      doc
        .font('Helvetica')
        .fontSize(7)
        .fillColor(COLOR_FAINT)
        .text(
          'Facture émise par voie électronique en conformité avec la Loi n° 18-05 relative au commerce électronique en Algérie.',
          marginX,
          footerY + 19,
          { width: contentWidth, align: 'center' }
        );

      doc
        .font('Helvetica-Oblique')
        .fontSize(6.5)
        .fillColor(COLOR_FAINT)
        .text(
          'Cette facture constitue votre titre de propriété de la licence logicielle VCheque.',
          marginX,
          footerY + 29,
          { width: contentWidth, align: 'center' }
        );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
