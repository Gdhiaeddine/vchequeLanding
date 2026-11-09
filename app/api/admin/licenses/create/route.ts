import { NextRequest, NextResponse } from 'next/server';
import licenseManager from '@/lib/licensing/license-manager';
import { getSession } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.is2faVerified) {
      return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { license_key, licensee_name, licensee_email, company, edition, max_activations, notes } = body;

    if (!licensee_name || !licensee_email) {
      return NextResponse.json(
        { success: false, error: 'Nom du titulaire et adresse email obligatoires.' },
        { status: 400 }
      );
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

    const license = await licenseManager.createLicense(
      {
        license_key: license_key || undefined,
        licensee_name,
        licensee_email,
        company,
        edition: edition || 'COMMERCIAL',
        max_activations: parseInt(max_activations, 10) || 1,
        notes,
      },
      `ADMIN:${session.email}`,
      ip
    );

    return NextResponse.json({ success: true, license });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erreur lors de la création de la licence.' },
      { status: 500 }
    );
  }
}
