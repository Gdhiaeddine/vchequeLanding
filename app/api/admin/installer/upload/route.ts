import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { uploadInstallerToSupabase } from '@/lib/supabase/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.is2faVerified) {
      return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const version = formData.get('version') as string | null;
    const release_notes = formData.get('release_notes') as string | null;

    if (!file || !version) {
      return NextResponse.json({ success: false, error: 'Fichier et numéro de version requis.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');
    const safeFilename = `${crypto.randomBytes(16).toString('hex')}.exe`;

    // 1. Téléversement prioritaire dans Supabase Storage (persistance cloud pour Vercel)
    let storagePath = `installers/${safeFilename}`;
    try {
      const publicUrl = await uploadInstallerToSupabase(
        buffer,
        safeFilename,
        file.type || 'application/x-msdownload'
      );
      storagePath = publicUrl;
      console.log('[Installer Upload] Successfully uploaded to Supabase Storage:', publicUrl);
    } catch (sbErr) {
      console.warn('[Installer Upload] Supabase upload failed, using local storage fallback:', sbErr);
    }

    // 2. Écriture sur disque local si le système de fichiers est accessible
    try {
      const uploadsDir = path.resolve(process.cwd(), 'data/uploads/installers');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const destPath = path.join(uploadsDir, safeFilename);
      fs.writeFileSync(destPath, buffer);
    } catch (fsErr) {
      console.warn('[Installer Upload] Local disk write skipped (read-only environment):', fsErr);
    }

    // 3. Enregistrement en base de données
    const release = await prisma.appRelease.create({
      data: {
        version: version.trim(),
        filename: file.name,
        storage_path: storagePath,
        file_size: buffer.length,
        mime_type: file.type || 'application/x-msdownload',
        sha256,
        is_active: false,
        release_notes: release_notes || null,
        uploaded_by: session.userId,
      },
    });

    return NextResponse.json({ success: true, release });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erreur lors du téléversement.' },
      { status: 500 }
    );
  }
}
