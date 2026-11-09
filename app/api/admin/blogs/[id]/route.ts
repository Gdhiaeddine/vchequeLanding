import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !session.is2faVerified) {
    return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 });
  }

  const { id } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { id: parseInt(id, 10) },
  });

  return NextResponse.json({ success: true, post });
}

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
    const postId = parseInt(id, 10);
    const body = await request.json();
    const { action } = body;

    if (action === 'toggle_status') {
      const current = await prisma.blogPost.findUnique({ where: { id: postId } });
      if (!current) return NextResponse.json({ success: false, error: 'Article introuvable' }, { status: 404 });

      const newStatus = current.status === 'published' ? 'draft' : 'published';
      const updated = await prisma.blogPost.update({
        where: { id: postId },
        data: {
          status: newStatus,
          published_at: newStatus === 'published' && !current.published_at ? new Date() : current.published_at,
        },
      });
      return NextResponse.json({ success: true, post: updated });
    }

    if (action === 'delete') {
      const post = await prisma.blogPost.findUnique({ where: { id: postId } });
      if (post?.cover_image_path) {
        const filePath = path.resolve(process.cwd(), post.cover_image_path);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch {}
        }
      }
      await prisma.blogPost.delete({ where: { id: postId } });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Action inconnue' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
