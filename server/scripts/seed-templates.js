const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const MessageTemplate = require('../models/MessageTemplate');

async function seedTemplates() {
  try {
    // Clear existing templates
    await MessageTemplate.deleteMany({});
    console.log('🗑️  Cleared existing templates');

    // Create default templates
    const templates = [
      {
        name: 'SMS - Car Buying',
        type: 'sms',
        serviceType: 'car-buying',
        content: `🚗 Thank you for calling Poddar Motors RV!

Browse our inventory: https://poddarmotorsrv.in/buy
📍 Bangalore, Karnataka
📞 +91 XXXXXXXXXX

Visit us today for test drives!`,
        active: true,
      },
      {
        name: 'SMS - Workshop',
        type: 'sms',
        serviceType: 'workshop',
        content: `🔧 Thank you for calling Poddar Motors Workshop!

Services: Repairs, Maintenance, Inspections
Book online: https://poddarmotorsrv.in/poddarmotors
📍 Bangalore, Karnataka
📞 +91 XXXXXXXXXX

We're here to help!`,
        active: true,
      },
      {
        name: 'WhatsApp - Car Buying',
        type: 'whatsapp',
        serviceType: 'car-buying',
        content: `Hi! 👋

Thanks for your interest in Poddar Motors RV.

🚗 *Browse Our Inventory*
https://poddarmotorsrv.in/buy

📍 *Visit Our Showroom*
Bangalore, Karnataka

💬 *Quick Questions?*
Reply to this message and our team will assist you!

Website: poddarmotorsrv.in`,
        active: true,
      },
      {
        name: 'WhatsApp - Workshop',
        type: 'whatsapp',
        serviceType: 'workshop',
        content: `Hi! 👋

Thanks for choosing Poddar Motors Workshop.

🔧 *Our Services*
Repairs, Maintenance, Inspections

📅 *Book Online*
https://poddarmotorsrv.in/poddarmotors

📍 *Location*
Bangalore, Karnataka

💬 Reply to this message for assistance!`,
        active: true,
      },
    ];

    await MessageTemplate.insertMany(templates);
    console.log('✅ Successfully seeded message templates');
    console.log(`📝 Created ${templates.length} templates`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding templates:', error);
    process.exit(1);
  }
}

seedTemplates();
