const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  profileImage: {
    type: String,
    default: '',
  },
  onboardingAnswers: {
    burnoutFrequency: { type: String, default: '' },
    sleepHours: { type: String, default: '' },
    stressLevel: { type: String, default: '' },
    workplaceSupport: { type: String, default: '' },
    recoveryTime: { type: String, default: '' },
  },
  isGoogle: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);