const express = require('express');
const router = express.Router();
const JobListing = require('../models/JobListing');

// @route   GET /api/careers/jobs
// @desc    Get all active job listings (Public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const jobs = await JobListing.find({ active: true }).sort({ createdAt: -1 });
    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   GET /api/careers/jobs/all
// @desc    Get all job listings including inactive (Admin)
// @access  Private (Admin)
router.get('/all', async (req, res) => {
  try {
    const jobs = await JobListing.find().sort({ createdAt: -1 });
    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   POST /api/careers/jobs
// @desc    Create a new job listing
// @access  Private (Admin)
router.post('/', async (req, res) => {
  try {
    const job = await JobListing.create(req.body);
    res.status(201).json({ success: true, data: job });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: messages });
    }
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   PUT /api/careers/jobs/:id
// @desc    Update a job listing
// @access  Private (Admin)
router.put('/:id', async (req, res) => {
  try {
    const job = await JobListing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    res.json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   DELETE /api/careers/jobs/:id
// @desc    Delete a job listing
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const job = await JobListing.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    await job.deleteOne();

    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

module.exports = router;
