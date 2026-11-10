import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Validation regex for email and Algerian phone numbers
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DZ_PHONE_REGEX = /^(?:\+213|00213|0)(?:5|6|7|2[0-9]|3[0-9]|4[0-9])[0-9]{7,8}$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, subject_type, subject, message, contact_hp } = body;

    // 1. Anti-spam honeypot verification
    // Bots usually fill hidden fields automatically. If filled, return silent success without writing to DB.
    if (contact_hp && typeof contact_hp === 'string' && contact_hp.trim() !== '') {
      console.warn('[Anti-Spam] Honeypot triggered. Silently discarded.');
      return NextResponse.json({
        success: true,
        message: 'Votre message a été transmis avec succès.',
      });
    }

    // 2. Required fields check
    const errors: Record<string, string> = {};

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      errors.name = 'Veuillez renseigner votre nom et prénom (au moins 2 caractères).';
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      errors.email = 'Veuillez saisir une adresse email professionnelle valide.';
    }

    if (!subject || typeof subject !== 'string' || subject.trim().length < 3) {
      errors.subject = "Veuillez préciser l'objet de votre message (au moins 3 caractères).";
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      errors.message = 'Votre message doit comporter au moins 10 caractères pour nous permettre de vous répondre efficacement.';
    }

    // 3. Optional phone validation if provided
    if (phone && typeof phone === 'string' && phone.trim() !== '') {
      const cleanPhone = phone.replace(/[\s\-\.\(\)]/g, '');
      if (!DZ_PHONE_REGEX.test(cleanPhone)) {
        errors.phone = 'Le format du numéro algérien est invalide (ex: 0550 12 34 56 ou +213 550 12 34 56).';
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Veuillez corriger les informations signalées dans le formulaire.',
          errors,
        },
        { status: 422 }
      );
    }

    // 4. Capture Client IP safely
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    // 5. Persist to PostgreSQL Supabase database
    const saved = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : null,
        company: company ? company.trim() : null,
        subject_type: subject_type || 'commercial',
        subject: subject.trim(),
        message: message.trim(),
        ip_address: ip,
        status: 'unread',
      },
    });

    return NextResponse.json({
      success: true,
      message:
        'Votre message a été transmis avec succès à l’équipe VCheque. Nous vous répondrons dans les plus brefs délais (sous 24h ouvrées).',
      id: saved.id,
    });
  } catch (error: any) {
    console.error('Erreur API Contact:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Une erreur inattendue est survenue lors de l'envoi de votre message.",
      },
      { status: 500 }
    );
  }
}
