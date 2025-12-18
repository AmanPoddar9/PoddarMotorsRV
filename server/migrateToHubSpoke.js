const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Models
const Customer = require('./models/Customer');
const WorkshopBooking = require('./models/workshopBooking'); // Note: Case sensitivity check needed
const SellRequest = require('./models/sellRequest'); // Note: Case sensitivity check needed
const CustomerOffer = require('./models/CustomerOffer');
const TestDriveBooking = require('./models/testDriveBooking');
const InspectionBooking = require('./models/InspectionBooking');

// Case insensitive require might be needed if filenames vary, but assuming standard for now based on previous file views.
// However, in previous tools:
// workshopBooking.js -> WorkshopBooking model match
// sellRequest.js -> SellRequest model match
// booking.js -> Booking model match
// CustomerOffer.js -> CustomerOffer model match

const DB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/poddar_motors';

async function migrate() {
  try {
    await mongoose.connect(DB_URI);
    console.log('🔗 Connected to MongoDB for Migration');

    await migrateCollection(WorkshopBooking, 'WorkshopBooking', 'Workshop', 'mobileNumber');
    await migrateCollection(SellRequest, 'SellRequest', 'Website', 'phoneNumber', 'Website (Sell)');
    await migrateCollection(CustomerOffer, 'CustomerOffer', 'Website', 'mobile', 'Website (Offer)');
    await migrateCollection(TestDriveBooking, 'TestDriveBooking (Test Drive)', 'Website', 'mobileNumber', 'Website (Test Drive)');
    await migrateCollection(InspectionBooking, 'InspectionBooking', 'Website', 'customerPhone', 'Website (Inspection)');

    console.log('✅ Migration Complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration Failed:', error);
    process.exit(1);
  }
}

async function migrateCollection(Model, modelName, sourceTag, phoneField, subTag) {
  console.log(`\n--- Migrating ${modelName} ---`);
  
  // Find records where customer is NOT set (orphan)
  const orphans = await Model.find({ customer: { $exists: false } });
  console.log(`Found ${orphans.length} orphan records.`);

  for (const record of orphans) {
    const mobile = record[phoneField];
    const name = record.name;

    if (!mobile) {
      console.log(`⚠️ Skiping record ${record._id}: No mobile number.`);
      continue;
    }

    // McLean the mobile number (basic)
    const cleanMobile = mobile.replace(/\D/g, '').slice(-10);

    // Find or Create Customer
    let customer = await Customer.findOne({ mobile: { $regex: cleanMobile + '$' } });

    if (!customer) {
      // Create new customer
      try {
        customer = await Customer.create({
          name: name || 'Unknown',
          mobile: cleanMobile,
          source: sourceTag,
          lifecycleStage: 'Lead',
          tags: ['Migrated', sourceTag, subTag].filter(Boolean)
        });
        console.log(`   ➕ Created Customer: ${name} (${cleanMobile})`);
      } catch (err) {
        if (err.code === 11000) {
            // Race condition or duplicate catch - unexpected but handle safely
            customer = await Customer.findOne({ mobile: cleanMobile });
        } else {
             console.error(`   ❌ Error creating customer for ${cleanMobile}:`, err.message);
             continue;
        }
      }
    } else {
      // console.log(`   🔗 Linked to existing: ${customer.name}`);
    }

    if (customer) {
      record.customer = customer._id;
      await record.save();
    }
  }
}

migrate();
