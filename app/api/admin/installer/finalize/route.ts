import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.is2faVerified) {
      return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const {
      version,
      filename,
      storage_path,
      file_size,
      mime_type,
      sha256,
      release_notes,
    } = body;

    if (!version || !filename || !storage_path || !sha256) {
      return NextResponse.json(
        { success: false, error: 'Paramètres manquants pour enregistrer la version.' },
        { status: 400 }
      );
    }

    const release = await prisma.appRelease.create({
      data: {
        version: String(version).trim(),
        filename: String(filename),
        storage_path: String(storage_path),
        file_size: Number(file_size) || 0,
        mime_type: String(mime_type) || 'application/x-msdownload',
        sha256: String(sha256).toLowerCase().trim(),
        is_active: false,
        release_notes: release_notes ? String(release_notes).trim() : null,
        uploaded_by: session.userId,
      },
    });

    return NextResponse.json({ success: true, release });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erreur lors de la finalisation du téléversement.' },
      { status: 500 }
    );
  }
}
