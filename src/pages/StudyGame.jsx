import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  STUDY_LEVELS,
  STUDY_SUBJECTS,
  getQuestions,
  getQuestionCount,
  getScoreMessage,
} from '../data/studyGameData';
import { submitQuizScore, isSupabaseConfigured } from '../lib/supabase';

const QUESTION_COUNT = 10;
const TIME_PER_QUESTION = 30;
const PLAYER_NAME_KEY = 'vidya_quiz_player_name';

function shuffleOptions(question) {
  const indexed = question.options.map((opt, i) => ({ opt, i }));
  const shuffled = [...indexed].sort(() => Math.random() - 0.5);
  const answer = shuffled.findIndex((item) => item.i === question.answer);
  return {
    options: shuffled.map((item) => item.opt),
    answer,
  };
}

export default function StudyGame() {
  const [screen, setScreen] = useState('menu');
  const [level, setLevel] = useState(null);
  const [subject, setSubject] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [shuffledQs, setShuffledQs] = useState([]);
  const [playerName, setPlayerName] = useState(() => localStorage.getItem(PLAYER_NAME_KEY) || '');
  const [scoreSaved, setScoreSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const q = questions[current];
  const shuffled = shuffledQs[current] || null;

  const startQuiz = (lvl, sub) => {
    const qs = getQuestions(lvl, sub, QUESTION_COUNT);
    if (!qs.length) return;
    setLevel(lvl);
    setSubject(sub);
    setQuestions(qs);
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setTimeLeft(TIME_PER_QUESTION);
    setStreak(0);
    setBestStreak(0);
    setShuffledQs(qs.map(shuffleOptions));
    setScoreSaved(false);
    setSaveError('');
    setScreen('quiz');
  };

  const handleSaveScore = async () => {
    if (!playerName.trim()) {
      setSaveError('Please enter your name.');
      return;
    }
    if (!isSupabaseConfigured) {
      setSaveError('Supabase not configured. Leaderboard unavailable.');
      return;
    }
    setSaving(true);
    setSaveError('');
    try {
      localStorage.setItem(PLAYER_NAME_KEY, playerName.trim());
      await submitQuizScore({
        playerName: playerName.trim(),
        level,
        subject,
        score,
        totalQuestions: questions.length,
        percent,
        bestStreak,
      });
      setScoreSaved(true);
    } catch {
      setSaveError('Could not save score. Run supabase/quiz-scores.sql in Supabase.');
    } finally {
      setSaving(false);
    }
  };

  const handleAnswer = useCallback((index) => {
    if (selected !== null || !shuffled) return;
    setSelected(index);
    const correct = index === shuffled.answer;
    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => {
        const next = s + 1;
        setBestStreak((b) => Math.max(b, next));
        return next;
      });
    } else {
      setStreak(0);
    }
    setShowResult(true);
  }, [selected, shuffled]);

  const nextQuestion = () => {
    if (current + 1 >= questions.length) {
      setScreen('finish');
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
    setShowResult(false);
    setTimeLeft(TIME_PER_QUESTION);
  };

  useEffect(() => {
    if (screen !== 'quiz' || selected !== null || showResult) return;
    if (timeLeft <= 0) {
      setStreak(0);
      setShowResult(true);
      return;
    }
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [screen, timeLeft, selected, showResult]);

  const reset = () => {
    setScreen('menu');
    setLevel(null);
    setSubject(null);
    setQuestions([]);
  };

  const levelLabel = STUDY_LEVELS.find((l) => l.id === level)?.label;
  const subjectLabel = STUDY_SUBJECTS.find((s) => s.id === subject)?.label;
  const percent = questions.length ? Math.round((score / questions.length) * 100) : 0;
  const msg = getScoreMessage(percent);

  return (
    <>
      <section className="page-hero study-game-hero">
        <div className="container">
          <div className="page-hero-badge"><i className="fas fa-gamepad" /> Learn &amp; Play</div>
          <h1>Study Game</h1>
          <p>Test your knowledge with fun quizzes — Math, Science, English &amp; GK</p>
          <Link to="/leaderboard" className="btn btn-outline" style={{ marginTop: 12, color: '#fff', borderColor: 'rgba(255,255,255,0.5)' }}>
            <i className="fas fa-trophy" /> View Leaderboard
          </Link>
        </div>
      </section>

      <section className="study-game-section">
        <div className="container">
          {screen === 'menu' && (
            <div className="sg-menu">
              <div className="page-section-head">
                <span className="section-eyebrow">Choose Your Quiz</span>
                <h2 className="section-heading">Pick class &amp; subject</h2>
                <p className="section-subtitle">10 questions · 30 seconds each · 20+ questions per subject</p>
              </div>

              {STUDY_LEVELS.map((lvl) => (
                <div key={lvl.id} className="sg-level-block">
                  <h3 className={`sg-level-title sg-level-title--${lvl.color}`}>
                    <i className={lvl.icon} /> {lvl.label}
                  </h3>
                  <div className="sg-subject-grid">
                    {STUDY_SUBJECTS.map((sub) => (
                      <button
                        key={`${lvl.id}-${sub.id}`}
                        type="button"
                        className="sg-subject-card"
                        onClick={() => startQuiz(lvl.id, sub.id)}
                      >
                        <i className={sub.icon} />
                        <span>{sub.label}</span>
                        <small>{getQuestionCount(lvl.id, sub.id)} questions</small>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {screen === 'quiz' && shuffled && (
            <div className="sg-quiz">
              <div className="sg-quiz-header">
                <div className="sg-quiz-meta">
                  <span className="sg-badge">{levelLabel}</span>
                  <span className="sg-badge">{subjectLabel}</span>
                </div>
                <div className="sg-quiz-stats">
                  <span><i className="fas fa-star" /> {score}/{questions.length}</span>
                  {streak >= 2 && <span className="sg-streak"><i className="fas fa-fire" /> {streak} streak</span>}
                  <span className={`sg-timer ${timeLeft <= 10 ? 'urgent' : ''}`}>
                    <i className="fas fa-clock" /> {timeLeft}s
                  </span>
                </div>
              </div>

              <div className="sg-progress">
                <div
                  className="sg-progress-fill"
                  style={{ width: `${((current + 1) / questions.length) * 100}%` }}
                />
              </div>
              <p className="sg-q-count">Question {current + 1} of {questions.length}</p>

              <div className="sg-question-card">
                <h2 className="sg-question">{q.q}</h2>
                <div className="sg-options">
                  {shuffled.options.map((opt, i) => {
                    let cls = 'sg-option';
                    if (showResult) {
                      if (i === shuffled.answer) cls += ' correct';
                      else if (i === selected) cls += ' wrong';
                    } else if (i === selected) cls += ' selected';
                    return (
                      <button
                        key={i}
                        type="button"
                        className={cls}
                        onClick={() => handleAnswer(i)}
                        disabled={showResult}
                      >
                        <span className="sg-option-letter">{String.fromCharCode(65 + i)}</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {showResult && (
                  <div className={`sg-feedback ${selected === shuffled.answer ? 'correct' : 'wrong'}`}>
                    {selected === shuffled.answer ? (
                      <><i className="fas fa-check-circle" /> Correct!</>
                    ) : selected === null ? (
                      <><i className="fas fa-hourglass-end" /> Time&apos;s up!</>
                    ) : (
                      <><i className="fas fa-times-circle" /> Wrong — answer is <strong>{shuffled.options[shuffled.answer]}</strong></>
                    )}
                    <button type="button" className="btn btn-primary btn-sm" onClick={nextQuestion}>
                      {current + 1 >= questions.length ? 'See Results' : 'Next Question'}
                    </button>
                  </div>
                )}
              </div>

              <button type="button" className="sg-quit" onClick={reset}>
                <i className="fas fa-arrow-left" /> Quit Quiz
              </button>
            </div>
          )}

          {screen === 'finish' && (
            <div className="sg-finish">
              <div className="sg-score-ring" style={{ '--pct': percent }}>
                <div className="sg-score-inner">
                  <strong>{percent}%</strong>
                  <span>{score}/{questions.length}</span>
                </div>
              </div>
              <h2>{msg.text}</h2>
              <p>{msg.sub}</p>
              {bestStreak >= 2 && (
                <p className="sg-best-streak"><i className="fas fa-fire" /> Best streak: {bestStreak} correct in a row</p>
              )}

              {!scoreSaved && (
                <div className="sg-save-score">
                  <label htmlFor="playerName">Save to Leaderboard</label>
                  <div className="sg-save-row">
                    <input
                      id="playerName"
                      type="text"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="Enter your name"
                      maxLength={40}
                    />
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={handleSaveScore}
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Submit Score'}
                    </button>
                  </div>
                  {saveError && <p className="sg-save-error">{saveError}</p>}
                </div>
              )}

              {scoreSaved && (
                <p className="sg-saved-msg"><i className="fas fa-check-circle" /> Score saved to leaderboard!</p>
              )}

              <div className="sg-finish-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => startQuiz(level, subject)}
                >
                  <i className="fas fa-redo" /> Play Again
                </button>
                <button type="button" className="btn btn-outline" onClick={reset}>
                  <i className="fas fa-th" /> Choose Another Quiz
                </button>
                <Link to="/leaderboard" className="btn btn-outline">
                  <i className="fas fa-trophy" /> Leaderboard
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
