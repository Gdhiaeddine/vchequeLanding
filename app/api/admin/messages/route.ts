import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session || !session.is2faVerified) {
    return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  const where: any = {};
  if (status && status !== 'all') {
    where.status = status;
  }

  const messages = await prisma.contactMessage.findMany({
    where,
    orderBy: { created_at: 'desc' },
  });

  return NextResponse.json({ success: true, messages });
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.is2faVerified) {
      return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 });
    }

    const { id, action, status } = await request.json();

    if (action === 'update_status') {
      const updated = await prisma.contactMessage.update({
        where: { id },
        data: { status },
      });
      return NextResponse.json({ success: true, message: updated });
    }

    if (action === 'delete') {
      await prisma.contactMessage.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Action non reconnue' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
