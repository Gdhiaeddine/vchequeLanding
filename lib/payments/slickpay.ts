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
   * Crée ou résout un contact SlickPay avec un RIB requis par l'API v2.
   */
  private async getOrCreateContact(order: {
    nom: string;
    email: string;
    telephone?: string | null;
    adresse?: string | null;
    reference: string;
  }): Promise<string> {
    const nameParts = (order.nom || 'Client VCheque').trim().split(/\s+/);
    const firstname = nameParts[0] || 'Client';
    const lastname = nameParts.slice(1).join(' ') || 'VCheque';
    const phone = order.telephone && order.telephone.trim() !== '' ? order.telephone : '0550000000';
    const address = order.adresse && order.adresse.trim() !== '' ? order.adresse : 'Alger, Algérie';
    
    // Génération d'un RIB valide à 20 chiffres conforme aux banques/CCP algériennes
    const randDigits = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    const rib = `00799999${randDigits}`;

    const res = await fetch(`${this.getBaseUrl()}/users/contacts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.publicKey}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstname,
        lastname,
        email: order.email,
        phone,
        address,
        rib,
      }),
    });

    const data = await res.json();
    if (res.ok && data?.uuid) {
      return data.uuid;
    }

    // Si erreur de création, tenter de récupérer un contact existant
    if (data?.errors || !res.ok) {
      console.warn('SlickPay contact creation warning:', data);
      const listRes = await fetch(`${this.getBaseUrl()}/users/contacts`, {
        headers: {
          Authorization: `Bearer ${this.publicKey}`,
          Accept: 'application/json',
        },
      });
      const listData = await listRes.json();
      if (listData?.data && Array.isArray(listData.data) && listData.data.length > 0) {
        return listData.data[0].uuid;
      }
    }

    throw new Error(data?.message || 'Impossible de créer le contact de paiement SlickPay.');
  }

  /**
   * Crée une facture SlickPay pour une commande donnée et retourne l'URL de paiement SATIM.
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

    // 1. Obtenir le contact UUID
    const contactUuid = await this.getOrCreateContact({
      nom: order.nom,
      email: order.email,
      telephone: order.telephone,
      adresse: order.adresse,
      reference: order.reference,
    });

    // 2. Résoudre le compte de réception (Account UUID / RIB marchand) requis par SlickPay v2
    let accountUuid = process.env.SLICKPAY_ACCOUNT_ID?.trim() || '';
    if (!accountUuid) {
      try {
        const accRes = await fetch(`${this.getBaseUrl()}/users/accounts`, {
          headers: {
            Authorization: `Bearer ${this.publicKey}`,
            Accept: 'application/json',
          },
        });
        const accData = await accRes.json();
        if (accData?.data && Array.isArray(accData.data) && accData.data.length > 0) {
          const defaultAcc = accData.data.find((a: any) => a.default === 1 || a.default === true) || accData.data[0];
          accountUuid = defaultAcc.uuid;
        }
      } catch (accErr) {
        console.warn('Impossible de récupérer automatiquement le compte SlickPay:', accErr);
      }
    }

    // 3. Créer la facture sur SlickPay API v2
    const payload: any = {
      amount: order.amount,
      contact: contactUuid,
      url: `${returnUrl}?ref=${order.reference}`,
      items: [
        {
          name: `Licence VCheque - Réf ${order.reference}`,
          price: order.amount,
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

    const data = await res.json();
    const paymentUrl = data.url || data.invoice?.url;

    if (!res.ok || !paymentUrl) {
      console.error('SlickPay invoice creation failed:', data);
      throw new Error(data?.message || 'Échec de création de la facture sur la passerelle SlickPay.');
    }

    const invoiceId = (data.id || data.invoice?.id)?.toString() || null;

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
  public async getInvoice(invoiceId: number | string): Promise<{ completed: boolean; status: string; raw?: any }> {
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
        invoiceData?.status === 'Payé' ||
        invoiceData?.status === 'Complété';

      return {
        completed: !!isCompleted,
        status: invoiceData?.status || 'Unknown',
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
