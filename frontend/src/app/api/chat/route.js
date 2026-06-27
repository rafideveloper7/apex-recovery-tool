const SYSTEM_PROMPT = `You are Apex Recovery AI, a burnout recovery advisor. Help with burnout, stress, anxiety, sleep issues, difficult relationships, toxic managers, financial stress, grief, life transitions, productivity, and motivation. Always validate feelings first, then give specific actionable steps with exact times and named techniques. Be warm and direct. Never show thinking or reasoning - only final answer.`;

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

async function callOpenRouter(messages, systemPrompt = SYSTEM_PROMPT) {
  const model = 'openrouter/auto';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://apex-recovery-web.vercel.app',
        'X-Title': 'Apex Recovery',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        max_tokens: 200,
        temperature: 0.7,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`OpenRouter error ${response.status}: ${text}`);
    }

    const data = await response.json();
    let content = data?.choices?.[0]?.message?.content || '';
    content = content
      .replace(/<thinking>[\s\S]*?<\/thinking>/gi, '')
      .replace(/<\|thinking\|>[\s\S]*?<\/thinking\|>/gi, '')
      .replace(/\*\*thinking\*\*[\s\S]*?\n\n/gmi, '')
      .replace(/thinking:[\s\S]*?\n\n/gmi, '')
      .replace(/^Let me think[\s\S]*?\n\n/gmi, '')
      .trim();
    return content;
  } catch (err) {
    throw err;
  }
}

export async function POST(req) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: 'Invalid request: messages array required' }, { status: 400 });
    }
    const replyText = await callOpenRouter(messages);
    return Response.json({ content: [{ type: 'text', text: replyText }] });
  } catch (err) {
    console.error('Chat API error:', String(err));
    return Response.json({ error: 'AI unavailable', details: String(err) }, { status: 502 });
  }
}

export async function GET() {
  return Response.json({ status: 'ok', message: 'Chat API ready' });
}