import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import crypto from 'crypto';
import { createInstallerUploadSignedUrl } from '@/lib/supabase/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.is2faVerified) {
      return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { filename } = body;

    if (!filename) {
      return NextResponse.json(
        { success: false, error: 'Nom de fichier requis.' },
        { status: 400 }
      );
    }

    // Génération d'un nom de fichier sécurisé et unique sur le bucket
    const ext = filename.endsWith('.msi') ? '.msi' : '.exe';
    const safeFilename = `${crypto.randomBytes(16).toString('hex')}${ext}`;

    const { signedUrl, path: storagePath, publicUrl } = await createInstallerUploadSignedUrl(safeFilename);

    return NextResponse.json({
      success: true,
      signedUrl,
      safeFilename,
      storagePath,
      publicUrl,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erreur lors de la préparation du téléversement.' },
      { status: 500 }
    );
  }
}
