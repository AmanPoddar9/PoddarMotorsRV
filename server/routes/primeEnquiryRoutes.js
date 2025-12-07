const express = require('express');
const router = express.Router();
const PrimeEnquiry = require('../models/PrimeEnquiry');

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

module.exports = router;
