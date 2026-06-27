require('dotenv').config({ path: '../.env' });
const ChatMessage = require('../src/models/ChatMessage');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const geminiAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const AI_PROVIDER = process.env.AI_PROVIDER || 'openrouter';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const SYSTEM_PROMPT = `You are Apex Recovery AI, a burnout recovery advisor and occupational wellness coach.

You help with burnout, stress, anxiety, sleep issues, difficult relationships, toxic managers, financial stress, grief, life transitions, productivity, motivation, physical health, and nutrition basics.`;

async function callOpenRouter(messages, systemPrompt) {
  const models = [
    'meta-llama/llama-3.3-70b-instruct:free',
    'google/gemma-3-27b-it:free',
    process.env.OPENROUTER_MODEL || 'openrouter/auto',
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
          'HTTP-Referer': process.env.CORS_ORIGIN?.split(',')[0] || 'https://frontend-six-iota-paeuc7ymc4.vercel.app',
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
      let content = data?.choices?.[0]?.message?.content || "I'm here to help.";
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

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { messages, system } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request: messages array required' });
    }

    const hasKey = OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;
    if (!hasKey) {
      return res.status(500).json({
        error: 'No AI API key configured. Set OPENROUTER_API_KEY or GEMINI_API_KEY in .env.'
      });
    }

    const finalSystem = system || SYSTEM_PROMPT;
    let replyText = 'I am here with you.';

    if (AI_PROVIDER === 'openrouter' && OPENROUTER_API_KEY) {
      replyText = await callOpenRouter(messages, finalSystem);
    }

    if (req.user) {
      try {
        const chatSession = new ChatMessage({
          userId: req.user._id,
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'assistant', content: replyText }
          ]
        });
        await chatSession.save();
      } catch (e) {
        console.warn('Could not save chat:', e.message);
      }
    }

    res.json({ content: [{ type: 'text', text: replyText }] });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(502).json({ error: 'AI is temporarily unavailable. Please try again shortly.' });
  }
};