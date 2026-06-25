const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const registerUser = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please fill all fields' });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  }
});

const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
});

const getMe = catchAsync(async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

const googleLogin = catchAsync(async (req, res) => {
  const { email, name } = req.body;
  const googleEmail = `g_${email.toLowerCase()}`;

  let user = await User.findOne({ email: googleEmail });

  if (!user) {
    user = await User.create({
      name,
      email: googleEmail,
      password: 'google_oauth',
      isGoogle: true,
    });
  }

  res.json({
    success: true,
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

module.exports = { registerUser, loginUser, getMe, googleLogin };