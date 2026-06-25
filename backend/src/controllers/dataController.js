const DataPoint = require('../models/DataPoint');
const catchAsync = require('../utils/catchAsync');

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

const submitCheckin = catchAsync(async (req, res) => {
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
  });

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
});

const getUserCheckins = catchAsync(async (req, res) => {
  const checkins = await DataPoint.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);
  res.json({ success: true, checkins });
});

const getLatestCheckin = catchAsync(async (req, res) => {
  const checkin = await DataPoint.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, checkin });
});

const getStats = catchAsync(async (req, res) => {
  const checkins = await DataPoint.find({ userId: req.user._id });
  const sessions = await DataPoint.countDocuments({ userId: req.user._id });
  
  res.json({
    success: true,
    stats: {
      sessions,
      checkins: checkins.length,
      avgScore: checkins.length ? Math.round(checkins.reduce((a, c) => a + c.score, 0) / checkins.length) : null,
    },
  });
});

module.exports = { submitCheckin, getUserCheckins, getLatestCheckin, getStats };