import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import slickPayService from '@/lib/payments/slickpay';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSession();
  if (!session || !session.is2faVerified) {
    return NextResponse.json(
      { success: false, error: 'Accès réservé aux administrateurs authentifiés.' },
      { status: 401 }
    );
  }

  const diagResult = await slickPayService.testConnection();

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    diagnostic: diagResult,
  });
}
