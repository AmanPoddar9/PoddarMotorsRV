const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { loginValidation } = require('../middleware/validators');

// Login – returns JWT in httpOnly cookie
router.post('/login', loginValidation, async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.validatePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });
  
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('auth', token, { 
    httpOnly: true, 
    sameSite: 'lax',
    secure: isProduction,
    maxAge: 2 * 60 * 60 * 1000, // 2 hours
    path: '/'
  });
  res.json({ message: 'Logged in' });
});

// Logout – clear cookie
router.post('/logout', (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('auth', {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    path: '/'
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
