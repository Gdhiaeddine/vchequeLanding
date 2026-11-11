import nodemailer from 'nodemailer';
import { generateInvoicePdf, InvoiceParams } from '@/lib/pdf/invoice-generator';

export interface SendLicenseEmailParams {
  to: string;
  customerName: string;
  orderRef: string;
  licenseKey: string;
  amount: number;
  company?: string | null;
  phone?: string | null;
  address?: string | null;
  ville?: string | null;
  wilaya?: string | null;
  planTitle?: string;
  maxActivations?: number;
  paidAt?: Date | null;
  transactionId?: string | null;
}

export class MailerService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    const host = process.env.MAIL_HOST || 'smtp-relay.brevo.com';
    const port = Number(process.env.MAIL_PORT) || 587;
    const user = process.env.MAIL_USERNAME;
    const pass = process.env.MAIL_PASSWORD;

    if (user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass,
        },
      });
    }
  }

  /**
   * Envoie l'email de confirmation post-achat avec la clé de licence VCheque
   * et la facture officielle acquittée en pièce jointe PDF.
   * Stylisé selon la charte exacte du site web VCheque (Luxury Banking & Space Grotesk / DM Serif Display).
   */
  public async sendLicenseConfirmationEmail(params: SendLicenseEmailParams): Promise<boolean> {
    if (!this.transporter) {
      console.warn('MailerService: SMTP credentials not configured, skipping email delivery.');
      return false;
    }

    const {
      to,
      customerName,
      orderRef,
      licenseKey,
      amount,
      company,
      phone,
      address,
      ville,
      wilaya,
      planTitle = 'Licence Commerciale VCheque (Perpétuelle)',
      maxActivations = 1,
      paidAt = new Date(),
      transactionId,
    } = params;

    const fromAddress = process.env.MAIL_FROM_ADDRESS || 'support@virtanis.net';
    const fromName = process.env.MAIL_FROM_NAME || 'VCheque par Virtanis';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vcheque.virtanis.com';
    const year = new Date().getFullYear();

    // Formatage propre du montant DZD avec espaces standards ASCII
    const num = Math.round(Number(amount || 0) * 100) / 100;
    const parts = num.toFixed(2).split('.');
    const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    const formattedAmount = `${intPart},${parts[1]}`;

    // 1. Génération de la facture PDF acquittée
    let pdfBuffer: Buffer | null = null;
    try {
      pdfBuffer = await generateInvoicePdf({
        orderRef,
        customerName,
        company,
        email: to,
        phone,
        address,
        ville,
        wilaya,
        amount,
        licenseKey,
        paidAt,
        transactionId,
        planTitle,
      });
    } catch (pdfErr) {
      console.error('Failed to generate PDF invoice attachment:', pdfErr);
    }

    const subject = `Confirmation & Facture Acquittée — Licence VCheque (Réf: ${orderRef})`;

    // 2. Gabarit HTML responsive (Luxury Banking & Typographie DM Serif Display / Space Grotesk)
    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Space+Grotesk:wght@400;500;600;700&display=swap');
    body, table, td, p, a, li, dt, dd, span {
      font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    .brand-serif {
      font-family: 'DM Serif Display', Georgia, 'Times New Roman', serif !important;
    }
    .code-mono {
      font-family: 'Space Grotesk', 'Courier New', Courier, monospace !important;
    }
    @media only screen and (max-width: 600px) {
      .card-wrapper {
        width: 100% !important;
        border-radius: 14px !important;
      }
      .content-padding {
        padding: 24px 18px !important;
      }
      .key-text {
        font-size: 17px !important;
        letter-spacing: 1px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F4EC; font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #102C25; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F7F4EC; padding: 36px 14px;">
    <tr>
      <td align="center">
        <!-- Conteneur 620px Max fidèle aux cartes du site -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" class="card-wrapper" style="max-width: 620px; background-color: #FFFFFF; border: 1px solid #E5DFD3; border-radius: 20px; overflow: hidden; box-shadow: 0 16px 36px rgba(16, 44, 37, 0.08);">
          
          <!-- LISERÉ SUPÉRIEUR D'EXCELLENCE OR NOBLE (4PX) -->
          <tr>
            <td height="4" style="background-color: #B99A5A; line-height: 4px; font-size: 4px;">&nbsp;</td>
          </tr>

          <!-- EN-TÊTE INSTITUTIONNEL VERT IMPÉRIAL -->
          <tr>
            <td style="background-color: #102C25; padding: 30px 24px 26px 24px; text-align: center;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <span class="brand-serif" style="font-family: 'DM Serif Display', Georgia, serif; font-size: 30px; font-weight: 400; color: #FFFFFF; letter-spacing: 0.01em;">
                      <span>V</span><span style="color: #B99A5A;">Cheque</span>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 6px;">
                    <span style="font-family: 'Space Grotesk', sans-serif; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.16em; color: #E5DFD3;">
                      IMPRESSION &amp; GESTION DE CHÈQUES BANCAIRES
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CORPS PRINCIPAL DE L'EMAIL -->
          <tr>
            <td class="content-padding" style="padding: 34px 30px 26px 30px;">

              <!-- EYEBROW & TITRE DU SITE -->
              <p style="margin: 0 0 6px 0; font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.16em; color: #B99A5A;">
                CONFIRMATION DE COMMANDE
              </p>

              <h1 class="brand-serif" style="margin: 0 0 14px 0; font-family: 'DM Serif Display', Georgia, serif; font-size: 24px; font-weight: 400; color: #102C25; line-height: 1.25;">
                Merci pour votre commande, ${customerName} !
              </h1>

              <p style="margin: 0 0 24px 0; font-family: 'Space Grotesk', sans-serif; font-size: 14px; line-height: 1.6; color: #556660;">
                Votre règlement de <strong style="color: #102C25;">${formattedAmount} DZD</strong> a été validé avec succès par carte bancaire (CIB / Edahabia). Votre licence commerciale permanente pour <strong>${maxActivations} poste${maxActivations > 1 ? 's' : ''} Windows</strong> est activée et prête à l'emploi.
              </p>

              <!-- CARTE CLÉ D'ACTIVATION CRYPTOGRAPHIQUE -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 28px 0; background-color: #F7F4EC; border: 2px dashed #B99A5A; border-radius: 14px; text-align: center;">
                <tr>
                  <td style="padding: 22px 18px;">
                    <p style="margin: 0 0 10px 0; font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: #7A5F2E;">
                      VOTRE CLÉ D&apos;ACTIVATION COMMERCIALE
                    </p>

                    <!-- Boîte intérieure blanche pour la clé -->
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FFFFFF; border: 1px solid #E5DFD3; border-radius: 10px; margin: 0 0 10px 0; box-shadow: 0 2px 8px rgba(16, 44, 37, 0.04);">
                      <tr>
                        <td style="padding: 16px 12px; text-align: center;">
                          <span class="code-mono key-text" style="font-family: 'Space Grotesk', 'Courier New', Courier, monospace; font-size: 20px; font-weight: 700; color: #102C25; letter-spacing: 2px; word-break: break-all;">
                            ${licenseKey}
                          </span>
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 0; font-family: 'Space Grotesk', sans-serif; font-size: 11.5px; color: #556660;">
                      Réf. Commande : <strong style="color: #102C25; font-family: 'Space Grotesk', monospace;">${orderRef}</strong> • Licence Perpétuelle (${maxActivations} PC)
                    </p>
                  </td>
                </tr>
              </table>

              <!-- RÉCAPITULATIF DE LA TRANSACTION -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 28px 0; border: 1px solid #E5DFD3; border-radius: 12px; overflow: hidden;">
                <tr style="background-color: #FCFAF5; border-bottom: 1px solid #E5DFD3;">
                  <td colspan="2" style="padding: 12px 16px; font-family: 'Space Grotesk', sans-serif; font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #102C25;">
                    Détails du règlement
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; font-size: 12.5px; color: #6B7C74; border-bottom: 1px solid #F4F0E6;">
                    Référence commande
                  </td>
                  <td align="right" style="padding: 10px 16px; font-size: 12.5px; font-weight: 700; color: #102C25; font-family: 'Space Grotesk', monospace; border-bottom: 1px solid #F4F0E6;">
                    ${orderRef}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; font-size: 12.5px; color: #6B7C74; border-bottom: 1px solid #F4F0E6;">
                    Formule acquise
                  </td>
                  <td align="right" style="padding: 10px 16px; font-size: 12.5px; font-weight: 700; color: #102C25; border-bottom: 1px solid #F4F0E6;">
                    ${planTitle}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; font-size: 12.5px; color: #6B7C74; border-bottom: 1px solid #F4F0E6;">
                    Mode de règlement
                  </td>
                  <td align="right" style="padding: 10px 16px; font-size: 12.5px; color: #102C25; border-bottom: 1px solid #F4F0E6;">
                    Carte CIB / Edahabia (SlickPay)
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: 700; color: #102C25;">
                    Montant total TTC
                  </td>
                  <td align="right" style="padding: 12px 16px; font-size: 14px; font-weight: 700; color: #102C25;">
                    ${formattedAmount} DZD
                  </td>
                </tr>
              </table>

              <!-- GUIDE DE PRISE EN MAIN EN 3 ÉTAPES -->
              <h2 class="brand-serif" style="margin: 0 0 16px 0; font-family: 'DM Serif Display', Georgia, serif; font-size: 19px; font-weight: 400; color: #102C25;">
                Guide de mise en route en 3 étapes
              </h2>

              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 28px 0;">
                <!-- ÉTAPE 1 -->
                <tr>
                  <td width="38" valign="top" style="padding-bottom: 20px;">
                    <span style="display: inline-block; width: 26px; height: 26px; line-height: 26px; text-align: center; border-radius: 50%; background-color: #102C25; color: #FFFFFF; font-weight: 700; font-size: 12px; font-family: 'Space Grotesk', sans-serif;">
                      1
                    </span>
                  </td>
                  <td valign="top" style="padding-bottom: 20px;">
                    <p style="margin: 0 0 8px 0; font-size: 13.5px; font-weight: 700; color: #102C25;">
                      Télécharger VCheque pour Windows
                    </p>
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td>
                          <a href="${appUrl}/telecharger/fichier" target="_blank" style="display: inline-block; padding: 11px 22px; background-color: #102C25; color: #FFFFFF; font-family: 'Space Grotesk', sans-serif; font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; text-decoration: none; border-radius: 9999px; border-left: 3px solid #B99A5A; box-shadow: 0 4px 12px rgba(16, 44, 37, 0.15);">
                            Télécharger l&apos;installateur (.exe)
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- ÉTAPE 2 -->
                <tr>
                  <td width="38" valign="top" style="padding-bottom: 20px;">
                    <span style="display: inline-block; width: 26px; height: 26px; line-height: 26px; text-align: center; border-radius: 50%; background-color: #102C25; color: #FFFFFF; font-weight: 700; font-size: 12px; font-family: 'Space Grotesk', sans-serif;">
                      2
                    </span>
                  </td>
                  <td valign="top" style="padding-bottom: 20px;">
                    <p style="margin: 0 0 4px 0; font-size: 13.5px; font-weight: 700; color: #102C25;">
                      Installer l'application sur votre poste de travail
                    </p>
                    <p style="margin: 0; font-size: 12.5px; line-height: 1.55; color: #556660;">
                      Exécutez l'installateur Windows sur l'ordinateur dédié à la rédaction et l'impression de chèques.
                    </p>
                  </td>
                </tr>

                <!-- ÉTAPE 3 -->
                <tr>
                  <td width="38" valign="top">
                    <span style="display: inline-block; width: 26px; height: 26px; line-height: 26px; text-align: center; border-radius: 50%; background-color: #B99A5A; color: #102C25; font-weight: 800; font-size: 12px; font-family: 'Space Grotesk', sans-serif;">
                      3
                    </span>
                  </td>
                  <td valign="top">
                    <p style="margin: 0 0 4px 0; font-size: 13.5px; font-weight: 700; color: #102C25;">
                      Activer votre licence logicielle
                    </p>
                    <p style="margin: 0; font-size: 12.5px; line-height: 1.55; color: #556660;">
                      Saisissez votre clé d'activation au premier démarrage. La validation cryptographique s'effectue instantanément hors-ligne par signature Ed25519.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- ENCART FACTURE PDF JOINTE -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 24px 0; background-color: #F1F8F4; border-left: 4px solid #102C25; border-radius: 8px;">
                <tr>
                  <td style="padding: 16px 18px;">
                    <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 700; color: #102C25;">
                      Facture Officielle Acquittée en Pièce Jointe (PDF)
                    </p>
                    <p style="margin: 0; font-size: 12px; line-height: 1.55; color: #2D5A43;">
                      Votre facture officielle acquittée <strong>Facture-${orderRef}.pdf</strong> est attachée à cet email pour votre service comptable. Vous pouvez également la <a href="${appUrl}/api/checkout/invoice/${orderRef}" style="color: #102C25; font-weight: 700; text-decoration: underline;">télécharger directement ici</a>.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- ASSISTANCE ET CONTACT -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid #E5DFD3; padding-top: 20px; margin-top: 8px;">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 6px 0; font-size: 12px; color: #556660;">
                      Besoin d'une assistance technique ou d'un devis multi-postes ?
                    </p>
                    <p style="margin: 0; font-size: 12.5px; font-weight: 600;">
                      <a href="mailto:support@virtanis.net" style="color: #7A5F2E; text-decoration: none;">support@virtanis.net</a>
                      <span style="color: #B99A5A; margin: 0 8px;">•</span>
                      <a href="${appUrl}/contact" style="color: #102C25; text-decoration: none;">Page de Contact</a>
                      <span style="color: #B99A5A; margin: 0 8px;">•</span>
                      <a href="https://virtanis.net" target="_blank" style="color: #102C25; text-decoration: none;">virtanis.net</a>
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- PIED DE PAGE LÉGAL -->
          <tr>
            <td style="background-color: #F7F4EC; padding: 22px 25px; text-align: center; border-top: 1px solid #E5DFD3; font-size: 11px; line-height: 1.6; color: #7A8B84;">
              <p style="margin: 0 0 4px 0;">
                © ${year} <strong>Virtanis Technologies</strong> — Tous droits réservés.
              </p>
              <p style="margin: 0;">
                Éditeur de VCheque • Conforme aux lois algériennes 18-05 &amp; 18-07
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    // 3. Fallback texte brut
    const textContent = `
Bonjour ${customerName},

Merci pour votre acquisition de VCheque (Réf: ${orderRef}).
Votre règlement de ${formattedAmount} DZD par carte bancaire (CIB / Edahabia) a été validé avec succès.

============================================================
VOTRE CLÉ D'ACTIVATION COMMERCIALE :
${licenseKey}
============================================================
Réf. Commande : ${orderRef} • Licence Perpétuelle (${maxActivations} PC)

GUIDE DE MISE EN ROUTE :
1. Téléchargez VCheque : ${appUrl}/telecharger/fichier
2. Installez le logiciel sur le PC dédié à l'impression de chèques.
3. Activez votre licence à l'ouverture (signature Ed25519 hors-ligne).

FACTURE OFFICIELLE ACQUITTÉE :
Votre facture Facture-${orderRef}.pdf est jointe à ce message.
Lien direct de téléchargement : ${appUrl}/api/checkout/invoice/${orderRef}

ASSISTANCE TECHNIQUE :
Email : support@virtanis.net
Web : https://virtanis.net

© ${year} Virtanis Technologies — Tous droits réservés.
Éditeur de VCheque • Conforme aux lois algériennes 18-05 & 18-07
    `.trim();

    // 4. Préparation des pièces jointes
    const attachments: Array<{ filename: string; content: Buffer; contentType: string }> = [];
    if (pdfBuffer) {
      attachments.push({
        filename: `Facture-${orderRef}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      });
    }

    try {
      const info = await this.transporter.sendMail({
        from: `"${fromName}" <${fromAddress}>`,
        to,
        subject,
        text: textContent,
        html: htmlContent,
        attachments,
      });

      console.log(
        `License email + PDF invoice sent to ${to} for order ${orderRef}. MessageId: ${info.messageId}`
      );
      return true;
    } catch (err: any) {
      console.error(`Failed to send license email to ${to}:`, err);
      return false;
    }
  }
}

export const mailerService = new MailerService();
export default mailerService;
