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
   * Crée une facture SlickPay pour une commande donnée et retourne l'URL de paiement.
   */
  public async createInvoice(orderId: number, returnUrl: string): Promise<string> {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error('Commande introuvable.');

    // Mode simulation locale
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

    // Appel à la véritable API SlickPay
    try {
      const payload = {
        amount: order.amount,
        nom: order.nom,
        prenom: '',
        email: order.email,
        phone: order.telephone || '',
        address: order.adresse || 'Alger',
        return_url: returnUrl,
        items: [
          {
            name: `Licence VCheque - Réf ${order.reference}`,
            price: order.amount,
            quantity: 1,
          },
        ],
      };

      const res = await fetch(`${this.getBaseUrl()}/users/invoices`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.publicKey}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.message || 'Échec de création de la facture SlickPay.');
      }

      await prisma.order.update({
        where: { id: order.id },
        data: {
          slickpay_invoice_id: data.id?.toString() || null,
          slickpay_payment_url: data.url,
          metadata: JSON.stringify(data),
        },
      });

      return data.url;
    } catch (err: any) {
      console.warn('SlickPay API error, fallback to simulation mode:', err.message);
      const mockInvoiceId = 'MOCK-INV-' + crypto.randomBytes(4).toString('hex').toUpperCase();
      const mockPaymentUrl = `${returnUrl}?ref=${order.reference}&simulated=true`;

      await prisma.order.update({
        where: { id: order.id },
        data: {
          slickpay_invoice_id: mockInvoiceId,
          slickpay_payment_url: mockPaymentUrl,
          metadata: JSON.stringify({ mode: 'fallback_mock', error: err.message }),
        },
      });

      return mockPaymentUrl;
    }
  }
}

export const slickPayService = new SlickPayService();
export default slickPayService;
