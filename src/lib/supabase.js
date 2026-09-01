import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function fetchApprovedReviews() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('approved', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function submitReview({ name, role, rating, text }) {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.from('reviews').insert({
    name,
    role,
    rating: Number(rating),
    text,
    approved: false,
  });
  if (error) throw error;
}

export async function fetchGalleryPhotos() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('gallery_photos')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function adminFetchPendingReviews(adminKey) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.rpc('admin_get_pending_reviews', {
    admin_key: adminKey,
  });
  if (error) throw error;
  return data || [];
}

export async function adminApproveReview(reviewId, adminKey) {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.rpc('admin_approve_review', {
    review_id: reviewId,
    admin_key: adminKey,
  });
  if (error) throw error;
}

export async function adminDeleteReview(reviewId, adminKey) {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.rpc('admin_delete_review', {
    review_id: reviewId,
    admin_key: adminKey,
  });
  if (error) throw error;
}

export async function adminAddGalleryPhoto({ github_path, alt, category }, adminKey) {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.rpc('admin_add_gallery_photo', {
    p_github_path: github_path,
    p_alt: alt,
    p_category: category,
    admin_key: adminKey,
  });
  if (error) throw error;
}

export async function adminDeleteGalleryPhoto(photoId, adminKey) {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.rpc('admin_delete_gallery_photo', {
    photo_id: photoId,
    admin_key: adminKey,
  });
  if (error) throw error;
}

export async function adminListGalleryPhotos(adminKey) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.rpc('admin_list_gallery_photos', {
    admin_key: adminKey,
  });
  if (error) throw error;
  return data || [];
}

export async function verifyAdminKey(adminKey) {
  if (!supabase) return false;
  const { data, error } = await supabase.rpc('verify_admin_key', {
    admin_key: adminKey,
  });
  if (error) return false;
  return Boolean(data);
}
