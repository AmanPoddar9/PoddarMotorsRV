const Customer = require('../models/Customer');
const { generateCustomId } = require('../utils/idGenerator');
const InsurancePolicy = require('../models/InsurancePolicy');

// Search Customers (Admin)
// Matches against name, mobile, alternatePhones, email, or vehicle registration
exports.searchCustomers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: 'Search query required' });

    // Escape special chars for regex safety
    const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(safeQuery, 'i');

    const customers = await Customer.find({
      $or: [
        { name: regex },
        { mobile: regex },
        { alternatePhones: regex }, // Matches any element in array
        { email: regex },
        { customId: regex },
        { 'vehicles.regNumber': regex }
      ]
    })
    .select('name mobile alternatePhones email customId vehicles primeStatus')
    .sort({ createdAt: -1 })
    .limit(20);

    res.json(customers);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Error searching customers' });
  }
};

// Create Customer (Admin Manual Entry)
exports.createCustomer = async (req, res) => {
  try {
    const { name, mobile, email, vehicle, address } = req.body;

    // 1. Duplicate Check
    const existing = await Customer.findOne({ 
      $or: [{ mobile }, { email: email || 'dummy_nomatch' }] 
    });
    
    if (existing) {
      return res.status(400).json({ 
        message: 'Customer already exists', 
        customer: existing 
      });
    }

    // 2. Generate ID
    const customId = await generateCustomId();

    // 3. Create
    const customer = new Customer({
      customId,
      name,
      mobile,
      email,
      vehicles: vehicle ? [vehicle] : [], // Expects { regNumber, make, model... }
      addresses: address ? [address] : []
    });

    await customer.save();
    res.status(201).json({ message: 'Customer created', customer });

  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ message: 'Error creating customer' });
  }
};

// Get Single Customer Details (Full View)
exports.getCustomerDetails = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    
    // Fetch Policies
    const policies = await InsurancePolicy.find({ customer: customer._id }).sort({ policyEndDate: -1 });

    res.json({ ...customer.toObject(), policies }); // Return combined
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer details' });
  }
};
// Update Customer (Admin)
exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mobile, email, alternatePhones } = req.body;

    // Check unique constraints if changing mobile/email
    if (mobile || email) {
        const existing = await Customer.findOne({
            $and: [
                { _id: { $ne: id } }, // Not self
                { $or: [{ mobile }, { email: email || 'dummy_nomatch' }] }
            ]
        });
        if (existing) return res.status(400).json({ message: 'Mobile or Email already in use by another customer' });
    }

    const updates = {};
    if (name) updates.name = name;
    if (mobile) updates.mobile = mobile;
    if (email) updates.email = email;
    if (alternatePhones) updates.alternatePhones = alternatePhones;

    const customer = await Customer.findByIdAndUpdate(id, updates, { new: true });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    res.json(customer);
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ message: 'Error updating customer' });
  }
};
