require('dotenv').config({ path: '../../../../.env' });
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../../../src/models/User');
const connectDB = require('../../../../src/config/db');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://apexrecovery.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await connectDB();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    if (email.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase()) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    const adminPass = process.env.ADMIN_PASSWORD || 'adminpassword123';
    if (password !== adminPass) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      const hashedPassword = bcrypt.hashSync(adminPass, 10);
      user = await User.create({
        name: 'Admin',
        email,
        password: hashedPassword,
        isAdmin: true,
      });
    } else {
      user.isAdmin = true;
      await user.save();
    }

    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: true,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Admin login error:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};