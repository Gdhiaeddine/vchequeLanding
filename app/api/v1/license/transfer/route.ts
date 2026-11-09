import { NextRequest, NextResponse } from 'next/server';
import licenseManager from '@/lib/licensing/license-manager';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { license_key, reason } = body;

    if (!license_key) {
      return NextResponse.json({ success: false, error: 'Clé de licence obligatoire' }, { status: 400 });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || '127.0.0.1';

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
