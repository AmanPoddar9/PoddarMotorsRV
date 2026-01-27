const mongoose = require('mongoose');
const User = require('./models/user');
require('dotenv').config({ path: './.env' }); // Look for .env in current folder (server/)

async function checkUsers() {
  try {
    const mongoURI = process.env.MONGO_URI;
    console.log('Connecting to:', mongoURI);
    await mongoose.connect(mongoURI);

    const users = await User.find().sort({ _id: -1 }).limit(5);

    console.log('--- RECENT USERS ---');
    users.forEach(u => {
      console.log(`ID: ${u._id}`);
      console.log(`Name: ${u.name}`);
      console.log(`Email: ${u.email}`);
      console.log(`Role: ${u.role}`);
      console.log(`Permissions: ${u.permissions}`);
      console.log(`IsActive: ${u.isActive}`);
      console.log('--------------------');
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkUsers();
