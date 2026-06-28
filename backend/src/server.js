const app = require('./app');
const connectDB = require('./config/db');

connectDB();

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${PORT} in use, trying ${PORT + 1}...`);
      app.listen(PORT + 1).on('listening', () => {
        console.log(`Server running on port ${PORT + 1}`);
      });
    } else {
      console.error('Server error:', err.message);
    }
  });
}

const handler = (req, res) => {
  return app(req, res);
};

module.exports = handler;
module.exports.default = handler;