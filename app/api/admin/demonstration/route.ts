import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export async function GET() {
  const session = await getSession();
  if (!session || !session.is2faVerified) {
    return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 });
  }

  const videos = await prisma.demoVideo.findMany({
    orderBy: { created_at: 'desc' },
  });

  return NextResponse.json({ success: true, videos });
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.is2faVerified) {
      return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const { action, videoId } = await request.json();
      if (action === 'activate') {
        await prisma.$transaction([
          prisma.demoVideo.updateMany({
            where: { id: { not: videoId } },
            data: { is_active: false },
          }),
          prisma.demoVideo.update({
            where: { id: videoId },
            data: { is_active: true },
          }),
        ]);
        return NextResponse.json({ success: true });
      }

      if (action === 'delete') {
        const vid = await prisma.demoVideo.findUnique({ where: { id: videoId } });
        if (vid) {
          const filePath = path.resolve(process.cwd(), vid.storage_path);
          if (fs.existsSync(filePath)) {
            try {
              fs.unlinkSync(filePath);
            } catch {}
          }
          await prisma.demoVideo.delete({ where: { id: videoId } });
        }
        return NextResponse.json({ success: true });
      }
    }

    // Handle video file upload
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string | null;
    const description = formData.get('description') as string | null;

    if (!file || !title) {
      return NextResponse.json({ success: false, error: 'Fichier et titre requis.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const dir = path.resolve(process.cwd(), 'data/uploads/videos');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const safeName = `${crypto.randomBytes(16).toString('hex')}.mp4`;
    fs.writeFileSync(path.join(dir, safeName), buffer);

    const video = await prisma.demoVideo.create({
      data: {
        title: title.trim(),
        description: description || null,
        filename: file.name,
        storage_path: `data/uploads/videos/${safeName}`,
        mime_type: 'video/mp4',
        file_size: buffer.length,
        is_active: false,
        uploaded_by: session.userId,
      },
    });

    return NextResponse.json({ success: true, video });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
