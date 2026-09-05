/**
 * seed.js — Populates the database with realistic test data.
 * Run: node seed.js
 */
const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./src/config/db');

const User = require('./src/models/User');
const Issue = require('./src/models/Issue');
const IssueUpdate = require('./src/models/StatusLog');
const Upvote = require('./src/models/Upvote');
const Department = require('./src/models/Department');
const Reward = require('./src/models/Reward');

const CATEGORIES = ['Roads', 'Water', 'Garbage', 'Electricity', 'Sanitation', 'Other'];
const STATUSES = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
const ADDRESSES = [
  'MG Road, Bangalore', 'Rajiv Gandhi Nagar, Delhi', 'Anna Nagar, Chennai',
  'Deccan Gymkhana, Pune', 'Salt Lake, Kolkata', 'Banjara Hills, Hyderabad',
  'Civil Lines, Jaipur', 'Model Town, Ludhiana', 'Hazratganj, Lucknow',
  'Boat Club Road, Nagpur', 'Jubilee Hills, Hyderabad', 'Koramangala, Bangalore',
];
const MOCK_IMAGES = [
  'https://res.cloudinary.com/demo/image/upload/v1/civic/pothole1.jpg',
  'https://res.cloudinary.com/demo/image/upload/v1/civic/garbage1.jpg',
  'https://res.cloudinary.com/demo/image/upload/v1/civic/water_leak1.jpg',
  'https://res.cloudinary.com/demo/image/upload/v1/civic/road_damage1.jpg',
];

const ISSUE_TITLES = [
  'Large pothole causing accidents on main road',
  'Overflowing garbage bin near school',
  'Water pipeline burst flooding residential area',
  'Street lights not working for a week',
  'Broken drainage cover posing danger',
  'Illegal dumping of construction debris',
  'Low water pressure in entire ward',
  'Fallen electric pole blocking traffic',
  'Open manhole near bus stop',
  'Stagnant water breeding mosquitoes',
  'Road markings faded at busy intersection',
  'Broken park bench needs replacement',
  'Public toilet in unhygienic condition',
  'Tree fallen on power lines',
  'Water contamination in taps',
  'Footpath broken and uneven',
  'Traffic signal malfunction',
  'Noise pollution from construction site',
  'Abandoned vehicle blocking road',
  'Street drain completely blocked',
  'Damaged park fence needs repair',
  'Overflowing sewage on main road',
];

function randomEl(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomCoords() {
  // Random Indian coordinates
  return [
    72 + Math.random() * 10,   // lng ~72-82
    12 + Math.random() * 16,   // lat ~12-28
  ];
}
function daysAgo(d) {
  const date = new Date();
  date.setDate(date.getDate() - d);
  date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
  return date;
}

async function seed() {
  try {
    await connectDB();
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}), Issue.deleteMany({}), IssueUpdate.deleteMany({}),
      Upvote.deleteMany({}), Department.deleteMany({}), Reward.deleteMany({}),
    ]);

    // ── Departments ──
    console.log('🏛️  Creating departments...');
    const depts = await Department.insertMany([
      { name: 'Public Works - Roads', headName: 'Rajesh Kumar', contactEmail: 'roads@civic.gov.in', avgResolutionDays: 5 },
      { name: 'Water Supply', headName: 'Priya Sharma', contactEmail: 'water@civic.gov.in', avgResolutionDays: 3 },
      { name: 'Waste Management', headName: 'Amit Patel', contactEmail: 'waste@civic.gov.in', avgResolutionDays: 2 },
      { name: 'Electricity Board', headName: 'Santosh Verma', contactEmail: 'power@civic.gov.in', avgResolutionDays: 4 },
      { name: 'Sanitation & Health', headName: 'Deepa Nair', contactEmail: 'health@civic.gov.in', avgResolutionDays: 3 },
      { name: 'General Administration', headName: 'Vikram Singh', contactEmail: 'admin@civic.gov.in', avgResolutionDays: 7 },
    ]);
    const deptMap = {
      Roads: depts[0]._id, Water: depts[1]._id, Garbage: depts[2]._id,
      Electricity: depts[3]._id, Sanitation: depts[4]._id, Other: depts[5]._id,
    };

    // ── Users ──
    console.log('👥 Creating users...');
    const pw = 'password123';

    const admin1 = await User.create({ name: 'Admin Officer', email: 'admin@civicpulse.in', password: pw, role: 'admin' });
    const admin2 = await User.create({ name: 'Super Admin', email: 'superadmin@civicpulse.in', password: pw, role: 'admin' });
    const muni = await User.create({ name: 'Ward Officer Ravi', email: 'municipality@civicpulse.in', password: pw, role: 'municipality', department: depts[0]._id });

    const citizenNames = ['Arjun Mehta', 'Sneha Reddy', 'Vikram Joshi', 'Ananya Gupta', 'Rohan Das'];
    const citizens = [];
    for (let i = 0; i < citizenNames.length; i++) {
      const c = await User.create({
        name: citizenNames[i],
        email: `citizen${i + 1}@demo.com`,
        password: pw,
        role: 'citizen',
        phone: `98765${String(i).padStart(5, '0')}`,
      });
      citizens.push(c);
    }

    // ── Issues ──
    console.log('📝 Creating issues...');
    const issues = [];
    for (let i = 0; i < ISSUE_TITLES.length; i++) {
      const cat = CATEGORIES[i % CATEGORIES.length];
      const status = STATUSES[i % STATUSES.length];
      const createdAt = daysAgo(Math.floor(Math.random() * 60) + 1);
      let resolvedAt;
      if (status === 'Resolved') {
        resolvedAt = new Date(createdAt.getTime() + (Math.random() * 7 + 1) * 24 * 60 * 60 * 1000);
      }

      const iss = await Issue.create({
        title: ISSUE_TITLES[i],
        description: `Detailed report: ${ISSUE_TITLES[i]}. This issue has been affecting residents in the area for several days. Immediate attention is requested from the municipal authorities.`,
        category: cat,
        status,
        priority: randomEl(PRIORITIES),
        images: [randomEl(MOCK_IMAGES)],
        location: { type: 'Point', coordinates: randomCoords(), address: randomEl(ADDRESSES) },
        submittedBy: randomEl(citizens)._id,
        assignedTo: status !== 'Pending' ? admin1._id : undefined,
        department: deptMap[cat],
        upvoteCount: Math.floor(Math.random() * 25),
        resolvedAt,
        createdAt,
        updatedAt: createdAt,
      });
      issues.push(iss);

      // Create initial IssueUpdate
      await IssueUpdate.create({
        issue: iss._id, updatedBy: iss.submittedBy,
        fromStatus: null, toStatus: 'Pending', comment: 'Issue reported',
        createdAt,
      });

      // Status transitions
      if (status === 'In Progress' || status === 'Resolved' || status === 'Rejected') {
        await IssueUpdate.create({
          issue: iss._id, updatedBy: admin1._id,
          fromStatus: 'Pending', toStatus: 'In Progress',
          comment: 'Assigned to department for investigation',
          createdAt: new Date(createdAt.getTime() + 24 * 60 * 60 * 1000),
        });
      }
      if (status === 'Resolved') {
        await IssueUpdate.create({
          issue: iss._id, updatedBy: muni._id,
          fromStatus: 'In Progress', toStatus: 'Resolved',
          comment: 'Work completed and verified',
          proofImage: randomEl(MOCK_IMAGES),
          createdAt: resolvedAt,
        });
      }
      if (status === 'Rejected') {
        await IssueUpdate.create({
          issue: iss._id, updatedBy: admin1._id,
          fromStatus: 'In Progress', toStatus: 'Rejected',
          comment: 'Issue falls outside municipal jurisdiction',
          createdAt: new Date(createdAt.getTime() + 48 * 60 * 60 * 1000),
        });
      }
    }

    // ── Upvotes ──
    console.log('👍 Creating upvotes...');
    for (const iss of issues.slice(0, 12)) {
      const voterCount = Math.min(citizens.length, Math.floor(Math.random() * 4) + 1);
      for (let j = 0; j < voterCount; j++) {
        try {
          await Upvote.create({ issue: iss._id, user: citizens[j]._id });
        } catch { /* dup key */ }
      }
    }

    console.log('\n✅ Seed complete!');
    console.log(`   📋 ${issues.length} issues`);
    console.log(`   👥 ${citizens.length + 3} users (2 admin, 1 municipality, ${citizens.length} citizens)`);
    console.log(`   🏛️  ${depts.length} departments`);
    console.log('\n🔑 Login credentials:');
    console.log('   Admin:        admin@civicpulse.in / password123');
    console.log('   Municipality: municipality@civicpulse.in / password123');
    console.log('   Citizen:      citizen1@demo.com / password123');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
