const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const errorHandler = require('./utils/errorHandler');

dotenv.config({ path: './.env' });

const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === 'development' 
    ? ['http://localhost:3000', 'http://localhost:5000'] 
    : ['https://*.vercel.app'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
    <html>
      <body style="font-family:sans-serif;padding:40px;background:#0D1B3E;color:#fff">
        <h2>🔥 Apex Recovery Backend Server</h2>
        <p style="color:#93c5fd">Server is running correctly.</p>
        <p style="color:#6b7280;font-size:13px">Using Groq AI & MongoDB</p>
      </body>
    </html>
  `);
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/data', require('./routes/dataRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));

app.use(errorHandler);

module.exports = app;