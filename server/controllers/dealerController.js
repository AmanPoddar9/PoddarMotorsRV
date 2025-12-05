const Dealer = require('../models/Dealer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new dealer
exports.register = async (req, res) => {
  try {
    const { name, phone, email, password, businessName, gstNumber, address, city } = req.body;

    // Check if dealer already exists
    const existingDealer = await Dealer.findOne({ $or: [{ email }, { phone }] });
    if (existingDealer) {
      return res.status(400).json({ error: 'Dealer with this email or phone already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const dealer = new Dealer({
      name,
      phone,
      email,
      password: hashedPassword,
      businessName,
      gstNumber,
      address,
      city,
      status: 'Pending' // Default status
    });

    await dealer.save();

    res.status(201).json({ message: 'Registration successful. Please wait for admin approval.' });
  } catch (error) {
    console.error('Error registering dealer:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Login dealer
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find dealer
    const dealer = await Dealer.findOne({ email });
    if (!dealer) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, dealer.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check status
    if (dealer.status === 'Rejected' || dealer.status === 'Suspended') {
      return res.status(403).json({ error: 'Your account has been suspended or rejected.' });
    }

    // Generate Token
    const token = jwt.sign(
      { id: dealer._id, role: 'dealer', name: dealer.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set Cookie - using dealer_auth to avoid conflict with admin auth cookie
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('dealer_auth', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    });

    res.json({ 
      message: 'Login successful', 
      dealer: {
        id: dealer._id,
        name: dealer.name,
        email: dealer.email,
        status: dealer.status
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Logout
exports.logout = (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('dealer_auth', {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    path: '/'
  });
  res.json({ message: 'Logged out successfully' });
};

// Get current dealer profile
exports.getProfile = async (req, res) => {
  try {
    const dealer = await Dealer.findById(req.user.id).select('-password');
    if (!dealer) {
      return res.status(404).json({ error: 'Dealer not found' });
    }
    res.json(dealer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// Admin: Get all dealers
exports.getAllDealers = async (req, res) => {
  try {
    const dealers = await Dealer.find().select('-password').sort({ createdAt: -1 });
    res.json(dealers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dealers' });
  }
};

// Admin: Update dealer status
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const dealer = await Dealer.findByIdAndUpdate(id, { status }, { new: true }).select('-password');
    
    if (!dealer) {
      return res.status(404).json({ error: 'Dealer not found' });
    }

    res.json({ message: 'Dealer status updated', dealer });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
};

// Get current dealer (lightweight auth check)
exports.getMe = async (req, res) => {
  try {
    const dealer = await Dealer.findById(req.user.id).select('name email status');
    if (!dealer) {
      return res.status(404).json({ error: 'Dealer not found' });
    }
    res.json({ 
      id: dealer._id,
      role: 'dealer',
      name: dealer.name,
      email: dealer.email,
      status: dealer.status
    });
  } catch (error) {
    console.error('Error fetching dealer info:', error);
    res.status(500).json({ error: 'Failed to fetch dealer info' });
  }
};
