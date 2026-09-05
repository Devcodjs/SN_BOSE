const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Issue = require('./src/models/Issue');
const StatusLog = require('./src/models/StatusLog');
const { calculatePriorityScore } = require('./src/services/priorityService');
const { getPriorityLabel } = require('./src/config/priorityConfig');

dotenv.config();

async function runMigration() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected.');

  console.log('--- Migrating Users ---');
  const users = await User.find({});
  let userUpdates = 0;
  for (const user of users) {
    let changed = false;
    if (user.trustScore === undefined) { user.trustScore = 100; changed = true; }
    if (user.identityVerified === undefined) { user.identityVerified = false; changed = true; }
    if (user.verificationStatus === undefined) { user.verificationStatus = 'unverified'; changed = true; }
    if (user.totalReports === undefined) { user.totalReports = 0; changed = true; }
    if (user.verifiedReports === undefined) { user.verifiedReports = 0; changed = true; }
    if (user.resolvedReports === undefined) { user.resolvedReports = 0; changed = true; }
    if (user.rejectedReports === undefined) { user.rejectedReports = 0; changed = true; }
    if (user.duplicateReports === undefined) { user.duplicateReports = 0; changed = true; }
    if (user.abuseFlags === undefined) { user.abuseFlags = 0; changed = true; }
    
    if (changed) {
      await user.save();
      userUpdates++;
    }
  }
  console.log(`Updated ${userUpdates} users.`);

  console.log('--- Migrating Issues ---');
  const issues = await Issue.find({});
  let issueUpdates = 0;
  for (const issue of issues) {
    let changed = false;
    
    if (!issue.severity) {
      // Map existing priority to severity
      issue.severity = issue.priority || 'Medium';
      changed = true;
    }
    
    if (issue.priorityScore === undefined || issue.priorityScore === 50) {
      // Calculate dynamic score
      const priorityResult = calculatePriorityScore(issue);
      issue.priorityScore = priorityResult.score;
      issue.priority = getPriorityLabel(priorityResult.score);
      issue.lastPriorityCalculation = new Date();
      changed = true;
    }

    if (issue.isDuplicate === undefined) { issue.isDuplicate = false; changed = true; }
    if (issue.corroborationCount === undefined) { issue.corroborationCount = 0; changed = true; }
    if (issue.duplicateStatus === undefined) { issue.duplicateStatus = 'none'; changed = true; }
    if (issue.abuseStatus === undefined) { issue.abuseStatus = 'clean'; changed = true; }

    if (changed) {
      await issue.save();
      issueUpdates++;
    }
  }
  console.log(`Updated ${issueUpdates} issues.`);

  console.log('--- Migrating Status Logs ---');
  const logs = await StatusLog.find({});
  let logUpdates = 0;
  for (const log of logs) {
    if (!log.eventType) {
      log.eventType = log.fromStatus === null ? 'CREATED' : 'STATUS_CHANGED';
      await log.save();
      logUpdates++;
    }
  }
  console.log(`Updated ${logUpdates} status logs.`);

  console.log('Migration Complete.');
  process.exit(0);
}

runMigration().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
