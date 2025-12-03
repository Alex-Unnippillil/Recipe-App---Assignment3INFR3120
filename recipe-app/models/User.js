// models/User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      required: true,
      enum: ['google', 'github']
    },
    providerId: {
      type: String,
      required: true
    },
    displayName: String,
    email: String,
    avatar: String
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
