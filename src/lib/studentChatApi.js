/**
 * Client API for AI doubt solving (via Vercel serverless → Gemini free tier).
 */

export async function askStudyBuddyAI(message, history = []) {
  const response = await fetch('/api/student-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      history: history.map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        text: m.text,
      })),
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const err = new Error(data.message || data.error || 'AI request failed');
    err.status = response.status;
    err.code = data.error;
    throw err;
  }

  return data.text;
}

export function isAiConfiguredHint(error) {
  return error?.status === 503 || error?.code === 'AI not configured';
}
