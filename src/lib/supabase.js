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

export async function fetchActiveNotices() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('notices')
    .select('*')
    .eq('active', true)
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  const now = Date.now();
  return (data || []).filter((n) => !n.expires_at || new Date(n.expires_at).getTime() > now);
}

export async function adminListNotices(adminKey) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.rpc('admin_list_notices', {
    admin_key: adminKey,
  });
  if (error) throw error;
  return data || [];
}

export async function adminAddNotice(notice, adminKey) {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.rpc('admin_add_notice', {
    p_title: notice.title,
    p_message: notice.message,
    p_notice_type: notice.notice_type,
    p_priority: Number(notice.priority) || 0,
    p_link_url: notice.link_url || '',
    p_link_label: notice.link_label || '',
    p_expires_at: notice.expires_at || null,
    admin_key: adminKey,
  });
  if (error) throw error;
}

export async function adminUpdateNotice(notice, adminKey) {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.rpc('admin_update_notice', {
    p_id: notice.id,
    p_title: notice.title,
    p_message: notice.message,
    p_notice_type: notice.notice_type,
    p_priority: Number(notice.priority) || 0,
    p_active: notice.active,
    p_link_url: notice.link_url || '',
    p_link_label: notice.link_label || '',
    p_expires_at: notice.expires_at || null,
    admin_key: adminKey,
  });
  if (error) throw error;
}

export async function adminDeleteNotice(noticeId, adminKey) {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.rpc('admin_delete_notice', {
    notice_id: noticeId,
    admin_key: adminKey,
  });
  if (error) throw error;
}

export async function adminToggleNotice(noticeId, adminKey) {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.rpc('admin_toggle_notice', {
    notice_id: noticeId,
    admin_key: adminKey,
  });
  if (error) throw error;
}
