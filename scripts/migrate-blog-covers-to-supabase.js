const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BUCKET_NAME = 'blog-covers';

async function migrate() {
  console.log('🚀 Starting migration of blog covers to Supabase Storage...\n');

  const posts = await prisma.blogPost.findMany({
    where: {
      cover_image_path: {
        not: null,
      },
    },
  });

  console.log(`Found ${posts.length} posts with cover images in database.`);

  for (const post of posts) {
    if (!post.cover_image_path) continue;

    if (post.cover_image_path.startsWith('http')) {
      console.log(`✓ Post ${post.id} (${post.title.substring(0, 30)}...) already hosted on Supabase Storage: ${post.cover_image_path}`);
      continue;
    }

    const filename = path.basename(post.cover_image_path);
    let localPath = path.resolve(process.cwd(), 'public/uploads/blog_covers', filename);
    if (!fs.existsSync(localPath)) {
      localPath = path.resolve(process.cwd(), post.cover_image_path);
    }

    if (!fs.existsSync(localPath)) {
      console.warn(`⚠️ File not found on disk for post ${post.id}: ${post.cover_image_path}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(localPath);
    const ext = path.extname(localPath).toLowerCase();
    const mime =
      ext === '.webp' ? 'image/webp' : ext === '.png' ? 'image/png' : 'image/jpeg';

    console.log(`Uploading ${filename} (${fileBuffer.length} bytes) to Supabase Storage...`);

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, fileBuffer, {
        contentType: mime,
        upsert: true,
      });

    if (error) {
      console.error(`❌ Failed to upload ${filename}:`, error.message);
      continue;
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    const publicUrl = publicUrlData.publicUrl;
    console.log(`✓ Uploaded to Supabase Storage: ${publicUrl}`);

    await prisma.blogPost.update({
      where: { id: post.id },
      data: { cover_image_path: publicUrl },
    });

    console.log(`✓ Updated database record for post ID ${post.id} -> ${publicUrl}\n`);
  }

  console.log('🎉 Migration completed successfully!');
  await prisma.$disconnect();
}

migrate().catch((err) => {
  console.error('Fatal migration error:', err);
  process.exit(1);
});
