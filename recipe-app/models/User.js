// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, sparse: true },
  passwordHash: String,          // for normal email/password users
  googleId: String,              // for Google OAuth
  githubId: String,              // for GitHub OAuth
  displayName: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);