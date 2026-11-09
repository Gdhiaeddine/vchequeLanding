import { describe, it, expect } from 'vitest';
import { Ed25519Signer } from '../lib/licensing/ed25519';

describe('Ed25519Signer', () => {
  const pubKey = '256f8f978f4e725ab3295771ea276be6918d1e6bb1262cbfc10ce2fadb7170ac';
  const privKey =
    'beb40b4e9921b157c9151ddd1a78c200629223a48b53d936465ca5cfeb666729256f8f978f4e725ab3295771ea276be6918d1e6bb1262cbfc10ce2fadb7170ac';

  const signer = new Ed25519Signer(pubKey, privKey);

  it('canonicalizes JSON object recursively with sorted keys and no spaces', () => {
    const raw = {
      zebra: 1,
      apple: 'hello',
      nested: {
        charlie: true,
        bravo: [3, 2, 1],
        alpha: 'accentué avec é / slashes',
      },
    };

    const canonical = signer.canonicalize(raw);
    expect(canonical).toBe(
      '{"apple":"hello","nested":{"alpha":"accentué avec é / slashes","bravo":[3,2,1],"charlie":true},"zebra":1}'
    );
  });

  it('signs payload and verifies signature correctly', async () => {
    const payload = {
      edition: 'COMMERCIAL',
      issued_at: 1730000000,
      license_key: 'VCHQ-TEST-1234-5678-ABCD',
      licensee_email: 'client@example.com',
      licensee_name: 'Client Test',
      machine_id: 'a1b2c3d4e5f6',
      type: 'PERMANENT',
      version: 1,
    };

    const signed = await signer.sign(payload);
    expect(signed.signature).toBeDefined();
    expect(signed.signature.length).toBe(128); // 64 bytes in hex
    expect(signed.payload_b64).toBeDefined();

    const isValid = await signer.verify(signed.payload_b64, signed.signature);
    expect(isValid).toBe(true);

    // Tampered payload verification should fail
    const tamperedPayloadB64 = Buffer.from(
      JSON.stringify({ ...payload, edition: 'PIRATED' })
    ).toString('base64');
    const isTamperedValid = await signer.verify(tamperedPayloadB64, signed.signature);
    expect(isTamperedValid).toBe(false);
  });
});
