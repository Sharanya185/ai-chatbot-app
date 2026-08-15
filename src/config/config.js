// ---------------------------------------------------------------------------
// App configuration
//
// IMPORTANT: Never commit a real API key to a public GitHub repo.
// For this assignment, the simplest approach is to paste your key below for
// local testing. For anything beyond a demo, move this to a backend proxy
// (see README "Security Note") so the key never ships inside the app bundle.
// ---------------------------------------------------------------------------

export const AI_PROVIDER = 'gemini'; // 'openai' | 'gemini'

// Paste your OpenAI API key here for local testing only.
export const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY_HERE';
export const OPENAI_MODEL = 'gpt-4o-mini';
export const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

// Paste your Gemini API key here if you switch AI_PROVIDER to 'gemini'.
export const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';
export const GEMINI_MODEL = 'gemini-2.5-flash';
export const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models';

export const SYSTEM_PROMPT =
  'You are a friendly, concise AI assistant inside a mobile chat app. ' +
  'Keep answers helpful and to the point.';

export const STORAGE_KEY = '@ai_chatbot_history_v1';
