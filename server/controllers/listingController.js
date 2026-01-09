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
    console.error('❌ Error in getAllListings:', error);
    res.status(500).json({ error: "Server error", details: error.message });
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
    // Use findOneAndUpdate to atomically increment views
    const listing = await Listing.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } },
      { new: true } // Return the updated document so UI gets new count immediately
    );
    
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

exports.getAgentKnowledgeBase = async (req, res) => {
  try {
    const listings = await Listing.find({ 
      // Optionally filter for available cars only, but for knowledge base maybe even sold ones are useful? 
      // Let's stick to generally available or likely to be queried. 
      // For now, let's return all, or maybe filter out sold ones if 'ownership' implies current owner count? 
      // 'ownership' is likely number of owners.
      // Let's just return all listings as per request.
    });

    let textResponse = "# Poddar Motors Used Car Inventory Knowledge Base\n\n";
    textResponse += "use this document to answer questions about available cars. Each section describes a specific car in our inventory.\n\n";

    listings.forEach(car => {
        textResponse += `## ${car.year} ${car.brand} ${car.model} ${car.variant}\n`;
        textResponse += `- **Price**: ₹${car.price.toLocaleString('en-IN')}\n`;
        textResponse += `- **Mileage**: ${car.kmDriven} km\n`;
        textResponse += `- **Fuel Type**: ${car.fuelType}\n`;
        textResponse += `- **Transmission**: ${car.transmissionType}\n`;
        textResponse += `- **Color**: ${car.color}\n`;
        textResponse += `- **Location**: ${car.location}\n`;
        textResponse += `- **Key Features**: ${car.features ? car.features.join(', ') : 'Standard features'}\n`;
        
        if (car.isFeaturedDeal) {
            textResponse += `- **SPECIAL DEAL**: This is a featured deal!\n`;
        }
        
        textResponse += `- **Description**: This is a used ${car.year} ${car.brand} ${car.model} ${car.variant} with ${car.ownership} previous owner(s). It is a ${car.type} body type.\n`;
        textResponse += `- **Link**: https://www.poddarmotors.com/buy/${car.slug}\n\n`;
        textResponse += "---\n\n";
    });

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(textResponse);

  } catch (error) {
    console.error('Error generating agent knowledge base:', error);
    res.status(500).send('Error generating knowledge base');
  }
};


exports.getBusinessContext = async (req, res) => {
  try {
    const businessContext = `
# Poddar Motors - Business Context & Standard Operating Procedures

## About Us
**Poddar Motors** is a premium used car dealership located in Ranchi, Jharkhand. We specialize in quality used cars, certified inspections, and transparent dealing.

## Location & Contact
- **Address**: Kokar Industrial Area, Ranchi, Jharkhand 834001.
- **Landmarks**: Near the Old H.B Road.
- **Showroom Hours**: 10:00 AM - 7:00 PM (Monday to Saturday), 11:00 AM - 5:00 PM (Sunday).
- **Contact Number**: +91-XXXXXXXXXX (General Enquiry).

## Financial Services (Loans)
- **Partners**: We work with HDFC Bank, SBI, Mahindra Finance, and IDFC First Bank.
- **Interest Rates**: Starting from **8.5%** for premium profiles (Civil > 750). Standard used car rates are 10-12%.
- **Down Payment**: Minimum 20-30% of the car value is required.
- **Documents Required**: Aadhar Card, PAN Card, Salary Slips (3 months) or ITR (2 years), Bank Statement (6 months), Rent Agreement/Electricity Bill.

## Warranty & Certification
- **Certification**: All our "Certified" cars go through a 120-point inspection check.
- **Warranty**: We offer a **6-month engine and gearbox warranty** on certified vehicles.
- **No Meter Tampering**: We guarantee genuine mileage on all our cars.
- **Accidental**: We do NOT sell accidentally damaged or total-loss vehicles.

## Exchange Policy (Trade-in)
- Customers can exchange their old car for a new one.
- We offer **instant valuation** and spot payment adjustment.
- Free RC transfer assistance is provided for the old car.

## Return Policy
- All sales are final. However, if a major undisclosed mechanical fault (engine/gearbox) is found within 7 days, we offer free repair or buy-back at management discretion.

## Workshop & After-Sales
- We have our own authorized workshop next to the showroom.
- First service is often free (labor only) for premium cars (mention only if specifically asked).
`;

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(businessContext.trim());

  } catch (error) {
    console.error('Error generating business context:', error);
    res.status(500).send('Error generating business context');
  }
};


exports.getPronunciationDictionary = async (req, res) => {
  try {
    // 1. Aggregating all unique terms from Brand, Model, and Variant
    const brands = await Listing.distinct("brand");
    const models = await Listing.distinct("model");
    const variants = await Listing.distinct("variant");
    
    // 2. Merge and deduplicate
    const allTerms = [...new Set([...brands, ...models, ...variants])];
    
    // 3. Sort alphabetically for easier editing
    allTerms.sort();

    // 4. Filter out empty or non-string values
    const cleanTerms = allTerms.filter(term => term && typeof term === 'string' && term.trim().length > 0);

    // 5. Construct PLS XML
    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<lexicon version="1.0"
    xmlns="http://www.w3.org/2005/01/pronunciation-lexicon"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.w3.org/2005/01/pronunciation-lexicon
        http://www.w3.org/TR/2007/CR-pronunciation-lexicon-20071212/pls.xsd"
    alphabet="ipa" xml:lang="en-US">
`;

    cleanTerms.forEach(term => {
      // Basic XML escaping just in case
      const escapedTerm = term.replace(/&/g, '&amp;')
                              .replace(/</g, '&lt;')
                              .replace(/>/g, '&gt;')
                              .replace(/"/g, '&quot;')
                              .replace(/'/g, '&apos;');
      
      xmlContent += `  <lexeme>
    <grapheme>${escapedTerm}</grapheme>
    <alias>${escapedTerm}</alias>
  </lexeme>
`;
    });

    xmlContent += `</lexicon>`;

    // 6. Send Response
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Content-Disposition', 'attachment; filename="poddar-motors-dictionary.pls"');
    res.send(xmlContent);

  } catch (error) {
    console.error('Error generating pronunciation dictionary:', error);
    res.status(500).send('Error generating dictionary');
  }
};

exports.getFacebookCatalog = async (req, res) => {
  try {
    const listings = await Listing.find();
    
    // Headers: STRICT TEMPLATE MATCH (Based on User provided Excel sample)
    // Uses dot/bracket notation for nested objects
    const headers = [
      'vehicle_id',
      'title',
      'description',
      'price',
      'image[0].url', // Correct nested header for images
      'url',
      'body_style',
      'mileage.unit',
      'mileage.value',
      'address.addr1', // Correct nested header for street address
      'address.city',
      'address.country',
      'address.region',
      'address.postal_code',
      'state_of_vehicle',
      'make',
      'model',
      'year',
      'availability',
      'transmission',
      'fuel_type',
      'exterior_color'
    ];

    // Helper: Map Fuel Type (Uppercase Enums)
    const mapFuelType = (fuel) => {
      if (!fuel) return 'OTHER';
      const cleanFuel = fuel.toLowerCase().trim();
      if (cleanFuel.includes('petrol')) return 'GASOLINE'; // 'GASOLINE' is standard for petrol
      if (cleanFuel.includes('diesel')) return 'DIESEL';
      if (cleanFuel.includes('electric') || cleanFuel.includes('ev')) return 'ELECTRIC';
      if (cleanFuel.includes('hybrid')) return 'HYBRID';
      return 'OTHER';
    };

    // Helper: Map Transmission (Uppercase Enums)
    const mapTransmission = (trans) => {
      if (!trans) return 'MANUAL';
      const cleanTrans = trans.toLowerCase().trim();
      if (cleanTrans.includes('auto') || cleanTrans.includes('amt')) return 'AUTOMATIC';
      return 'MANUAL';
    };

    // Helper: Map Body Style (Uppercase Enums)
    const mapBodyStyle = (type) => {
      if (!type) return 'OTHER';
      const cleanType = type.toLowerCase().trim();
      if (cleanType.includes('suv')) return 'SUV';
      if (cleanType.includes('sedan')) return 'SEDAN';
      if (cleanType.includes('hatch')) return 'HATCHBACK';
      if (cleanType.includes('pickup')) return 'PICKUP';
      if (cleanType.includes('van') || cleanType.includes('muv') || cleanType.includes('mpv')) return 'VAN';
      if (cleanType.includes('coupe')) return 'COUPE';
      if (cleanType.includes('convert') || cleanType.includes('cabrio')) return 'CONVERTIBLE';
      if (cleanType.includes('wagon')) return 'WAGON';
      return 'OTHER';
    };

    // Helper to escape CSV fields
    const escapeCsv = (field) => {
      if (field === null || field === undefined) return '';
      const stringField = String(field).trim(); 
      const cleanString = stringField.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ');
      if (cleanString.includes(',') || cleanString.includes('"')) {
        return `"${cleanString.replace(/"/g, '""')}"`;
      }
      return cleanString;
    };

    const csvRows = listings.map(listing => {
      const availability = 'AVAILABLE'; 
      const state_of_vehicle = 'USED'; // Uppercase per sample

      const title = `${listing.year} ${listing.brand} ${listing.model} ${listing.variant}`;
      
      const description = `Used ${listing.year} ${listing.brand} ${listing.model} ${listing.variant}. ` +
          `Driven ${listing.kmDriven} kms. Fuel: ${listing.fuelType}. ` +
          `Transmission: ${listing.transmissionType}. ` +
          `Color: ${listing.color}. Located in ${listing.location}.`;

      const link = `https://www.poddarmotors.com/buy/${listing.slug || listing._id}`;
      const image_link = listing.images && listing.images.length > 0 ? listing.images[0] : '';
      
      const priceValue = listing.price ? listing.price.toString().replace(/,/g, '') : '0';
      const formattedPrice = `${priceValue} INR`;

      return [
        listing._id,          // vehicle_id
        title,                // title
        description,          // description
        formattedPrice,       // price
        image_link,           // image[0].url
        link,                 // url
        mapBodyStyle(listing.type),         // body_style
        'KM',                 // mileage.unit
        listing.kmDriven,     // mileage.value
        'Poddar Motors, Kokar industrial Area', // address.addr1
        'Ranchi',             // address.city
        'India',              // address.country
        'Jharkhand',          // address.region
        '834001',             // address.postal_code
        state_of_vehicle,     // state_of_vehicle
        listing.brand,        // make
        listing.model,        // model
        listing.year,         // year
        availability,         // availability
        mapTransmission(listing.transmissionType), // transmission
        mapFuelType(listing.fuelType),     // fuel_type
        listing.color         // exterior_color
      ].map(escapeCsv).join(',');
    });

    const csvContent = [headers.join(','), ...csvRows].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'inline; filename="poddar-motors-catalog.csv"');
    res.status(200).send(csvContent);

  } catch (error) {
    console.error('Error generating Facebook catalog:', error);
    res.status(500).send('Error generating catalog');
  }
};

exports.getGoogleCatalog = async (req, res) => {
  try {
    const listings = await Listing.find();
    
    // Headers: GOOGLE MERCHANT CENTER VEHICLE ADS SPEC (2025)
    const headers = [
      'id',                   // Unique ID (same as vehicle_id)
      'store_code',           // Links to GBP (Must match user's GMB code)
      'title',
      'description',
      'link',                 // Link to VDP
      'image_link',           // Main image
      'condition',            // new/used
      'brand',
      'model',
      'year',
      'mileage',              // value + unit (e.g., "50000 km")
      'color',
      'price',                // value + currency (e.g., "500000 INR")
      'availability',         // in_stock
      'vehicle_fulfillment(option:store_code)' // REQUIRED: "in_store:CODE"
    ];

    // Helpers (Reusing logic but adapting return values if needed)
    const escapeCsv = (field) => {
      if (field === null || field === undefined) return '';
      const stringField = String(field).trim(); 
      const cleanString = stringField.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ');
      if (cleanString.includes(',') || cleanString.includes('"')) {
        return `"${cleanString.replace(/"/g, '""')}"`;
      }
      return cleanString;
    };

    const STORE_CODE = 'REAL_VALUE_RANCHI'; // Must be set by user in GBP

    const csvRows = listings.map(listing => {
      const title = `${listing.year} ${listing.brand} ${listing.model} ${listing.variant}`;
      
      const description = `Used ${listing.year} ${listing.brand} ${listing.model} ${listing.variant}. ` +
          `Driven ${listing.kmDriven} kms. Fuel: ${listing.fuelType}. ` +
          `Transmission: ${listing.transmissionType}. ` +
          `Color: ${listing.color}. Located in Ranchi.`;

      const link = `https://www.poddarmotors.com/buy/${listing.slug || listing._id}`;
      const image_link = listing.images && listing.images.length > 0 ? listing.images[0] : '';
      
      const priceValue = listing.price ? listing.price.toString().replace(/,/g, '') : '0';
      const formattedPrice = `${priceValue} INR`;
      const mileage = `${listing.kmDriven} km`;

      return [
        listing._id,                  // id
        STORE_CODE,                   // store_code
        title,                        // title
        description,                  // description
        link,                         // link
        image_link,                   // image_link
        'used',                       // condition (lowercase for Google preference)
        listing.brand,                // brand
        listing.model,                // model
        listing.year,                 // year
        mileage,                      // mileage
        listing.color,                // color
        formattedPrice,               // price
        'in_stock',                   // availability (Google uses 'in_stock')
        `in_store:${STORE_CODE}`      // vehicle_fulfillment
      ].map(escapeCsv).join(',');
    });

    const csvContent = [headers.join(','), ...csvRows].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'inline; filename="google-merchant-catalog.csv"');
    res.status(200).send(csvContent);

  } catch (error) {
    console.error('Error generating Google catalog:', error);
    res.status(500).send('Error generating Google catalog');
  }
};
