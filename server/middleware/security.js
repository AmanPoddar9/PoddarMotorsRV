const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: 429,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }
});

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 login attempts per hour
  message: {
    status: 429,
    message: 'Too many login attempts, please try again after an hour'
  }
});

const setupSecurity = (app) => {
  // Set security HTTP headers
  app.use(helmet());

  // Apply global rate limiting to all requests
  app.use('/api', limiter);
  
  // Apply stricter limits to auth routes
  app.use('/api/auth/login', authLimiter);
  app.use('/api/admin/login', authLimiter);

  console.log('✅ Security middleware initialized');
};

module.exports = { setupSecurity, limiter, authLimiter };
