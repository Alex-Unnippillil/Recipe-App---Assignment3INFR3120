
const mongoose = require('mongoose');
const { mongoURI } = require('./keys');

async function connectDB() {
  if (!mongoURI) {
    console.error('Error: MONGODB_URI is defined in variables');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB!');
  } catch (err) {
    console.error('Failed to connect to MongoDB!:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;