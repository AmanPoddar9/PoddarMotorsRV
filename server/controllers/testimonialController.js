const Testimonial = require('../models/testimonial');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

// Create a new testimonial
exports.createTestimonial = async (req, res) => {
  try {
    const { name, location, carModel, rating, text, type, mediaUrl, thumbnailUrl, isFeatured } = req.body;

    const testimonial = new Testimonial({
      name,
      location,
      carModel,
      rating,
      text,
      type,
      mediaUrl,
      thumbnailUrl,
      isFeatured
    });

    await testimonial.save();
    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Get all testimonials with optional filtering
exports.getTestimonials = async (req, res) => {
  try {
    const { carModel, featured, limit } = req.query;
    const query = {};

    if (carModel) {
      // Fuzzy search for car model (case-insensitive)
      query.carModel = { $regex: carModel, $options: 'i' };
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    let testimonialsQuery = Testimonial.find(query).sort({ createdAt: -1 });

    if (limit) {
      testimonialsQuery = testimonialsQuery.limit(parseInt(limit));
    }

    const testimonials = await testimonialsQuery;

    res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Get single testimonial
exports.getTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ success: false, error: 'Testimonial not found' });
    }

    res.status(200).json({ success: true, data: testimonial });
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Update testimonial
exports.updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!testimonial) {
      return res.status(404).json({ success: false, error: 'Testimonial not found' });
    }

    res.status(200).json({ success: true, data: testimonial });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Delete testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ success: false, error: 'Testimonial not found' });
    }

    // Attempt to delete media from Cloudinary if it exists
    // Note: We'd need to extract public_id from the URL. 
    // For simplicity in this version, we'll skip automatic Cloudinary deletion 
    // or implement a helper if needed later.

    await testimonial.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
