const mongoose = require('mongoose');
const slugify = require('slugify');
const connectDB = require('../config/db');
const Listing = require('../models/listing');

const backfillSlugs = async () => {
  try {
    await connectDB();

    console.log('Connected to MongoDB');

    const listings = await Listing.find({
      $or: [{ slug: { $exists: false } }, { slug: '' }, { slug: null }],
    });

    console.log(`Found ${listings.length} listings with missing slugs.`);

    for (const listing of listings) {
      const slugBase = `${listing.brand} ${listing.model} ${listing.variant} ${listing.year}`;
      const slug = slugify(slugBase, { lower: true, strict: true });
      
      // Check for uniqueness (simple version, might need more robust handling if many duplicates)
      let uniqueSlug = slug;
      let counter = 1;
      while (await Listing.findOne({ slug: uniqueSlug, _id: { $ne: listing._id } })) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
      }

      listing.slug = uniqueSlug;
      await listing.save();
      console.log(`Updated listing ${listing._id} with slug: ${uniqueSlug}`);
    }

    console.log('Backfill complete.');
    process.exit(0);
  } catch (error) {
    console.error('Error backfilling slugs:', error);
    process.exit(1);
  }
};

backfillSlugs();
