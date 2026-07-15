-- =============================================
-- Vidya Coachings - Supabase Database Schema
-- Run this in the Supabase SQL Editor
--
-- NOTE: Reviews are managed via Google Sheets (ReviewsBackend.gs).
-- Supabase handles: admissions, contacts, downloads, gallery, notices.
-- =============================================

-- ── Admission enquiries ───────────────────────
CREATE TABLE IF NOT EXISTS public.admissions (
  id           BIGSERIAL PRIMARY KEY,
  student_name TEXT        NOT NULL,
  class        TEXT        NOT NULL,
  parent_name  TEXT        NOT NULL,
  phone        TEXT        NOT NULL,
  email        TEXT,
  message      TEXT,
  read         BOOLEAN     NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit admission"  ON public.admissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role reads admissions" ON public.admissions FOR SELECT USING (true);
CREATE POLICY "Service role deletes admissions" ON public.admissions FOR DELETE USING (true);

-- ── Contact messages ─────────────────────────
CREATE TABLE IF NOT EXISTS public.contacts (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT        NOT NULL,
  phone      TEXT        NOT NULL,
  email      TEXT,
  message    TEXT        NOT NULL,
  read       BOOLEAN     NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contact"    ON public.contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role reads contacts"  ON public.contacts FOR SELECT USING (true);
CREATE POLICY "Service role deletes contacts" ON public.contacts FOR DELETE USING (true);

-- ── Downloads ────────────────────────────────
CREATE TABLE IF NOT EXISTS public.downloads (
  id          BIGSERIAL PRIMARY KEY,
  title       TEXT        NOT NULL,
  category    TEXT        NOT NULL CHECK (category IN ('notes','circulars')),
  class_label TEXT        NOT NULL DEFAULT '',
  file_url    TEXT        NOT NULL,
  file_type   TEXT        NOT NULL DEFAULT 'pdf',
  published   BOOLEAN     NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published downloads" ON public.downloads FOR SELECT USING (published = true);
CREATE POLICY "Service role manages downloads"      ON public.downloads FOR ALL   USING (true);

INSERT INTO public.downloads (title, category, class_label, file_url, file_type) VALUES
  ('History Chapter 2', 'notes', 'Class 10', '/downloads/notes/class10-history-chapter2.pdf', 'pdf'),
  ('History Chapter: The Age of Industrialisation', 'notes', 'Class 10', '/downloads/notes/class10-sst-chapter-The_Age_of_Industrialisation.pdf', 'pdf'),
  ('History Chapter: Print Culture and the Modern World', 'notes', 'Class 10', '/downloads/notes/class10-sst-chapter-Print_Culture_and_the_Modern_World.pdf', 'pdf');

-- ── Gallery photos ───────────────────────────
CREATE TABLE IF NOT EXISTS public.gallery (
  id         BIGSERIAL PRIMARY KEY,
  src        TEXT        NOT NULL,
  alt        TEXT        NOT NULL DEFAULT '',
  category   TEXT        NOT NULL CHECK (category IN ('general','students','alumni','achievements')),
  published  BOOLEAN     NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published gallery" ON public.gallery FOR SELECT USING (published = true);
CREATE POLICY "Service role manages gallery"      ON public.gallery FOR ALL   USING (true);

-- ── Notices ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notices (
  id         BIGSERIAL PRIMARY KEY,
  title      TEXT        NOT NULL,
  body       TEXT        NOT NULL,
  type       TEXT        NOT NULL DEFAULT 'info'
               CHECK (type IN ('info','warning','success','urgent')),
  active     BOOLEAN     NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads active notices"  ON public.notices FOR SELECT USING (active = true);
CREATE POLICY "Service role manages notices" ON public.notices FOR ALL   USING (true);

-- Sample notice
INSERT INTO public.notices (title, body, type) VALUES
  ('Welcome to Vidya Coachings!',
   'Admissions open for 2025–26 session. Classes for Class 1 to 12, CUET, CTET & more. Contact us at +91 98717 49012.',
   'info');
