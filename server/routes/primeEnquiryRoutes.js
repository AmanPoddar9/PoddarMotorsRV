const express = require('express');
const router = express.Router();
const PrimeEnquiry = require('../models/PrimeEnquiry');
const { sendEvent } = require('../services/facebookCAPIService');

const { requireAuth, requireRole } = require('../middleware/auth');

// @route   POST /api/prime-enquiry
// @desc    Submit a new Prime Membership enquiry
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, carModel, registrationNumber, selectedPlan } = req.body;

    // Basic validation
    if (!name || !phone || !selectedPlan) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide name, phone, and select a plan' 
      });
    }

    const newEnquiry = await PrimeEnquiry.create({
      name,
      phone,
      email,
      carModel,
      registrationNumber,
      selectedPlan
    });

    // [Meta CAPI] Fire Lead Event
    sendEvent('Lead', {
        name: name,
        email: email,
        phone: phone,
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
    }, {
        content_name: 'Prime Membership Enquiry',
        content_category: 'Membership',
        value: selectedPlan === 'Gold' ? 4999 : 999, // Estimated Value logic
        currency: 'INR'
    });

    res.status(201).json({
      success: true,
      data: newEnquiry,
      message: 'Enquiry submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting prime enquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @route   GET /api/prime-enquiry
// @desc    Get all Prime Enquiries (Paginated)
// @access  Admin only
router.get('/', requireAuth, requireRole('admin', 'customers.manage'), async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    let filter = {};
    if (status) {
      filter.status = status;
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await PrimeEnquiry.countDocuments(filter);

    const enquiries = await PrimeEnquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({ 
      success: true, 
      count: enquiries.length, 
      data: enquiries,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });

  } catch (error) {
    console.error('Error fetching prime enquiries:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   PATCH /api/prime-enquiry/:id
// @desc    Update enquiry status
// @access  Admin only
router.patch('/:id', requireAuth, requireRole('admin', 'customers.manage'), async (req, res) => {
  try {
    const { status } = req.body;
    const enquiry = await PrimeEnquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    res.json({ success: true, data: enquiry });
  } catch (error) {
    console.error('Error updating prime enquiry:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
