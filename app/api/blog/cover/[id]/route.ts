import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

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
  const etag = `"${stat.size.toString(16)}-${stat.mtimeMs.toString(16)}"`;

  const ifNoneMatch = request.headers.get('if-none-match');
  if (ifNoneMatch && ifNoneMatch === etag) {
    return new NextResponse(null, {
      status: 304,
      headers: {
        ETag: etag,
        'Cache-Control': 'public, max-age=60, must-revalidate',
      },
    });
  }

  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const mime =
    ext === '.webp' ? 'image/webp' : ext === '.png' ? 'image/png' : 'image/jpeg';

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': mime,
      'Content-Length': fileBuffer.length.toString(),
      ETag: etag,
      'Last-Modified': stat.mtime.toUTCString(),
      'Cache-Control': 'public, max-age=60, must-revalidate',
    },
  });
}
