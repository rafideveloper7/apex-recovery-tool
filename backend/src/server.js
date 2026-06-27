const app = require('./app');
const connectDB = require('./config/db');

connectDB();

const handler = (req, res) => {
  return app(req, res);
};

module.exports = handler;
module.exports.default = handler;