const mongoose = require('mongoose');

// HARDCODED FOR DEBUGGING
const MONGO_URI = 'mongodb+srv://amanpoddar9:realvalue1@cluster0.9tbfrft.mongodb.net/?appName=Cluster0&retryWrites=true&w=majority';

const InspectionReport = require('./models/InspectionReport');
const InspectionBooking = require('./models/InspectionBooking');

const run = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        console.log('--- RECENT REPORTS ---');
        const reports = await InspectionReport.find().sort({ createdAt: -1 }).limit(5);
        reports.forEach(r => {
            console.log(`Report ID: ${r._id}`);
            console.log(`  Booking ID (Ref): ${r.bookingId}`);
            console.log(`  CreatedAt: ${r.createdAt}`);
            console.log('-------------------');
        });

        console.log('\n--- RECENT BOOKINGS ---');
        const bookings = await InspectionBooking.find().sort({ createdAt: -1 }).limit(5);
        bookings.forEach(b => {
            console.log(`Booking ID: ${b._id}`);
            console.log(`  Report ID (Ref): ${b.inspectionReportId}`);
            console.log(`  Customer: ${b.customerName}`);
            console.log(`  Status: ${b.status}`);
            console.log('-------------------');
        });

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
};

run();
