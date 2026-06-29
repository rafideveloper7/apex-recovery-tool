require('dotenv').config({ path: '../.env' });

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://apexrecovery.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  res.send(`
    <html>
      <body style="font-family:sans-serif;padding:40px;background:#0D1B3E;color:#fff">
        <h2>🔥 Apex Recovery Backend Server</h2>
        <p style="color:#93c5fd">Server is running correctly.</p>
        <p style="color:#6b7280;font-size:13px">AI advisor is ready!</p>
      </body>
    </html>
  `);
};