const mongoose = require('mongoose');

const uri = 'mongodb+srv://amanpoddar9:poddarmotorsrv@cluster0.9tbfrft.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';

const blogSchema = new mongoose.Schema({}, { strict: false });
const workshopBookingSchema = new mongoose.Schema({}, { strict: false });

const Blog = mongoose.model('Blog', blogSchema, 'blogs');
const WorkshopBooking = mongoose.model('WorkshopBooking', workshopBookingSchema, 'workshopbookings');

async function checkData() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to Cluster0.9tbfrft');
    
    const blogCount = await Blog.countDocuments();
    const workshopBookingCount = await WorkshopBooking.countDocuments();
    
    console.log(`\n📊 Data Check:`);
    console.log(`- Blogs found: ${blogCount}`);
    console.log(`- Workshop Bookings found: ${workshopBookingCount}`);
    
    // Show all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`\n📁 Collections in database:`);
    collections.forEach(col => console.log(`  - ${col.name}`));
    
    if (workshopBookingCount > 0) {
      console.log('\n✅ Workshop bookings found in database!');
      const bookings = await WorkshopBooking.find().limit(3);
      console.log('\nSample booking:');
      console.log(JSON.stringify(bookings[0], null, 2));
    } else {
      console.log('\n⚠️  No workshop bookings in database!');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

checkData();
