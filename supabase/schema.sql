-- Vidya Coachings Supabase Schema
-- Run this in Supabase SQL Editor

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Gallery photos (admin-added, images hosted on GitHub repo)
CREATE TABLE IF NOT EXISTS gallery_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  github_path TEXT NOT NULL,
  alt TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Admin config (set your password after running schema)
CREATE TABLE IF NOT EXISTS admin_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

INSERT INTO admin_config (key, value)
VALUES ('password', 'change-me-vidya2026')
ON CONFLICT (key) DO NOTHING;

-- RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit reviews" ON reviews;
CREATE POLICY "Anyone can submit reviews" ON reviews FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view approved reviews" ON reviews;
CREATE POLICY "Public can view approved reviews" ON reviews FOR SELECT USING (approved = true);

DROP POLICY IF EXISTS "Public can view gallery photos" ON gallery_photos;
CREATE POLICY "Public can view gallery photos" ON gallery_photos FOR SELECT USING (true);

DROP POLICY IF EXISTS "No direct admin config access" ON admin_config;
CREATE POLICY "No direct admin config access" ON admin_config FOR SELECT USING (false);

-- Admin helper functions (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION verify_admin_key(admin_key TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_config WHERE key = 'password' AND value = admin_key
  );
END;
$$;

CREATE OR REPLACE FUNCTION admin_get_pending_reviews(admin_key TEXT)
RETURNS SETOF reviews
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT verify_admin_key(admin_key) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  RETURN QUERY SELECT * FROM reviews WHERE approved = false ORDER BY created_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION admin_approve_review(review_id UUID, admin_key TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT verify_admin_key(admin_key) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  UPDATE reviews SET approved = true WHERE id = review_id;
END;
$$;

CREATE OR REPLACE FUNCTION admin_delete_review(review_id UUID, admin_key TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT verify_admin_key(admin_key) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  DELETE FROM reviews WHERE id = review_id;
END;
$$;

CREATE OR REPLACE FUNCTION admin_add_gallery_photo(
  p_github_path TEXT,
  p_alt TEXT,
  p_category TEXT,
  admin_key TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT verify_admin_key(admin_key) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  INSERT INTO gallery_photos (github_path, alt, category)
  VALUES (p_github_path, COALESCE(p_alt, ''), COALESCE(p_category, 'general'));
END;
$$;

CREATE OR REPLACE FUNCTION admin_delete_gallery_photo(photo_id UUID, admin_key TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT verify_admin_key(admin_key) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  DELETE FROM gallery_photos WHERE id = photo_id;
END;
$$;

CREATE OR REPLACE FUNCTION admin_list_gallery_photos(admin_key TEXT)
RETURNS SETOF gallery_photos
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT verify_admin_key(admin_key) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  RETURN QUERY SELECT * FROM gallery_photos ORDER BY created_at DESC;
END;
$$;

-- Grant execute to anon/authenticated
GRANT EXECUTE ON FUNCTION verify_admin_key(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_get_pending_reviews(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_approve_review(UUID, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_delete_review(UUID, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_add_gallery_photo(TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_delete_gallery_photo(UUID, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_list_gallery_photos(TEXT) TO anon, authenticated;

-- Site alerts & notices
CREATE TABLE IF NOT EXISTS notices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notice_type TEXT NOT NULL DEFAULT 'notice' CHECK (notice_type IN ('alert', 'notice')),
  priority INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN DEFAULT true,
  link_url TEXT,
  link_label TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active notices" ON notices;
CREATE POLICY "Public can view active notices" ON notices
  FOR SELECT USING (
    active = true
    AND (expires_at IS NULL OR expires_at > now())
  );

CREATE OR REPLACE FUNCTION admin_list_notices(admin_key TEXT)
RETURNS SETOF notices
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT verify_admin_key(admin_key) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  RETURN QUERY SELECT * FROM notices ORDER BY priority DESC, created_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION admin_add_notice(
  p_title TEXT,
  p_message TEXT,
  p_notice_type TEXT,
  p_priority INTEGER,
  p_link_url TEXT,
  p_link_label TEXT,
  p_expires_at TIMESTAMPTZ,
  admin_key TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT verify_admin_key(admin_key) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  INSERT INTO notices (title, message, notice_type, priority, link_url, link_label, expires_at)
  VALUES (
    p_title,
    p_message,
    COALESCE(p_notice_type, 'notice'),
    COALESCE(p_priority, 0),
    NULLIF(p_link_url, ''),
    NULLIF(p_link_label, ''),
    p_expires_at
  );
END;
$$;

CREATE OR REPLACE FUNCTION admin_update_notice(
  p_id UUID,
  p_title TEXT,
  p_message TEXT,
  p_notice_type TEXT,
  p_priority INTEGER,
  p_active BOOLEAN,
  p_link_url TEXT,
  p_link_label TEXT,
  p_expires_at TIMESTAMPTZ,
  admin_key TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT verify_admin_key(admin_key) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  UPDATE notices SET
    title = p_title,
    message = p_message,
    notice_type = COALESCE(p_notice_type, 'notice'),
    priority = COALESCE(p_priority, 0),
    active = COALESCE(p_active, true),
    link_url = NULLIF(p_link_url, ''),
    link_label = NULLIF(p_link_label, ''),
    expires_at = p_expires_at
  WHERE id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION admin_delete_notice(notice_id UUID, admin_key TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT verify_admin_key(admin_key) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  DELETE FROM notices WHERE id = notice_id;
END;
$$;

CREATE OR REPLACE FUNCTION admin_toggle_notice(notice_id UUID, admin_key TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT verify_admin_key(admin_key) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  UPDATE notices SET active = NOT active WHERE id = notice_id;
END;
$$;

GRANT EXECUTE ON FUNCTION admin_list_notices(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_add_notice(TEXT, TEXT, TEXT, INTEGER, TEXT, TEXT, TIMESTAMPTZ, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_update_notice(UUID, TEXT, TEXT, TEXT, INTEGER, BOOLEAN, TEXT, TEXT, TIMESTAMPTZ, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_delete_notice(UUID, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_toggle_notice(UUID, TEXT) TO anon, authenticated;
