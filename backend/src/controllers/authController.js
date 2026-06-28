const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const cloudinary = require('../config/cloudinary');
const connectDB = require('../config/db');
const { addOfflineUser, findOfflineUserByEmail } = require('../utils/offlineUsers');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const registerUser = catchAsync(async (req, res) => {
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
  }).catch(() => {
    const id = Date.now().toString();
    const newUser = {
      _id: id,
      name,
      email,
      password: hashedPassword,
      profileImage: profileImageUrl,
      onboardingAnswers: onboardingAnswers || {},
      isAdmin: isAdminEmail,
    };
addOfflineUser(newUser);
     return newUser;
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
 });

 const loginUser = catchAsync(async (req, res) => {
   const { email, password } = req.body;

   if (!email || !password) {
     return res.status(400).json({ success: false, message: 'Please provide email and password' });
   }

   const user = await User.findOne({ email }).catch(() => {
     return findOfflineUserByEmail(email);
   });

  const hashedPassword = user?.password || '';
  
  let validPassword = false;
  if (hashedPassword.startsWith('$2')) {
    validPassword = bcrypt.compareSync(password, hashedPassword);
  } else if (hashedPassword === password) {
    validPassword = true;
  } else if (process.env.ADMIN_EMAIL && email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()) {
    const adminPass = process.env.ADMIN_PASSWORD || 'adminpassword123';
    if (password === adminPass) {
      validPassword = true;
    }
  }

  if (user && validPassword) {
    const isAdmin = user.isAdmin || email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase();
    user.isAdmin = isAdmin;
    await user.save().catch(() => {});
    
    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      onboardingAnswers: user.onboardingAnswers,
      isAdmin,
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

const adminLogin = catchAsync(async (req, res) => {
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

  let user = await User.findOne({ email }).catch(() => null);

  if (!user) {
    const hashedPassword = bcrypt.hashSync(adminPass, 10);
    user = await User.create({
      name: 'Admin',
      email,
      password: hashedPassword,
      isAdmin: true,
    }).catch(() => {
      const id = Date.now().toString();
      const newUser = {
        _id: id,
        name: 'Admin',
        email,
        password: hashedPassword,
        isAdmin: true,
        onboardingAnswers: {},
      };
      addOfflineUser(newUser);
      return newUser;
    });
  } else {
    user.isAdmin = true;
    await user.save().catch(() => {});
  }

  res.json({
    success: true,
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: true,
    token: generateToken(user._id),
  });
});

const googleLogin = catchAsync(async (req, res) => {
  const { email, name, profileImage } = req.body;
  const googleEmail = `g_${email.toLowerCase()}`;

  let user = await User.findOne({ email: googleEmail }).catch(() => {
    return findOfflineUserByEmail(googleEmail);
  });

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
    }).catch(() => {
      const id = Date.now().toString();
      const newUser = {
        _id: id,
        name,
        email: googleEmail,
        password: hashedPassword,
        profileImage: profileImageUrl,
        isGoogle: true,
        onboardingAnswers: {},
        isAdmin: false,
      };
      addOfflineUser(newUser);
      return newUser;
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
});

module.exports = { registerUser, loginUser, getMe, adminLogin, googleLogin };