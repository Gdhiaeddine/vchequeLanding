import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import prisma from '../lib/prisma';
import { NextRequest } from 'next/server';
import { POST as activateRoute } from '../app/api/v1/license/activate/route';
import { POST as verifyRoute } from '../app/api/v1/license/verify/route';
import { GET as historyRoute } from '../app/api/v1/license/history/[key]/route';
import { POST as transferRoute } from '../app/api/v1/license/transfer/route';
import licenseManager from '../lib/licensing/license-manager';

describe('Desktop Client License API Endpoints', () => {
  let testKey: string;

  beforeAll(async () => {
    const lic = await licenseManager.createLicense(
      {
        licensee_name: 'Pharmacie El Chifa',
        licensee_email: 'pharmacie@elchifa.dz',
        company: 'Pharmacie El Chifa EURL',
        max_activations: 1,
      },
      'TEST_SUITE'
    );
    testKey = lic.license_key;
  });

  afterAll(async () => {
    if (testKey) {
      await prisma.license.deleteMany({ where: { license_key: testKey } });
    }
    await prisma.$disconnect();
  });

  it('POST /api/v1/license/activate successfully binds machine 1', async () => {
    const req = new NextRequest('http://localhost:3000/api/v1/license/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        license_key: testKey,
        machine_id: 'DESKTOP-ABC123456789',
        machine_name: 'Caisse-Principale',
        os_info: 'Windows 11',
      }),
    });

    const res = await activateRoute(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.status).toBe('activated');
    expect(json.data.signature).toBeDefined();
    expect(json.data.payload.machine_id).toBe('desktop-abc123456789');
  });

  it('POST /api/v1/license/activate rejects second PC when quota is 1', async () => {
    const req = new NextRequest('http://localhost:3000/api/v1/license/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        license_key: testKey,
        machine_id: 'DESKTOP-XYZ987654321',
        machine_name: 'Bureau-Direction',
      }),
    });

    const res = await activateRoute(req);
    expect(res.status).toBe(409);

    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.code).toBe('ALREADY_ACTIVATED_ON_ANOTHER_PC');
  });

  it('POST /api/v1/license/verify validates machine 1', async () => {
    const req = new NextRequest('http://localhost:3000/api/v1/license/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        license_key: testKey,
        machine_id: 'DESKTOP-ABC123456789',
      }),
    });

    const res = await verifyRoute(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.valid).toBe(true);
    expect(json.status).toBe('active');
  });

  it('POST /api/v1/license/transfer unbinds machine 1', async () => {
    const req = new NextRequest('http://localhost:3000/api/v1/license/transfer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        license_key: testKey,
        reason: 'Changement de carte mère',
      }),
    });

    const res = await transferRoute(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
  });

  it('POST /api/v1/license/activate now allows activating machine 2 after transfer', async () => {
    const req = new NextRequest('http://localhost:3000/api/v1/license/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        license_key: testKey,
        machine_id: 'DESKTOP-XYZ987654321',
        machine_name: 'Nouveau-PC',
      }),
    });

    const res = await activateRoute(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.payload.machine_id).toBe('desktop-xyz987654321');
  });

  it('GET /api/v1/license/history/[key] returns audit logs and activations', async () => {
    const req = new NextRequest(`http://localhost:3000/api/v1/license/history/${testKey}`);
    const res = await historyRoute(req, { params: Promise.resolve({ key: testKey }) });
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.activations.length).toBeGreaterThanOrEqual(1);
    expect(json.data.audit_logs.length).toBeGreaterThanOrEqual(2);
  });
});
