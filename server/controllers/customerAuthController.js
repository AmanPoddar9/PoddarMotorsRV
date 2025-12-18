const Customer = require('../models/Customer');
const jwt = require('jsonwebtoken');
const WorkshopBooking = require('../models/workshopBooking');
const TestDriveBooking = require('../models/testDriveBooking'); // Test drives
const CustomerOffer = require('../models/CustomerOffer');
const Listing = require('../models/listing');

// Helper to create JWT
const createToken = (customer) => {
  return jwt.sign(
    { id: customer._id, role: 'customer', mobile: customer.mobile, name: customer.name },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // ... (Customer logic remains the same) ...
    // Check if exists by Mobile first (Primary Key)
    let customer = await Customer.findOne({ mobile });

    if (customer) {
        // CASE 1: Account exists but NO password (Imported/Offline Customer) -> CLAIM ACCOUNT
        if (!customer.passwordHash) {
            // Update details if missing
            if (!customer.email && email) customer.email = email;
            if (name) customer.name = name; // Update name if provided

            await customer.setPassword(password);
            await customer.save();
            
            // Generate Token & Login
            const token = createToken(customer);
            
            const isProduction = process.env.NODE_ENV === 'production';
            const cookieOptions = {
                httpOnly: true,
                sameSite: isProduction ? 'none' : 'lax', // 'lax' is better for local dev than 'none'
                secure: isProduction, // Secure only in production
                maxAge: 30 * 24 * 60 * 60 * 1000,
                path: '/'
            };
            // Do NOT set domain explicitly if backend URL differs from frontend
            res.cookie('customer_auth', token, cookieOptions);

            return res.status(201).json({
                message: 'Account linked and registered successfully',
                customer: {
                    id: customer._id,
                    name: customer.name,
                    email: customer.email,
                    mobile: customer.mobile,
                    primeStatus: customer.primeStatus
                }
            });
        }
        
        // CASE 2: Account exists AND has password -> ERROR
        return res.status(400).json({ message: 'Mobile number already registered. Please login.' });
    }

    // Check email uniqueness only if creating NEW account or if email provided doesn't match existing
    if (email) {
        const existingEmail = await Customer.findOne({ email });
        if (existingEmail) return res.status(400).json({ message: 'Email already registered' });
    }

    // Create NEW customer
    customer = new Customer({
      name,
      email,
      mobile,
      preferences: {},
      primeStatus: { isActive: false }
    });

    await customer.setPassword(password);
    await customer.save();

    const token = createToken(customer);
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/'
    };
    
    res.cookie('customer_auth', token, cookieOptions);

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

    const customer = await Customer.findOne({ email });
    if (!customer) return res.status(401).json({ message: 'Invalid credentials' });

    const isValid = await customer.validatePassword(password);
    if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = createToken(customer);

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/'
    };
    
    res.cookie('customer_auth', token, cookieOptions);

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
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction,
    path: '/'
  };
  
  res.clearCookie('customer_auth', cookieOptions);
  res.json({ message: 'Logged out successfully' });
};

const InsurancePolicy = require('../models/InsurancePolicy');

// ... imports ...

// Get Current Profile & Dashboard Data
exports.getDashboard = async (req, res) => {
  try {
    const customerId = req.user.id;
    const customer = await Customer.findById(customerId).populate('wishlist');

    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    // Aggregation: Fetch related data based on MOBILE NUMBER
    // This "auto-links" past interactions without needing database migration
    const mobile = customer.mobile;

    // Find ALL customer IDs closely matching this mobile (handle duplicates from imports)
    const linkedCustomerDocs = await Customer.find({ mobile }).select('_id');
    
    // Ensure we ALWAYS include the current customer's ID, interacting defensively with the aggregation
    const linkedCustomerIds = linkedCustomerDocs.map(c => c._id);
    const hasCurrentId = linkedCustomerIds.some(id => id.toString() === customer._id.toString());
    if (!hasCurrentId) {
        linkedCustomerIds.push(customer._id);
    }

    // Fetch everything in parallel
    const [workshopBookings, testDrives, offers, insurancePolicies] = await Promise.all([
      WorkshopBooking.find({ mobile }).sort({ createdAt: -1 }),
      TestDriveBooking.find({ mobileNumber: mobile }).sort({ createdAt: -1 }).populate('listing'),
      CustomerOffer.find({ mobile }).sort({ createdAt: -1 }).populate('listing'),
      // Fetch policies where the customer ID matches ANY of the IDs associated with this mobile
      InsurancePolicy.find({ customer: { $in: linkedCustomerIds } }).sort({ policyEndDate: -1 })
    ]);
    
    res.json({
      profile: customer,
      dashboard: {
        workshopBookings,
        testDrives,
        offers,
        insurancePolicies
      }
    });

  } catch (error) {
    console.error('Dashboard fetch error:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
};

// Update Own Profile (Name/Mobile)
exports.updateProfile = async (req, res) => {
    try {
        const { name, mobile } = req.body;
        const customerId = req.user.id;

        // Check if mobile is taken by someone else
        if (mobile) {
            const existing = await Customer.findOne({ mobile, _id: { $ne: customerId } });
            if (existing) {
                return res.status(400).json({ message: 'Mobile number already in use by another account.' });
            }
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (mobile) updateData.mobile = mobile;

        const updatedCustomer = await Customer.findByIdAndUpdate(customerId, updateData, { new: true });

        res.json({ 
            message: 'Profile updated successfully', 
            customer: updatedCustomer 
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Error updating profile' });
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

// ADMIN: Get All Customers (with pagination & search)
exports.getAllCustomers = async (req, res) => {
  try {
    const { primeStatus, search, page = 1, limit = 20 } = req.query;
    
    let filter = {};
    
    // Status Filter
    if (primeStatus === 'active') {
      filter['primeStatus.isActive'] = true;
    } else if (primeStatus === 'inactive') {
      filter['primeStatus.isActive'] = false;
    }

    // Search Filter (Name, Email, Mobile)
    if (search) {
      filter['$or'] = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Customer.countDocuments(filter);
    
    const customers = await Customer.find(filter)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      customers,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });

  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Error fetching customers' });
  }
};

// ADMIN: Update Prime Status
exports.updatePrimeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, tier, expiryDate, benefits } = req.body;

    const customer = await Customer.findById(id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    // Update Prime status
    customer.primeStatus.isActive = isActive;
    customer.primeStatus.tier = tier || (isActive ? 'Gold' : null);
    customer.primeStatus.expiryDate = expiryDate || null;
    customer.primeStatus.benefits = benefits || [];
    customer.primeStatus.servicesAvailed = req.body.servicesAvailed || [];

    await customer.save();

    res.json({ 
      message: 'Prime status updated successfully',
      customer: {
        id: customer._id,
        name: customer.name,
        primeStatus: customer.primeStatus
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating Prime status' });
  }
};

// Get Current User (Lightweight)
exports.getMe = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id).select('-passwordHash').populate('wishlist');
    if (!customer) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user: customer });
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
