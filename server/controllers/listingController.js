const Listing = require("../models/listing");
const ListingImages = require("../models/listingImages");

const AdmZip = require("adm-zip");
var detect = require("detect-file-type");
const axios = require("axios");
const CryptoJS = require("crypto-js");

exports.createListing = async (req, res) => {
  try {
    const data = req.body;
    const listing = new Listing(data);
    await listing.save();
    res.status(201).json({ message: "Listing created successfully", listing });
  } catch (error) {
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

exports.geFeaturedListings = async (req, res) => {
  try {
    const listings = await Listing.find({ featured: true });
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

// Update one listing by ID
exports.updateListingById = async (req, res) => {
  try {
    const { id } = req.params;
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
  const CLOUD_NAME = "djyvxi14o";
  const API_KEY = "969818645141645";
  const API_SECRET = "6zE7tZ-h5zzcqAKksmyFJL3-Lzg";
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
// Delete one listing by ID
exports.deleteListingById = async (req, res) => {
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
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
