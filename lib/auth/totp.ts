import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import crypto from 'crypto';

// Configure TOTP window (tolerates ±1 step of 30s)
authenticator.options = { window: 1 };

export function generateTotpSecret(): string {
  return authenticator.generateSecret();
}

export function getTotpUri(userEmail: string, secret: string): string {
  return authenticator.keyuri(userEmail, 'VCheque Admin', secret);
}

export async function generateQrCodeDataUrl(otpUri: string): Promise<string> {
  return QRCode.toDataURL(otpUri, {
    margin: 2,
    width: 256,
    color: {
      dark: '#122620',
      light: '#ffffff',
    },
  });
}

export function verifyTotpCode(code: string, secret: string): boolean {
  try {
    const cleanCode = code.replace(/\s+/g, '');
    return authenticator.check(cleanCode, secret);
  } catch {
    return false;
  }
}

export function generateRecoveryCodes(count = 8): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const part1 = crypto.randomBytes(3).toString('hex').toUpperCase();
    const part2 = crypto.randomBytes(3).toString('hex').toUpperCase();
    codes.push(`${part1}-${part2}`);
  }
  return codes;
}
