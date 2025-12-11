const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Customer = require('../models/Customer');

async function checkCustomer() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const query = 'Pankaj';
        const regex = new RegExp(query, 'i');
        
        console.log(`Searching for "${query}" with regex: ${regex}`);

        const exactMatch = await Customer.findOne({ name: 'Pankaj Jha' });
        console.log('Exact Match "Pankaj Jha":', exactMatch ? 'FOUND' : 'NOT FOUND');

        const searchResults = await Customer.find({
            $or: [
                { name: regex },
                { mobile: regex },
                { email: regex }
            ]
        }).select('name mobile');
        
        console.log(`Search Results (${searchResults.length}):`);
        searchResults.forEach(c => console.log(` - ${c.name} (${c.mobile})`));

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

checkCustomer();
