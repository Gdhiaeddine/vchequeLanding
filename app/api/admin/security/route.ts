import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import { generateRecoveryCodes, generateTotpSecret, getTotpUri, generateQrCodeDataUrl, verifyTotpCode } from '@/lib/auth/totp';

export async function GET() {
  const session = await getSession();
  if (!session || !session.is2faVerified) {
    return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  if (!user) return NextResponse.json({ success: false, error: 'Utilisateur introuvable' }, { status: 404 });

  let recoveryCodesCount = 0;
  if (user.two_factor_recovery_codes) {
    try {
      recoveryCodesCount = JSON.parse(user.two_factor_recovery_codes).length;
    } catch {}
  }

  return NextResponse.json({
    success: true,
    has2fa: !!user.two_factor_secret && !!user.two_factor_confirmed_at,
    recoveryCodesCount,
  });
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.is2faVerified) {
      return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 });
    }

    const { action, code, secret } = await request.json();

    if (action === 'regenerate_recovery_codes') {
      const newCodes = generateRecoveryCodes(8);
      await prisma.user.update({
        where: { id: session.userId },
        data: { two_factor_recovery_codes: JSON.stringify(newCodes) },
      });
      return NextResponse.json({ success: true, recoveryCodes: newCodes });
    }

    if (action === 'start_setup') {
      const newSecret = generateTotpSecret();
      const uri = getTotpUri(session.email, newSecret);
      const qrCode = await generateQrCodeDataUrl(uri);
      return NextResponse.json({ success: true, secret: newSecret, qrCode });
    }

    if (action === 'confirm_setup') {
      if (!code || !secret) {
        return NextResponse.json({ success: false, error: 'Code et secret requis' }, { status: 400 });
      }

      const isValid = verifyTotpCode(code, secret);
      if (!isValid) {
        return NextResponse.json({ success: false, error: 'Code TOTP invalide' }, { status: 400 });
      }

      const recoveryCodes = generateRecoveryCodes(8);
      await prisma.user.update({
        where: { id: session.userId },
        data: {
          two_factor_secret: secret,
          two_factor_confirmed_at: new Date(),
          two_factor_recovery_codes: JSON.stringify(recoveryCodes),
        },
      });

      return NextResponse.json({ success: true, recoveryCodes });
    }

    return NextResponse.json({ success: false, error: 'Action non reconnue' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
