const mongoose = require('mongoose');

/**
 * StartupSubmission Schema
 * Defines the details of a startup idea submitted by an Entrepreneur.
 * Strictly follows requirements in PRD Section 6.3.
 */
const startupSubmissionSchema = new mongoose.Schema({
  // --- 1. ENTREPRENEUR DETAILS ---
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Links to the Entrepreneur who submitted the idea
    required: [true, 'Validation failed: User ID is required']
  },
  userName: {
    type: String,
    required: [true, 'Validation failed: Submitting user name is required']
  },

  // --- 2. LINK TO MENTOR'S PROFILE ---
  startupProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StartupProfile', // Links to the specific mentor opportunity
    required: [true, 'Validation failed: Startup Profile link is required']
  },

  // --- 3. SUBMISSION METRICS ---
  marketPotential: {
    type: Number,
    required: [true, 'Validation failed: Market potential score is required'],
    min: [1, 'Min score is 1'],
    max: [100, 'Max score is 100']
  },
  launchYear: {
    type: Date,
    required: [true, 'Validation failed: Anticipated launch year is required']
  },
  expectedFunding: {
    type: Number,
    required: [true, 'Validation failed: Expected funding amount is required'],
    min: [1, 'Funding must be a positive number'],
    max: [10000000, 'Maximum funding requested can be ₹10,000,000']
  },

  // --- 4. TRACKING & LOGISTICS ---
  submissionDate: {
    type: Date,
    default: Date.now // Records when the form was submitted
  },
  status: {
    type: Number,
    required: true,
    default: 1, // 1 = Submitted, 2 = Shortlisted, 3 = Rejected
    enum: {
      values: [1, 2, 3],
      message: 'Status code must be 1 (Submitted), 2 (Shortlisted), or 3 (Rejected)'
    }
  },
  address: {
    type: String,
    required: [true, 'Validation failed: Physical address or location is required'],
    minlength: [10, 'Address is too short (min 10 characters)'],
    maxlength: [300, 'Address is too long (max 300 characters)']
  },

  // --- 5. PITCH DECK FILE ---
  pitchDeckFile: {
    type: String,
    required: [true, 'Validation failed: Pitch deck (PDF) is mandatory']
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  }
});

// --- PERFORMANCE & LOGIC INDEXES (PRD 6.3) ---

// Prevent duplicate submissions: One entrepreneur can submit only ONE idea 
// to the SAME mentor profile.
startupSubmissionSchema.index({ userId: 1, startupProfileId: 1 }, { unique: true });

// Help the mentor see newest submissions first
startupSubmissionSchema.index({ status: 1, submissionDate: -1 });

module.exports = mongoose.model('StartupSubmission', startupSubmissionSchema);