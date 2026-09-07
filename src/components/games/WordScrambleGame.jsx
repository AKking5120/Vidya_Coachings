import { useState } from 'react';
import { WORD_SCRAMBLE, pickRandom } from '../../data/miniGamesData';

const TOTAL = 10;

export default function WordScrambleGame({ onBack }) {
  const [phase, setPhase] = useState('ready');
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const start = () => {
    setQuestions(pickRandom(WORD_SCRAMBLE, TOTAL));
    setIndex(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setPhase('play');
  };

  const q = questions[index];

  const handleAnswer = (i) => {
    if (showResult) return;
    setSelected(i);
    const correct = i === q.answer;
    if (correct) setScore((s) => s + 1);
    setShowResult(true);
  };

  const next = () => {
    if (index + 1 >= questions.length) {
      setPhase('finish');
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setShowResult(false);
  };

  if (phase === 'ready') {
    return (
      <div className="mg-game">
        <button type="button" className="mg-back" onClick={onBack}><i className="fas fa-arrow-left" /> All Games</button>
        <div className="mg-intro mg-intro--blue">
          <i className="fas fa-random" />
          <h2>Word Scramble</h2>
          <p>Unscramble <strong>{TOTAL} English words</strong> — pick the correct spelling!</p>
          <button type="button" className="btn btn-primary" onClick={start}>Start Game</button>
        </div>
      </div>
    );
  }

  if (phase === 'finish') {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="mg-game">
        <div className="mg-finish">
          <h2>Done! 📝</h2>
          <p className="mg-finish-score">{score} / {questions.length} correct ({pct}%)</p>
          <p>{pct >= 80 ? 'Spelling star! 🌟' : pct >= 50 ? 'Good job! 📚' : 'Try again! 💪'}</p>
          <div className="mg-finish-actions">
            <button type="button" className="btn btn-primary" onClick={start}>Play Again</button>
            <button type="button" className="btn btn-outline" onClick={onBack}>All Games</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mg-game">
      <button type="button" className="mg-back" onClick={onBack}><i className="fas fa-arrow-left" /> Quit</button>
      <p className="mg-progress-label">Word {index + 1} of {questions.length} · Score: {score}</p>
      <div className="mg-scramble-box">
        <span className="mg-scramble-letters">{q.scrambled}</span>
        <p>Unscramble this word:</p>
      </div>
      <div className="sg-options">
        {q.options.map((opt, i) => {
          let cls = 'sg-option';
          if (showResult) {
            if (i === q.answer) cls += ' correct';
            else if (i === selected) cls += ' wrong';
          }
          return (
            <button key={i} type="button" className={cls} onClick={() => handleAnswer(i)} disabled={showResult}>
              {opt}
            </button>
          );
        })}
      </div>
      {showResult && (
        <button type="button" className="btn btn-primary btn-sm mg-next-btn" onClick={next}>
          {index + 1 >= questions.length ? 'See Results' : 'Next Word'}
        </button>
      )}
    </div>
  );
}
