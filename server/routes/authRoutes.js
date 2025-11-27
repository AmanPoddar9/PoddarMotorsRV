const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Login – returns JWT in httpOnly cookie
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.validatePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });
  res.cookie('auth', token, { 
    httpOnly: true, 
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 2 * 60 * 60 * 1000 // 2 hours
  });
  res.json({ message: 'Logged in' });
});

// Logout – clear cookie
router.post('/logout', (req, res) => {
  res.clearCookie('auth', {
    httpOnly: true,
    sameSite: 'none',
    secure: true
  });
  res.json({ message: 'Logged out' });
});

// Me – return current user info (used by client UI for gating)
router.get('/me', (req, res) => {
  const token = req.cookies?.auth;
  if (!token) return res.status(401).json({ message: 'Unauthenticated' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ id: payload.id, role: payload.role });
  } catch (e) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
