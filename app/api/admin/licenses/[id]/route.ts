import { NextRequest, NextResponse } from 'next/server';
import licenseManager from '@/lib/licensing/license-manager';
import { getSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || !session.is2faVerified) {
      return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;
    const license = await licenseManager.getHistory(id);

    return NextResponse.json({
      success: true,
      data: {
        ...license,
        license,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Licence introuvable' },
      { status: 404 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || !session.is2faVerified) {
      return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;
    const licenseId = parseInt(id, 10);
    if (isNaN(licenseId)) {
      return NextResponse.json({ success: false, error: 'ID invalide' }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const { action, quota, reason, activationId } = body;
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const actor = `ADMIN:${session.email}`;

    if (action === 'update_quota') {
      const updated = await licenseManager.updateQuota(
        licenseId,
        parseInt(quota, 10) || 1,
        actor,
        reason || 'Mise à jour du quota par l’administrateur',
        ip
      );
      return NextResponse.json({ success: true, license: updated });
    }

    if (action === 'revoke') {
      const updated = await licenseManager.revoke(
        licenseId,
        reason || 'Révocation administrative',
        actor,
        ip
      );
      return NextResponse.json({ success: true, license: updated });
    }

    if (action === 'transfer') {
      const updated = await licenseManager.authorizeTransfer(
        licenseId,
        reason || 'Transfert autorisé par l’administrateur',
        actor,
        ip
      );
      return NextResponse.json({ success: true, license: updated });
    }

    if (action === 'deactivate_machine') {
      if (!activationId) {
        return NextResponse.json({ success: false, error: 'ID d’activation manquant' }, { status: 400 });
      }
      const deactivated = await licenseManager.deactivateMachine(
        licenseId,
        parseInt(activationId, 10),
        actor,
        reason || 'Poste libéré par l’administrateur',
        ip
      );
      return NextResponse.json({ success: true, activation: deactivated });
    }

    return NextResponse.json({ success: false, error: 'Action non reconnue' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erreur lors de l’opération' },
      { status: 500 }
    );
  }
}
