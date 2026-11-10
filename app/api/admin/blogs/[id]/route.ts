import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !session.is2faVerified) {
    return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 });
  }

  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) {
    return NextResponse.json({ success: false, error: 'ID invalide' }, { status: 400 });
  }

  const post = await prisma.blogPost.findUnique({
    where: { id: numId },
  });

  if (!post) {
    return NextResponse.json({ success: false, error: 'Article introuvable' }, { status: 404 });
  }

  return NextResponse.json({ success: true, post });
}

export async function PUT(
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
    if (isNaN(postId)) {
      return NextResponse.json({ success: false, error: 'ID invalide' }, { status: 400 });
    }

    const existing = await prisma.blogPost.findUnique({ where: { id: postId } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Article introuvable' }, { status: 404 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string | null;
    const category = formData.get('category') as string | null;
    const excerpt = formData.get('excerpt') as string | null;
    const content = formData.get('content') as string;
    const status = (formData.get('status') as string) || existing.status;
    const coverFile = formData.get('cover') as File | null;
    const removeCover = formData.get('remove_cover') === 'true';

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Titre et contenu obligatoires.' },
        { status: 400 }
      );
    }

    let cleanSlug = slug?.trim();
    if (!cleanSlug) {
      cleanSlug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    // Vérifier l'unicité du slug s'il a changé
    if (cleanSlug !== existing.slug) {
      const slugExists = await prisma.blogPost.findUnique({ where: { slug: cleanSlug } });
      if (slugExists && slugExists.id !== postId) {
        cleanSlug = `${cleanSlug}-${Date.now()}`;
      }
    }

    let coverPath = existing.cover_image_path;

    if (removeCover && coverPath) {
      const filePath = path.resolve(process.cwd(), coverPath);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch {}
      }
      coverPath = null;
    }

    if (coverFile && coverFile.size > 0) {
      // Nettoyage ancien fichier
      if (coverPath) {
        const oldPath = path.resolve(process.cwd(), coverPath);
        if (fs.existsSync(oldPath)) {
          try {
            fs.unlinkSync(oldPath);
          } catch {}
        }
      }

      const buffer = Buffer.from(await coverFile.arrayBuffer());
      const rawExt = path.extname(coverFile.name).toLowerCase();
      const ext = ['.jpg', '.jpeg', '.png', '.webp'].includes(rawExt) ? rawExt : '.jpg';
      const safeName = `${crypto.randomBytes(16).toString('hex')}${ext}`;
      const uploadDir = path.resolve(process.cwd(), 'public/uploads/blog_covers');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      fs.writeFileSync(path.join(uploadDir, safeName), buffer);
      coverPath = `public/uploads/blog_covers/${safeName}`;
    }

    const wordCount = content.trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const updated = await prisma.blogPost.update({
      where: { id: postId },
      data: {
        title: title.trim(),
        slug: cleanSlug,
        category: category || existing.category,
        excerpt: excerpt?.trim() || null,
        content: content.trim(),
        status,
        reading_time: readingTime,
        cover_image_path: coverPath,
        published_at:
          status === 'published' && !existing.published_at
            ? new Date()
            : existing.published_at,
      },
    });

    try {
      revalidatePath('/blog');
      revalidatePath(`/blog/${cleanSlug}`);
      if (existing.slug !== cleanSlug) {
        revalidatePath(`/blog/${existing.slug}`);
      }
      revalidatePath('/admin/blogs');
    } catch {}

    return NextResponse.json({ success: true, post: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
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
    const body = await request.json().catch(() => ({}));
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
      try {
        revalidatePath('/blog');
        revalidatePath('/admin/blogs');
      } catch {}
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
      try {
        revalidatePath('/blog');
        revalidatePath('/admin/blogs');
      } catch {}
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Action inconnue' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
