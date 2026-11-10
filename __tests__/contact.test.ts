import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import prisma from '../lib/prisma';
import { NextRequest } from 'next/server';
import { POST as contactRoute } from '../app/api/contact/route';
import { resetRateLimit } from '../lib/security/rate-limiter';

describe('Contact Form API & Rate Limiting Hardening', () => {
  const testIp = '203.0.113.88';
  const testEmail = 'audit-ratelimit@vcheque.dz';

  beforeAll(() => {
    resetRateLimit(`contact:ip:${testIp}`);
    resetRateLimit(`contact:email:${testEmail}`);
  });

  afterAll(async () => {
    await prisma.contactMessage.deleteMany({
      where: { email: testEmail },
    });
    resetRateLimit(`contact:ip:${testIp}`);
    resetRateLimit(`contact:email:${testEmail}`);
    await prisma.$disconnect();
  });

  it('silently discards spam with honeypot without writing to database', async () => {
    const req = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '198.51.100.99',
      },
      body: JSON.stringify({
        name: 'Spam Bot',
        email: 'spambot@example.com',
        subject: 'Buy cheap watches',
        message: 'Visit our spam link now!',
        contact_hp: 'I am a malicious bot filling hidden fields',
      }),
    });

    const res = await contactRoute(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);

    const found = await prisma.contactMessage.findFirst({
      where: { email: 'spambot@example.com' },
    });
    expect(found).toBeNull();
  });

  it('rejects invalid inputs with 422 before consuming rate limit quota', async () => {
    const req = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': testIp,
      },
      body: JSON.stringify({
        name: 'A', // too short
        email: 'invalid-email',
        subject: '',
        message: 'short',
      }),
    });

    const res = await contactRoute(req);
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.errors).toBeDefined();
  });

  it('allows up to 5 valid contact messages and enforces rate limit on the 6th', async () => {
    // Send 5 successful messages
    for (let i = 1; i <= 5; i++) {
      const req = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': testIp,
        },
        body: JSON.stringify({
          name: `Contact Tester ${i}`,
          email: testEmail,
          phone: '0550123456',
          company: 'Virtanis Test',
          subject: `Demande de devis n°${i}`,
          message: `Ceci est un message de test automatisé numéro ${i} pour le rate limiting.`,
        }),
      });

      const res = await contactRoute(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.remaining).toBe(5 - i);
    }

    // 6th attempt should be blocked with 429 Too Many Requests
    const blockedReq = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': testIp,
      },
      body: JSON.stringify({
        name: 'Contact Tester 6',
        email: testEmail,
        phone: '0550123456',
        subject: 'Demande de devis n°6',
        message: 'Ce message doit obligatoirement être rejeté par le rate limiter.',
      }),
    });

    const blockedRes = await contactRoute(blockedReq);
    expect(blockedRes.status).toBe(429);
    expect(blockedRes.headers.get('Retry-After')).toBeDefined();

    const blockedJson = await blockedRes.json();
    expect(blockedJson.success).toBe(false);
    expect(blockedJson.error).toContain('Limite d\'envoi atteinte');
  });
});
