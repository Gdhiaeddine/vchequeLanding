import prisma from '@/lib/prisma';
import crypto from 'crypto';

export class SlickPayService {
  private publicKey: string;
  private isSandbox: boolean;

  constructor() {
    this.publicKey = process.env.SLICKPAY_PUBLIC_KEY || '';
    this.isSandbox = process.env.SLICKPAY_SANDBOX !== 'false';
  }

  public getBaseUrl(): string {
    return this.isSandbox
      ? 'https://devapi.slick-pay.com/api/v2'
      : 'https://prodapi.slick-pay.com/api/v2';
  }

  public isConfigured(): boolean {
    return !!this.publicKey && this.publicKey.trim() !== '';
  }

  public isMockMode(): boolean {
    if (process.env.SLICKPAY_MOCK === 'true' || process.env.NODE_ENV === 'test') {
      return true;
    }
    return !this.isConfigured();
  }

  /**
   * Crée une facture SlickPay API v2 pour une commande donnée et retourne l'URL de paiement SATIM.
   * Aligne le payload directement avec la spécification officielle (contact inline sans RIB fictif).
   */
  public async createInvoice(orderId: number, returnUrl: string): Promise<string> {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error('Commande introuvable.');

    // Mode simulation locale explicite
    if (this.isMockMode()) {
      const mockInvoiceId = 'MOCK-INV-' + crypto.randomBytes(4).toString('hex').toUpperCase();
      const mockPaymentUrl = `${returnUrl}?ref=${order.reference}&simulated=true`;

      await prisma.order.update({
        where: { id: order.id },
        data: {
          slickpay_invoice_id: mockInvoiceId,
          slickpay_payment_url: mockPaymentUrl,
          metadata: JSON.stringify({ mode: 'mock_simulation' }),
        },
      });

      return mockPaymentUrl;
    }

    // 1. Préparation des coordonnées client inline (selon doc officielle SlickPay)
    const nameParts = (order.nom || 'Client VCheque').trim().split(/\s+/);
    const firstname = nameParts[0] || 'Client';
    const lastname = nameParts.slice(1).join(' ') || 'VCheque';
    const phone =
      order.telephone && order.telephone.trim() !== ''
        ? order.telephone.trim().replace(/[^0-9+]/g, '') || '0550000000'
        : '0550000000';
    const address =
      order.adresse && order.adresse.trim() !== '' ? order.adresse.trim() : 'Alger, Algérie';

    // 2. Résoudre le compte de réception (Account UUID marchand) si nécessaire
    let accountUuid = process.env.SLICKPAY_ACCOUNT_ID?.trim() || '';
    if (!accountUuid) {
      try {
        const accRes = await fetch(`${this.getBaseUrl()}/users/accounts`, {
          headers: {
            Authorization: `Bearer ${this.publicKey}`,
            Accept: 'application/json',
          },
          cache: 'no-store',
        });
        if (accRes.ok) {
          const accData = await accRes.json();
          if (accData?.data && Array.isArray(accData.data) && accData.data.length > 0) {
            const defaultAcc =
              accData.data.find((a: any) => a.default === 1 || a.default === true) ||
              accData.data[0];
            accountUuid = defaultAcc.uuid;
          }
        }
      } catch (accErr) {
        console.warn('SlickPay account lookup skipped (using SlickPay default):', accErr);
      }
    }

    // 3. Payload conforme à POST /api/v2/users/invoices
    const payload: Record<string, any> = {
      amount: Number(order.amount),
      url: `${returnUrl}?ref=${order.reference}`,
      firstname,
      lastname,
      phone,
      email: order.email.trim(),
      address,
      note: `Commande VCheque ${order.reference}`,
      items: [
        {
          name: `Licence VCheque - Réf ${order.reference}`,
          price: Number(order.amount),
          quantity: 1,
        },
      ],
    };

    if (accountUuid) {
      payload.account = accountUuid;
    }

    const res = await fetch(`${this.getBaseUrl()}/users/invoices`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.publicKey}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const rawText = await res.text();
    let data: any = {};
    try {
      data = JSON.parse(rawText);
    } catch {
      console.error('[SlickPay] Non-JSON response:', rawText);
      throw new Error(`Réponse invalide de SlickPay (HTTP ${res.status}).`);
    }

    // Gestion explicite d'erreur d'authentification (souvent due à un mismatch Sandbox / Production)
    if (res.status === 401) {
      const envName = this.isSandbox ? 'Sandbox (devapi)' : 'Production (prodapi)';
      throw new Error(
        `Authentification SlickPay refusée (401 Unauthenticated) sur l'environnement ${envName}. Vérifiez votre SLICKPAY_PUBLIC_KEY et SLICKPAY_SANDBOX.`
      );
    }

    const paymentUrl = data.url || data.invoice?.url || data.data?.url;

    if (!res.ok || !paymentUrl) {
      console.error('[SlickPay invoice creation failed]', {
        status: res.status,
        env: this.isSandbox ? 'sandbox' : 'production',
        data,
      });

      let detailedMsg =
        data?.message ||
        data?.error ||
        `Échec de création de la facture sur SlickPay (HTTP ${res.status}).`;

      if (data?.errors && typeof data.errors === 'object') {
        const errorDetails = Object.entries(data.errors)
          .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
          .join(' | ');
        detailedMsg = `${detailedMsg} (${errorDetails})`;
      } else if (typeof data?.contact === 'string') {
        detailedMsg = `${detailedMsg} (${data.contact})`;
      }

      throw new Error(detailedMsg);
    }

    const invoiceId = (data.id || data.invoice?.id || data.data?.id)?.toString() || null;

    await prisma.order.update({
      where: { id: order.id },
      data: {
        slickpay_invoice_id: invoiceId,
        slickpay_payment_url: paymentUrl,
        metadata: JSON.stringify(data),
      },
    });

    return paymentUrl;
  }

  /**
   * Vérifie le statut d'une facture auprès de l'API SlickPay.
   */
  public async getInvoice(
    invoiceId: number | string
  ): Promise<{ completed: boolean; status: string; raw?: any }> {
    if (!invoiceId || invoiceId.toString().startsWith('MOCK-INV-')) {
      return { completed: false, status: 'Mock' };
    }

    try {
      const res = await fetch(`${this.getBaseUrl()}/users/invoices/${invoiceId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.publicKey}`,
          Accept: 'application/json',
        },
        cache: 'no-store',
      });

      if (!res.ok) {
        return { completed: false, status: 'FetchError' };
      }

      const data = await res.json();
      const invoiceData = data?.data || data?.invoice || data;

      const isCompleted =
        data?.completed === 1 ||
        data?.completed === true ||
        invoiceData?.completed === 1 ||
        invoiceData?.completed === true ||
        invoiceData?.pay_status === 1 ||
        invoiceData?.payment_status === 'paid' ||
        invoiceData?.status === 'Payé' ||
        invoiceData?.status === 'Complété';

      return {
        completed: !!isCompleted,
        status: invoiceData?.payment_status || invoiceData?.status || 'Unknown',
        raw: data,
      };
    } catch (err: any) {
      console.error('Error fetching invoice status from SlickPay:', err);
      return { completed: false, status: 'Error' };
    }
  }
}

export const slickPayService = new SlickPayService();
export default slickPayService;
