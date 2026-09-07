export const GAME_LIST = [
  {
    id: 'quiz',
    title: 'Quiz Challenge',
    desc: '10 MCQs · pick class & subject',
    icon: 'fas fa-question-circle',
    color: 'purple',
  },
  {
    id: 'speed-math',
    title: 'Speed Math',
    desc: '60 seconds · solve max sums!',
    icon: 'fas fa-bolt',
    color: 'orange',
  },
  {
    id: 'word-scramble',
    title: 'Word Scramble',
    desc: 'Unscramble 10 English words',
    icon: 'fas fa-random',
    color: 'blue',
  },
  {
    id: 'true-false',
    title: 'True or False',
    desc: '15 quick facts · 12 sec each',
    icon: 'fas fa-check-double',
    color: 'green',
  },
  {
    id: 'memory',
    title: 'Memory Match',
    desc: 'Flip cards & match 8 pairs',
    icon: 'fas fa-th',
    color: 'teal',
  },
];

export const SPEED_MATH_QUESTIONS = [
  { q: '12 + 8 = ?', options: ['18', '20', '22', '19'], answer: 1 },
  { q: '15 × 3 = ?', options: ['35', '40', '45', '50'], answer: 2 },
  { q: '100 − 37 = ?', options: ['53', '63', '73', '43'], answer: 1 },
  { q: '56 ÷ 8 = ?', options: ['6', '7', '8', '9'], answer: 1 },
  { q: '9² = ?', options: ['72', '81', '90', '99'], answer: 1 },
  { q: '25 + 17 = ?', options: ['40', '42', '44', '41'], answer: 1 },
  { q: '11 × 6 = ?', options: ['56', '60', '66', '72'], answer: 2 },
  { q: '144 ÷ 12 = ?', options: ['10', '11', '12', '14'], answer: 2 },
  { q: '7 × 8 = ?', options: ['54', '56', '58', '48'], answer: 1 },
  { q: '50% of 80 = ?', options: ['30', '40', '50', '35'], answer: 1 },
  { q: '3/4 of 20 = ?', options: ['12', '15', '18', '10'], answer: 1 },
  { q: '√81 = ?', options: ['7', '8', '9', '10'], answer: 2 },
  { q: '18 + 27 = ?', options: ['43', '44', '45', '46'], answer: 2 },
  { q: '6 × 9 = ?', options: ['45', '54', '56', '63'], answer: 1 },
  { q: '200 − 85 = ?', options: ['105', '115', '125', '95'], answer: 1 },
  { q: '5³ = ?', options: ['100', '125', '150', '75'], answer: 1 },
  { q: '48 ÷ 6 = ?', options: ['6', '7', '8', '9'], answer: 2 },
  { q: '13 + 29 = ?', options: ['40', '41', '42', '43'], answer: 2 },
  { q: '4 × 15 = ?', options: ['50', '55', '60', '65'], answer: 2 },
  { q: '90 − 45 = ?', options: ['35', '40', '45', '50'], answer: 2 },
];

export const WORD_SCRAMBLE = [
  { scrambled: 'LOHOCS', options: ['SCHOOL', 'CHLOOS', 'SHCOOL', 'SCHOLL'], answer: 0 },
  { scrambled: 'KBOO', options: ['BOOK', 'BOKO', 'KOOB', 'OBOK'], answer: 0 },
  { scrambled: 'HCAERT', options: ['TEACHER', 'CHART', 'CHEAT', 'REACT'], answer: 0 },
  { scrambled: 'NRAET', options: ['LEARN', 'EARN', 'ANTER', 'RENAL'], answer: 0 },
  { scrambled: 'TUDENS', options: ['STUDENT', 'STUNTED', 'DUSTEN', 'TUNSED'], answer: 0 },
  { scrambled: 'YTSUD', options: ['STUDY', 'DUSTY', 'DUTYS', 'YSDUT'], answer: 0 },
  { scrambled: 'HACERT', options: ['TEACHER', 'CHEATER', 'REACTH', 'CHARTE'], answer: 0 },
  { scrambled: 'NAPENCI', options: ['PENCIL', 'PENNIC', 'NICEPL', 'CLIPEN'], answer: 0 },
  { scrambled: 'KDES', options: ['DESK', 'DEKS', 'SEDK', 'KEDS'], answer: 0 },
  { scrambled: 'GNLEISH', options: ['ENGLISH', 'SINGLEH', 'HINGLES', 'LENGISH'], answer: 0 },
  { scrambled: 'THMA', options: ['MATH', 'THAM', 'MAHT', 'TAMH'], answer: 0 },
  { scrambled: 'ECNIES', options: ['SCIENCE', 'SINCENE', 'NECISEC', 'SCENICE'], answer: 0 },
  { scrambled: 'RABYLIB', options: ['LIBRARY', 'BRIARLY', 'LABYRIL', 'RAILBY'], answer: 0 },
  { scrambled: 'TSE', options: ['SET', 'EST', 'TES', 'STE'], answer: 0 },
  { scrambled: 'XAM', options: ['EXAM', 'MAX', 'AXE', 'MEX'], answer: 1 },
];

export const TRUE_FALSE = [
  { statement: 'The Sun is a star.', answer: true },
  { statement: 'Water boils at 50°C.', answer: false },
  { statement: 'India has 28 states.', answer: true },
  { statement: 'Hindi is the national language of India (official status).', answer: false },
  { statement: 'Photosynthesis happens in plants.', answer: true },
  { statement: 'The Moon produces its own light.', answer: false },
  { statement: 'Newton discovered the law of gravity.', answer: true },
  { statement: 'There are 8 planets in our solar system.', answer: true },
  { statement: 'Oxygen is needed for burning.', answer: true },
  { statement: 'Delhi is the capital of India.', answer: true },
  { statement: 'A triangle can have 4 sides.', answer: false },
  { statement: 'Sound travels faster in vacuum than air.', answer: false },
  { statement: 'Mahatma Gandhi is called Father of the Nation.', answer: true },
  { statement: 'π (pi) is approximately 3.14.', answer: true },
  { statement: 'Human heart has 4 chambers.', answer: true },
  { statement: 'Gold is a liquid at room temperature.', answer: false },
  { statement: 'Republic Day is celebrated on 26 January.', answer: true },
  { statement: 'The largest ocean is the Atlantic.', answer: false },
  { statement: 'Mitochondria is the powerhouse of the cell.', answer: true },
  { statement: '2 is the only even prime number.', answer: true },
];

export const MEMORY_PAIRS = [
  { term: '7 × 8', match: '56' },
  { term: '12²', match: '144' },
  { term: 'Capital of India', match: 'New Delhi' },
  { term: 'H₂O', match: 'Water' },
  { term: 'National Animal', match: 'Tiger' },
  { term: '5! (factorial)', match: '120' },
  { term: 'Largest planet', match: 'Jupiter' },
  { term: '√64', match: '8' },
];

export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickRandom(pool, count) {
  return shuffleArray(pool).slice(0, Math.min(count, pool.length));
}
