import { describe, it, expect, afterAll } from 'vitest';
import prisma from '../lib/prisma';
import { NextRequest } from 'next/server';
import { POST as submitCheckout } from '../app/api/checkout/submit/route';

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
});
