import { useState, useEffect, useCallback } from 'react';
import { SPEED_MATH_QUESTIONS, pickRandom, shuffleArray } from '../../data/miniGamesData';

const GAME_TIME = 60;

function shuffleOptions(question) {
  const indexed = question.options.map((opt, i) => ({ opt, i }));
  const shuffled = [...indexed].sort(() => Math.random() - 0.5);
  const answer = shuffled.findIndex((item) => item.i === question.answer);
  return { options: shuffled.map((item) => item.opt), answer };
}

export default function SpeedMathGame({ onBack }) {
  const [phase, setPhase] = useState('ready');
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [pool, setPool] = useState([]);
  const [current, setCurrent] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const start = () => {
    const shuffled = shuffleArray(SPEED_MATH_QUESTIONS);
    setPool(shuffled);
    setScore(0);
    setTotal(0);
    setTimeLeft(GAME_TIME);
    setFeedback(null);
    setCurrent(shuffleOptions(shuffled[0]));
    setPhase('play');
  };

  const nextQ = useCallback(() => {
    const q = pool[total % pool.length] || pickRandom(SPEED_MATH_QUESTIONS, 1)[0];
    setCurrent(shuffleOptions(q));
    setFeedback(null);
  }, [pool, total]);

  const handleAnswer = (index) => {
    if (feedback !== null) return;
    const correct = index === current.answer;
    setTotal((t) => t + 1);
    if (correct) setScore((s) => s + 1);
    setFeedback(correct ? 'correct' : 'wrong');
    setTimeout(() => nextQ(), 400);
  };

  useEffect(() => {
    if (phase !== 'play') return;
    if (timeLeft <= 0) {
      setPhase('finish');
      return;
    }
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft]);

  if (phase === 'ready') {
    return (
      <div className="mg-game">
        <button type="button" className="mg-back" onClick={onBack}><i className="fas fa-arrow-left" /> All Games</button>
        <div className="mg-intro mg-intro--orange">
          <i className="fas fa-bolt" />
          <h2>Speed Math</h2>
          <p>Solve as many sums as you can in <strong>60 seconds</strong>!</p>
          <button type="button" className="btn btn-primary" onClick={start}>Start Game</button>
        </div>
      </div>
    );
  }

  if (phase === 'finish') {
    return (
      <div className="mg-game">
        <div className="mg-finish">
          <h2>Time&apos;s Up! ⚡</h2>
          <p className="mg-finish-score">{score} / {total} correct</p>
          <p>{score >= 15 ? 'Math wizard! 🏆' : score >= 10 ? 'Great speed! ⭐' : 'Keep practising! 💪'}</p>
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
      <div className="mg-stats-bar">
        <span><i className="fas fa-clock" /> {timeLeft}s</span>
        <span><i className="fas fa-star" /> {score} correct</span>
      </div>
      <div className="sg-question-card">
        <h2 className="sg-question">{current?.q}</h2>
        <div className="sg-options">
          {current?.options.map((opt, i) => {
            let cls = 'sg-option';
            if (feedback) {
              if (i === current.answer) cls += ' correct';
              else if (feedback === 'wrong') cls += ' wrong';
            }
            return (
              <button key={i} type="button" className={cls} onClick={() => handleAnswer(i)} disabled={feedback !== null}>
                <span className="sg-option-letter">{String.fromCharCode(65 + i)}</span>
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
