const Customer = require('../models/Customer');
const jwt = require('jsonwebtoken');
const WorkshopBooking = require('../models/workshopBooking');
const Booking = require('../models/booking'); // Test drives
const CustomerOffer = require('../models/CustomerOffer');

// Helper to create JWT
const createToken = (customer) => {
  return jwt.sign(
    { id: customer._id, role: 'customer', mobile: customer.mobile },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Check if exists
    const existingEmail = await Customer.findOne({ email });
    if (existingEmail) return res.status(400).json({ message: 'Email already registered' });

    const existingMobile = await Customer.findOne({ mobile });
    if (existingMobile) return res.status(400).json({ message: 'Mobile number already registered' });

    // Create customer
    const customer = new Customer({
      name,
      email,
      mobile,
      // Initialize empty preferences
      preferences: {},
      primeStatus: { isActive: false }
    });

    await customer.setPassword(password);
    await customer.save();

    // Create token
    const token = createToken(customer);

    // Set cookie
    res.cookie('customer_auth', token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(201).json({
      message: 'Account created successfully',
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        mobile: customer.mobile,
        primeStatus: customer.primeStatus
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find by email (or mobile could be added later)
    const customer = await Customer.findOne({ email });
    if (!customer) return res.status(401).json({ message: 'Invalid credentials' });

    const isValid = await customer.validatePassword(password);
    if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = createToken(customer);

    res.cookie('customer_auth', token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: 'Logged in successfully',
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        mobile: customer.mobile,
        primeStatus: customer.primeStatus
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Logout
exports.logout = (req, res) => {
  res.clearCookie('customer_auth');
  res.json({ message: 'Logged out successfully' });
};

// Get Current Profile & Dashboard Data
exports.getDashboard = async (req, res) => {
  try {
    const customerId = req.user.id;
    const customer = await Customer.findById(customerId).populate('wishlist');

    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    // Aggregation: Fetch related data based on MOBILE NUMBER
    // This "auto-links" past interactions without needing database migration
    const mobile = customer.mobile;

    const [workshopBookings, testDrives, offers] = await Promise.all([
      WorkshopBooking.find({ mobile }).sort({ createdAt: -1 }),
      Booking.find({ mobile }).sort({ createdAt: -1 }).populate('listing'),
      CustomerOffer.find({ mobile }).sort({ createdAt: -1 }).populate('listing')
    ]);

    res.json({
      profile: customer,
      dashboard: {
        workshopBookings,
        testDrives,
        offers
      }
    });

  } catch (error) {
    console.error('Dashboard fetch error:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
};

// Update Preferences
exports.updatePreferences = async (req, res) => {
  try {
    const { brands, budgetRange, bodyTypes, transmission, fuelType } = req.body;
    
    const customer = await Customer.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          'preferences.brands': brands,
          'preferences.budgetRange': budgetRange,
          'preferences.bodyTypes': bodyTypes,
          'preferences.transmission': transmission,
          'preferences.fuelType': fuelType
        }
      },
      { new: true }
    );

    res.json({ message: 'Preferences updated', preferences: customer.preferences });
  } catch (error) {
    res.status(500).json({ message: 'Error updating preferences' });
  }
};

// Toggle Wishlist
exports.toggleWishlist = async (req, res) => {
  try {
    const { listingId } = req.body;
    const customer = await Customer.findById(req.user.id);
    
    const index = customer.wishlist.indexOf(listingId);
    if (index > -1) {
      customer.wishlist.splice(index, 1); // Remove
    } else {
      customer.wishlist.push(listingId); // Add
    }
    
    await customer.save();
    res.json({ message: 'Wishlist updated', wishlist: customer.wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Error updating wishlist' });
  }
};
