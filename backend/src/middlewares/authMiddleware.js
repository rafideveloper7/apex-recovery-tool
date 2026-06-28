const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { findOfflineUser } = require('../utils/offlineUsers');

const authMiddleware = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      let user = await User.findById(decoded.id).select('-password').catch(() => null);
      if (!user) {
        const offlineUser = findOfflineUser(decoded.id);
        if (offlineUser) {
          const { password, ...userWithoutPassword } = offlineUser;
          req.user = userWithoutPassword;
        }
      } else {
        req.user = user;
      }
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

const adminMiddleware = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authorized, no user' });
  }
  if (req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Admin access required' });
  }
};

module.exports = { authMiddleware, adminMiddleware };