const express = require('express');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');
const { getOfflineUsers } = require('../utils/offlineUsers');

const router = express.Router();

router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const User = require('../models/User');
    let users = await User.find({}).select('-password').sort({ createdAt: -1 }).catch(() => null);
    if (!users) {
      users = getOfflineUsers().map(({ password, ...u }) => u);
    }
    res.json({ success: true, users });
  } catch (error) {
    const users = getOfflineUsers().map(({ password, ...u }) => u);
    res.json({ success: true, users });
  }
});

router.put('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const User = require('../models/User');
    const { id } = req.params;
    const { name, isAdmin } = req.body;
    let user = await User.findByIdAndUpdate(id, { name, isAdmin }, { new: true }).select('-password');
    if (user) return res.json({ success: true, user });
  } catch (error) {
    // Continue to offline mode handling
  }
  
  const { findOfflineUser } = require('../utils/offlineUsers');
  const user = findOfflineUser(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  
  const updated = { ...user, ...req.body };
  res.json({ success: true, user: updated });
});

router.delete('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const User = require('../models/User');
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Cannot delete user in offline mode' });
  }
});

router.get('/blogs', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const Blog = require('../models/Blog');
    const blogs = await Blog.find({}).sort({ createdAt: -1 }).catch(() => []);
    res.json({ success: true, blogs });
  } catch (error) {
    res.json({ success: true, blogs: [] });
  }
});

router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const User = require('../models/User');
    const Blog = require('../models/Blog');
    const ChatMessage = require('../models/ChatMessage');
    const DataPoint = require('../models/DataPoint');
    
    let [userCount, blogCount, chatCount, dataCount] = await Promise.all([
      User.countDocuments().catch(() => null),
      Blog.countDocuments().catch(() => null),
      ChatMessage.countDocuments().catch(() => null),
      DataPoint.countDocuments().catch(() => null),
    ]);
    
    userCount = userCount ?? getOfflineUsers().length;
    blogCount = blogCount ?? 0;
    chatCount = chatCount ?? 0;
    dataCount = dataCount ?? 0;
    
    res.json({ success: true, stats: { users: userCount, blogs: blogCount, chats: chatCount, dataPoints: dataCount } });
  } catch (error) {
    const users = getOfflineUsers();
    res.json({ success: true, stats: { users: users.length, blogs: 0, chats: 0, dataPoints: 0 } });
  }
});

module.exports = router;