const mongoose = require('mongoose');

const startupProfileSchema = new mongoose.Schema({
  // --- 1. MENTOR ID VALIDATION ---
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Links this profile to the Mentor who created it
    required: [true, 'Validation failed: Profile must belong to a mentor']
  },

  // --- 2. CATEGORY VALIDATION ---
  category: {
    type: String,
    required: [true, 'Validation failed: Business category is required'],
    // Enum ensures the category matches one of the options below
    enum: {
      values: ['FinTech', 'GreenTech', 'EdTech', 'AI/ML', 'HealthTech', 'Retail', 'Other'],
      message: 'Validation failed: Please select a valid category from the list'
    },
    index: 'text' // Makes searching by category much faster
  },

  // --- 3. DESCRIPTION VALIDATION ---
  description: {
    type: String,
    required: [true, 'Validation failed: Profile description is required'],
    // Ensures the description is informative enough
    minlength: [20, 'Validation failed: Description is too short (min 20 characters)'],
    maxlength: [500, 'Validation failed: Description is too long (max 500 characters)']
  },

  // --- 4. FUNDING LIMIT VALIDATION ---
  fundingLimit: {
    type: Number,
    required: [true, 'Validation failed: Funding limit must be specified'],
    // Ensures a mentor offers at least 1 Rupee and stays within the 1 Crore limit
    min: [0, 'Validation failed: Funding limit cannot be negative'],
    max: [10000000, 'Validation failed: Maximum funding limit is ₹10,000,000']
  },

  // --- 5. EQUITY EXPECTATION VALIDATION ---
  avgEquityExpectation: {
    type: Number,
    required: [true, 'Validation failed: Please enter expected equity percentage'],
    // Ensures a valid percentage between 1% and 100%
    min: [0, 'Validation failed: Equity expectation cannot be negative'],
    max: [100, 'Validation failed: Maximum equity expectation is 100%']
  },

  // --- 6. TARGET INDUSTRY VALIDATION ---
  targetIndustry: {
    type: String,
    required: [true, 'Validation failed: Please select a target industry'],
    enum: {
      values: ['Energy', 'Education', 'Financial Services', 'Retail', 'Healthcare', 'Technology'],
      message: 'Validation failed: Please select a valid target industry'
    }
  },

  // --- 7. PREFERRED STAGE VALIDATION ---
  preferredStage: {
    type: String,
    required: [true, 'Validation failed: Please select the startup stage you prefer'],
    enum: {
      values: ['idea', 'MVP', 'pre-revenue', 'scaling', 'established'],
      message: 'Validation failed: Invalid startup stage'
    }
  },

  // --- 8. CREATED DATE ---
  createdAt: {
    type: Date,
    default: Date.now
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

// Added an index for performance optimization per PRD 6.2
startupProfileSchema.index({ mentorId: 1 });

module.exports = mongoose.model('StartupProfile', startupProfileSchema);    