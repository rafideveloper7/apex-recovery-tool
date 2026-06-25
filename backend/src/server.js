const app = require('./app');
const connectDB = require('./config/db');

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.includes('YOUR_GROQ_API_KEY_HERE')) {
    console.log('⚠️  WARNING: Groq API key not set in .env!');
    console.log('   Please set your free key at: https://console.groq.com');
  } else {
    console.log('🔑 Groq API key is set — advisor is ready!');
  }
  if (process.env.OPENROUTER_API_KEY) {
    console.log(`🔑 OpenRouter API key is set (provider: ${process.env.AI_PROVIDER || 'openrouter'}, model: ${process.env.OPENROUTER_MODEL || 'default'})`);
  }
});