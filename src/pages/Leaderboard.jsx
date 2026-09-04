import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { STUDY_LEVELS, STUDY_SUBJECTS } from '../data/studyGameData';
import { fetchLeaderboard, isSupabaseConfigured } from '../lib/supabase';

const FILTERS = [
  { id: 'all', label: 'All' },
  ...STUDY_LEVELS.map((l) => ({ id: l.id, label: l.label })),
];

const SUBJECT_FILTERS = [
  { id: 'all', label: 'All Subjects' },
  ...STUDY_SUBJECTS.map((s) => ({ id: s.id, label: s.label })),
];

function medal(rank) {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return rank;
}

function labelFor(level, subject) {
  const lvl = STUDY_LEVELS.find((l) => l.id === level)?.label || level;
  const sub = STUDY_SUBJECTS.find((s) => s.id === subject)?.label || subject;
  return { lvl, sub };
}

export default function Leaderboard() {
  const [levelFilter, setLevelFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      setError('Leaderboard needs Supabase. Run supabase/quiz-scores.sql in SQL Editor.');
      return;
    }
    setLoading(true);
    setError('');
    fetchLeaderboard({ level: levelFilter, subject: subjectFilter })
      .then(setScores)
      .catch(() => setError('Could not load leaderboard. Run supabase/quiz-scores.sql first.'))
      .finally(() => setLoading(false));
  }, [levelFilter, subjectFilter]);

  return (
    <>
      <section className="page-hero study-game-hero">
        <div className="container">
          <div className="page-hero-badge"><i className="fas fa-trophy" /> Top Students</div>
          <h1>Leaderboard</h1>
          <p>Highest quiz scores from Vidya Coachings Study Game</p>
          <div className="study-game-hero-actions">
            <Link to="/study-game" className="btn btn-primary">
              <i className="fas fa-gamepad" /> Play Study Game
            </Link>
          </div>
        </div>
      </section>

      <section className="study-game-section">
        <div className="container">
          <div className="lb-filters">
            <div className="lb-filter-group">
              <span className="lb-filter-label">Class</span>
              <div className="lb-filter-tabs">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className={levelFilter === f.id ? 'active' : ''}
                    onClick={() => setLevelFilter(f.id)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="lb-filter-group">
              <span className="lb-filter-label">Subject</span>
              <div className="lb-filter-tabs">
                {SUBJECT_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className={subjectFilter === f.id ? 'active' : ''}
                    onClick={() => setSubjectFilter(f.id)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading && (
            <p className="lb-status"><i className="fas fa-spinner fa-spin" /> Loading scores...</p>
          )}

          {error && !loading && (
            <div className="lb-error">
              <i className="fas fa-info-circle" /> {error}
            </div>
          )}

          {!loading && !error && scores.length === 0 && (
            <div className="lb-empty">
              <i className="fas fa-medal" />
              <h3>No scores yet!</h3>
              <p>Be the first — play Study Game and submit your score.</p>
              <Link to="/study-game" className="btn btn-primary">Start Quiz</Link>
            </div>
          )}

          {!loading && !error && scores.length > 0 && (
            <div className="lb-table-wrap">
              <table className="lb-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Class</th>
                    <th>Subject</th>
                    <th>Score</th>
                    <th>Streak</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((row, i) => {
                    const { lvl, sub } = labelFor(row.level, row.subject);
                    const rank = i + 1;
                    return (
                      <tr key={row.id} className={rank <= 3 ? `lb-top-${rank}` : ''}>
                        <td className="lb-rank">{medal(rank)}</td>
                        <td className="lb-name">{row.player_name}</td>
                        <td>{lvl}</td>
                        <td>{sub}</td>
                        <td className="lb-score">
                          <strong>{row.percent}%</strong>
                          <small>{row.score}/{row.total_questions}</small>
                        </td>
                        <td>{row.best_streak >= 2 ? <span className="lb-streak"><i className="fas fa-fire" /> {row.best_streak}</span> : '—'}</td>
                        <td className="lb-date">{new Date(row.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
