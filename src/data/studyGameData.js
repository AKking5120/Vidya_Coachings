import { EXTRA_QUESTIONS } from './studyGameExtra';

export const STUDY_LEVELS = [
  { id: 'primary', label: 'Class 1–8', icon: 'fas fa-child', color: 'orange' },
  { id: 'secondary', label: 'Class 9–10', icon: 'fas fa-book-open', color: 'blue' },
  { id: 'senior', label: 'Class 11–12', icon: 'fas fa-user-graduate', color: 'purple' },
];

export const STUDY_SUBJECTS = [
  { id: 'math', label: 'Math', icon: 'fas fa-calculator' },
  { id: 'science', label: 'Science', icon: 'fas fa-flask' },
  { id: 'english', label: 'English', icon: 'fas fa-language' },
  { id: 'gk', label: 'GK', icon: 'fas fa-globe-asia' },
];

function mergeQuestions(base, extra) {
  const merged = { primary: {}, secondary: {}, senior: {} };
  for (const level of ['primary', 'secondary', 'senior']) {
    for (const subject of ['math', 'science', 'english', 'gk']) {
      merged[level][subject] = [
        ...(base[level]?.[subject] || []),
        ...(extra[level]?.[subject] || []),
      ];
    }
  }
  return merged;
}

const BASE_QUESTIONS = {
  primary: {
    math: [
      { q: 'What is 15 + 27?', options: ['32', '42', '52', '62'], answer: 1 },
      { q: 'How many sides does a triangle have?', options: ['2', '3', '4', '5'], answer: 1 },
      { q: 'What is 8 × 7?', options: ['54', '56', '58', '64'], answer: 1 },
      { q: 'Which is the largest: 0.5, 0.05, 0.55?', options: ['0.5', '0.05', '0.55', 'All equal'], answer: 2 },
      { q: 'A week has how many days?', options: ['5', '6', '7', '8'], answer: 2 },
      { q: 'What is half of 48?', options: ['22', '24', '26', '28'], answer: 1 },
      { q: 'How many cm in 1 metre?', options: ['10', '100', '1000', '50'], answer: 1 },
      { q: 'What is 100 − 37?', options: ['53', '63', '73', '83'], answer: 1 },
      { q: 'Which shape has 4 equal sides?', options: ['Rectangle', 'Square', 'Triangle', 'Circle'], answer: 1 },
      { q: 'What is 9² (9 squared)?', options: ['18', '72', '81', '99'], answer: 2 },
    ],
    science: [
      { q: 'Plants make food by which process?', options: ['Respiration', 'Photosynthesis', 'Digestion', 'Evaporation'], answer: 1 },
      { q: 'Which gas do we breathe in?', options: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen'], answer: 1 },
      { q: 'The Sun is a ___?', options: ['Planet', 'Star', 'Moon', 'Comet'], answer: 1 },
      { q: 'Water boils at ___ °C?', options: ['50', '100', '150', '0'], answer: 1 },
      { q: 'Which organ pumps blood?', options: ['Brain', 'Lungs', 'Heart', 'Liver'], answer: 2 },
      { q: 'Sound cannot travel through ___?', options: ['Air', 'Water', 'Vacuum', 'Wood'], answer: 2 },
      { q: 'Which is a renewable source of energy?', options: ['Coal', 'Petrol', 'Solar', 'Diesel'], answer: 2 },
      { q: 'Human body has how many bones (approx)?', options: ['106', '206', '306', '406'], answer: 1 },
      { q: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], answer: 1 },
      { q: 'Rainwater is ___ water?', options: ['Fresh', 'Salt', 'Dirty', 'Hot'], answer: 0 },
    ],
    english: [
      { q: 'Choose the correct spelling:', options: ['Recieve', 'Receive', 'Receve', 'Receeve'], answer: 1 },
      { q: 'Opposite of "hot" is ___?', options: ['Warm', 'Cold', 'Cool', 'Heat'], answer: 1 },
      { q: 'Which is a noun?', options: ['Run', 'Beautiful', 'School', 'Quickly'], answer: 2 },
      { q: 'Past tense of "go" is ___?', options: ['Goed', 'Gone', 'Went', 'Going'], answer: 2 },
      { q: 'Synonym of "happy" is ___?', options: ['Sad', 'Joyful', 'Angry', 'Tired'], answer: 1 },
      { q: 'How many vowels in English alphabet?', options: ['4', '5', '6', '7'], answer: 1 },
      { q: '"She ___ to school daily." (correct verb)', options: ['go', 'goes', 'going', 'gone'], answer: 1 },
      { q: 'Plural of "child" is ___?', options: ['Childs', 'Children', 'Childes', 'Child'], answer: 1 },
      { q: 'Which is an adjective?', options: ['Jump', 'Tall', 'Quickly', 'And'], answer: 1 },
      { q: 'Antonym of "begin" is ___?', options: ['Start', 'End', 'Open', 'First'], answer: 1 },
    ],
    gk: [
      { q: 'Capital of India is ___?', options: ['Mumbai', 'New Delhi', 'Kolkata', 'Chennai'], answer: 1 },
      { q: 'National animal of India is ___?', options: ['Lion', 'Tiger', 'Elephant', 'Peacock'], answer: 1 },
      { q: 'How many states in India (approx)?', options: ['28', '29', '30', '36'], answer: 0 },
      { q: 'Who is known as the Father of the Nation?', options: ['Nehru', 'Gandhi', 'Patel', 'Bose'], answer: 1 },
      { q: 'Independence Day is celebrated on ___?', options: ['26 Jan', '15 Aug', '2 Oct', '14 Nov'], answer: 1 },
      { q: 'National bird of India is ___?', options: ['Parrot', 'Peacock', 'Eagle', 'Sparrow'], answer: 1 },
      { q: 'Which river is longest in India?', options: ['Yamuna', 'Ganga', 'Godavari', 'Narmada'], answer: 1 },
      { q: 'Republic Day is on ___?', options: ['15 Aug', '26 Jan', '2 Oct', '5 Sep'], answer: 1 },
      { q: 'Currency of India is ___?', options: ['Dollar', 'Rupee', 'Euro', 'Pound'], answer: 1 },
      { q: 'Which festival is called the festival of lights?', options: ['Holi', 'Diwali', 'Eid', 'Christmas'], answer: 1 },
    ],
  },
  secondary: {
    math: [
      { q: 'Value of √144 is ___?', options: ['10', '11', '12', '14'], answer: 2 },
      { q: 'If x² = 49, then x = ___?', options: ['±5', '±6', '±7', '±8'], answer: 2 },
      { q: 'Area of circle = πr². If r=7, area ≈?', options: ['154', '44', '22', '77'], answer: 0 },
      { q: 'Sum of angles in a triangle is ___°?', options: ['90', '180', '270', '360'], answer: 1 },
      { q: 'HCF of 12 and 18 is ___?', options: ['3', '6', '9', '12'], answer: 1 },
      { q: 'LCM of 4 and 6 is ___?', options: ['6', '12', '24', '18'], answer: 1 },
      { q: 'Slope formula: (y₂−y₁)/(x₂−x₁). Slope of (2,3) to (4,7)?', options: ['1', '2', '3', '4'], answer: 1 },
      { q: 'sin 30° = ___?', options: ['0', '1/2', '√3/2', '1'], answer: 1 },
      { q: 'Probability of getting head in a fair coin toss?', options: ['1/4', '1/3', '1/2', '1'], answer: 2 },
      { q: 'If 3x + 5 = 20, then x = ___?', options: ['3', '5', '7', '15'], answer: 1 },
    ],
    science: [
      { q: 'Unit of electric current is ___?', options: ['Volt', 'Ampere', 'Ohm', 'Watt'], answer: 1 },
      { q: 'Chemical formula of water is ___?', options: ['CO₂', 'H₂O', 'O₂', 'NaCl'], answer: 1 },
      { q: 'Speed = distance / ___?', options: ['Time', 'Mass', 'Force', 'Area'], answer: 0 },
      { q: 'Which lens is used to correct myopia?', options: ['Convex', 'Concave', 'Bifocal', 'Cylindrical'], answer: 1 },
      { q: 'pH of pure water is ___?', options: ['0', '7', '14', '10'], answer: 1 },
      { q: 'Mitochondria is called ___ of the cell?', options: ['Brain', 'Powerhouse', 'Wall', 'Nucleus'], answer: 1 },
      { q: 'Ohm\'s law: V = ___?', options: ['I/R', 'IR', 'R/I', 'I+R'], answer: 1 },
      { q: 'Metal that is liquid at room temperature?', options: ['Iron', 'Mercury', 'Gold', 'Silver'], answer: 1 },
      { q: 'Greenhouse gas mainly responsible for global warming?', options: ['Oxygen', 'CO₂', 'Nitrogen', 'Helium'], answer: 1 },
      { q: 'Human blood group discovered by ___?', options: ['Darwin', 'Landsteiner', 'Pasteur', 'Newton'], answer: 1 },
    ],
    english: [
      { q: 'Figure of speech: "He is a lion in battle" is ___?', options: ['Simile', 'Metaphor', 'Personification', 'Hyperbole'], answer: 1 },
      { q: 'Active voice of "The ball was thrown by Ram"?', options: ['Ram throws the ball', 'Ram threw the ball', 'Ram has thrown', 'Ram will throw'], answer: 1 },
      { q: 'Correct: "Neither of the boys ___ present."', options: ['are', 'were', 'was', 'have been'], answer: 2 },
      { q: 'Antonym of "abundant" is ___?', options: ['Plenty', 'Scarce', 'Full', 'Rich'], answer: 1 },
      { q: 'A group of lions is called ___?', options: ['Herd', 'Pride', 'Pack', 'Flock'], answer: 1 },
      { q: '"To burn the midnight oil" means ___?', options: ['Waste oil', 'Study/work late', 'Cook at night', 'Sleep early'], answer: 1 },
      { q: 'Which is a conjunction?', options: ['Quickly', 'Because', 'Happy', 'Run'], answer: 1 },
      { q: 'Direct speech: He said, "I am tired." Indirect?', options: ['He said he is tired', 'He said he was tired', 'He says he was tired', 'He said I am tired'], answer: 1 },
      { q: 'Synonym of "diligent" is ___?', options: ['Lazy', 'Hardworking', 'Slow', 'Weak'], answer: 1 },
      { q: 'Correct plural: "Criterion" → ___?', options: ['Criterions', 'Criteria', 'Criterias', 'Criterion'], answer: 1 },
    ],
    gk: [
      { q: 'First Prime Minister of India?', options: ['Gandhi', 'Nehru', 'Patel', 'Bose'], answer: 1 },
      { q: 'UN headquarters is in ___?', options: ['London', 'New York', 'Paris', 'Geneva'], answer: 1 },
      { q: 'Largest planet in our solar system?', options: ['Saturn', 'Jupiter', 'Neptune', 'Earth'], answer: 1 },
      { q: 'Constitution of India was adopted in ___?', options: ['1947', '1950', '1952', '1949'], answer: 1 },
      { q: 'Which gas is most abundant in atmosphere?', options: ['Oxygen', 'Nitrogen', 'CO₂', 'Hydrogen'], answer: 1 },
      { q: 'Nobel Prize is given in memory of Alfred Nobel from ___?', options: ['Germany', 'Sweden', 'USA', 'UK'], answer: 1 },
      { q: 'Gateway of India is in ___?', options: ['Delhi', 'Mumbai', 'Kolkata', 'Chennai'], answer: 1 },
      { q: 'World Environment Day is on ___?', options: ['5 June', '22 April', '8 March', '1 May'], answer: 0 },
      { q: 'Largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], answer: 2 },
      { q: 'Indian Parliament has two houses: Lok Sabha and ___?', options: ['Vidhan Sabha', 'Rajya Sabha', 'Panchayat', 'Assembly'], answer: 1 },
    ],
  },
  senior: {
    math: [
      { q: 'Derivative of x³ is ___?', options: ['x²', '2x²', '3x²', '3x'], answer: 2 },
      { q: '∫ 2x dx = ___?', options: ['x²', 'x² + C', '2x²', 'x + C'], answer: 1 },
      { q: 'Determinant of |2 0; 0 3| is ___?', options: ['5', '6', '0', '1'], answer: 1 },
      { q: 'cos²θ + sin²θ = ___?', options: ['0', '1', '2', 'θ'], answer: 1 },
      { q: 'If A = {1,2,3}, number of subsets is ___?', options: ['6', '7', '8', '9'], answer: 2 },
      { q: 'Limit of (sin x)/x as x→0 is ___?', options: ['0', '1', '∞', 'undefined'], answer: 1 },
      { q: 'Sum of first n natural numbers = ___?', options: ['n(n+1)/2', 'n²', 'n(n-1)/2', '2n'], answer: 0 },
      { q: 'Matrix multiplication AB is defined when cols of A = rows of ___?', options: ['A', 'B', 'C', 'I'], answer: 1 },
      { q: 'Probability of drawing a red card from standard deck?', options: ['1/4', '1/2', '1/3', '1/13'], answer: 1 },
      { q: 'log₁₀ 100 = ___?', options: ['1', '2', '10', '100'], answer: 1 },
    ],
    science: [
      { q: 'Newton\'s 2nd law: F = ___?', options: ['mv', 'ma', 'mg', 'm/a'], answer: 1 },
      { q: 'Ideal gas equation: PV = ___?', options: ['nRT', 'nR/T', 'RT/P', 'P/nT'], answer: 0 },
      { q: 'Unit of Planck\'s constant (h) includes ___?', options: ['kg·m²/s', 'J·s', 'Both A and B', 'N/m'], answer: 2 },
      { q: 'Benzene molecular formula is ___?', options: ['C₆H₆', 'C₆H₁₂', 'C₇H₈', 'CH₄'], answer: 0 },
      { q: 'DNA double helix was discovered by Watson and ___?', options: ['Darwin', 'Crick', 'Mendel', 'Pasteur'], answer: 1 },
      { q: 'Snell\'s law relates angle of incidence and ___?', options: ['Reflection', 'Refraction', 'Diffraction', 'Polarization'], answer: 1 },
      { q: 'Faraday\'s law is related to ___?', options: ['Gravity', 'Electromagnetic induction', 'Thermodynamics', 'Optics'], answer: 1 },
      { q: 'pH < 7 means solution is ___?', options: ['Basic', 'Acidic', 'Neutral', 'Salt'], answer: 1 },
      { q: 'Half-life is time for ___ of radioactive substance to decay?', options: ['Quarter', 'Half', 'Full', 'Double'], answer: 1 },
      { q: 'Mendel is father of ___?', options: ['Evolution', 'Genetics', 'Ecology', 'Anatomy'], answer: 1 },
    ],
    english: [
      { q: 'Shakespeare wrote ___?', options: ['Paradise Lost', 'Hamlet', 'Pride and Prejudice', 'Gitanjali'], answer: 1 },
      { q: '"All the world\'s a stage" is from ___?', options: ['Macbeth', 'As You Like It', 'Othello', 'King Lear'], answer: 1 },
      { q: 'Antonym of "ephemeral" is ___?', options: ['Brief', 'Permanent', 'Weak', 'Hidden'], answer: 1 },
      { q: 'Correct: "The committee ___ divided in opinion."', options: ['are', 'were', 'is', 'have'], answer: 2 },
      { q: 'Literary device in "The wind whispered" is ___?', options: ['Simile', 'Metaphor', 'Personification', 'Irony'], answer: 2 },
      { q: 'Author of "Discovery of India"?', options: ['Gandhi', 'Nehru', 'Tagore', 'Ambedkar'], answer: 1 },
      { q: 'A sonnet has ___ lines traditionally?', options: ['12', '14', '16', '20'], answer: 1 },
      { q: 'Synonym of "ubiquitous" is ___?', options: ['Rare', 'Everywhere', 'Hidden', 'Ancient'], answer: 1 },
      { q: '"To call a spade a spade" means ___?', options: ['Garden work', 'Speak frankly', 'Be rude', 'Dig deep'], answer: 1 },
      { q: 'Passive: "They will finish the work." → ___?', options: ['The work will be finished', 'The work is finished', 'The work was finished', 'The work has finished'], answer: 0 },
    ],
    gk: [
      { q: 'Article 370 was related to which state/UT?', options: ['Punjab', 'J&K', 'Assam', 'Goa'], answer: 1 },
      { q: 'GST was implemented in India in ___?', options: ['2015', '2016', '2017', '2018'], answer: 2 },
      { q: 'Longest river in the world?', options: ['Amazon', 'Nile', 'Ganga', 'Yangtze'], answer: 1 },
      { q: 'WHO headquarters is in ___?', options: ['Paris', 'Geneva', 'New York', 'London'], answer: 1 },
      { q: 'First woman IPS officer of India?', options: ['Kiran Bedi', 'Indira Gandhi', 'Sushma Swaraj', 'Kalpana Chawla'], answer: 0 },
      { q: 'Mangalyaan was launched by ___?', options: ['NASA', 'ISRO', 'ESA', 'SpaceX'], answer: 1 },
      { q: 'RBI was established in ___?', options: ['1935', '1947', '1950', '1969'], answer: 0 },
      { q: 'Largest democracy in the world?', options: ['USA', 'India', 'UK', 'Brazil'], answer: 1 },
      { q: 'Chipko Movement is related to ___?', options: ['Water', 'Forests', 'Air', 'Soil'], answer: 1 },
      { q: 'Nobel Peace Prize 2014 was won by ___?', options: ['Gandhi', 'Malala Yousafzai', 'Obama', 'Mandela'], answer: 1 },
    ],
  },
};

export const QUIZ_QUESTIONS = mergeQuestions(BASE_QUESTIONS, EXTRA_QUESTIONS);

export function getQuestionCount(level, subject) {
  return QUIZ_QUESTIONS[level]?.[subject]?.length || 0;
}

export function getQuestions(level, subject, count = 10) {
  const pool = QUIZ_QUESTIONS[level]?.[subject] || [];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getScoreMessage(percent) {
  if (percent >= 90) return { text: 'Outstanding! 🏆', sub: 'You are a star student!' };
  if (percent >= 70) return { text: 'Great job! ⭐', sub: 'Keep practising to reach the top!' };
  if (percent >= 50) return { text: 'Good effort! 📚', sub: 'Revise and try again to improve.' };
  return { text: 'Keep learning! 💪', sub: 'Practice makes perfect — try once more!' };
}
