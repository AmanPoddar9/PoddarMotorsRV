const mongoose = require('mongoose');
const Customer = require('../models/Customer');
const path = require('path');
require('dotenv').config({ path: path.join(process.cwd(), 'server', '.env') });
const connectDB = require('../config/db');

const countStuck = async () => {
  try {
    await connectDB();
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const count = await Customer.countDocuments({
        name: 'Voice Agent Lead',
        createdAt: { $gte: threeDaysAgo }
    });
    console.log(`Remaining Stuck Leads: ${count}`);
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};
countStuck();
