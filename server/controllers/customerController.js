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
// Import all spoke models
// Import all spoke models
const CarRequirement = require('../models/CarRequirement');
const SellRequest = require('../models/sellRequest');
const WorkshopBooking = require('../models/workshopBooking');
const TestDriveBooking = require('../models/testDriveBooking');
const CustomerOffer = require('../models/CustomerOffer');
const ServiceRecord = require('../models/ServiceRecord');

// Get Single Customer Details (Full 360 View)
exports.getCustomerDetails = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    
    const mobile = customer.mobile;

    // Parallel Fetch for "Grand Union" of Data
    // We match by ID (Strong Link) OR Mobile (Weak Link/Imported)
    const [
        policies,
        requirements,
        sellRequests,
        workshopBookings,
        serviceRecords,
        testDrives,
        offers
    ] = await Promise.all([
        // Insurance
        InsurancePolicy.find({ customer: customer._id }).sort({ policyEndDate: -1 }),
        
        // Buying (Requirements)
        CarRequirement.find({ 
            $or: [{ customer: customer._id }] // Requirements are usually linked by ID
        }).sort({ createdAt: -1 }),

        // Selling
        SellRequest.find({ 
            $or: [{ customer: customer._id }, { phoneNumber: mobile }] 
        }).sort({ createdAt: -1 }),

        // Service Bookings (Requests)
        WorkshopBooking.find({ 
            $or: [{ customer: customer._id }, { mobileNumber: mobile }] 
        }).sort({ createdAt: -1 }),

        // Service History (Actual Records)
        ServiceRecord.find({ customer: customer._id }).sort({ serviceDate: -1 }),

        // Test Drives
        TestDriveBooking.find({ 
            $or: [{ customer: customer._id }, { mobileNumber: mobile }] 
        }).sort({ createdAt: -1 }).populate('listing'),

        // Offers
        CustomerOffer.find({ 
            $or: [{ customer: customer._id }, { mobile: mobile }] 
        }).sort({ createdAt: -1 }).populate('listing')
    ]);

    res.json({ 
        ...customer.toObject(), 
        policies,
        requirements,
        sellRequests,
        workshopBookings,
        serviceRecords, 
        testDrives,
        offers
    }); 
  } catch (error) {
    console.error('360 Fetch Error:', error);
    res.status(500).json({ message: 'Error fetching customer details' });
  }
};

// Add Service Record (Admin)
exports.addServiceRecord = async (req, res) => {
    try {
        const { regNumber, serviceDate, serviceType, description, cost, mileage, nextServiceDue } = req.body;
        
        if (!regNumber) return res.status(400).json({ message: 'Registration number required' });

        const serviceRecord = new ServiceRecord({
            customer: req.params.id,
            regNumber,
            serviceDate: serviceDate || new Date(),
            serviceType,
            description,
            cost,
            mileage,
            nextServiceDue,
            enteredBy: req.user._id
        });

        await serviceRecord.save();
        res.status(201).json(serviceRecord);
    } catch (error) {
        console.error('Add Service Record Error:', error);
        res.status(500).json({ message: 'Error adding service record' });
    }
};
// Update Customer (Admin)
exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mobile, email, alternatePhones, areaCity, source, lifecycleStage } = req.body;

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
    if (areaCity) updates.areaCity = areaCity;
    if (source) updates.source = source;
    if (lifecycleStage) updates.lifecycleStage = lifecycleStage;

    const customer = await Customer.findByIdAndUpdate(id, updates, { new: true });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    res.json(customer);
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ message: 'Error updating customer' });
  }
};

// Add Note
exports.addCustomerNote = async (req, res) => {
    try {
        const { note } = req.body;
        if (!note) return res.status(400).json({ message: 'Note content required' });

        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        customer.notes.push({
            content: note,
            addedBy: req.user._id, // Assuming auth middleware populates req.user
            createdAt: new Date()
        });

        await customer.save();
        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: 'Error adding note' });
    }
};

// Manage Tags
exports.manageCustomerTags = async (req, res) => {
    try {
        const { tags } = req.body; // Expects array of strings
        if (!Array.isArray(tags)) return res.status(400).json({ message: 'Tags must be an array' });

        const customer = await Customer.findByIdAndUpdate(
            req.params.id, 
            { tags }, 
            { new: true }
        );
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: 'Error updating tags' });
    }
};

// Add Vehicle (Garage)
exports.addCustomerVehicle = async (req, res) => {
    try {
        const { regNumber, make, model, variant, yearOfManufacture } = req.body;
        if (!regNumber) return res.status(400).json({ message: 'Registration number required' });

        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        customer.vehicles.push({
            regNumber, make, model, variant, yearOfManufacture
        });

        await customer.save();
        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: 'Error adding vehicle' });
    }
};

// Delete Requirement (Admin)
exports.deleteRequirement = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await CarRequirement.findByIdAndDelete(id);
        if (!result) return res.status(404).json({ message: 'Requirement not found' });
        res.json({ message: 'Requirement deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting requirement' });
    }
};

// Update Vehicle (Garage)
exports.updateCustomerVehicle = async (req, res) => {
    try {
        const { id, vehicleId } = req.params;
        const { regNumber, make, model, variant, yearOfManufacture } = req.body;

        const customer = await Customer.findById(id);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        const vehicle = customer.vehicles.id(vehicleId);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

        if (regNumber) vehicle.regNumber = regNumber;
        if (make) vehicle.make = make;
        if (model) vehicle.model = model;
        if (variant) vehicle.variant = variant;
        if (yearOfManufacture) vehicle.yearOfManufacture = yearOfManufacture;

        await customer.save();
        res.json(customer);
    } catch (error) {
        console.error('Update vehicle error:', error);
        res.status(500).json({ message: 'Error updating vehicle' });
    }
};

// Delete Vehicle (Garage)
exports.deleteCustomerVehicle = async (req, res) => {
    try {
        const { id, vehicleId } = req.params;
        
        const customer = await Customer.findById(id);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        // Use pull to remove the subdocument
        customer.vehicles.pull({ _id: vehicleId });
        
        await customer.save();
        res.json(customer);
    } catch (error) {
        console.error('Delete vehicle error:', error);
        res.status(500).json({ message: 'Error deleting vehicle' });
    }
};
