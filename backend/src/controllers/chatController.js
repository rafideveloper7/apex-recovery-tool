const ChatMessage = require('../models/ChatMessage');
const catchAsync = require('../utils/catchAsync');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const geminiAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// Priority: OpenRouter > Gemini
const AI_PROVIDER = process.env.AI_PROVIDER || 'openrouter';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

// System prompt for Apex Recovery AI
const SYSTEM_PROMPT = `You are Apex Recovery AI, a burnout recovery advisor and occupational wellness coach.

You help with burnout, stress, anxiety, sleep issues, difficult relationships, toxic managers, financial stress, grief, life transitions, productivity, motivation, physical health, and nutrition basics.

Rules:
1. ALWAYS validate first — acknowledge their feelings before giving advice.
2. Give SPECIFIC, ACTIONABLE steps with exact times and named techniques (box breathing 4-4-4-4, 5-4-3-2-1 grounding, progressive muscle relaxation, Pomodoro, polyvagal exercises).
3. Never say "it's important to", "you should consider", or "it might be helpful". Just tell them what to do.
4. Be warm and direct — like a brilliant friend, not a textbook.
5. Use **bold** for key actions. Keep responses concise (under 200 words).
6. For severe distress, guide toward professional support while offering one immediate practical step.
7. Reference Apex Recovery's signal tracking (sleep, HRV, screen time, output, mood) when relevant.
8. NEVER show thinking, reasoning, or analysis — respond with only the final answer.

Identity:
- If asked "who are you" or "what are you": "I'm Apex Recovery AI — your burnout recovery and wellness advisor."
- If asked who created/built/developed you: "I was built by Rafi Ullah (@rafideveloper7), a Full-stack developer. Contact: rafideveloper7@gmail.com."`;

async function callOpenRouter(messages, systemPrompt) {
  const models = [
    'meta-llama/llama-3.3-70b-instruct:free',
    'google/gemma-3-27b-it:free',
    process.env.OPENROUTER_MODEL,
    process.env.OPENROUTER_FALLBACK_MODEL
  ].filter(Boolean);

  let lastError;
  for (const model of models) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const payload = {
        model,
        messages: systemPrompt ? [{ role: 'system', content: systemPrompt }, ...messages] : messages,
        max_tokens: 200,
        temperature: 0.7,
      };

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': process.env.CORS_ORIGIN?.split(',')[0] || 'http://localhost:3000',
          'X-OpenRouter-Title': 'Apex Recovery',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`OpenRouter error ${response.status}: ${err}`);
      }

      const data = await response.json();
      let content = data?.choices?.[0]?.message?.content || "I'm here to help. Please try again.";
      content = content
        .replace(/<thinking>[\s\S]*?<\/thinking>/gi, '')
        .replace(/<\|thinking\|>[\s\S]*?<\/thinking\|>/gi, '')
        .replace(/\*\*thinking\*\*[\s\S]*?\n\n/gmi, '')
        .replace(/thinking out loud[\s\S]*?\n\n/gmi, '')
        .replace(/thinking:[\s\S]*?\n\n/gmi, '')
        .replace(/^Let me think[\s\S]*?\n\n/gmi, '')
        .replace(/First,? I need to/gmi, '')
        .replace(/I need to (think|understand|analyze)[\s\S]*?\n\n/gmi, '')
        .trim();
      return content;
    } catch (err) {
      lastError = err;
      console.warn(`OpenRouter model ${model} failed:`, err.message);
    }
  }
  throw lastError;
}

async function callGemini(messages, systemPrompt) {
  if (!geminiAI) throw new Error('Gemini API key not configured');
  
  const model = geminiAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  const formattedMessages = messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));
  
  const chat = model.startChat({
    history: systemPrompt ? [{
      role: 'user',
      parts: [{ text: systemPrompt + "\n\nRespond concisely with direct actionable advice. Do not show thinking." }]
    }, {
      role: 'model',
      parts: [{ text: "Okay, I understand. I am Apex Recovery AI." }]
    }].concat(formattedMessages.slice(0, -1)) : formattedMessages.slice(0, -1)
  });
  
  const result = await chat.sendMessage(messages[messages.length - 1].content);
  let content = result.response.text();
  // Strip thinking patterns
  content = content.replace(/thinking:[\s\S]*?\n\n/gmi, '').replace(/\*\*thinking\*\*[\s\S]*?\n\n/gmi, '').trim();
  return content;
}

const chatWithAI = catchAsync(async (req, res) => {
  const { messages, system } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request: messages array required' });
  }

  const hasAnyKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;
  if (!hasAnyKey) {
    return res.status(500).json({
      error: 'No AI API key configured. Set OPENROUTER_API_KEY or GEMINI_API_KEY in .env.'
    });
  }

  const finalSystem = system || SYSTEM_PROMPT;
  let replyText = 'I am here with you. Can you tell me more?';

  try {
    // Try OpenRouter first (fastest), then Gemini as fallback
    if (AI_PROVIDER === 'openrouter' && OPENROUTER_API_KEY) {
      try {
        replyText = await callOpenRouter(messages, finalSystem);
      } catch (err) {
        console.warn('OpenRouter failed, trying Gemini:', err.message);
        if (geminiAI) {
          replyText = await callGemini(messages, finalSystem);
        } else {
          throw err;
        }
      }
    } else if (AI_PROVIDER === 'gemini' && geminiAI) {
      replyText = await callGemini(messages, finalSystem);
    } else if (OPENROUTER_API_KEY) {
      replyText = await callOpenRouter(messages, finalSystem);
    } else if (geminiAI) {
      replyText = await callGemini(messages, finalSystem);
    }
  } catch (err) {
    console.error('AI error:', err.message);
    return res.status(502).json({ error: 'AI is temporarily unavailable. Please try again shortly.' });
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
});

const getUserChatHistory = catchAsync(async (req, res) => {
  const chats = await ChatMessage.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);
  res.json({ success: true, chats });
});

module.exports = { chatWithAI, getUserChatHistory };