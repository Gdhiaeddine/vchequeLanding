import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import prisma from '../lib/prisma';
import { LicenseManager } from '../lib/licensing/license-manager';

describe('LicenseManager', () => {
  const manager = new LicenseManager();
  let testLicenseKey: string;

  beforeAll(async () => {
    // Generate a test license
    const license = await manager.createLicense(
      {
        licensee_name: 'Test Client Ltd',
        licensee_email: 'test@client.com',
        max_activations: 1,
      },
      'TEST_SUITE'
    );
    testLicenseKey = license.license_key;
  });

  afterAll(async () => {
    if (testLicenseKey) {
      await prisma.license.deleteMany({ where: { license_key: testLicenseKey } });
    }
    await prisma.$disconnect();
  });

  it('activates a license on machine 1 successfully', async () => {
    const res = await manager.activate({
      licenseKey: testLicenseKey,
      machineId: 'MACHINE_ALPHA_001',
      machineName: 'Accounting-PC-1',
      osInfo: 'Windows 11 Pro',
    });

    expect(res.status).toBe('activated');
    expect(res.license_key).toBe(testLicenseKey);
    expect(res.signature).toBeDefined();
    expect(res.payload.machine_id).toBe('machine_alpha_001');
  });

  it('rejects activation on machine 2 when quota is 1', async () => {
    await expect(
      manager.activate({
        licenseKey: testLicenseKey,
        machineId: 'MACHINE_BETA_002',
        machineName: 'Accounting-PC-2',
      })
    ).rejects.toThrow();
  });

  it('allows activating machine 2 after quota is updated to 2', async () => {
    await manager.updateQuota(testLicenseKey, 2, 'TEST_ADMIN');

    const res2 = await manager.activate({
      licenseKey: testLicenseKey,
      machineId: 'MACHINE_BETA_002',
      machineName: 'Accounting-PC-2',
    });

    expect(res2.status).toBe('activated');
  });

  it('verifies machine 1 is active', async () => {
    const check = await manager.verify(testLicenseKey, 'MACHINE_ALPHA_001');
    expect(check.valid).toBe(true);
    expect(check.status).toBe('active');
  });

  it('revokes license and refuses subsequent verifications', async () => {
    await manager.revoke(testLicenseKey, 'Fraud detected', 'TEST_ADMIN');
    const check = await manager.verify(testLicenseKey, 'MACHINE_ALPHA_001');
    expect(check.valid).toBe(false);
    expect(check.code).toBe('LICENSE_REVOKED');
  });
});
