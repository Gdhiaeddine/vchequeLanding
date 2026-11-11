import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateInvoicePdf } from '@/lib/pdf/invoice-generator';
import { checkRateLimit } from '@/lib/security/rate-limiter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ref: string }> }
) {
  try {
    const { ref } = await params;

    if (!ref || typeof ref !== 'string' || ref.trim() === '') {
      return NextResponse.json({ error: 'Référence requise.' }, { status: 400 });
    }

    // 1. Protection anti-énumération et limitation du débit CPU (Rate Limiting)
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    const rateLimit = checkRateLimit(`invoice:ip:${ip}`, 20, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Trop de demandes de génération de factures. Veuillez patienter quelques minutes.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.resetInSec) } }
      );
    }

    // 2. Recherche de la commande
    const order = await prisma.order.findUnique({
      where: { reference: ref.trim() },
      include: { license: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Commande introuvable.' }, { status: 404 });
    }

    // 3. Contrôle d'intégrité commerciale : facture acquittée réservée aux règlements certifiés
    if (order.status !== 'completed') {
      return NextResponse.json(
        {
          error:
            'La facture officielle acquittée est accessible uniquement pour les commandes dont le règlement a été validé.',
        },
        { status: 403 }
      );
    }

    let planTitle = 'Licence Commerciale VCheque (Perpétuelle)';
    if (order.metadata) {
      try {
        const meta = JSON.parse(order.metadata);
        if (meta.plan === 'duo') planTitle = 'Licence Commerciale VCheque Duo (2 Postes)';
        if (meta.plan === 'enterprise') planTitle = 'Licence Commerciale VCheque Entreprise (5 Postes)';
      } catch {}
    }

    const pdfBuffer = await generateInvoicePdf({
      orderRef: order.reference,
      customerName: order.nom,
      company: order.entreprise,
      email: order.email,
      phone: order.telephone,
      address: order.adresse,
      ville: order.ville,
      wilaya: order.wilaya,
      amount: order.amount,
      licenseKey: order.license_key || 'LICENCE-EN-COURS',
      paidAt: order.paid_at || order.created_at,
      transactionId: order.slickpay_invoice_id,
      planTitle,
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Facture-${order.reference}.pdf"`,
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (err: any) {
    console.error('Invoice generation error:', err);
    return NextResponse.json(
      { error: err.message || 'Erreur lors de la génération de la facture.' },
      { status: 500 }
    );
  }
}
