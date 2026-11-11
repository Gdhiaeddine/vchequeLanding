import prisma from '@/lib/prisma';
import crypto from 'crypto';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
   * Récupère la liste officielle des comptes de réception (RIB) rattachés à votre profil SlickPay.
   */
  public async getAccounts(): Promise<any[]> {
    if (!this.isConfigured() || this.isMockMode()) {
      return [];
    }

    try {
      const res = await fetch(`${this.getBaseUrl()}/users/accounts`, {
        headers: {
          Authorization: `Bearer ${this.publicKey}`,
          Accept: 'application/json',
        },
        cache: 'no-store',
      });

      if (!res.ok) {
        console.warn(`[SlickPay] Impossible de récupérer les comptes (HTTP ${res.status}).`);
        return [];
      }

      const data = await res.json();
      return Array.isArray(data?.data) ? data.data : [];
    } catch (err) {
      console.warn('[SlickPay] Erreur lors de la récupération des comptes:', err);
      return [];
    }
  }

  /**
   * Résout intelligemment l'UUID du compte marchand pour éviter l'erreur "Compte non trouvé".
   * Accepte indifféremment un UUID, un ID numérique, un RIB ou le titre du compte.
   */
  public async resolveAccountUuid(): Promise<string | null> {
    const rawConfigAccount = process.env.SLICKPAY_ACCOUNT_ID?.trim() || '';
    const accounts = await this.getAccounts();

    if (accounts.length > 0) {
      // 1. Si une valeur de configuration est fournie, tenter une correspondance intelligente
      if (rawConfigAccount) {
        const matched = accounts.find((a: any) => {
          if (!a) return false;
          if (a.uuid && a.uuid.toLowerCase() === rawConfigAccount.toLowerCase()) return true;
          if (a.id && a.id.toString() === rawConfigAccount) return true;
          if (a.rib && a.rib.replace(/\s+/g, '') === rawConfigAccount.replace(/\s+/g, '')) return true;
          if (a.title && a.title.toLowerCase().trim() === rawConfigAccount.toLowerCase().trim()) return true;
          return false;
        });

        if (matched && matched.uuid && UUID_REGEX.test(matched.uuid)) {
          return matched.uuid;
        }
      }

      // 2. Sinon, prendre le compte marqué par défaut (default: 1)
      const defaultAcc = accounts.find((a: any) => a.default === 1 || a.default === true);
      if (defaultAcc?.uuid && UUID_REGEX.test(defaultAcc.uuid)) {
        return defaultAcc.uuid;
      }

      // 3. À défaut, prendre le premier compte disponible
      if (accounts[0]?.uuid && UUID_REGEX.test(accounts[0].uuid)) {
        return accounts[0].uuid;
      }
    }

    // 4. Si la valeur configurée est déjà un UUID valide (au cas où /users/accounts n'a pas répondu)
    if (rawConfigAccount && UUID_REGEX.test(rawConfigAccount)) {
      return rawConfigAccount;
    }

    return null;
  }

  /**
   * Crée une facture SlickPay API v2 pour une commande donnée et retourne l'URL de paiement SATIM.
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

    // 1. Préparation des coordonnées client inline conformes à la spécification officielle
    const nameParts = (order.nom || 'Client VCheque').trim().split(/\s+/);
    const firstname = nameParts[0] || 'Client';
    const lastname = nameParts.slice(1).join(' ') || 'VCheque';
    const phone =
      order.telephone && order.telephone.trim() !== ''
        ? order.telephone.trim().replace(/[^0-9+]/g, '') || '0550000000'
        : '0550000000';
    const address =
      order.adresse && order.adresse.trim() !== '' ? order.adresse.trim() : 'Alger, Algérie';

    // 2. Résoudre le compte de réception officiel (Account UUID)
    const accountUuid = await this.resolveAccountUuid();

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

    // N'ajouter account QUE si c'est un UUID valide garanti
    if (accountUuid && UUID_REGEX.test(accountUuid)) {
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

      let detailedMsg = `Échec de création de la facture sur SlickPay (HTTP ${res.status}).`;

      if (data?.message) {
        detailedMsg = data.message;
      } else if (data?.error) {
        detailedMsg = data.error;
      }

      // Collecter exhaustivement toutes les erreurs (Laravel validation + erreurs métier directes comme account ou contact)
      const errorParts: string[] = [];

      if (data?.errors && typeof data.errors === 'object') {
        for (const [key, val] of Object.entries(data.errors)) {
          errorParts.push(`${key}: ${Array.isArray(val) ? val.join(', ') : val}`);
        }
      }

      // Intercepter les erreurs retournées sous forme de clés directes (ex: { account: "Compte non trouvé." })
      for (const [key, val] of Object.entries(data || {})) {
        if (
          !['success', 'message', 'error', 'errors', 'status', 'id', 'invoice', 'data'].includes(key) &&
          typeof val === 'string' &&
          !errorParts.some((p) => p.startsWith(`${key}:`))
        ) {
          errorParts.push(`${key}: ${val}`);
        }
      }

      if (errorParts.length > 0) {
        detailedMsg = `${detailedMsg} (${errorParts.join(' | ')})`;
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
   * Diagnostic en direct pour vérifier l'environnement, les comptes et la création de facture SATIM.
   */
  public async testConnection(): Promise<{
    success: boolean;
    environment: string;
    baseUrl: string;
    publicKeyMasked: string;
    accountsCount: number;
    accounts: any[];
    resolvedAccountUuid: string | null;
    sampleInvoiceUrl?: string;
    error?: string;
  }> {
    const environment = this.isSandbox ? 'Sandbox (devapi.slick-pay.com)' : 'Production (prodapi.slick-pay.com)';
    const publicKeyMasked = this.publicKey
      ? `${this.publicKey.slice(0, 6)}...${this.publicKey.slice(-4)}`
      : 'NON CONFIGURÉE';

    if (!this.isConfigured()) {
      return {
        success: false,
        environment,
        baseUrl: this.getBaseUrl(),
        publicKeyMasked,
        accountsCount: 0,
        accounts: [],
        resolvedAccountUuid: null,
        error: 'La clé SLICKPAY_PUBLIC_KEY est absente.',
      };
    }

    try {
      const accounts = await this.getAccounts();
      const resolvedAccountUuid = await this.resolveAccountUuid();

      // Test de création de facture témoin
      const testPayload: Record<string, any> = {
        amount: 4900,
        url: 'https://vcheque.virtanis.net/commander/succes?ref=DIAG-TEST',
        firstname: 'Test',
        lastname: 'Diagnostic',
        phone: '0550000000',
        email: 'diagnostic@vcheque.virtanis.net',
        address: 'Alger, Algérie',
        note: 'Test Diagnostic VCheque SATIM',
        items: [{ name: 'Test SATIM VCheque', price: 4900, quantity: 1 }],
      };

      if (resolvedAccountUuid) {
        testPayload.account = resolvedAccountUuid;
      }

      const res = await fetch(`${this.getBaseUrl()}/users/invoices`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.publicKey}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testPayload),
      });

      const resText = await res.text();
      let resJson: any = {};
      try {
        resJson = JSON.parse(resText);
      } catch {
        // Ignorer
      }

      const sampleInvoiceUrl = resJson.url || resJson.invoice?.url || resJson.data?.url;

      if (!res.ok || !sampleInvoiceUrl) {
        return {
          success: false,
          environment,
          baseUrl: this.getBaseUrl(),
          publicKeyMasked,
          accountsCount: accounts.length,
          accounts: accounts.map((a: any) => ({
            id: a.id,
            title: a.title,
            rib: a.rib,
            default: a.default,
            uuid: a.uuid,
          })),
          resolvedAccountUuid,
          error: `HTTP ${res.status}: ${resText}`,
        };
      }

      return {
        success: true,
        environment,
        baseUrl: this.getBaseUrl(),
        publicKeyMasked,
        accountsCount: accounts.length,
        accounts: accounts.map((a: any) => ({
          id: a.id,
          title: a.title,
          rib: a.rib,
          default: a.default,
          uuid: a.uuid,
        })),
        resolvedAccountUuid,
        sampleInvoiceUrl,
      };
    } catch (err: any) {
      return {
        success: false,
        environment,
        baseUrl: this.getBaseUrl(),
        publicKeyMasked,
        accountsCount: 0,
        accounts: [],
        resolvedAccountUuid: null,
        error: err.message || 'Erreur inattendue.',
      };
    }
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
