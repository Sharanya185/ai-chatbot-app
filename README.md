# AI Chatbot — React Native (Expo)

A mobile AI chatbot built with React Native and Expo. Users can chat with an
AI assistant (OpenAI or Gemini), messages persist locally between sessions,
and the app shows loading and error states cleanly.

## Features

- Clean, mobile-first chat UI (message bubbles, timestamps, auto-scroll)
- AI integration — works with **OpenAI** (`gpt-4o-mini`) or **Google Gemini**
  (`gemini-1.5-flash`), switchable with one config line
- Chat history persistence using `AsyncStorage` (survives app restarts)
- Loading indicator (animated "typing" dots) while waiting for a reply
- Error handling — network/API failures show an inline error banner instead
  of crashing the app
- "Clear" button to wipe the conversation
- Empty-state screen on first launch

## Tech Stack / Third-Party Libraries

| Library | Purpose |
|---|---|
| `expo` | React Native tooling & runtime, makes it runnable via Expo Go with no native build setup |
| `react-native` | Core mobile framework |
| `@react-native-async-storage/async-storage` | Local persistence of chat history |
| OpenAI Chat Completions API (or Gemini API) | The AI model powering responses |

No other UI libraries are used — all components (bubbles, input bar, typing
indicator) are hand-built with `StyleSheet` to keep the app lightweight and
dependency-free.

## Project Structure

```
ai-chatbot-app/
├── App.js                       # Entry point
├── app.json                     # Expo config
├── src/
│   ├── screens/
│   │   └── ChatScreen.js        # Main screen: state, send logic, persistence
│   ├── components/
│   │   ├── MessageBubble.js     # Single chat message
│   │   ├── ChatInput.js         # Text input + send button
│   │   └── TypingIndicator.js   # Animated "AI is typing" indicator
│   ├── services/
│   │   ├── aiService.js         # Calls OpenAI / Gemini API
│   │   └── storageService.js    # AsyncStorage read/write/clear
│   ├── config/
│   │   └── config.js            # API keys, model names, system prompt
│   └── theme/
│       └── colors.js            # Shared color tokens
```

This separation (screens / components / services / config) keeps UI, business
logic, and API calls independent, so swapping the AI provider or storage
backend later doesn't require touching the UI code.

## Setup Instructions (from scratch)

You said you're not sure Node/Expo is set up — follow these steps in order.

### 1. Install Node.js
Download and install the **LTS version** from https://nodejs.org (v18 or v20
recommended). Verify it worked:
```bash
node -v
npm -v
```

### 2. Install the Expo Go app on your phone
- Android: [Expo Go on Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
- iOS: [Expo Go on the App Store](https://apps.apple.com/app/expo-go/id982107779)

You do **not** need Android Studio or Xcode for this — Expo Go lets you run
the app on your real phone instantly by scanning a QR code.

### 3. Get the project and install dependencies
Unzip the project, then in a terminal:
```bash
cd ai-chatbot-app
npm install
```

### 4. Add your AI API key
Open `src/config/config.js` and paste your key:
```js
export const OPENAI_API_KEY = 'sk-...your key here...';
```
Get a free/paid OpenAI key at https://platform.openai.com/api-keys, or if you
prefer Gemini, set `AI_PROVIDER = 'gemini'` and paste a key from
https://aistudio.google.com/app/apikey instead.

### 5. Run it
```bash
npx expo start
```
This opens a terminal QR code. Scan it with the Expo Go app (Android: use the
in-app scanner; iOS: use the Camera app) — the chatbot will load on your
phone in a few seconds.

Alternatively, press `w` in the terminal to open it in a browser tab for a
quick check.

## Security Note

For this assignment, the API key lives in `config.js` for simplicity. In a
real production app, API keys must **never** ship inside the client bundle —
route requests through your own backend/serverless proxy that holds the key
server-side instead.

## Known Limitations

- No user authentication — single local conversation per device
- No streaming responses (replies appear once fully generated, not
  token-by-token)
- History is stored per-device only, not synced across devices
