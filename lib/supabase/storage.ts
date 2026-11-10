import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ngndjnmylutlctigrczs.supabase.co';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  '';

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export const BLOG_BUCKET = 'blog-covers';

/**
 * Téléverse une image de couverture dans le bucket Supabase Storage.
 * @param buffer Contenu binaire de l'image
 * @param filename Nom de fichier unique (ex: safe hex + ext)
 * @param mimeType Type MIME (ex: image/jpeg, image/webp)
 * @returns L'URL publique permanente CDN de l'image
 */
export async function uploadBlogCoverToSupabase(
  buffer: Buffer,
  filename: string,
  mimeType: string = 'image/jpeg'
): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from(BLOG_BUCKET)
    .upload(filename, buffer, {
      contentType: mimeType,
      upsert: true,
    });

  if (error) {
    console.error('[Supabase Storage] Upload error:', error);
    throw new Error(`Erreur lors du téléversement sur Supabase Storage: ${error.message}`);
  }

  const { data: urlData } = supabaseAdmin.storage
    .from(BLOG_BUCKET)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * Supprime une image de couverture du bucket Supabase Storage.
 * @param coverUrlOrPath URL complète ou nom de fichier de l'image
 */
export async function deleteBlogCoverFromSupabase(coverUrlOrPath: string): Promise<boolean> {
  try {
    if (!coverUrlOrPath) return false;

    // Extraction du nom de fichier
    const filename = coverUrlOrPath.split('/').pop()?.split('?')[0];
    if (!filename) return false;

    const { error } = await supabaseAdmin.storage
      .from(BLOG_BUCKET)
      .remove([filename]);

    if (error) {
      console.warn('[Supabase Storage] Delete error:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.warn('[Supabase Storage] Delete exception:', err);
    return false;
  }
}
