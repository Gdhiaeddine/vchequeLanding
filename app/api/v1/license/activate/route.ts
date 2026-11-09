import { NextRequest, NextResponse } from 'next/server';
import licenseManager from '@/lib/licensing/license-manager';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { license_key, machine_id, machine_name, os_info } = body;

    if (!license_key || !machine_id) {
      return NextResponse.json(
        {
          success: false,
          error: "La clé de licence et l'identifiant machine (machine_id) sont obligatoires.",
          code: 'INVALID_ARGUMENTS',
        },
        { status: 400 }
      );
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || '127.0.0.1';

    const result = await licenseManager.activate({
      licenseKey: license_key,
      machineId: machine_id,
      machineName: machine_name,
      osInfo: os_info,
      ipAddress: ip,
      actor: 'CLIENT',
    });

    return NextResponse.json({
      success: true,
      message: 'Licence commerciale activée avec succès.',
      data: result,
    });
  } catch (error: any) {
    const status = error.status || 400;
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Erreur lors de l'activation.",
        code: error.code || 'ACTIVATION_FAILED',
      },
      { status }
    );
  }
}
