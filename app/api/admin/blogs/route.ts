import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import path from 'path';
import crypto from 'crypto';
import { uploadBlogCoverToSupabase } from '@/lib/supabase/storage';

export async function GET() {
  const session = await getSession();
  if (!session || !session.is2faVerified) {
    return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 });
  }

  const posts = await prisma.blogPost.findMany({
    orderBy: { created_at: 'desc' },
  });

  return NextResponse.json({ success: true, posts });
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.is2faVerified) {
      return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string | null;
    const category = formData.get('category') as string | null;
    const excerpt = formData.get('excerpt') as string | null;
    const content = formData.get('content') as string;
    const status = (formData.get('status') as string) || 'published';
    const coverFile = formData.get('cover') as File | null;

    if (!title || !content) {
      return NextResponse.json({ success: false, error: 'Titre et contenu obligatoires.' }, { status: 400 });
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

    let coverPath: string | null = null;
    if (coverFile && coverFile.size > 0) {
      const buffer = Buffer.from(await coverFile.arrayBuffer());
      const rawExt = path.extname(coverFile.name).toLowerCase();
      const ext = ['.jpg', '.jpeg', '.png', '.webp'].includes(rawExt) ? rawExt : '.jpg';
      const safeName = `${crypto.randomBytes(16).toString('hex')}${ext}`;
      const mime = ext === '.webp' ? 'image/webp' : ext === '.png' ? 'image/png' : 'image/jpeg';

      // Téléversement sécurisé dans Supabase Storage (Bucket: blog-covers)
      coverPath = await uploadBlogCoverToSupabase(buffer, safeName, mime);
    }

    const wordCount = content.trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const post = await prisma.blogPost.create({
      data: {
        title: title.trim(),
        slug: cleanSlug,
        excerpt: excerpt || null,
        content: content.trim(),
        category: category || 'conseils',
        reading_time: readingTime,
        status,
        published_at: status === 'published' ? new Date() : null,
        cover_image_path: coverPath,
        author_id: session.userId,
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
