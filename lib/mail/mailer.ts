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

    const fromAddress = process.env.MAIL_FROM_ADDRESS || 'support@virtanis.dz';
    const fromName = process.env.MAIL_FROM_NAME || 'VCheque par Virtanis';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vcheque.virtanis.com';
    const year = new Date().getFullYear();

    const formattedAmount = new Intl.NumberFormat('fr-DZ', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

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

    // 2. Gabarit HTML responsive (Luxury Banking & Enterprise Security)
    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F4EC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #102C25; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F7F4EC; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Conteneur 600px Max -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #E5DFD3; border-radius: 18px; overflow: hidden; box-shadow: 0 12px 30px rgba(16, 44, 37, 0.07);">
          
          <!-- SECTION A : HEADER BANNER (VERT IMPÉRIAL & OR) -->
          <tr>
            <td style="background-color: #102C25; padding: 32px 25px; text-align: center; border-bottom: 3px solid #B99A5A;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <span style="font-size: 26px; font-weight: 800; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; letter-spacing: -0.02em;">
                      <span style="color: #FFFFFF;">V</span><span style="color: #B99A5A;">Cheque</span>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 8px;">
                    <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.16em; color: #E5DFD3;">
                      IMPRESSION &amp; GESTION DE CHÈQUES BANCAIRES
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CORPS PRINCIPAL DE L'EMAIL -->
          <tr>
            <td style="padding: 32px 28px 24px 28px;">

              <!-- SECTION B : SALUTATION & REMERCIEMENT -->
              <h2 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 700; color: #102C25; letter-spacing: -0.01em;">
                Bonjour ${customerName},
              </h2>

              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #556660;">
                Nous vous confirmons avec plaisir le règlement de <strong style="color: #102C25;">${formattedAmount} DZD</strong> effectué avec succès par carte bancaire (CIB / Edahabia). Votre licence commerciale permanente pour <strong>${maxActivations} poste Windows</strong> est désormais activée et prête à l'emploi.
              </p>

              <!-- SECTION C : BOÎTE MAÎTRESSE - CLÉ D'ACTIVATION COMMERCIALE -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 28px 0; background-color: #F7F4EC; border: 2px dashed #B99A5A; border-radius: 12px; text-align: center;">
                <tr>
                  <td style="padding: 22px 18px;">
                    <p style="margin: 0 0 10px 0; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: #7A5F2E;">
                      VOTRE CLÉ D&apos;ACTIVATION COMMERCIALE
                    </p>

                    <!-- Boîte intérieure blanche pour la clé -->
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FFFFFF; border: 1px solid #E5DFD3; border-radius: 8px; margin: 0 0 10px 0;">
                      <tr>
                        <td style="padding: 14px 12px; text-align: center;">
                          <span style="font-family: 'Courier New', Courier, monospace; font-size: 20px; font-weight: 700; color: #102C25; letter-spacing: 2px; word-break: break-all;">
                            ${licenseKey}
                          </span>
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 0; font-size: 11.5px; color: #556660;">
                      Réf. Commande : <strong style="color: #102C25; font-family: monospace;">${orderRef}</strong> • Licence Perpétuelle (${maxActivations} PC)
                    </p>
                  </td>
                </tr>
              </table>

              <!-- SECTION D : GUIDE DE PRISE EN MAIN EN 3 ÉTAPES NUMÉROTÉES -->
              <h3 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #102C25;">
                Guide de mise en route en 3 étapes
              </h3>

              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 26px 0;">
                <!-- ÉTAPE 1 -->
                <tr>
                  <td width="36" valign="top" style="padding-bottom: 18px;">
                    <span style="display: inline-block; width: 26px; height: 26px; line-height: 26px; text-align: center; border-radius: 50%; background-color: #102C25; color: #FFFFFF; font-weight: 700; font-size: 12px;">
                      1
                    </span>
                  </td>
                  <td valign="top" style="padding-bottom: 18px;">
                    <p style="margin: 0 0 8px 0; font-size: 13.5px; font-weight: 700; color: #102C25;">
                      Télécharger VCheque pour Windows
                    </p>
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td>
                          <a href="${appUrl}/telecharger/fichier" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #102C25; color: #FFFFFF; font-size: 12px; font-weight: 700; text-decoration: none; border-radius: 6px; border-left: 3px solid #B99A5A;">
                            Télécharger VCheque (.exe)
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- ÉTAPE 2 -->
                <tr>
                  <td width="36" valign="top" style="padding-bottom: 18px;">
                    <span style="display: inline-block; width: 26px; height: 26px; line-height: 26px; text-align: center; border-radius: 50%; background-color: #102C25; color: #FFFFFF; font-weight: 700; font-size: 12px;">
                      2
                    </span>
                  </td>
                  <td valign="top" style="padding-bottom: 18px;">
                    <p style="margin: 0 0 4px 0; font-size: 13.5px; font-weight: 700; color: #102C25;">
                      Installer le logiciel sur votre poste de travail
                    </p>
                    <p style="margin: 0; font-size: 12.5px; line-height: 1.5; color: #556660;">
                      Exécutez le fichier d'installation sur le PC Windows dédié à la rédaction et l'impression de chèques.
                    </p>
                  </td>
                </tr>

                <!-- ÉTAPE 3 -->
                <tr>
                  <td width="36" valign="top">
                    <span style="display: inline-block; width: 26px; height: 26px; line-height: 26px; text-align: center; border-radius: 50%; background-color: #B99A5A; color: #102C25; font-weight: 800; font-size: 12px;">
                      3
                    </span>
                  </td>
                  <td valign="top">
                    <p style="margin: 0 0 4px 0; font-size: 13.5px; font-weight: 700; color: #102C25;">
                      Activer votre licence
                    </p>
                    <p style="margin: 0; font-size: 12.5px; line-height: 1.5; color: #556660;">
                      Saisissez votre clé d'activation à l'ouverture. La validation s'effectue instantanément hors-ligne par signature Ed25519.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- SECTION E : ENCART D'ANNONCE DE LA FACTURE PDF JOINTE -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 24px 0; background-color: #F1F8F4; border-left: 4px solid #137333; border-radius: 8px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 700; color: #102C25;">
                      Facture Officielle en Pièce Jointe (PDF)
                    </p>
                    <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #2D5A43;">
                      Votre facture acquittée <strong>Facture-${orderRef}.pdf</strong> est attachée à ce message pour votre service comptable. Vous pouvez également la <a href="${appUrl}/api/checkout/invoice/${orderRef}" style="color: #137333; font-weight: 700; text-decoration: underline;">télécharger directement ici</a>.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- SECTION F : SUPPORT -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid #E5DFD3; padding-top: 18px; margin-top: 8px;">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 4px 0; font-size: 12px; color: #556660;">
                      Besoin d'un accompagnement technique ou d'un devis multi-postes ?
                    </p>
                    <p style="margin: 0; font-size: 12px;">
                      <a href="mailto:support@virtanis.dz" style="color: #7A5F2E; font-weight: 700; text-decoration: none;">support@virtanis.dz</a>
                      <span style="color: #B99A5A; margin: 0 8px;">•</span>
                      <a href="https://virtanis.net" target="_blank" style="color: #102C25; font-weight: 700; text-decoration: none;">virtanis.net</a>
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- SECTION F (SUITE) : FOOTER LÉGAL -->
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
Email : support@virtanis.dz
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
