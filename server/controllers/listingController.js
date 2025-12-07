const Listing = require("../models/listing");
const ListingImages = require("../models/listingImages");
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const slugify = require('slugify');

const AdmZip = require("adm-zip");
var detect = require("detect-file-type");
const axios = require("axios");
const CryptoJS = require("crypto-js");
const { clearCachePattern } = require('../middleware/cache');

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Delete one listing by ID
exports.deleteListingByIdCloudinary = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    const publicIds = [];
    listing.images.map((url) => {
      const publicId = extractPublicId(url);
      if (publicId.length > 0) {
        publicIds.push(publicId);
      }
    });
    for (let i = 0; i < publicIds.length; i++) {
      await deleteSingleImage(publicIds[i]);
    }
    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.json({
      message: "Listing deleted successfully",
      listing: deletedListing,
    });
    // Invalidate cache
    clearCachePattern('/api/listings');
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteListingById = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    const urls = listing.images;

    const bucketName = 'realvaluestorage';

    for (let url of urls) {
      // Extract the key from the URL
      const key = url.split(`${bucketName}.s3.amazonaws.com/`)[1];
      if (key) {
        const params = {
          Bucket: bucketName,
          Key: key,
        };

        const command = new DeleteObjectCommand(params);
        await s3Client.send(command);

      }
    }

    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.json({
      message: "Listing deleted successfully",
      listing: deletedListing,
    });
    // Invalidate cache
    clearCachePattern('/api/listings');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting listing' });
  }
}

exports.createListing = async (req, res) => {
  try {
    const data = req.body;
    console.log('📝 Creating listing with data:', JSON.stringify(data, null, 2));
    
    const slugBase = `${data.brand}-${data.model}-${data.variant}-${data.year}`;
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    data.slug = slugify(`${slugBase}-${randomSuffix}`, { lower: true, strict: true });
    
    console.log('🔗 Generated slug:', data.slug);
    
    const listing = new Listing(data);
    await listing.save();

    console.log('✅ Listing saved successfully:', listing._id);

    // Check for matching requirements and send emails
    try {
      const CarRequirement = require('../models/CarRequirement');
      const { sendRequirementMatchEmail } = require('../utils/email');
      const Customer = require('../models/Customer');

      // Find requirements that match:
      // 1. Same Brand (case insensitive)
      // 2. Budget overlaps with price
      // 3. Year is within range (yearMin <= listing.year)
      const matches = await CarRequirement.find({
        isActive: true,
        brand: { $regex: new RegExp(`^${data.brand}$`, 'i') },
        budgetMax: { $gte: data.price },
        budgetMin: { $lte: data.price },
        yearMin: { $lte: data.year }
      }).populate('customer');

      console.log(`Found ${matches.length} matching requirements for new listing: ${data.brand} ${data.model}`);

      for (const match of matches) {
        if (match.customer && match.customer.email) {
          await sendRequirementMatchEmail(match.customer.email, match.customer.name, listing);
        }
      }
    } catch (emailError) {
      console.error('Error sending requirement emails:', emailError);
    }

    res.status(201).json({ message: "Listing created successfully", listing });
    // Invalidate cache
    clearCachePattern('/api/listings');
  } catch (error) {
    console.error('❌ Error creating listing:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    if (error.errors) {
      console.error('Validation errors:', JSON.stringify(error.errors, null, 2));
    }
    res.status(400).json({ error: error.message });
  }
};

function bufferToDataUri(buffer, contentType) {
  return `data:${contentType};base64,${buffer.toString("base64")}`;
}

exports.uploadImage = async (req, res) => {
  try {
    res.status(201).json({ message: "Listing Image created successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Read all listings
exports.getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Listing.distinct("brand");
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllTypes = async (req, res) => {
  try {
    const brands = await Listing.distinct("type");
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllFuelTypes = async (req, res) => {
  try {
    const brands = await Listing.distinct("fuelType");
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllTransmissionTypes = async (req, res) => {
  try {
    const brands = await Listing.distinct("transmissionType");
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllSeats = async (req, res) => {
  try {
    const brands = await Listing.distinct("seats");
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getFeaturedListings = async (req, res) => {
  try {
    const listings = await Listing.find({ featured: true });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getDealListings = async (req, res) => {
  try {
    const now = new Date();
    const listings = await Listing.find({
      isFeaturedDeal: true,
      $or: [
        { dealEndDate: { $gt: now } },
        { dealEndDate: null }
      ]
    }).limit(6);
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};


exports.getFilteredListings = async (req, res) => {
  try {
    const filters = req.body;
    let query = {};

    Object.keys(filters).forEach((key) => {
      switch (key) {
        case "brand":
        case "fuelType":
        case "transmissionType":
        case "seats":
        case "ownership":
        case "type":
          if (filters[key].length > 0) {
            query[key] = { $in: filters[key] };
          }
          break;
        case "budget":
          const budgetQueries = filters[key].map((range) => {
            const [min, max] = range.split("-").map(Number);
            if (!isNaN(min) && !isNaN(max)) {
              return { price: { $gte: min, $lte: max } };
            } else if (!isNaN(min)) {
              return { price: { $gte: min } };
            } else if (!isNaN(max)) {
              return { price: { $lte: max } };
            }
            return null;
          });
          query["$or"] = budgetQueries.filter((q) => q !== null);
          break;
        case "kmDriven":
          const kmQueries = filters[key].map((range) => {
            const [min, max] = range.split("-").map(Number);
            if (!isNaN(min) && !isNaN(max)) {
              return { kmDriven: { $gte: min, $lte: max } };
            } else if (!isNaN(min)) {
              return { kmDriven: { $gte: min } };
            } else if (!isNaN(max)) {
              return { kmDriven: { $lte: max } };
            }
            return null;
          });
          query["$or"] = kmQueries.filter((q) => q !== null);
          break;
        case "modelYear":
          query["year"] = { $gte: filters[key][0], $lte: filters[key][1] };
          break;
      }
    });
    let listings = await Listing.find(query);

    if (filters.search) {
      const searchQuery = filters.search.toLowerCase();
      listings = listings.filter((car) =>
        car.model.toLowerCase().includes(searchQuery) ||
        car.brand.toLowerCase().includes(searchQuery)
      );
    }

    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read one listing by ID
exports.getListingById = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getListingBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const listing = await Listing.findOne({ slug });
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update one listing by ID
exports.updateListingById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    if (req.body.brand || req.body.model || req.body.variant || req.body.year) {
      const brand = req.body.brand || listing.brand;
      const model = req.body.model || listing.model;
      const variant = req.body.variant || listing.variant;
      const year = req.body.year || listing.year;
      const randomSuffix = Math.random().toString(36).substring(2, 6);
      req.body.slug = slugify(`${brand}-${model}-${variant}-${year}-${randomSuffix}`, { lower: true, strict: true });
    }

    const updatedListing = await Listing.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedListing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    res.json({
      message: "Listing updated successfully",
      listing: updatedListing,
    });
    // Invalidate cache
    clearCachePattern('/api/listings');
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const extractPublicId = (url) => {
  const parts = url.split("/");
  const versionAndId = parts[parts.length - 1];
  const publicId = versionAndId.split(".")[0];
  return publicId;
};
const deleteSingleImage = async (publicId) => {
  const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
  const API_KEY = process.env.CLOUDINARY_API_KEY;
  const API_SECRET = process.env.CLOUDINARY_API_SECRET;
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = CryptoJS.SHA1(
    `public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`
  ).toString();
  const data = new FormData();
  data.append("public_id", publicId);
  data.append("api_key", API_KEY);
  data.append("timestamp", timestamp);
  data.append("signature", signature);
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/djyvxi14o/image/destroy`,
      {
        method: "POST",
        body: data,
      }
    );
    const result = await response.json();
    console.log("Deleted image:", publicId, result);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};
