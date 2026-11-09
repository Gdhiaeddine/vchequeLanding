import { NextRequest, NextResponse } from 'next/server';
import licenseManager from '@/lib/licensing/license-manager';

export async function POST(request: NextRequest) {
  try {
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
