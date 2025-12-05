const jwt = require('jsonwebtoken');

/**
 * Middleware to verify dealer authentication via dealer_auth cookie.
 * Checks for valid JWT token and ensures the user has 'dealer' role.
 */
function requireDealerAuth(req, res, next) {
  const token = req.cookies?.dealer_auth;
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthenticated' });
  }
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // Ensure the token is for a dealer
    if (payload.role !== 'dealer') {
      return res.status(403).json({ message: 'Forbidden: Dealer access required' });
    }
    
    req.user = payload; // { id, role, name }
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = { requireDealerAuth };
