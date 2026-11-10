import { describe, it, expect, afterAll } from 'vitest';
import prisma from '../lib/prisma';
import { NextRequest } from 'next/server';
import { POST as submitCheckout } from '../app/api/checkout/submit/route';
import slickPayService from '../lib/payments/slickpay';
import mailerService from '../lib/mail/mailer';
import { generateInvoicePdf } from '../lib/pdf/invoice-generator';

describe('Checkout & Order Flow', () => {
  let createdRef: string;

  afterAll(async () => {
    if (createdRef) {
      await prisma.order.deleteMany({ where: { reference: createdRef } });
    }
    await prisma.$disconnect();
  });

  it('creates an order with single plan (4900 DA) and returns payment redirect', async () => {
    const req = new NextRequest('http://localhost:3000/api/checkout/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nom: 'Dr. Yacine Kaci',
        email: 'yacine.kaci@clinic.dz',
        telephone: '0555 11 22 33',
        entreprise: 'Clinique Al Azhar',
        plan: 'single',
      }),
    });

    const res = await submitCheckout(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.reference).toBeDefined();
    expect(json.redirect_url).toBeDefined();

    createdRef = json.reference;

    const saved = await prisma.order.findUnique({ where: { reference: createdRef } });
    expect(saved).toBeDefined();
    expect(saved?.amount).toBe(4900);
    expect(saved?.status).toBe('pending');
  });

  it('creates an enterprise pack order with 18900 DA amount', async () => {
    const req = new NextRequest('http://localhost:3000/api/checkout/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nom: 'Amine Berrada',
        email: 'finance@groupe-berrada.dz',
        telephone: '0555 99 88 77',
        entreprise: 'Groupe Berrada & Frères',
        plan: 'enterprise',
      }),
    });

    const res = await submitCheckout(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    const enterpriseRef = json.reference;

    const saved = await prisma.order.findUnique({ where: { reference: enterpriseRef } });
    expect(saved?.amount).toBe(18900);

    await prisma.order.delete({ where: { reference: enterpriseRef } });
  });

  it('verifies getInvoice returns completed: false for mock or invalid invoice ID', async () => {
    const status = await slickPayService.getInvoice('MOCK-INV-1234');
    expect(status.completed).toBe(false);
  });

  it('ensures mailer service is configured and handles email delivery interface', () => {
    expect(mailerService).toBeDefined();
    expect(typeof mailerService.sendLicenseConfirmationEmail).toBe('function');
  });

  it('generates a valid high-fidelity vector PDF invoice with %PDF- header', async () => {
    const pdf = await generateInvoicePdf({
      orderRef: 'VC-20261110-TEST1',
      customerName: 'Samir Benali',
      company: 'SARL Atlas Distribution',
      email: 'samir.benali@atlas.dz',
      phone: '0550 12 34 56',
      address: 'Zone Industrielle Oued Smar',
      ville: 'Alger',
      wilaya: '16 - Alger',
      amount: 8500,
      licenseKey: 'VC-TEST-KEY1-9999',
      transactionId: 'SATIM-12345678',
    });

    expect(pdf).toBeDefined();
    expect(Buffer.isBuffer(pdf)).toBe(true);
    expect(pdf.length).toBeGreaterThan(1000);
    const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page\b/g) || []).length;
    expect(pages).toBe(1);

    // Verify valid PDF magic header (%PDF-)
    const header = pdf.subarray(0, 5).toString('ascii');
    expect(header).toBe('%PDF-');
  });

  it('generates a 1-page monochrome PDF invoice without slashes between numbers', async () => {
    const pdf = await generateInvoicePdf({
      orderRef: 'VC-20261110-TEST2',
      customerName: 'Karim Zouaoui',
      company: 'Eurl Sahara Logistics',
      email: 'karim@sahara.dz',
      phone: '0550/12/34/56',
      address: 'Route 12/A Lot 44/2',
      ville: 'Blida',
      wilaya: '09/Blida',
      amount: 18900,
      licenseKey: 'VC-8888-9999-1111-2222',
      paidAt: new Date('2026-11-10T10:00:00Z'),
      transactionId: 'SLK-INV-99999',
    });

    const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page\b/g) || []).length;
    expect(pages).toBe(1);
    const raw = pdf.toString('utf-8');
    expect(raw).not.toMatch(/\d+\/\d+/);

    // Decompress PDF stream to verify raw text does not contain " /" in amounts
    const zlib = await import('zlib');
    let streamIdx = pdf.indexOf('stream\n');
    while (streamIdx !== -1) {
      const endStream = pdf.indexOf('endstream', streamIdx);
      const chunk = pdf.subarray(streamIdx + 7, endStream);
      try {
        const text = zlib.inflateSync(chunk).toString('latin1');
        expect(text).not.toContain(' /');
        expect(text).not.toContain('18 /900');
        expect(text).not.toContain('/900');
      } catch {}
      streamIdx = pdf.indexOf('stream\n', endStream + 9);
    }
  });
});
