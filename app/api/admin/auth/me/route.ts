import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSession();
  if (!session || !session.is2faVerified) {
    return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, email: true, name: true },
    });

    return NextResponse.json({
      success: true,
      user: user || { id: session.userId, email: session.email, name: session.name },
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      user: { id: session.userId, email: session.email, name: session.name },
    });
  }
}
