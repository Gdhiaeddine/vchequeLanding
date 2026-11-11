import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import mailerService from '@/lib/mail/mailer';
import { checkRateLimit } from '@/lib/security/rate-limiter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { ref } = body;

    if (!ref || typeof ref !== 'string' || ref.trim() === '') {
      return NextResponse.json({ error: 'Référence requise.' }, { status: 400 });
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    const rateLimit = checkRateLimit(`resend-email:${ip}`, 5, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Trop de demandes. Veuillez patienter quelques minutes.' },
        { status: 429 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { reference: ref.trim() },
      include: { license: true },
    });

    if (!order || order.status !== 'completed' || !order.license_key) {
      return NextResponse.json(
        { error: 'Commande introuvable ou non réglée.' },
        { status: 404 }
      );
    }

    let maxActivations = 1;
    let planTitle = 'Licence Commerciale VCheque (Perpétuelle)';
    if (order.metadata) {
      try {
        const meta = JSON.parse(order.metadata);
        if (meta.maxActivations && typeof meta.maxActivations === 'number') {
          maxActivations = meta.maxActivations;
        }
        if (meta.plan === 'duo') planTitle = 'Licence Commerciale VCheque Duo (2 Postes)';
        if (meta.plan === 'enterprise') planTitle = 'Licence Commerciale VCheque Entreprise (5 Postes)';
      } catch {}
    }

    const sent = await mailerService.sendLicenseConfirmationEmail({
      to: order.email,
      customerName: order.nom,
      orderRef: order.reference,
      licenseKey: order.license_key,
      amount: order.amount,
      company: order.entreprise,
      phone: order.telephone,
      address: order.adresse,
      ville: order.ville,
      wilaya: order.wilaya,
      planTitle,
      maxActivations,
      paidAt: order.paid_at || new Date(),
      transactionId: order.slickpay_invoice_id,
    });

    return NextResponse.json({
      success: sent,
      message: sent
        ? `Email de confirmation et facture PDF acquittée envoyés avec succès à ${order.email}`
        : "Le service d'email n'a pas pu expédier le message.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Erreur lors de l’envoi de l’email.' },
      { status: 500 }
    );
  }
}
