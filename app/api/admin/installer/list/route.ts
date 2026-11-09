import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';

export async function GET() {
  const session = await getSession();
  if (!session || !session.is2faVerified) {
    return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 });
  }

  const releases = await prisma.appRelease.findMany({
    orderBy: { created_at: 'desc' },
  });

  return NextResponse.json({ success: true, releases });
}
