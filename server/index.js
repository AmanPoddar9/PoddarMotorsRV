const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();
const validateEnv = require('./config/validateEnv');

// Validate environment variables immediately
validateEnv();
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { setupSecurity } = require('./middleware/security');
const errorHandler = require('./middleware/errorHandler');

const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const featuresRoutes = require('./routes/featuresRoutes');
const listingRoutes = require('./routes/listingRoutes');
const sellRequestRoutes = require('./routes/sellRequestRoutes');
const scrapRequestRoutes = require('./routes/scrapRequestRoutes');
const blogRoutes = require('./routes/blogRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const twilioRoutes = require('./routes/twilioRoutes');
const authRoutes = require('./routes/authRoutes');
const workshopBookingRoutes = require('./routes/workshopBookingRoutes');
const customerOfferRoutes = require('./routes/customerOfferRoutes');
const videoRoutes = require('./routes/videoRoutes');
const inspectionRoutes = require('./routes/inspectionRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const auctionRoutes = require('./routes/auctionRoutes');
const dealerRoutes = require('./routes/dealerRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const { requireAuth, requireRole } = require('./middleware/auth');

const cors = require('cors');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 4000;

// FIX: Force DNS to use Google's Public DNS to resolve MongoDB SRV records
// This fixes the 'querySrv ENOTFOUND' error on some local networks
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
  console.log('✅ DNS servers set to Google Public DNS');
} catch (error) {
  console.error('⚠️ Could not set custom DNS servers:', error);
}

connectDB();

// Request logging
app.use(morgan('dev'));

// Trust proxy for Vercel (required for rate limiting and correct IP identification)
app.set('trust proxy', 1);

// Security Middleware (Helmet, Rate Limiting, Sanitization)
setupSecurity(app);

app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'https://www.poddarmotors.com',
      'https://poddarmotors.com',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'https://poddar-motors-rv-hkxu.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Allow any Vercel preview deployment
    if (origin.includes('.vercel.app')) {
      return callback(null, true);
    }
    
    // Allow local network IPs for mobile testing (e.g., 192.168.x.x)
    const isLocalNetwork = /^http:\/\/(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|127\.0\.0\.1).*/.test(origin);

    if (allowedOrigins.indexOf(origin) !== -1 || isLocalNetwork) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(compression());

// Data sanitization against NoSQL query injection (Must be after body parser)
app.use(require('express-mongo-sanitize')());

app.get('/', (req, res) => {
  res.send('Real Value backend Server');
});

app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    database: dbStatus
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/testimonials', require('./routes/testimonialRoutes'));

app.use('/api/features', featuresRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/sellRequests', sellRequestRoutes);
app.use('/api/scrapRequests', scrapRequestRoutes);
app.use('/api/workshop-bookings', workshopBookingRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/twilio', twilioRoutes);
app.use('/api/customer-offers', customerOfferRoutes);
app.use('/api/customer', require('./routes/customerRoutes')); // Customer Ecosystem
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/price-alerts', require('./routes/priceAlerts'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/videos', videoRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/dealers', dealerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/prime-enquiry', require('./routes/primeEnquiryRoutes'));
app.use('/api/insurance', require('./routes/insuranceRoutes'));  // Insurance CRM

// Global Error Handler (Must be last)
app.use(errorHandler);

// Start Server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Initialize WebSocket
const websocket = require('./websocket');
websocket.init(server);

// Handle Unhandled Promise Rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;
