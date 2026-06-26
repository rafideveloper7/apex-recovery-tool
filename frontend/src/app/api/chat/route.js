import axios from 'axios';

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000').replace(/\/+$/, '') || 'http://localhost:5000';
const FINAL_URL = BACKEND_URL === 'http://localhost:5000' ? 'http://localhost:5000' : 'https://apexapi-alpha.vercel.app';

export async function POST(req) {
  const body = await req.json();
  const url = `${FINAL_URL}/api/chat`;
  
  try {
    const response = await axios.post(url, body, {
      timeout: 10000,
    });
    return Response.json(response.data);
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      return Response.json({ error: 'Backend unavailable' }, { status: 503 });
    }
    if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
      return Response.json({ error: 'Request timeout' }, { status: 504 });
    }
    return Response.json({ error: 'AI request failed', details: error.message }, { status: 500 });
  }
}