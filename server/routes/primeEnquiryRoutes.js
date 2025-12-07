const express = require('express');
const router = express.Router();
const PrimeEnquiry = require('../models/PrimeEnquiry');

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
// @desc    Get all Prime Enquiries
// @access  Admin only
router.get('/', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const enquiries = await PrimeEnquiry.find().sort({ createdAt: -1 });
    res.json({ success: true, count: enquiries.length, data: enquiries });
  } catch (error) {
    console.error('Error fetching prime enquiries:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   PATCH /api/prime-enquiry/:id
// @desc    Update enquiry status
// @access  Admin only
router.patch('/:id', requireAuth, requireRole('admin'), async (req, res) => {
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
