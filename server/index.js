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
const defaultAllowedOrigins = [
  'https://www.poddarmotors.com',
  'https://poddarmotors.com',
  'http://localhost:3000',
  'https://poddar-motors-rv-hkxu.vercel.app'
];

const defaultAllowedHeaders = [
  'Content-Type',
  'Authorization',
  'X-Requested-With',
  'Accept',
  'Origin',
  'Cache-Control',
  'Pragma'
];

const envAllowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const normalizeOrigin = (origin) => {
  if (!origin) return null;

  // Strip trailing slashes early to simplify parsing
  const sanitizedOrigin = origin.replace(/\/+$/, '');

  try {
    const { protocol, hostname, port } = new URL(sanitizedOrigin);
    const isDefaultPort =
      (protocol === 'https:' && (port === '443' || port === '')) ||
      (protocol === 'http:' && (port === '80' || port === ''));

    return `${protocol}//${hostname}${isDefaultPort ? '' : `:${port}`}`;
  } catch {
    // Fallback: remove default ports and trailing slashes if URL parsing fails
    return sanitizedOrigin.replace(/:(80|443)$/, '');
  }
};

const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...envAllowedOrigins])];
const normalizedAllowedOrigins = allowedOrigins
  .map(normalizeOrigin)
  .filter(Boolean);
const allowedOriginPatterns = [/poddarmotors\.com$/, /vercel\.app$/];

const isAllowedOrigin = (origin) => {
  if (!origin) return true; // Same-origin requests

  const normalizedOrigin = normalizeOrigin(origin);
  if (!normalizedOrigin) return false;

  let hostname;
  try {
    hostname = new URL(normalizedOrigin).hostname;
  } catch {
    hostname = null;
  }

  return (
    normalizedAllowedOrigins.includes(normalizedOrigin) ||
    (hostname && allowedOriginPatterns.some((pattern) => pattern.test(hostname)))
  );
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    console.warn(`Blocked CORS origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  // Use browser-requested headers plus a stable default allowlist so OPTIONS requests
  // never omit common headers like Authorization or Content-Type.
  allowedHeaders: (req, callback) => {
    const requestHeaders = req.header('Access-Control-Request-Headers');
    const mergedHeaders = new Set(defaultAllowedHeaders);

    if (requestHeaders) {
      requestHeaders
        .split(',')
        .map((header) => header.trim())
        .filter(Boolean)
        .forEach((header) => mergedHeaders.add(header));
    }

    callback(null, Array.from(mergedHeaders));
  },
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Enable pre-flight requests for all routes with the same options
app.options('*', cors(corsOptions));
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
