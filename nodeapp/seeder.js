const mongoose = require('mongoose');
const StartupProfile = require('./models/StartupProfile');
const User = require('./models/userModel');

mongoose.connect("mongodb://127.0.0.1:27017/startupnest")
  .then(async () => {
    console.log("Connected to DB");
    const mentor = await User.findOne({ role: 'Mentor' });
    if (!mentor) {
      console.log("No Mentor found in the database. Please create one first.");
      process.exit(1);
    }

    const categories = ['FinTech', 'GreenTech', 'EdTech', 'AI/ML', 'HealthTech', 'Retail', 'Other'];
    const industries = ['Energy', 'Education', 'Financial Services', 'Retail', 'Healthcare', 'Technology'];
    const stages = ['idea', 'MVP', 'pre-revenue', 'scaling', 'established'];

    const profiles = [];
    for (let i = 1; i <= 30; i++) {
      profiles.push({
        mentorId: mentor._id,
        category: categories[Math.floor(Math.random() * categories.length)],
        description: `This is a randomly generated startup opportunity description number ${i} to test pagination. It is long enough to pass validation.`,
        fundingLimit: Math.floor(Math.random() * 1000000) + 50000,
        avgEquityExpectation: Math.floor(Math.random() * 30) + 5,
        targetIndustry: industries[Math.floor(Math.random() * industries.length)],
        preferredStage: stages[Math.floor(Math.random() * stages.length)],
      });
    }

    await StartupProfile.insertMany(profiles);
    console.log("Successfully inserted 30 dummy startup profiles.");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
