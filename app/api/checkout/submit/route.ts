import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import slickPayService from '@/lib/payments/slickpay';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nom, email, telephone, entreprise, adresse, code_postal, ville, wilaya, plan = 'single', amount: reqAmount } = body;

    if (!nom || !email) {
      return NextResponse.json({ success: false, error: 'Nom et email sont obligatoires.' }, { status: 400 });
    }

    // Determine pricing and devices from plan
    let amount = Number(reqAmount) || 4900;
    let maxActivations = 1;

    if (plan === 'duo') {
      amount = Number(reqAmount) || 8900;
      maxActivations = 2;
    } else if (plan === 'enterprise') {
      amount = Number(reqAmount) || 18900;
      maxActivations = 5;
    }

    // Generate unique order reference: VC-YYYYMMDD-XXXXX
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase().slice(0, 5);
    const reference = `VC-${today}-${randomSuffix}`;

    const order = await prisma.order.create({
      data: {
        reference,
        nom,
        email,
        telephone: telephone || null,
        entreprise: entreprise || null,
        adresse: adresse || null,
        code_postal: code_postal || null,
        ville: ville || null,
        wilaya: wilaya || null,
        amount,
        currency: 'DZD',
        status: 'pending',
        metadata: JSON.stringify({ plan, maxActivations }),
      },
    });

    const origin = request.nextUrl.origin;
    const returnUrl = `${origin}/commander/succes`;

    const paymentUrl = await slickPayService.createInvoice(order.id, returnUrl);

    return NextResponse.json({
      success: true,
      reference: order.reference,
      redirect_url: paymentUrl,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erreur lors de la commande.' },
      { status: 500 }
    );
  }
}
