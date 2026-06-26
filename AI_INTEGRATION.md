# Apex Recovery — AI Integration Guide

## Overview
The AI advisor runs entirely server-side. The frontend never touches API keys. All provider selection, fallback logic, and prompt engineering happen in the backend.

---

## 1. API Keys & Environment Variables

| Variable | Purpose | Location |
|----------|---------|----------|
| `GROQ_API_KEY` | Groq inference (Llama, Mixtral, etc.) | `backend/.env` |
| `GEMINI_API_KEY` | Google Gemini inference | `backend/.env` |
| `OPENROUTER_API_KEY` | OpenRouter gateway (200+ models) | `backend/.env` |
| `AI_PROVIDER` | Which provider the backend calls | `backend/.env` |
| `OPENROUTER_MODEL` | Primary model slug (e.g. `openrouter/free`) | `backend/.env` |
| `OPENROUTER_FALLBACK_MODEL` | Fallback model if primary 404s | `backend/.env` |
| `NEXT_PUBLIC_BACKEND_URL` | Frontend -> backend target | `frontend/.env.local` |

**Security rule:** API keys exist ONLY in `backend/.env`. The frontend `.env.local` contains zero secrets.

---

## 2. Data Flow

```
User Message (Frontend)
    ↓ POST /api/chat
Express Route (backend/src/routes/chatRoutes.js)
    ↓ calls
chatWithAI() (backend/src/controllers/chatController.js)
    ↓ selects provider
AI Provider API (Groq / Gemini / OpenRouter)
    ↓ returns text
Backend saves ChatMessage (MongoDB)
    ↓ JSON response
Frontend renders assistant bubble (AIChat.js)
```

### Request Payload
```json
{
  "messages": [
    { "role": "user", "content": "I can't sleep" },
    { "role": "assistant", "content": "..." }
  ]
}
```

### Response Payload
```json
{
  "content": [
    { "type": "text", "text": "Tonight, set an alarm for 9:15pm..." }
  ]
}
```

---

## 3. Provider Selection Logic

Located in `backend/src/controllers/chatController.js`:

1. **Gemini** — used if `AI_PROVIDER=gemini` and `GEMINI_API_KEY` is set.
   - Model: `gemini-pro` (or `GEMINI_MODEL` override).
   - History is mapped to `{ role: 'user'|'model', parts: [{ text }] }`.
   - System prompt is injected as a `user` turn with a dummy `model` acknowledgment.

2. **OpenRouter** — used if `AI_PROVIDER=openrouter` (default) and `OPENROUTER_API_KEY` is set.
   - Prefers `@openrouter/sdk` if installed; falls back to raw `fetch`.
   - Sends `model`, `max_tokens`, `messages` (with `system` role prepended).
   - If the primary model returns 404 / "No endpoints found", automatically retries with `OPENROUTER_FALLBACK_MODEL`.
   - If both fail, returns HTTP 502.

3. **Groq** — available if `AI_PROVIDER=groq` and `GROQ_API_KEY` is set (not currently wired in the `else if` chain; add a branch when needed).

---

## 4. Model Configuration & Fallback

**Default config (from `.env`):**
```env
AI_PROVIDER=openrouter
OPENROUTER_MODEL=openrouter/free
OPENROUTER_FALLBACK_MODEL=google/gemma-4-31b-it:free
```

- `openrouter/free` is a meta-slug. OpenRouter selects an available free endpoint at runtime.
- If that endpoint is full/shut down, the system retries with `google/gemma-4-31b-it:free`.
- Max tokens: **2000** (raised from 1000 to prevent mid-sentence cutoff).
- The frontend does not choose the model. Swapping models is done by editing `backend/.env` and restarting the server.

---

## 5. System Prompt Design

Stored in `backend/src/controllers/chatController.js` as `SYSTEM_PROMPT`.

**Current behavior:**
- Validates user emotion first.
- Demands specific, time-bound actions and named techniques.
- Bans vague language ("it might be helpful").
- Caps length under 200 words.
- Enforces identity rules:
  - **"Who are you?"** → "I'm Apex Recovery AI — your burnout recovery and wellness advisor."
  - **"Who made you?"** → credits Rafi Ullah / `@rafideveloper7` only on direct creator inquiry.

**Why it changed (June 25, 2026):**
- Old prompt was ~500 words, eating the token budget and causing cut-off responses.
- Old prompt had typos and forced creator info on every response.
- New prompt is ~150 words, leaving room for complete answers.

---

## 6. File-by-File Connections

| File | Role |
|------|------|
| `frontend/.env.local` | Defines `NEXT_PUBLIC_BACKEND_URL`. No API keys here. |
| `frontend/src/components/AIChat.js` | Chat UI. Sends `messages` array to `POST ${backend}/chat`. Renders `response.data.content[0].text`. |
| `frontend/src/app/layout.js` | Root layout. Contains mobile nav and sidebar. |
| `frontend/src/app/page.js` | Dashboard home. |
| `frontend/src/styles/globals.css` | All component styling. |
| `backend/.env` | Secrets + model selection. Loaded by `dotenv.config({ path: './.env' })` in `backend/src/app.js`. |
| `backend/src/app.js` | Express app, CORS, JSON body parsing, mounts routes. |
| `backend/src/server.js` | Starts server, validates Groq/OpenRouter keys on boot. |
| `backend/src/routes/chatRoutes.js` | `POST /` → `chatWithAI`, `GET /history` → `getUserChatHistory` (auth required). |
| `backend/src/controllers/chatController.js` | Core AI logic: provider selection, prompt injection, fallback chain, DB save. |
| `backend/src/models/ChatMessage.js` | MongoDB schema for chat history. |
| `backend/src/middlewares/authMiddleware.js` | Protects `/api/chat/history`. |

---

## 7. Deployment Notes
deployed both pakages on vercel


## 8. Key Constraints
- API keys are **server-side only**.
- Frontend sends only user text and conversation history.
- Model selection requires a backend `.env` edit + server restart.
- Chat history is saved per user when authenticated (`req.user` exists).
