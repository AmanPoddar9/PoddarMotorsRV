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

function requireRole(...allowed) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthenticated' });
    if (allowed.includes(req.user.role)) return next();
    return res.status(403).json({ message: 'Forbidden' });
  };
}

module.exports = { requireAuth, requireRole };
