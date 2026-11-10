import { NextRequest, NextResponse } from 'next/server';
import licenseManager from '@/lib/licensing/license-manager';
import { checkRateLimit } from '@/lib/security/rate-limiter';

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    // Rate limiting sur le déliement de postes (Max 10 par minute par IP)
    const rateLimit = checkRateLimit(`transfer:ip:${ip}`, 10, 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Trop de requêtes de transfert. Veuillez patienter une minute.',
        },
        { status: 429, headers: { 'Retry-After': String(rateLimit.resetInSec) } }
      );
    }

    const body = await request.json();
    const { license_key, reason } = body;

    if (!license_key) {
      return NextResponse.json({ success: false, error: 'Clé de licence obligatoire' }, { status: 400 });
    }

    const updated = await licenseManager.authorizeTransfer(
      license_key,
      reason || 'Demande client de transfert de machine',
      'API_CLIENT',
      ip
    );

    return NextResponse.json({
      success: true,
      message: "Transfert de licence autorisé. L'ancien poste a été délié.",
      data: {
        license_key: updated.license_key,
        status: updated.status,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erreur lors du transfert',
      },
      { status: 400 }
    );
  }
}
