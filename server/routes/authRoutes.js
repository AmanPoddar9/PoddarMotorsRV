const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { loginValidation } = require('../middleware/validators');

// Login – returns JWT in httpOnly cookie
router.post('/login', loginValidation, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Only allow admin OR employee role to login via this endpoint
    if (user.role !== 'admin' && user.role !== 'employee') {
      return res.status(403).json({ message: 'Access denied. Admin/Employee login only.' });
    }
    
    // Check if employee is active
    if (user.role === 'employee' && user.isActive === false) {
        return res.status(403).json({ message: 'Account is deactivated. Contact Admin.' });
    }

    const token = jwt.sign(
      { 
          id: user._id, 
          role: user.role,
          name: user.name,
          permissions: user.permissions 
      },
      process.env.JWT_SECRET,
      { expiresIn: '12h' } // Increased to 12h for employee convenience
    );

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      sameSite: isProduction ? 'lax' : 'lax',
      secure: isProduction,
      path: '/',
      domain: isProduction ? '.poddarmotors.com' : undefined
    };

    // Clear any existing dealer/customer auth cookies
    res.clearCookie('dealer_auth', cookieOptions);
    res.clearCookie('customer_auth', cookieOptions);

    // Set admin/employee auth cookie
    res.cookie('auth', token, {
      ...cookieOptions,
      maxAge: 12 * 60 * 60 * 1000 
    });

    res.json({ message: 'Logged in', role: user.role, permissions: user.permissions });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Unexpected error during login. Please try again.' });
  }
});

// Logout – clear cookie
router.post('/logout', (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';

  const cookieOptions = {
    httpOnly: true,
    sameSite: isProduction ? 'lax' : 'lax',
    secure: isProduction,
    path: '/',
    domain: isProduction ? '.poddarmotors.com' : undefined
  };

  // Clear all auth cookies
  res.clearCookie('auth', cookieOptions);
  res.clearCookie('dealer_auth', cookieOptions);
  res.clearCookie('customer_auth', cookieOptions);

  res.json({ message: 'Logged out' });
});

// Me – return current user info
router.get('/me', (req, res) => {
  const token = req.cookies?.auth;
  if (!token) return res.status(401).json({ message: 'Unauthenticated' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Allow both admin and employee
    if (payload.role !== 'admin' && payload.role !== 'employee') {
      return res.status(403).json({ message: 'Forbidden: Admin/Employee access only' });
    }

    res.json({ 
        id: payload.id, 
        role: payload.role, 
        name: payload.name, 
        permissions: payload.permissions 
    });
  } catch (e) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
