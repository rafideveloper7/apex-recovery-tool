const ChatMessage = require('../models/ChatMessage');
const catchAsync = require('../utils/catchAsync');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const geminiAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// OpenRouter SDK (falls back to raw fetch if not installed)
let openRouterClient = null;
let openRouterChatCreate = null;
try {
  const sdk = require('@openrouter/sdk');
  openRouterClient = new sdk.OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY || '',
    httpReferer: process.env.CORS_ORIGIN?.split(',')[0] || 'http://localhost:3000',
    appTitle: 'Apex Recovery',
  });
  openRouterChatCreate = sdk.chat.create;
} catch (e) {
  console.log('ℹ️ @openrouter/sdk not installed, using raw fetch for OpenRouter.');
}


const SYSTEM_PROMPT = `You are Apex Recovery AI — a world-class burnout recovery advisor and occupational wellness coach. You combine the latest evidence from neuroscience, occupational psychology, sleep science, HRV research, and real-world workplace coaching.

You help people with ANY wellness or life challenge — burnout, workplace stress, anxiety, sleep issues, difficult relationships, toxic managers, financial stress, grief, life transitions, productivity, performance, motivation, physical health habits, nutrition basics, exercise for mental health, and any human struggle.

Core principles when responding:

1. ALWAYS validate their experience first — acknowledge what they're feeling before giving any advice. Make them feel heard.

2. Give SPECIFIC, ACTIONABLE advice — never vague. Be concrete:
   - Bad: "get more sleep" 
   - Good: "Tonight, set a phone alarm for 9:15pm that says 'START WIND-DOWN'. Put your phone in another room. Lights dim. Target: in bed by 10pm, lights off by 10:30pm."

3. Use specific time frames: "tonight", "in the next 2 hours", "this week by Wednesday"

4. Reference concrete, named techniques: box breathing (4-4-4-4), progressive muscle relaxation, 5-4-3-2-1 grounding, the Pomodoro method, cognitive defusion, the WRAP plan, polyvagal theory exercises, etc.

5. If someone mentions severe symptoms (suicidal thoughts, inability to function, medical symptoms), respond with compassion and gently guide them toward professional support — while still providing immediate practical help.

6. Be warm, direct, and human — like a brilliant friend who happens to be an expert. Not clinical. Not preachy. Not corporate wellness.

7. Never say "it's important to", "you should consider", or "it might be helpful". Just say what to do.

8. Format responses cleanly with line breaks. Use **bold** for key actions. Keep under 320 words unless genuinely complex. Don't use bullet points — write in a natural, conversational flow.

9. For burnout-specific questions: reference Apex Recovery's signal tracking (sleep, HRV, screen time, output, mood) as a tool to measure recovery progress.

10. You can discuss: burnout, stress, anxiety, depression signs, sleep disorders, workplace conflict, toxic relationships, grief, life transitions, productivity, performance, motivation, physical health habits, nutrition basics, exercise for mental health, and any human struggle.

You are never dismissive, never rushed, always genuinely present. Treat every message as if it comes from someone who really needs to be heard right now.`;

const MODEL = (process.env.OPENROUTER_MODEL || 'openrouter/free').trim();
const FALLBACK_MODEL = (process.env.OPENROUTER_FALLBACK_MODEL || 'google/gemma-4-31b-it:free').trim();

const chatWithAI = catchAsync(async (req, res) => {
  const { messages, system } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request: messages array required' });
  }

  if (!process.env.GROQ_API_KEY && !process.env.GEMINI_API_KEY && !process.env.OPENROUTER_API_KEY) {
    return res.status(500).json({
      error: 'No AI API key configured. Set GROQ_API_KEY, GEMINI_API_KEY, or OPENROUTER_API_KEY in .env.'
    });
  }

  try {
    let replyText = 'I am here with you. Can you tell me more?';
    const finalSystem = system || SYSTEM_PROMPT;

    if (process.env.AI_PROVIDER === 'gemini' && geminiAI) {
      // Gemini API call
      const model = geminiAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-pro' });
      const history = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      if (finalSystem) {
        history.unshift({ role: 'user', parts: [{ text: finalSystem }] });
        history.unshift({ role: 'model', parts: [{ text: 'Okay, I understand. I will act as Apex Recovery AI.' }] });
      }

      const result = await model.startChat({ history }).sendMessage(messages[messages.length - 1].content);
      const response = await result.response;
      replyText = response.text();

} else if (process.env.AI_PROVIDER === 'openrouter') {
      if (!process.env.OPENROUTER_API_KEY) {
        return res.status(500).json({ error: 'OpenRouter API key not configured. Set OPENROUTER_API_KEY in .env.' });
      }

      const callModel = async (modelSlug) => {
        const payload = {
          model: modelSlug,
          max_tokens: 1000,
          messages: (finalSystem ? [{ role: 'system', content: finalSystem }] : []).concat(messages),
        };

        let data;
        if (openRouterChatCreate) {
          const res = await openRouterChatCreate(openRouterClient, {
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
          });
          if (!res.ok) {
            const errBody = await res.text();
            throw { status: res.status, body: errBody };
          }
          data = await res.json();
        } else {
          const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
              'HTTP-Referer': process.env.CORS_ORIGIN?.split(',')[0] || 'http://localhost:3000',
              'X-OpenRouter-Title': 'Apex Recovery',
            },
            body: JSON.stringify(payload),
          });

          if (!orRes.ok) {
            const errBody = await orRes.text();
            throw { status: orRes.status, body: errBody };
          }
          data = await orRes.json();
        }

        replyText = data?.choices?.[0]?.message?.content;
        if (!replyText) {
          console.error('OpenRouter unexpected response for model', modelSlug, JSON.stringify(data));
          throw { status: 500, body: 'Empty response' };
        }
      };

      try {
        await callModel(MODEL);
      } catch (err) {
        const isModelError = err.status === 404 || /No endpoints found/i.test(err.body || '');
        if (!isModelError) {
          console.error('OpenRouter error:', err.status, err.body);
          return res.status(err.status || 500).json({ error: `OpenRouter error ${err.status || 500}` });
        }
        console.warn('Primary OpenRouter model unavailable, falling back to', FALLBACK_MODEL);
        try {
          await callModel(FALLBACK_MODEL);
        } catch (fallbackErr) {
          console.error('OpenRouter fallback failed:', fallbackErr.status, fallbackErr.body);
          return res.status(502).json({ error: 'AI is temporarily unavailable. Please try again shortly.' });
        }
      }
    }
    
    if (req.user) {
      const chatSession = new ChatMessage({
        userId: req.user._id,
        messages: [
          ...messages.map(m => ({ role: m.role, content: m.content })),
          { role: 'assistant', content: replyText }
        ]
      });
      await chatSession.save();
    }

    res.json({ content: [{ type: 'text', text: replyText }] });
  } catch (err) {
    console.error('Server fetch error:', err.message);
    res.status(500).json({ error: 'Server encountered an issue. Please try again later.' });
  }
});

const getUserChatHistory = catchAsync(async (req, res) => {
  const chats = await ChatMessage.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);
  res.json({ success: true, chats });
});

module.exports = { chatWithAI, getUserChatHistory };