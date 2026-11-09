import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const release = await prisma.appRelease.findFirst({
    where: { is_active: true },
  });

  if (!release) {
    return NextResponse.json({ error: 'Aucun installateur disponible actuellement.' }, { status: 404 });
  }

  // Increment download counter
  await prisma.appRelease.update({
    where: { id: release.id },
    data: { download_count: { increment: 1 } },
  });

  // Resolve file path (check data/uploads/installers/ or relative storage_path)
  let filePath = path.resolve(process.cwd(), 'data/uploads/installers', path.basename(release.storage_path));
  if (!fs.existsSync(filePath)) {
    filePath = path.resolve(process.cwd(), release.storage_path);
  }

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Fichier physique introuvable sur le serveur.' }, { status: 404 });
  }

  const stat = fs.statSync(filePath);
  const fileStream = fs.createReadStream(filePath);

  // Convert Node ReadStream to Web ReadableStream
  const stream = new ReadableStream({
    start(controller) {
      fileStream.on('data', (chunk) => controller.enqueue(chunk));
      fileStream.on('end', () => controller.close());
      fileStream.on('error', (err) => controller.error(err));
    },
  });

  const headers = new Headers();
  headers.set('Content-Disposition', `attachment; filename="${release.filename}"`);
  headers.set('Content-Type', release.mime_type || 'application/x-msdownload');
  headers.set('Content-Length', stat.size.toString());

  return new NextResponse(stream, { headers });
}
