const mongoose = require('mongoose');
const slugify = require('slugify');
const connectDB = require('../config/db');
const Listing = require('../models/listing');

const backfillSlugs = async () => {
  try {
    await connectDB();

    console.log('Connected to MongoDB');

    const listings = await Listing.find({});

    console.log(`Found ${listings.length} listings. Updating all with robust slugs...`);

    for (const listing of listings) {
      const slugBase = `${listing.brand} ${listing.model} ${listing.variant} ${listing.year}`;
      const randomSuffix = Math.random().toString(36).substring(2, 6);
      const slug = slugify(`${slugBase}-${randomSuffix}`, { lower: true, strict: true });
      
      listing.slug = slug;
      await listing.save();
      console.log(`Updated listing ${listing._id} with slug: ${slug}`);
    }

    console.log('Backfill complete.');
    process.exit(0);
  } catch (error) {
    console.error('Error backfilling slugs:', error);
    process.exit(1);
  }
};

backfillSlugs();
