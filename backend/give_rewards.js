require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Issue = require('./src/models/Issue');
const Reward = require('./src/models/Reward');
const { dispenseAllRewards } = require('./src/services/rewardService');

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const citizen = await User.findOne({ email: 'citizen1@demo.com' });
    let issue = await Issue.findOne({ submittedBy: citizen._id, status: 'Resolved' });
    
    if (!issue) {
      issue = await Issue.findOne({ submittedBy: citizen._id });
    }

    if(citizen && issue) {
      console.log('Clearing old rewards...');
      await Reward.deleteMany({ user: citizen._id });
      await User.findByIdAndUpdate(citizen._id, {
        $set: { rewards: { points: 0, badges: [], treesPlanted: 0, certificates: [] } }
      });

      console.log('Generating rewards for', citizen.name, 'based on issue', issue.title);
      // Wait for it to pull fresh context
      const freshCitizen = await User.findOne({ email: 'citizen1@demo.com' });
      await dispenseAllRewards(freshCitizen, issue);
      console.log('Successfully generated rewards!');
    } else {
      console.log('Could not find citizen or issue');
    }
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}
run();
