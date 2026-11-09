import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, remember = false } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email et mot de passe requis.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Identifiants de connexion incorrects ou compte introuvable.' },
        { status: 401 }
      );
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return NextResponse.json(
        { success: false, error: 'Identifiants de connexion incorrects ou compte introuvable.' },
        { status: 401 }
      );
    }

    const has2fa = !!user.two_factor_secret && !!user.two_factor_confirmed_at;

    // Create session (is2faVerified = false if 2FA is configured)
    await createSession(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        is2faVerified: !has2fa,
      },
      remember
    );

    return NextResponse.json({
      success: true,
      requires2fa: has2fa,
      redirect: has2fa ? '/admin/2fa' : '/admin',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erreur lors de la connexion.' },
      { status: 500 }
    );
  }
}
