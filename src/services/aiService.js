import {
  AI_PROVIDER,
  OPENAI_API_KEY,
  OPENAI_ENDPOINT,
  OPENAI_MODEL,
  GEMINI_API_KEY,
  GEMINI_ENDPOINT,
  GEMINI_MODEL,
  SYSTEM_PROMPT,
} from '../config/config';

/**
 * Sends the full conversation to the configured AI provider and
 * returns the assistant's reply text.
 *
 * @param {Array<{role: 'user'|'assistant', content: string}>} messages
 * @returns {Promise<string>}
 */
export async function getAIResponse(messages) {
  if (AI_PROVIDER === 'gemini') {
    return callGemini(messages);
  }
  return callOpenAI(messages);
}

async function callOpenAI(messages) {
  if (!OPENAI_API_KEY || OPENAI_API_KEY.includes('YOUR_OPENAI')) {
    throw new Error(
      'Missing OpenAI API key. Add it in src/config/config.js before sending messages.'
    );
  }

  const payload = {
    model: OPENAI_MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
    temperature: 0.7,
  };

  const response = await fetch(OPENAI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errBody = await safeJson(response);
    throw new Error(
      errBody?.error?.message || `OpenAI request failed (${response.status})`
    );
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('OpenAI returned an empty response.');
  return text.trim();
}

async function callGemini(messages) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY.includes('YOUR_GEMINI')) {
    throw new Error(
      'Missing Gemini API key. Add it in src/config/config.js before sending messages.'
    );
  }

  const url = `${GEMINI_ENDPOINT}/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const payload = {
    contents,
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errBody = await safeJson(response);
    throw new Error(
      errBody?.error?.message || `Gemini request failed (${response.status})`
    );
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini returned an empty response.');
  return text.trim();
}

async function safeJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
