import { NextRequest, NextResponse } from 'next/server';
import licenseManager from '@/lib/licensing/license-manager';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    if (!key) {
      return NextResponse.json({ success: false, error: 'Clé non spécifiée' }, { status: 400 });
    }

    const history = await licenseManager.getHistory(key);

    return NextResponse.json({
      success: true,
      data: {
        ...history,
        license: history,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Licence introuvable',
      },
      { status: 404 }
    );
  }
}
