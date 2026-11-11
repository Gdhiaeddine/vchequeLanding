import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import fs from 'fs';
import path from 'path';
import { deleteInstallerFromSupabase } from '@/lib/supabase/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
    const releaseId = parseInt(id, 10);
    const body = await request.json();
    const { action } = body;

    if (action === 'activate') {
      await prisma.$transaction([
        prisma.appRelease.updateMany({
          where: { id: { not: releaseId } },
          data: { is_active: false },
        }),
        prisma.appRelease.update({
          where: { id: releaseId },
          data: { is_active: true },
        }),
      ]);
      return NextResponse.json({ success: true });
    }

    if (action === 'delete') {
      const release = await prisma.appRelease.findUnique({ where: { id: releaseId } });
      if (release) {
        // 1. Suppression dans Supabase Storage
        await deleteInstallerFromSupabase(release.storage_path);

        // 2. Suppression sur disque local si le fichier y réside
        try {
          const filename = path.basename(release.storage_path.split('?')[0]);
          let filePath = path.resolve(process.cwd(), 'data/uploads/installers', filename);
          if (!fs.existsSync(filePath)) {
            filePath = path.resolve(process.cwd(), release.storage_path);
          }
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch {}

        await prisma.appRelease.delete({ where: { id: releaseId } });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Action non reconnue' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
