// Script to create admin users for PoddarMotorsRV
// Run with: node server/scripts/createAdminUsers.js

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/user');

// Configure your admin users here
const USERS = [
  {
    email: 'admin@poddarmotors.com',
    password: 'Admin@123',  // Change this to a strong password
    role: 'admin',
  },
  {
    email: 'blog@poddarmotors.com',
    password: 'Blog@123',  // Change this to a strong password
    role: 'blogEditor',
  },
  {
    email: 'workshop@poddarmotors.com',
    password: 'Workshop@123',  // Change this to a strong password
    role: 'bookingManager',
  },
];

async function createAdminUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    for (const { email, password, role } of USERS) {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log(`⚠️  User ${email} already exists - skipping`);
        continue;
      }

      // Create new user
      const user = new User({ email, role });
      await user.setPassword(password);
      await user.save();
      console.log(`✅ Created ${role} user: ${email}`);
    }

    console.log('\n🎉 All done!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdminUsers();
