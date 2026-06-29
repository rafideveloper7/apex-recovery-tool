require('dotenv').config({ path: '../../../.env' });
const jwt = require('jsonwebtoken');
const User = require('../../../src/models/User');
const Blog = require('../../../src/models/Blog');
const { getOfflineUsers } = require('../../../src/utils/offlineUsers');
const connectDB = require('../../../src/config/db');

const authMiddleware = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new Error('No token');
  }
  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  let user = await User.findById(decoded.id).select('-password').catch(() => null);
  if (!user) {
    const offlineUsers = getOfflineUsers();
    user = offlineUsers.find(u => u._id === decoded.id);
  }
  req.user = user;
};

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://apexrecovery.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDB();
    await authMiddleware(req);

    if (!req.user?.isAdmin) {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    if (req.method === 'GET') {
      let blogs = await Blog.find({}).sort({ createdAt: -1 }).catch(() => []);
      res.json({ success: true, blogs });
    } else {
      res.status(405).json({ success: false, message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Admin blogs error:', error.message);
    if (error.message === 'No token') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};