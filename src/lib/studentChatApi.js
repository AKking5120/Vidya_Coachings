/**
 * Client API for AI doubt solving (via Vercel serverless → Gemini free tier).
 */

export async function askStudyBuddyAI(message, history = []) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 14000);

  try {
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
      signal: controller.signal,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const err = new Error(data.message || data.error || 'AI request failed');
      err.status = response.status;
      err.code = data.error;
      throw err;
    }

    return data.text;
  } catch (err) {
    if (err.name === 'AbortError') {
      const timeoutErr = new Error('Response took too long — please try again');
      timeoutErr.status = 408;
      throw timeoutErr;
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export function isAiConfiguredHint(error) {
  return error?.status === 503 || error?.code === 'AI not configured';
}
