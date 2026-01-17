const mongoose = require('mongoose');
const Customer = require('../models/Customer');
const path = require('path');
// Assume running from project root
require('dotenv').config({ path: path.join(process.cwd(), 'server', '.env') });

const checkCustomer = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
        console.error("MONGO_URI not found");
        process.exit(1);
    }
    
    // Bypass strict query warning
    mongoose.set('strictQuery', false);
    
    await mongoose.connect(mongoURI);
    console.log("Connected to DB");

    const mobile = '9234147075';
    // The controller uses slice(-10), so let's match that logic just in case, 
    // but here we are explicit.
    const customer = await Customer.findOne({ mobile: { $regex: mobile + '$' } });
    
    if (customer) {
        console.log("-------------------------------------------------");
        console.log("Customer Found:");
        console.log(`ID: ${customer._id}`);
        console.log(`Name: '${customer.name}'`);
        console.log(`Mobile: '${customer.mobile}'`);
        console.log(`Source: '${customer.source}'`);
        console.log(`Lifecycle Stage: '${customer.lifecycleStage}'`);
        console.log("-------------------------------------------------");
    } else {
        console.log("Customer NOT Found with mobile ending in " + mobile);
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};

checkCustomer();
