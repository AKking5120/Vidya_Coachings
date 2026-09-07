import { useState, useEffect } from 'react';
import { TRUE_FALSE, pickRandom } from '../../data/miniGamesData';

const TOTAL = 15;
const TIME_PER = 12;

export default function TrueFalseGame({ onBack }) {
  const [phase, setPhase] = useState('ready');
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER);
  const [answered, setAnswered] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(null);

  const start = () => {
    setQuestions(pickRandom(TRUE_FALSE, TOTAL));
    setIndex(0);
    setScore(0);
    setTimeLeft(TIME_PER);
    setAnswered(false);
    setLastCorrect(null);
    setPhase('play');
  };

  const q = questions[index];

  const advance = () => {
    if (index + 1 >= questions.length) {
      setPhase('finish');
      return;
    }
    setIndex((i) => i + 1);
    setTimeLeft(TIME_PER);
    setAnswered(false);
    setLastCorrect(null);
  };

  const handleAnswer = (choice) => {
    if (answered) return;
    const correct = choice === q.answer;
    if (correct) setScore((s) => s + 1);
    setLastCorrect(correct);
    setAnswered(true);
  };

  useEffect(() => {
    if (!answered || phase !== 'play') return;
    const t = setTimeout(advance, 700);
    return () => clearTimeout(t);
  }, [answered, phase, index, questions.length]);

  useEffect(() => {
    if (phase !== 'play' || answered) return;
    if (timeLeft <= 0) {
      setLastCorrect(false);
      setAnswered(true);
      return;
    }
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft, answered]);

  if (phase === 'ready') {
    return (
      <div className="mg-game">
        <button type="button" className="mg-back" onClick={onBack}><i className="fas fa-arrow-left" /> All Games</button>
        <div className="mg-intro mg-intro--green">
          <i className="fas fa-check-double" />
          <h2>True or False</h2>
          <p><strong>{TOTAL} facts</strong> — tap True or False before time runs out!</p>
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
          <h2>Finished! ✅</h2>
          <p className="mg-finish-score">{score} / {questions.length} correct ({pct}%)</p>
          <p>{pct >= 80 ? 'Super smart! 🧠' : pct >= 50 ? 'Well done! 👍' : 'Study more & retry! 📖'}</p>
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
        <span>Q {index + 1}/{questions.length}</span>
        <span><i className="fas fa-star" /> {score}</span>
        <span className={timeLeft <= 5 ? 'mg-urgent' : ''}><i className="fas fa-clock" /> {timeLeft}s</span>
      </div>
      <div className="sg-question-card">
        <h2 className="sg-question">{q.statement}</h2>
        <div className="mg-tf-buttons">
          <button
            type="button"
            className={`mg-tf-btn mg-tf-btn--true ${answered && q.answer === true ? 'correct' : ''} ${answered && lastCorrect === false && q.answer !== true ? 'wrong' : ''}`}
            onClick={() => handleAnswer(true)}
            disabled={answered}
          >
            <i className="fas fa-check" /> True
          </button>
          <button
            type="button"
            className={`mg-tf-btn mg-tf-btn--false ${answered && q.answer === false ? 'correct' : ''} ${answered && lastCorrect === false && q.answer !== false ? 'wrong' : ''}`}
            onClick={() => handleAnswer(false)}
            disabled={answered}
          >
            <i className="fas fa-times" /> False
          </button>
        </div>
        {answered && (
          <p className={`mg-tf-feedback ${lastCorrect ? 'correct' : 'wrong'}`}>
            {lastCorrect ? 'Correct!' : `Wrong — answer was ${q.answer ? 'True' : 'False'}`}
          </p>
        )}
      </div>
    </div>
  );
}
