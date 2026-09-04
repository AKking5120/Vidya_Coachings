/**
 * Vercel serverless — proxies to Google Gemini (free tier) for student doubts.
 * Set GEMINI_API_KEY in Vercel env (get free key: https://aistudio.google.com/apikey)
 */

const SYSTEM_PROMPT = `You are Vidya Study Buddy for Vidya Coachings students (Class 1-12, Delhi).
Reply in simple Hinglish. Be SHORT: 60-120 words max.
Math: show key steps. Science: one simple example.
For admission/fees/contact mention WhatsApp +91 98717 49012.
No exam cheating. Encourage learning.`;

const PRIMARY_MODEL = 'gemini-flash-latest';
const FALLBACK_MODEL = 'gemini-3.5-flash-lite';
const REQUEST_TIMEOUT_MS = 12000;

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

async function fetchGemini(apiKey, model, body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const data = await response.json();
    return { ok: response.ok, status: response.status, data };
  } finally {
    clearTimeout(timer);
  }
}

async function callGemini(apiKey, message, history) {
  const contents = [];

  for (const item of history.slice(-4)) {
    if (!item?.text?.trim()) continue;
    contents.push({
      role: item.role === 'user' ? 'user' : 'model',
      parts: [{ text: item.text.trim().slice(0, 400) }],
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
      maxOutputTokens: 320,
      temperature: 0.4,
    },
  };

  const models = [PRIMARY_MODEL, FALLBACK_MODEL];
  let lastError = null;

  for (const model of models) {
    try {
      const { ok, status, data } = await fetchGemini(apiKey, model, body);

      if (!ok) {
        lastError = data?.error?.message || `Gemini ${model} failed (${status})`;
        if (status === 404 || status === 400) continue;
        if (status === 503 && model === PRIMARY_MODEL) continue;
        throw new Error(lastError);
      }

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (text) return { text, model };
      lastError = 'Empty response from AI';
    } catch (err) {
      if (err.name === 'AbortError') {
        throw new Error('Request timed out — please try again');
      }
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

  if (message.length > 500) {
    return res.status(400).json({ error: 'Message too long (max 500 characters)' });
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
