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
    const { email, name, profileImage } = req.body;
    const googleEmail = `g_${email.toLowerCase()}`;

    let user = await User.findOne({ email: googleEmail });

    if (!user) {
      let profileImageUrl = profileImage || '';
      if (profileImage && connectDB.getConnectionStatus()) {
        try {
          const uploadResult = await cloudinary.uploader.upload(profileImage, {
            folder: 'apex-recovery/profiles',
            resource_type: 'image',
          });
          profileImageUrl = uploadResult.secure_url;
        } catch (e) {}
      }

      const hashedPassword = bcrypt.hashSync('google_oauth', 10);
      user = await User.create({
        name,
        email: googleEmail,
        password: hashedPassword,
        profileImage: profileImageUrl,
        isGoogle: true,
      });
    }

    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      onboardingAnswers: user.onboardingAnswers,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Google login error:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};