import nodemailer from 'nodemailer';

interface SendLicenseEmailParams {
  to: string;
  customerName: string;
  orderRef: string;
  licenseKey: string;
  amount: number;
  company?: string | null;
  planTitle?: string;
  maxActivations?: number;
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
   * Envoie l'email de confirmation post-achat avec la clé de licence VCheque.
   */
  public async sendLicenseConfirmationEmail(params: SendLicenseEmailParams): Promise<boolean> {
    if (!this.transporter) {
      console.warn('MailerService: SMTP credentials not configured, skipping email.');
      return false;
    }

    const {
      to,
      customerName,
      orderRef,
      licenseKey,
      amount,
      company,
      planTitle = 'Licence VCheque Permanente',
      maxActivations = 1,
    } = params;

    const fromAddress = process.env.MAIL_FROM_ADDRESS || 'contact@virtanis.com';
    const fromName = process.env.MAIL_FROM_NAME || 'VCheque par Virtanis';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vcheque.virtanis.com';

    const formattedAmount = new Intl.NumberFormat('fr-DZ', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    const subject = `Votre clé de licence VCheque — Commande ${orderRef}`;

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
        <!-- Conteneur Principal -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 620px; background-color: #FFFFFF; border: 1px solid #E5E0D5; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(16, 44, 37, 0.06);">
          
          <!-- En-tête Institutionnel Vert Impérial -->
          <tr>
            <td style="background-color: #102C25; padding: 36px 32px; text-align: center; border-bottom: 3px solid #B99A5A;">
              <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #B99A5A;">
                VIRTANIS ÉDITION LOGICIELLE
              </p>
              <h1 style="margin: 0; font-size: 24px; font-weight: 400; font-family: Georgia, 'DM Serif Display', serif; color: #FFFFFF; letter-spacing: -0.01em;">
                Votre licence VCheque est prête
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 13px; color: #F5E8C7; opacity: 0.9;">
                Règlement validé par carte bancaire CIB / Edahabia
              </p>
            </td>
          </tr>

          <!-- Corps du message -->
          <tr>
            <td style="padding: 32px 32px 24px 32px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #102C25;">
                Bonjour <strong>${customerName}</strong>,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #556660;">
                Nous vous confirmons la validation de votre règlement pour l'acquisition du logiciel d'impression et d'édition de chèques bancaires <strong>VCheque</strong>. Vous trouverez ci-dessous votre clé d'activation permanente.
              </p>

              <!-- Cadre Clé de Licence Gold -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 28px 0; background-color: #F7F4EC; border: 2px dashed #B99A5A; border-radius: 14px; text-align: center;">
                <tr>
                  <td style="padding: 24px 20px;">
                    <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #96783C;">
                      Clé d'Activation Permanente
                    </p>
                    <p style="margin: 0; font-family: 'Courier New', Courier, monospace; font-size: 22px; font-weight: 700; color: #102C25; letter-spacing: 0.14em; word-break: break-all;">
                      ${licenseKey}
                    </p>
                    <p style="margin: 8px 0 0 0; font-size: 11px; color: #556660;">
                      Autorisé pour : ${maxActivations} poste${maxActivations > 1 ? 's' : ''} Windows ${company ? `(${company})` : ''}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Récapitulatif Commande -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 28px 0; border: 1px solid #EDE8DF; border-radius: 12px; background-color: #FCFAF7;">
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #EDE8DF;">
                    <span style="font-size: 12px; color: #556660;">Référence Commande :</span>
                    <strong style="float: right; font-size: 12px; color: #102C25; font-family: monospace;">${orderRef}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #EDE8DF;">
                    <span style="font-size: 12px; color: #556660;">Formule :</span>
                    <strong style="float: right; font-size: 12px; color: #102C25;">${planTitle}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px;">
                    <span style="font-size: 13px; font-weight: 600; color: #102C25;">Montant Réglé :</span>
                    <strong style="float: right; font-size: 15px; color: #102C25; font-weight: 700;">${formattedAmount} DZD</strong>
                  </td>
                </tr>
              </table>

              <!-- Guide d'activation rapide en 3 étapes -->
              <h3 style="margin: 0 0 16px 0; font-size: 15px; font-weight: 700; color: #102C25; text-transform: uppercase; letter-spacing: 0.05em;">
                Guide de mise en route Windows
              </h3>
              
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 28px 0;">
                <tr>
                  <td width="32" valign="top" style="padding-bottom: 12px;">
                    <span style="display: inline-block; width: 22px; height: 22px; line-height: 22px; text-align: center; border-radius: 50%; background-color: #102C25; color: #B99A5A; font-weight: 700; font-size: 11px;">1</span>
                  </td>
                  <td valign="top" style="padding-bottom: 12px; font-size: 13px; line-height: 1.5; color: #102C25;">
                    <strong>Téléchargez le logiciel :</strong> Récupérez l'installeur officiel VCheque compatible Windows 10 & 11.
                  </td>
                </tr>
                <tr>
                  <td width="32" valign="top" style="padding-bottom: 12px;">
                    <span style="display: inline-block; width: 22px; height: 22px; line-height: 22px; text-align: center; border-radius: 50%; background-color: #102C25; color: #B99A5A; font-weight: 700; font-size: 11px;">2</span>
                  </td>
                  <td valign="top" style="padding-bottom: 12px; font-size: 13px; line-height: 1.5; color: #102C25;">
                    <strong>Installez le programme :</strong> Lancez l'exécutable et suivez l'assistant d'installation sécurisé.
                  </td>
                </tr>
                <tr>
                  <td width="32" valign="top">
                    <span style="display: inline-block; width: 22px; height: 22px; line-height: 22px; text-align: center; border-radius: 50%; background-color: #102C25; color: #B99A5A; font-weight: 700; font-size: 11px;">3</span>
                  </td>
                  <td valign="top" style="font-size: 13px; line-height: 1.5; color: #102C25;">
                    <strong>Activez la licence :</strong> Collez votre clé ci-dessus au premier démarrage pour débloquer l'impression illimitée.
                  </td>
                </tr>
              </table>

              <!-- Bouton Télécharger -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 24px 0; text-align: center;">
                <tr>
                  <td align="center">
                    <a href="${appUrl}/telecharger" target="_blank" style="display: inline-block; padding: 14px 32px; background-color: #102C25; color: #FFFFFF; font-size: 13px; font-weight: 700; text-decoration: none; text-transform: uppercase; letter-spacing: 0.08em; border-radius: 999px; box-shadow: 0 4px 12px rgba(16, 44, 37, 0.2);">
                      Télécharger VCheque pour Windows
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #556660; text-align: center;">
                Besoin d'aide ? Notre support technique est à votre disposition par retour de cet email.
              </p>
            </td>
          </tr>

          <!-- Footer Signature -->
          <tr>
            <td style="background-color: #F7F4EC; padding: 20px 32px; text-align: center; border-top: 1px solid #E5E0D5; font-size: 11px; color: #556660;">
              <p style="margin: 0 0 4px 0;">
                © ${new Date().getFullYear()} Virtanis SARL. Tous droits réservés.
              </p>
              <p style="margin: 0;">
                Solution certifiée pour les banques et entreprises en Algérie.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const textContent = `
Bonjour ${customerName},

Merci pour votre commande sur VCheque (Réf: ${orderRef}).
Votre règlement de ${formattedAmount} DZD a été validé avec succès.

VOTRE CLÉ D'ACTIVATION PERMANENTE :
${licenseKey}

Autorisé pour : ${maxActivations} poste(s) Windows ${company ? `(${company})` : ''}

GUIDE DE MISE EN ROUTE :
1. Téléchargez le logiciel : ${appUrl}/telecharger
2. Installez le programme sous Windows.
3. Collez votre clé ci-dessus au premier lancement.

Une question ? Notre équipe d'assistance reste à votre écoute par retour de cet email.

L'équipe VCheque par Virtanis
https://vcheque.virtanis.com
    `.trim();

    try {
      const info = await this.transporter.sendMail({
        from: `"${fromName}" <${fromAddress}>`,
        to,
        subject,
        text: textContent,
        html: htmlContent,
      });

      console.log(`License email sent to ${to} for order ${orderRef}. MessageId: ${info.messageId}`);
      return true;
    } catch (err: any) {
      console.error(`Failed to send license email to ${to}:`, err);
      return false;
    }
  }
}

export const mailerService = new MailerService();
export default mailerService;
