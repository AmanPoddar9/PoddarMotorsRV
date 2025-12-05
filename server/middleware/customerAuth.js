const jwt = require('jsonwebtoken');

/**
 * Middleware to verify customer authentication via customer_auth cookie.
 * Checks for valid JWT token and ensures the user has 'customer' role.
 */
function requireCustomerAuth(req, res, next) {
  const token = req.cookies?.customer_auth;
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthenticated' });
  }
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // Ensure the token is for a customer
    if (payload.role !== 'customer') {
      return res.status(403).json({ message: 'Forbidden: Customer access required' });
    }
    
    req.user = payload; // { id, role, mobile, name }
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = { requireCustomerAuth };
