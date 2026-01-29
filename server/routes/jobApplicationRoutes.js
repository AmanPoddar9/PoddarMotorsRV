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

// @route   GET /api/careers/apply
// @desc    Get all job applications
// @access  Private (Admin)
router.get('/', async (req, res) => {
  try {
    const applications = await JobApplication.find().sort({ createdAt: -1 });
    res.json({ success: true, count: applications.length, data: applications });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   PATCH /api/careers/apply/:id
// @desc    Update application status
// @access  Private (Admin)
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    res.json({ success: true, data: application });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

module.exports = router;
