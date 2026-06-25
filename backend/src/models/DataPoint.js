const mongoose = require('mongoose');

const dataPointSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sleep: {
    type: Number,
    required: true,
  },
  screenTime: {
    type: Number,
    required: true,
  },
  energy: {
    type: Number,
    min: 1,
    max: 10,
    required: true,
  },
  focus: {
    type: Number,
    min: 1,
    max: 10,
    required: true,
  },
  output: {
    type: Number,
    min: 0,
    max: 3,
    required: true,
  },
  mood: {
    type: Number,
    min: 0,
    max: 3,
    required: true,
  },
  breaks: {
    type: Number,
    min: 1,
    max: 3,
    required: true,
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('DataPoint', dataPointSchema);