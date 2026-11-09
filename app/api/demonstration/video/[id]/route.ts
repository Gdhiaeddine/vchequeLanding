import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const videoId = parseInt(id, 10);
  if (isNaN(videoId)) {
    return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
  }

  const video = await prisma.demoVideo.findUnique({
    where: { id: videoId },
  });

  if (!video) {
    return NextResponse.json({ error: 'Vidéo non trouvée' }, { status: 404 });
  }

  let filePath = path.resolve(process.cwd(), video.storage_path);
  if (!fs.existsSync(filePath)) {
    filePath = path.resolve(process.cwd(), 'data/uploads/videos', path.basename(video.storage_path));
  }

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Fichier vidéo introuvable sur le disque.' }, { status: 404 });
  }

  const stat = fs.statSync(filePath);
  const stream = fs.createReadStream(filePath);

  const webStream = new ReadableStream({
    start(controller) {
      stream.on('data', (chunk) => controller.enqueue(chunk));
      stream.on('end', () => controller.close());
      stream.on('error', (err) => controller.error(err));
    },
  });

  return new NextResponse(webStream, {
    headers: {
      'Content-Type': video.mime_type || 'video/mp4',
      'Content-Length': stat.size.toString(),
    },
  });
}
