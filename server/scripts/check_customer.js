require('dotenv').config({ path: '/Users/amanpoddar/Documents/GitHub/PoddarMotorsRV/server/.env' });
const mongoose = require('mongoose');
const Customer = require('../models/Customer');
const Interaction = require('../models/Interaction');

const checkCustomer = async () => {
  try {
    if (!process.env.MONGO_URI) {
        console.error('MONGO_URI not found in environment');
        process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const mobile = '8873002702';
    const customer = await Customer.findOne({ mobile });

    if (!customer) {
      console.log(`❌ Customer not found with mobile: ${mobile}`);
    } else {
      console.log(`✅ Customer Found: ${customer.name} (ID: ${customer._id})`);
      console.log(`   Source: ${customer.source}`);
      console.log(`   Notes Count: ${customer.notes ? customer.notes.length : 0}`);
      if(customer.notes && customer.notes.length > 0) {
          console.log('   Recent Notes:', JSON.stringify(customer.notes.slice(-2), null, 2));
      }

      const interactions = await Interaction.find({ customer: customer._id });
      console.log(`✅ Interactions Found: ${interactions.length}`);
      
      interactions.forEach((int, i) => {
          console.log(`   [${i+1}] Type: ${int.type}, Date: ${int.date}`);
          console.log(`       Agent: ${int.agentName}`);
          console.log(`       Outcome: ${int.data?.outcome}`);
          console.log(`       Summary: ${int.data?.remark?.substring(0, 50).replace(/\n/g, ' ')}...`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
};

checkCustomer();
