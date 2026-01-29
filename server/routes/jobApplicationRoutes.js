const express = require('express');
const router = express.Router();
const JobApplication = require('../models/JobApplication');

// @route   POST /api/careers/apply
// @desc    Submit a new job application
// @access  Public
router.post('/apply', async (req, res) => {
  try {
    const { name, email, phone, jobId, jobTitle, experience, linkedinProfile } = req.body;

    const application = await JobApplication.create({
      name,
      email,
      phone,
      jobId,
      jobTitle,
      experience,
      linkedinProfile
    });

    res.status(201).json({
      success: true,
      data: application,
      message: 'Application submitted successfully'
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

module.exports = router;
