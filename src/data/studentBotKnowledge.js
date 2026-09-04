import { SITE } from './constants';

export const BOT_NAME = 'Vidya Study Buddy';

export const QUICK_PROMPTS = [
  { id: 'doubt', label: 'Doubt', text: 'Explain photosynthesis in simple words' },
  { id: 'admission', label: 'Admission', text: 'How do I take admission?' },
  { id: 'classes', label: 'Classes', text: 'Which classes do you teach?' },
  { id: 'branches', label: 'Branches', text: 'Where are your branches?' },
  { id: 'game', label: 'Study Game', text: 'Tell me about Study Game' },
  { id: 'tips', label: 'Study tips', text: 'Give me study tips' },
  { id: 'contact', label: 'Contact', text: 'How can I contact you?' },
];

const STUDY_TIPS = [
  'Roz 30 minute revision karo — consistency beats cramming.',
  'Padhai ke beech 5 minute break lo, focus better rehta hai.',
  'Difficult topics subah tackle karo jab mind fresh ho.',
  'Notes likho apne words mein — yaad rakhna easy hota hai.',
  'Study Game se roz 10 questions practice karo!',
  'Previous year questions solve karna board exam ke liye best hai.',
  'Group study mein ek topic explain karo — samajh aur strong hoti hai.',
  'Phone ko padhai time par silent rakho ya Study Game khelo instead!',
];

const BRANCHES = [
  'Vidya 1.0 — Jaitpur, Badarpur',
  'Vidya 2.0 (Main) — Ekta Vihar, Jaitpur Extension',
  'Branch 3.0 — Om Nagar, Jaitpur-Badarpur',
];

function normalize(text) {
  return text.toLowerCase().trim().replace(/\s+/g, ' ');
}

function includesAny(text, words) {
  return words.some((w) => text.includes(w));
}

function pickTip() {
  return STUDY_TIPS[Math.floor(Math.random() * STUDY_TIPS.length)];
}

function greetingReply() {
  return {
    text: `Namaste! Main ${BOT_NAME} hoon — Vidya Coachings ka student helper.\n\n✅ Padhai ke doubts solve karo (Math, Science, English…)\n✅ Admission, classes, branches — instant answers\n\nNeeche quick buttons try karo ya apna sawaal likho!`,
    actions: [
      { type: 'link', label: 'Play Study Game', href: '/study-game', icon: 'fas fa-gamepad' },
      { type: 'link', label: 'Admission Form', href: 'https://forms.gle/J7kSgvwpFc1261At5', external: true, icon: 'fas fa-file-alt' },
    ],
  };
}

const RULES = [
  {
    match: (t) => includesAny(t, ['hello', 'hi', 'hey', 'namaste', 'namaskar', 'hii', 'good morning', 'good evening']),
    reply: greetingReply,
  },
  {
    match: (t) => includesAny(t, ['admission', 'admit', 'join', 'enroll', 'enrol', 'form', 'daakhila', 'dakhila', 'register']),
    reply: () => ({
      text: `Admission ke liye:\n\n1. Online form bharo (Admission Query section)\n2. Ya WhatsApp par message karo\n3. Ya call karo: ${SITE.phone}\n\nHindi & English dono medium available hain. Demo class ke liye bhi contact karo!`,
      actions: [
        { type: 'link', label: 'Fill Form', href: 'https://forms.gle/J7kSgvwpFc1261At5', external: true, icon: 'fas fa-file-alt' },
        { type: 'whatsapp', label: 'WhatsApp', message: 'Hi, I want admission at Vidya Coachings', icon: 'fab fa-whatsapp' },
        { type: 'call', label: 'Call', icon: 'fas fa-phone' },
      ],
    }),
  },
  {
    match: (t) => includesAny(t, ['fee', 'fees', 'price', 'cost', 'kitna', 'charges', 'payment', 'monthly']),
    reply: () => ({
      text: `Fee structure class aur batch ke hisaab se alag hoti hai.\n\nExact fees aur offers ke liye humse seedha baat karo — team aapko best batch suggest karegi.\n\n📞 ${SITE.phone}\n📧 ${SITE.email}`,
      actions: [
        { type: 'whatsapp', label: 'Ask on WhatsApp', message: 'Hi, I want to know about fees at Vidya Coachings', icon: 'fab fa-whatsapp' },
        { type: 'call', label: 'Call Now', icon: 'fas fa-phone' },
      ],
    }),
  },
  {
    match: (t) => includesAny(t, ['class', 'classes', 'subject', 'subjects', 'padhai', 'course', 'program', 'sikhate', 'teach', 'medium', 'hindi', 'english', 'board', 'cbse']),
    reply: () => ({
      text: `Vidya Coachings mein:\n\n📚 Class 1 to 12 — All subjects\n🗣 Hindi & English medium\n🎯 Board prep (9th–12th)\n📖 CUET, CTET, KVS/NVS, BA/MA (IGNOU)\n💻 Offline & Online dono\n\nSubjects: Math, Science, English, SST, aur streams ke hisaab se.`,
      actions: [
        { type: 'link', label: 'Study Game', href: '/study-game', icon: 'fas fa-gamepad' },
        { type: 'link', label: 'Downloads', href: '/downloads', icon: 'fas fa-download' },
      ],
    }),
  },
  {
    match: (t) => includesAny(t, ['branch', 'branches', 'location', 'address', 'kahan', 'where', 'badarpur', 'jaitpur', 'map', 'direction']),
    reply: () => ({
      text: `Hamare 3 branches Badarpur & Jaitpur area mein:\n\n📍 ${BRANCHES.join('\n📍 ')}\n\nMain branch: Vidya 2.0, Ekta Vihar, Jaitpur Extension.`,
      actions: [
        { type: 'link', label: 'Contact & Map', href: '/#contact', icon: 'fas fa-map-marker-alt' },
        { type: 'whatsapp', label: 'Ask Directions', message: 'Hi, which Vidya Coachings branch is nearest to me?', icon: 'fab fa-whatsapp' },
      ],
    }),
  },
  {
    match: (t) => includesAny(t, ['timing', 'timings', 'time', 'hours', 'open', 'close', 'kab', 'schedule', 'batch']),
    reply: () => ({
      text: `Working hours: Monday – Saturday, 8 AM to 8 PM\n\nBatch timings class ke hisaab se alag hote hain (morning / evening). Exact slot ke liye call ya WhatsApp karo.`,
      actions: [
        { type: 'call', label: 'Call', icon: 'fas fa-phone' },
        { type: 'whatsapp', label: 'WhatsApp', message: 'Hi, what are the batch timings?', icon: 'fab fa-whatsapp' },
      ],
    }),
  },
  {
    match: (t) => includesAny(t, ['game', 'quiz', 'study game', 'leaderboard', 'score', 'khel', 'practice', 'mcq']),
    reply: () => ({
      text: `Study Game mein Math, Science, English aur GK ke quizzes hain!\n\n✅ Class 1–8, 9–10, 11–12\n✅ 10 questions, 30 sec each\n✅ Leaderboard par apna score save karo\n\nRoz practice karo aur top students mein aao!`,
      actions: [
        { type: 'link', label: 'Play Now', href: '/study-game', icon: 'fas fa-play' },
        { type: 'link', label: 'Leaderboard', href: '/leaderboard', icon: 'fas fa-trophy' },
      ],
    }),
  },
  {
    match: (t) => includesAny(t, ['tip', 'tips', 'study tip', 'padhai tip', 'focus', 'exam', 'revision', 'motivation', 'help me study']),
    reply: () => ({
      text: `💡 Study Tip:\n\n${pickTip()}`,
      actions: [
        { type: 'link', label: 'Practice Quiz', href: '/study-game', icon: 'fas fa-gamepad' },
        { type: 'prompt', label: 'Another tip', text: 'Give me another study tip', icon: 'fas fa-lightbulb' },
      ],
    }),
  },
  {
    match: (t) => includesAny(t, ['contact', 'phone', 'call', 'whatsapp', 'email', 'number', 'founder', 'amarpal', 'reach']),
    reply: () => ({
      text: `Contact Vidya Coachings:\n\n📞 ${SITE.phone}\n📧 ${SITE.email}\n👤 Founder: ${SITE.founder}\n📅 Established ${SITE.established}`,
      actions: [
        { type: 'whatsapp', label: 'WhatsApp', message: 'Hi Vidya Coachings!', icon: 'fab fa-whatsapp' },
        { type: 'call', label: 'Call', icon: 'fas fa-phone' },
        { type: 'link', label: 'Contact Page', href: '/#contact', icon: 'fas fa-envelope' },
      ],
    }),
  },
  {
    match: (t) => includesAny(t, ['download', 'notes', 'pdf', 'material', 'syllabus', 'paper']),
    reply: () => ({
      text: 'Study material aur downloads hamari Downloads page par available hain. Wahan se PDFs aur resources dekh sakte ho.',
      actions: [
        { type: 'link', label: 'Go to Downloads', href: '/downloads', icon: 'fas fa-download' },
      ],
    }),
  },
  {
    match: (t) => includesAny(t, ['teacher', 'teachers', 'faculty', 'sir', 'maam', 'staff']),
    reply: () => ({
      text: 'Hamare experienced teachers Class 1–12 aur competitive exams dono padhate hain. Teacher profiles homepage par Team section mein dekh sakte ho.',
      actions: [
        { type: 'link', label: "Teacher's Day", href: '/teachers-day', icon: 'fas fa-chalkboard-teacher' },
        { type: 'link', label: 'Home — Team', href: '/#team', icon: 'fas fa-users' },
      ],
    }),
  },
  {
    match: (t) => includesAny(t, ['online', 'offline', 'mode', 'class mode', 'ghar se']),
    reply: () => ({
      text: 'Vidya Coachings dono modes offer karti hai — Offline classes (Badarpur & Jaitpur) aur Online classes bhi available hain. Admission form mein apna preference batao.',
      actions: [
        { type: 'link', label: 'Admission Form', href: 'https://forms.gle/J7kSgvwpFc1261At5', external: true, icon: 'fas fa-file-alt' },
      ],
    }),
  },
  {
    match: (t) => includesAny(t, ['thank', 'thanks', 'dhanyavad', 'shukriya', 'bye', 'goodbye']),
    reply: () => ({
      text: 'Aapka swagat hai! Padhai mein best wishes — koi sawaal ho to yahin poochna. All the best! 🎓',
    }),
  },
];

export function getFaqResponse(userText) {
  const text = normalize(userText);
  if (!text) return { text: 'Kuch likh kar bhejo — main help karunga!' };

  for (const rule of RULES) {
    if (rule.match(text)) {
      const result = rule.reply(text);
      return typeof result === 'function' ? result() : result;
    }
  }

  return null;
}

export function getBotResponse(userText) {
  const faq = getFaqResponse(userText);
  if (faq) return faq;

  return {
    text: `Abhi AI doubt solver connect nahi hai. Admin ko GEMINI_API_KEY add karni hogi (free: aistudio.google.com/apikey).\n\nTab tak yeh try karo ya WhatsApp karo:`,
    actions: [
      { type: 'whatsapp', label: 'WhatsApp', message: userText, icon: 'fab fa-whatsapp' },
      { type: 'call', label: 'Call', icon: 'fas fa-phone' },
      { type: 'link', label: 'Study Game', href: '/study-game', icon: 'fas fa-gamepad' },
    ],
  };
}

export function getWelcomeMessage() {
  return greetingReply();
}
