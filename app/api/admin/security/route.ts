import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
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
    email: user.email,
    name: user.name,
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

    const body = await request.json();
    const { action, code, secret, currentPassword, newEmail, newPassword } = body;

    // Modification de l'adresse email et/ou du mot de passe
    if (action === 'change_credentials') {
      if (!currentPassword) {
        return NextResponse.json(
          { success: false, error: 'Le mot de passe actuel est requis pour confirmer la modification.' },
          { status: 400 }
        );
      }

      const user = await prisma.user.findUnique({ where: { id: session.userId } });
      if (!user) {
        return NextResponse.json({ success: false, error: 'Utilisateur introuvable.' }, { status: 404 });
      }

      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        return NextResponse.json({ success: false, error: 'Mot de passe actuel incorrect.' }, { status: 400 });
      }

      const updateData: { email?: string; password?: string } = {};

      if (newEmail && newEmail.trim() !== '' && newEmail.trim() !== user.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail.trim())) {
          return NextResponse.json({ success: false, error: 'Format d’adresse email invalide.' }, { status: 400 });
        }
        const existing = await prisma.user.findUnique({ where: { email: newEmail.trim() } });
        if (existing && existing.id !== user.id) {
          return NextResponse.json({ success: false, error: 'Cette adresse email est déjà assignée à un autre compte.' }, { status: 400 });
        }
        updateData.email = newEmail.trim();
      }

      if (newPassword && newPassword.trim() !== '') {
        if (newPassword.trim().length < 8) {
          return NextResponse.json(
            { success: false, error: 'Le nouveau mot de passe doit contenir au moins 8 caractères.' },
            { status: 400 }
          );
        }
        updateData.password = await bcrypt.hash(newPassword.trim(), 12);
      }

      if (Object.keys(updateData).length === 0) {
        return NextResponse.json(
          { success: false, error: 'Veuillez saisir un nouvel email ou un nouveau mot de passe distinct.' },
          { status: 400 }
        );
      }

      const updatedUser = await prisma.user.update({
        where: { id: session.userId },
        data: updateData,
      });

      return NextResponse.json({
        success: true,
        message: 'Vos identifiants ont été modifiés avec succès.',
        email: updatedUser.email,
      });
    }

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
