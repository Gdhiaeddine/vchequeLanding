import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';
import { getInstallerPublicUrl } from '@/lib/supabase/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  // 1. Recherche de la release active (ou de la plus récente par défaut)
  let release = await prisma.appRelease.findFirst({
    where: { is_active: true },
    orderBy: { created_at: 'desc' },
  });

  if (!release) {
    release = await prisma.appRelease.findFirst({
      orderBy: { created_at: 'desc' },
    });
  }

  if (!release) {
    return NextResponse.json({ error: 'Aucun installateur disponible actuellement.' }, { status: 404 });
  }

  // 2. Incrémentation asynchrone du compteur de téléchargements
  try {
    await prisma.appRelease.update({
      where: { id: release.id },
      data: { download_count: { increment: 1 } },
    });
  } catch (countErr) {
    console.warn('Failed to increment download counter:', countErr);
  }

  const rawFilename = release.filename || 'VCheque-Setup.exe';
  const safeDownloadName = rawFilename.replace(/"/g, '');
  const mimeType = release.mime_type || 'application/x-msdownload';

  // 3. Résolution du fichier physique en local (si présent sur disque, ex: dev local)
  const baseName = path.basename(release.storage_path.split('?')[0]);
  let localPath = path.resolve(process.cwd(), 'data/uploads/installers', baseName);
  if (!fs.existsSync(localPath)) {
    localPath = path.resolve(process.cwd(), release.storage_path);
  }

  if (fs.existsSync(localPath)) {
    const stat = fs.statSync(localPath);
    const fileStream = fs.createReadStream(localPath);

    const stream = new ReadableStream({
      start(controller) {
        fileStream.on('data', (chunk) => controller.enqueue(chunk));
        fileStream.on('end', () => controller.close());
        fileStream.on('error', (err) => controller.error(err));
      },
    });

    const headers = new Headers();
    headers.set('Content-Disposition', `attachment; filename="${safeDownloadName}"`);
    headers.set('Content-Type', mimeType);
    headers.set('Content-Length', stat.size.toString());

    return new NextResponse(stream, { headers });
  }

  // 4. Résolution distante sur Supabase Storage (environnement Serverless / Vercel)
  const publicUrl = getInstallerPublicUrl(release.storage_path);

  try {
    const remoteRes = await fetch(publicUrl);
    if (remoteRes.ok && remoteRes.body) {
      const headers = new Headers();
      headers.set('Content-Disposition', `attachment; filename="${safeDownloadName}"`);
      headers.set('Content-Type', mimeType);

      const contentLength = remoteRes.headers.get('content-length') || (release.file_size ? release.file_size.toString() : '');
      if (contentLength) {
        headers.set('Content-Length', contentLength);
      }

      return new NextResponse(remoteRes.body as any, { headers });
    }
  } catch (streamErr) {
    console.warn('Streaming from Supabase failed, falling back to direct redirect:', streamErr);
  }

  // 5. Fallback : redirection directe vers l'URL publique Supabase CDN
  return NextResponse.redirect(publicUrl, { status: 302 });
}
