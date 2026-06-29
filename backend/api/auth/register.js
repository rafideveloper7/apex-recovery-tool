require('dotenv').config({ path: '../../../.env' });
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../../src/models/User');
const cloudinary = require('../../../src/config/cloudinary');
const connectDB = require('../../../src/config/db');

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
    const { name, email, password, profileImage, onboardingAnswers } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please fill all fields' });
    }

    const isAdminEmail = email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase();

    let profileImageUrl = profileImage || '';
    if (profileImage && connectDB.getConnectionStatus()) {
      try {
        const uploadResult = await cloudinary.uploader.upload(profileImage, {
          folder: 'apex-recovery/profiles',
          resource_type: 'image',
        });
        profileImageUrl = uploadResult.secure_url;
      } catch (e) {
        profileImageUrl = profileImage;
      }
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImage: profileImageUrl,
      onboardingAnswers: onboardingAnswers || {},
      isAdmin: isAdminEmail,
    });

    res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      onboardingAnswers: user.onboardingAnswers,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Register error:', error.message);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};