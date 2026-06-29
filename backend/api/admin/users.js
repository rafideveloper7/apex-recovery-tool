require('dotenv').config({ path: '../../../.env' });
const jwt = require('jsonwebtoken');
const User = require('../../../src/models/User');
const { getOfflineUsers, findOfflineUser } = require('../../../src/utils/offlineUsers');
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
    user = getOfflineUsers().find(u => u._id === decoded.id);
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
      let users = await User.find({}).select('-password').sort({ createdAt: -1 }).catch(() => null);
      if (!users) {
        users = getOfflineUsers().map(({ password, ...u }) => u);
      }
      res.json({ success: true, users });
    } else if (req.method === 'PUT') {
      const { id } = req.query;
      const { name, isAdmin } = req.body;
      let user = await User.findByIdAndUpdate(id, { name, isAdmin }, { new: true }).select('-password').catch(() => null);
      if (user) return res.json({ success: true, user });
      
      const offlineUser = findOfflineUser(id);
      if (!offlineUser) return res.status(404).json({ success: false, message: 'User not found' });
      const updated = { ...offlineUser, ...req.body };
      res.json({ success: true, user: updated });
    } else if (req.method === 'DELETE') {
      const { id } = req.query;
      await User.findByIdAndDelete(id).catch(() => {});
      res.json({ success: true, message: 'User deleted' });
    } else {
      res.status(405).json({ success: false, message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Admin users error:', error.message);
    if (error.message === 'No token') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};