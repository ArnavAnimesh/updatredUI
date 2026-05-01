const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  otpHash: {
    type: String,
    required: true,
  },
  userData: {
    type: Object, // Temporarily stores all the signup data
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600 // The document will be automatically deleted after 600 seconds (10 minutes)
  }
});

module.exports = mongoose.model('Otp', otpSchema);
