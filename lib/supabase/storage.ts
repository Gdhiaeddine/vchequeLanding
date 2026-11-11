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
export const INSTALLER_BUCKET = 'installers';

/**
 * Crée une URL d'upload signée directement pour Supabase Storage.
 * Permet au navigateur de téléverser de gros fichiers (jusqu'à 500MB+)
 * directement sur Supabase, contournant la limite de 4.5MB des fonctions Vercel.
 */
export async function createInstallerUploadSignedUrl(filename: string): Promise<{
  signedUrl: string;
  token: string;
  path: string;
  publicUrl: string;
}> {
  const { data, error } = await supabaseAdmin.storage
    .from(INSTALLER_BUCKET)
    .createSignedUploadUrl(filename);

  if (error || !data) {
    console.error('[Supabase Storage] createSignedUploadUrl error:', error);
    throw new Error(`Erreur lors de la préparation du téléversement: ${error?.message || 'Erreur inconnue'}`);
  }

  const { data: urlData } = supabaseAdmin.storage
    .from(INSTALLER_BUCKET)
    .getPublicUrl(filename);

  return {
    signedUrl: data.signedUrl,
    token: data.token,
    path: data.path,
    publicUrl: urlData.publicUrl,
  };
}

/**
 * Téléverse un fichier d'installation (.exe, .msi) dans le bucket Supabase Storage.
 * @param buffer Contenu binaire de l'installateur
 * @param filename Nom du fichier dans le bucket (ex: safe hash + .exe)
 * @param mimeType Type MIME (par défaut: application/x-msdownload)
 * @returns L'URL publique permanente CDN de l'installateur
 */
export async function uploadInstallerToSupabase(
  buffer: Buffer,
  filename: string,
  mimeType: string = 'application/x-msdownload'
): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from(INSTALLER_BUCKET)
    .upload(filename, buffer, {
      contentType: mimeType,
      upsert: true,
    });

  if (error) {
    console.error('[Supabase Storage] Installer upload error:', error);
    throw new Error(`Erreur lors du téléversement de l'installateur sur Supabase: ${error.message}`);
  }

  const { data: urlData } = supabaseAdmin.storage
    .from(INSTALLER_BUCKET)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * Supprime un fichier installateur du bucket Supabase Storage.
 * @param filenameOrUrl URL ou nom du fichier
 */
export async function deleteInstallerFromSupabase(filenameOrUrl: string): Promise<boolean> {
  try {
    if (!filenameOrUrl) return false;
    const filename = filenameOrUrl.split('/').pop()?.split('?')[0];
    if (!filename) return false;

    const { error } = await supabaseAdmin.storage
      .from(INSTALLER_BUCKET)
      .remove([filename]);

    if (error) {
      console.warn('[Supabase Storage] Installer delete error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase Storage] Installer delete exception:', err);
    return false;
  }
}

/**
 * Récupère l'URL publique Supabase d'un installateur.
 */
export function getInstallerPublicUrl(filenameOrPath: string): string {
  if (filenameOrPath.startsWith('http://') || filenameOrPath.startsWith('https://')) {
    return filenameOrPath;
  }
  const filename = filenameOrPath.split('/').pop()?.split('?')[0] || filenameOrPath;
  const { data } = supabaseAdmin.storage
    .from(INSTALLER_BUCKET)
    .getPublicUrl(filename);
  return data.publicUrl;
}

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
