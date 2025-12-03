// models/User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      required: true,
      enum: ['google', 'github', 'local']   
    },
    providerId: {
      type: String,
      required: true                        
    },
    displayName: String,
    email: {
      type: String,
      lowercase: true,
      trim: true
    },
    avatar: String,
    // use only for local accounts
    passwordHash: String
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
