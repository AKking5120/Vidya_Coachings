import { useState, useMemo } from 'react';
import { MEMORY_PAIRS, shuffleArray } from '../../data/miniGamesData';

function buildDeck() {
  const cards = [];
  MEMORY_PAIRS.forEach((pair, pairId) => {
    cards.push({ id: `${pairId}-a`, pairId, text: pair.term, type: 'term' });
    cards.push({ id: `${pairId}-b`, pairId, text: pair.match, type: 'match' });
  });
  return shuffleArray(cards);
}

export default function MemoryMatchGame({ onBack }) {
  const [phase, setPhase] = useState('ready');
  const [deck, setDeck] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [lock, setLock] = useState(false);

  const start = () => {
    setDeck(buildDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setLock(false);
    setPhase('play');
  };

  const won = matched.length === MEMORY_PAIRS.length;

  const handleFlip = (cardId) => {
    if (lock || flipped.includes(cardId) || matched.includes(deck.find((c) => c.id === cardId)?.pairId)) return;

    const nextFlipped = [...flipped, cardId];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      setLock(true);
      const [a, b] = nextFlipped.map((id) => deck.find((c) => c.id === id));
      if (a.pairId === b.pairId) {
        setMatched((m) => [...m, a.pairId]);
        setFlipped([]);
        setLock(false);
        if (matched.length + 1 === MEMORY_PAIRS.length) {
          setTimeout(() => setPhase('finish'), 500);
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
          setLock(false);
        }, 700);
      }
    }
  };

  const isVisible = (card) => flipped.includes(card.id) || matched.includes(card.pairId);

  const gridClass = useMemo(() => 'mg-memory-grid', []);

  if (phase === 'ready') {
    return (
      <div className="mg-game">
        <button type="button" className="mg-back" onClick={onBack}><i className="fas fa-arrow-left" /> All Games</button>
        <div className="mg-intro mg-intro--teal">
          <i className="fas fa-th" />
          <h2>Memory Match</h2>
          <p>Match <strong>{MEMORY_PAIRS.length} pairs</strong> — question with answer!</p>
          <button type="button" className="btn btn-primary" onClick={start}>Start Game</button>
        </div>
      </div>
    );
  }

  if (phase === 'finish') {
    return (
      <div className="mg-game">
        <div className="mg-finish">
          <h2>You matched all! 🎉</h2>
          <p className="mg-finish-score">{moves} moves</p>
          <p>{moves <= 12 ? 'Amazing memory! 🧠' : moves <= 18 ? 'Great job! ⭐' : 'Good try — play again!'}</p>
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
        <span>Moves: {moves}</span>
        <span>Pairs: {matched.length}/{MEMORY_PAIRS.length}</span>
      </div>
      <div className={gridClass}>
        {deck.map((card) => (
          <button
            key={card.id}
            type="button"
            className={`mg-memory-card ${isVisible(card) ? 'flipped' : ''} ${matched.includes(card.pairId) ? 'matched' : ''}`}
            onClick={() => handleFlip(card.id)}
            disabled={lock && !isVisible(card)}
          >
            <span className="mg-memory-front"><i className="fas fa-question" /></span>
            <span className="mg-memory-back">{card.text}</span>
          </button>
        ))}
      </div>
      {won && <p className="mg-win-msg">All pairs matched!</p>}
    </div>
  );
}
