const mongoose = require('mongoose');

const uri = 'mongodb+srv://amanpoddar9:poddarmotorsrv@cluster0.9tbfrft.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';

const blogSchema = new mongoose.Schema({}, { strict: false });
const bookingSchema = new mongoose.Schema({}, { strict: false });

const Blog = mongoose.model('Blog', blogSchema, 'blogs');
const Booking = mongoose.model('WorkshopBooking', bookingSchema, 'workshopbookings');

async function checkData() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to Cluster0.9tbfrft');
    
    const blogCount = await Blog.countDocuments();
    const bookingCount = await Booking.countDocuments();
    
    console.log(`\n📊 Data Check:`);
    console.log(`- Blogs found: ${blogCount}`);
    console.log(`- Bookings found: ${bookingCount}`);
    
    if (blogCount === 0 && bookingCount === 0) {
      console.log('\n⚠️  This database is empty! Your data is likely in the OTHER cluster (iyrbdvi).');
    } else {
      console.log('\n✅ Data found in this cluster.');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

checkData();
