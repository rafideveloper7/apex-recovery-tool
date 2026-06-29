require('dotenv').config({ path: '../../../.env' });
const jwt = require('jsonwebtoken');
const DataPoint = require('../../../src/models/DataPoint');
const User = require('../../../src/models/User');
const { findOfflineUser } = require('../../../src/utils/offlineUsers');
const connectDB = require('../../../src/config/db');

const calculateBurnoutScore = (data) => {
  let score = 0;
  const { sleep, screenTime, energy, focus, output, mood, breaks } = data;

  if (sleep < 5) score += 36;
  else if (sleep < 6) score += 26;
  else if (sleep < 7) score += 16;
  else score += 3;

  if (screenTime > 12) score += 28;
  else if (screenTime > 9) score += 20;
  else if (screenTime > 7) score += 12;
  else score += 3;

  if (energy < 3) score += 20;
  else if (energy < 5) score += 13;
  else if (energy < 7) score += 6;
  else score += 1;

  if (focus < 3) score += 14;
  else if (focus < 6) score += 8;
  else score += 1;

  if (output === 0) score += 22;
  else if (output === 1) score += 12;
  else if (output === 2) score += 5;
  else score += 1;

  if (mood === 0) score += 16;
  else if (mood === 1) score += 8;
  else if (mood === 2) score += 2;
  else score += 0;

  if (breaks === 1) score += 8;
  else if (breaks === 2) score += 3;
  else score += 0;

  return Math.min(Math.round(score), 100);
};

const getRiskLevel = (score) => {
  if (score > 65) return 'high';
  if (score > 35) return 'medium';
  return 'low';
};

const authMiddleware = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new Error('No token');
  }
  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  let user = await User.findById(decoded.id).select('-password').catch(() => null);
  if (!user) {
    user = findOfflineUser(decoded.id);
  }
  req.user = user;
};

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://apexrecovery.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDB();
    await authMiddleware(req);
    
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { sleep, screenTime, energy, focus, output, mood, breaks } = req.body;

    if ([sleep, screenTime, energy, focus, output, mood, breaks].some(v => v === undefined)) {
      return res.status(400).json({ success: false, message: 'All check-in fields are required' });
    }

    const score = calculateBurnoutScore({ sleep, screenTime, energy, focus, output, mood, breaks });
    const level = getRiskLevel(score);
    const now = new Date();

    const dataPoint = await DataPoint.create({
      userId: req.user ? req.user._id : null,
      sleep,
      screenTime,
      energy,
      focus,
      output,
      mood,
      breaks,
      score,
      date: now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    }).catch(() => null);

    res.status(201).json({
      success: true,
      data: {
        score,
        level,
        sleep,
        screenTime,
        energy,
        focus,
      },
    });
  } catch (error) {
    console.error('Checkin error:', error.message);
    if (error.message === 'No token') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};