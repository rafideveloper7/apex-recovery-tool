const mongoose = require('mongoose');
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/apex-recovery';
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('⚠️  Running in offline mode - data will not persist');
    isConnected = false;
  }
};

module.exports = connectDB;
module.exports.getConnectionStatus = () => isConnected;