import { describe, it, expect } from 'vitest';
import {
  generateTotpSecret,
  getTotpUri,
  generateQrCodeDataUrl,
  verifyTotpCode,
  generateRecoveryCodes,
} from '../lib/auth/totp';
import { authenticator } from 'otplib';

describe('TOTP Two-Factor Authentication', () => {
  it('generates a valid Base32 secret', () => {
    const secret = generateTotpSecret();
    expect(secret).toBeDefined();
    expect(secret.length).toBeGreaterThanOrEqual(16);
  });

  it('generates a valid otpauth uri', () => {
    const secret = generateTotpSecret();
    const uri = getTotpUri('admin@virtanis.dz', secret);
    expect(uri).toContain('otpauth://totp/');
    expect(uri).toContain('secret=' + secret);
  });

  it('generates a QR code data url', async () => {
    const secret = generateTotpSecret();
    const uri = getTotpUri('admin@virtanis.dz', secret);
    const dataUrl = await generateQrCodeDataUrl(uri);
    expect(dataUrl).toContain('data:image/png;base64,');
  });

  it('verifies a generated TOTP token correctly', () => {
    const secret = generateTotpSecret();
    const token = authenticator.generate(secret);
    const isValid = verifyTotpCode(token, secret);
    expect(isValid).toBe(true);

    const isInvalid = verifyTotpCode('000000', secret);
    expect(isInvalid).toBe(false);
  });

  it('generates 8 unique recovery codes with format XXXXXX-XXXXXX', () => {
    const codes = generateRecoveryCodes(8);
    expect(codes.length).toBe(8);
    const unique = new Set(codes);
    expect(unique.size).toBe(8);
    expect(codes[0]).toMatch(/^[A-F0-9]{6}-[A-F0-9]{6}$/);
  });
});
