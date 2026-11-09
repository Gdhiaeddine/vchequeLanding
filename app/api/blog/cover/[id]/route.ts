import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) {
    return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
  }

  const post = await prisma.blogPost.findUnique({
    where: { id: numId },
  });

  if (!post || !post.cover_image_path) {
    return NextResponse.json({ error: 'Image non trouvée' }, { status: 404 });
  }

  const filename = path.basename(post.cover_image_path);
  let filePath = path.resolve(process.cwd(), 'public/uploads/blog_covers', filename);
  if (!fs.existsSync(filePath)) {
    filePath = path.resolve(process.cwd(), post.cover_image_path);
  }

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Fichier physique introuvable' }, { status: 404 });
  }

  const stat = fs.statSync(filePath);
  const stream = fs.createReadStream(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const mime = ext === '.webp' ? 'image/webp' : ext === '.png' ? 'image/png' : 'image/jpeg';

  const webStream = new ReadableStream({
    start(controller) {
      stream.on('data', (chunk) => controller.enqueue(chunk));
      stream.on('end', () => controller.close());
      stream.on('error', (err) => controller.error(err));
    },
  });

  return new NextResponse(webStream, {
    headers: {
      'Content-Type': mime,
      'Content-Length': stat.size.toString(),
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
