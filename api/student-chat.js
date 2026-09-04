/**
 * Vercel serverless — proxies to Google Gemini (free tier) for student doubts.
 * Set GEMINI_API_KEY in Vercel env (get free key: https://aistudio.google.com/apikey)
 */

const SYSTEM_PROMPT = `You are Vidya Study Buddy, a friendly tutor for students at Vidya Coachings tuition centre in Badarpur & Jaitpur, Delhi (Class 1 to 12).

Rules:
- Answer study doubts clearly in simple Hinglish (natural mix of Hindi and English).
- Keep answers concise: usually 80–180 words. Use short paragraphs or bullet points.
- For Math: show step-by-step solution. For Science: use simple real-life examples.
- For English/GK: explain in easy language suitable for school students.
- If the question is about admission, fees, timings, or contact — briefly answer and say they can also WhatsApp Vidya Coachings at +91 98717 49012.
- Do NOT help cheat on live exams or share inappropriate content.
- If unsure, say "Yeh topic detail mein teacher se poochna better hoga" and encourage asking in class.
- End with encouragement when helpful.`;

const MODELS = ['gemini-flash-latest', 'gemini-3.5-flash-lite', 'gemini-3.6-flash'];

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

async function callGemini(apiKey, message, history) {
  const contents = [];

  for (const item of history.slice(-8)) {
    if (!item?.text?.trim()) continue;
    contents.push({
      role: item.role === 'user' ? 'user' : 'model',
      parts: [{ text: item.text.trim() }],
    });
  }

  contents.push({
    role: 'user',
    parts: [{ text: message.trim() }],
  });

  const body = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents,
    generationConfig: {
      maxOutputTokens: 700,
      temperature: 0.65,
    },
  };

  let lastError = null;

  for (const model of MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        lastError = data?.error?.message || `Gemini ${model} failed (${response.status})`;
        continue;
      }

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (text) return { text, model };
      lastError = 'Empty response from AI';
    } catch (err) {
      lastError = err.message;
    }
  }

  throw new Error(lastError || 'AI unavailable');
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'AI not configured',
      hint: 'Add GEMINI_API_KEY in Vercel environment variables',
    });
  }

  const { message, history = [] } = req.body || {};

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (message.length > 800) {
    return res.status(400).json({ error: 'Message too long (max 800 characters)' });
  }

  try {
    const result = await callGemini(apiKey, message, Array.isArray(history) ? history : []);
    return res.status(200).json({ text: result.text, source: 'ai' });
  } catch (err) {
    console.error('student-chat error:', err.message);
    return res.status(502).json({
      error: 'AI request failed',
      message: err.message,
    });
  }
}
