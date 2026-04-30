// This file defines the User schema for our database. 
// It tells MongoDB what information to store for each user and what rules that information must follow.

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // The username of the person signing up
  userName: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [50, 'Username cannot exceed 50 characters'],
    // Regex to make sure username only has letters, numbers, and underscores
    match: [/^[a-zA-Z0-9_]{3,}$/, 'Username can only contain alphanumeric characters and underscores']
  },
  // The email address of the user (must be unique)
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    // Regex to check if the email format is valid
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
  },
  // The user's 10-digit mobile number
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    unique: true,
    trim: true,
    // Regex to make sure it's a valid 10-digit Indian mobile number
    match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number']
  },
  // The password (will be stored as a hash, not plain text)
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  // The role of the user, either Mentor or Entrepreneur
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: {
      values: ['Mentor', 'Entrepreneur'],
      message: 'Role must be either Mentor or Entrepreneur'
    }
  },
  // The answer to the secret question used for resetting passwords
  secretQuestionAnswer: {
    type: String,
    required: [true, 'Secret question answer is required'],
    trim: true,
    lowercase: true
  },
  // When the user account was created
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);