import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession, createSession } from '@/lib/auth/session';
import { verifyTotpCode } from '@/lib/auth/totp';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Session expirée. Veuillez vous reconnecter.' }, { status: 401 });
    }

    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ success: false, error: 'Veuillez saisir votre code d’authentification.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user || !user.two_factor_secret) {
      return NextResponse.json({ success: false, error: 'Utilisateur ou configuration 2FA introuvable.' }, { status: 400 });
    }

    const cleanCode = code.trim().replace(/\s+/g, '');
    let isValid = verifyTotpCode(cleanCode, user.two_factor_secret);

    // If TOTP verification failed, check emergency recovery codes
    if (!isValid && user.two_factor_recovery_codes) {
      try {
        const recoveryCodes: string[] = JSON.parse(user.two_factor_recovery_codes);
        const matchIndex = recoveryCodes.findIndex(
          (rc) => rc.toUpperCase() === cleanCode.toUpperCase()
        );

        if (matchIndex !== -1) {
          isValid = true;
          // Consume the used recovery code
          recoveryCodes.splice(matchIndex, 1);
          await prisma.user.update({
            where: { id: user.id },
            data: { two_factor_recovery_codes: JSON.stringify(recoveryCodes) },
          });
        }
      } catch {}
    }

    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Code à deux facteurs incorrect ou expiré.' }, { status: 400 });
    }

    // Upgrade session to verified
    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      is2faVerified: true,
    });

    return NextResponse.json({
      success: true,
      redirect: '/admin',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erreur lors de la vérification 2FA.' },
      { status: 500 }
    );
  }
}
