const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const testimonialsRoutes = require('./routes/testimonialsRoutes');
const offersRoutes = require('./routes/offersRoutes');
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
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedDomains = [
      'poddarmotors.com',
      'www.poddarmotors.com',
      'localhost',
      'poddar-motors-rv-hkxu.vercel.app'
    ];

    const isAllowed = allowedDomains.some(domain => origin.includes(domain));
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin); // Log blocked origins for debugging
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Set-Cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
app.use(cookieParser());
app.use(express.json());
app.use(compression());

app.get('/', (req, res) => {
  res.send('Real Value backend Server');
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/offers', offersRoutes);
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
