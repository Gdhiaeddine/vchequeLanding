import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, subject_type, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Veuillez remplir tous les champs obligatoires (nom, email, sujet, message).' },
        { status: 400 }
      );
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || '127.0.0.1';

    const saved = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        company: company || null,
        subject_type: subject_type || 'autre',
        subject,
        message,
        ip_address: ip,
        status: 'unread',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Votre message a été transmis avec succès. Notre équipe vous répondra dans les plus brefs délais.',
      id: saved.id,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Erreur lors de l'envoi du message." },
      { status: 500 }
    );
  }
}
