-- Quiz scores leaderboard — run in Supabase SQL Editor
CREATE TABLE IF NOT EXISTS quiz_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL,
  level TEXT NOT NULL,
  subject TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  percent INTEGER NOT NULL,
  best_streak INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE quiz_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit quiz scores" ON quiz_scores;
CREATE POLICY "Anyone can submit quiz scores" ON quiz_scores
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view quiz scores" ON quiz_scores;
CREATE POLICY "Public can view quiz scores" ON quiz_scores
  FOR SELECT USING (true);

GRANT SELECT, INSERT ON quiz_scores TO anon, authenticated;
