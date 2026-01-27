const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const token = req.cookies?.auth;
  if (!token) return res.status(401).json({ message: 'Unauthenticated' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { ...payload, _id: payload.id }; // Map standard JWT 'id' to Mongoose '_id'
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Enhanced requireRole to handle both Roles AND specific Permissions
function requireRole(...allowed) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthenticated' });

    // SUPER ADMIN CHECK: If user is 'admin', allow EVERYTHING.
    if (req.user.role === 'admin') return next();

    // Check if user has one of the allowed roles
    if (allowed.includes(req.user.role)) return next();

    // PERMISSION CHECK for Employees
    // If the 'allowed' array contains a permission string (e.g. 'workshop.manage')
    // and the user is an employee, check their permissions array.
    // PERMISSION CHECK (Granular)
    // Check if user has ANY of the specific permission strings passed in 'allowed'
    // This now applies to ALL roles (employee, bookingManager, etc.) not just 'employee'
    const userPermissions = req.user.permissions || [];
    const hasPermission = allowed.some(permission => userPermissions.includes(permission));
    
    if (hasPermission) return next();

    return res.status(403).json({ message: 'Forbidden' });
  };
}

module.exports = { requireAuth, requireRole };
