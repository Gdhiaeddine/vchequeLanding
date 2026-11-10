import { NextRequest, NextResponse } from 'next/server';
import licenseManager from '@/lib/licensing/license-manager';
import { checkRateLimit } from '@/lib/security/rate-limiter';

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    // Limitation du débit pour prévenir le scanning automatisé (60 requêtes par minute par IP)
    const rateLimit = checkRateLimit(`verify:ip:${ip}`, 60, 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          valid: false,
          error: 'Trop de vérifications rapprochées. Veuillez patienter une minute.',
          code: 'RATE_LIMITED',
        },
        { status: 429, headers: { 'Retry-After': String(rateLimit.resetInSec) } }
      );
    }

    const body = await request.json();
    const { license_key, machine_id } = body;

    if (!license_key || !machine_id) {
      return NextResponse.json(
        {
          valid: false,
          error: "La clé de licence et l'identifiant machine sont requis.",
          code: 'INVALID_ARGUMENTS',
        },
        { status: 400 }
      );
    }

    const result = await licenseManager.verify(license_key, machine_id);
    const httpStatus = typeof result.statusCode === 'number' ? result.statusCode : result.valid ? 200 : 400;

    return NextResponse.json(result, { status: httpStatus });
  } catch (error: any) {
    return NextResponse.json(
      {
        valid: false,
        error: error.message || 'Erreur lors de la vérification.',
        code: 'VERIFICATION_FAILED',
      },
      { status: 500 }
    );
  }
}
