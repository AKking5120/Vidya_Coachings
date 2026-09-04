-- ============================================================
-- Vidya Coachings — Alerts & Notices Migration
-- Run this ENTIRE file in Supabase SQL Editor (one paste).
-- Do NOT run partial snippets starting from "RETURNS VOID".
-- ============================================================

-- 1. Table
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

-- 2. RLS
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active notices" ON notices;
CREATE POLICY "Public can view active notices" ON notices
  FOR SELECT USING (
    active = true
    AND (expires_at IS NULL OR expires_at > now())
  );

-- 3. Admin functions (requires verify_admin_key from main schema.sql)
CREATE OR REPLACE FUNCTION admin_list_notices(admin_key TEXT)
RETURNS SETOF notices
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
BEGIN
  IF NOT verify_admin_key(admin_key) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  RETURN QUERY SELECT * FROM notices ORDER BY priority DESC, created_at DESC;
END;
$fn$;

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
AS $fn$
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
$fn$;

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
AS $fn$
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
$fn$;

CREATE OR REPLACE FUNCTION admin_delete_notice(notice_id UUID, admin_key TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
BEGIN
  IF NOT verify_admin_key(admin_key) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  DELETE FROM notices WHERE id = notice_id;
END;
$fn$;

CREATE OR REPLACE FUNCTION admin_toggle_notice(notice_id UUID, admin_key TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
BEGIN
  IF NOT verify_admin_key(admin_key) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  UPDATE notices SET active = NOT active WHERE id = notice_id;
END;
$fn$;

-- 4. Permissions
GRANT EXECUTE ON FUNCTION admin_list_notices(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_add_notice(TEXT, TEXT, TEXT, INTEGER, TEXT, TEXT, TIMESTAMPTZ, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_update_notice(UUID, TEXT, TEXT, TEXT, INTEGER, BOOLEAN, TEXT, TEXT, TIMESTAMPTZ, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_delete_notice(UUID, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_toggle_notice(UUID, TEXT) TO anon, authenticated;
