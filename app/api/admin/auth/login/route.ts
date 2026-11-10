import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/auth/session';
import { checkRateLimit, resetRateLimit } from '@/lib/security/rate-limiter';

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    // Protection anti-brute force : 5 tentatives max par 15 minutes par IP
    const rateCheck = checkRateLimit(`auth_login:${ip}`, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Trop de tentatives infructueuses. Veuillez patienter ${rateCheck.resetInSec} secondes avant de réessayer.`,
        },
        { status: 429 }
      );
    }

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

    // Réinitialisation de la limitation après authentification réussie
    resetRateLimit(`auth_login:${ip}`);

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
