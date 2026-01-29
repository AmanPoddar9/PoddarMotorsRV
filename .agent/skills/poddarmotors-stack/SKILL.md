---
name: PoddarMotorsRV Tech Stack & Architecture
description: Complete technical stack, architecture, models, and integrations for PoddarMotorsRV Used Car Dealership platform
---

# PoddarMotorsRV Tech Stack & Architecture

## Project Overview
**PoddarMotorsRV** is a comprehensive Used Car Dealership Management System with customer-facing website, admin portal, dealer portal, and sales tools.

---

## Tech Stack

### Backend
- **Framework**: Node.js + Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (cookie-based), bcrypt for password hashing
- **Real-time**: Socket.io (WebSocket for live updates)
- **Server**: Vercel Serverless (production), Nodemon (development)

### Frontend
- **Framework**: Next.js 14.2.2 (React 18, App Router)
- **Styling**: Tailwind CSS, Ant Design (antd 5.16.2)
- **UI Libraries**: 
  - Framer Motion (animations)
  - Heroicons, React Icons
  - Chart.js + react-chartjs-2 (analytics)
- **State Management**: React Context API
- **Forms**: React Hook Form implied by patterns
- **Notifications**: react-hot-toast

### File Storage
- **Primary**: AWS S3 (`@aws-sdk/client-s3` v3.592.0)
- **Region**: `ap-south-1` (Mumbai)
- **Bucket**: `realvaluestorage` (public-read ACL)
- **Image Processing**: Sharp (server-side compression), browser-image-compression (client-side)
- **Upload Limits**: 
  - Images: 5MB
  - Videos (testimonials): 50MB
  - Documents: 5MB

### Third-Party Integrations
- **Payments**: Razorpay (v2.9.6)
- **SMS/WhatsApp**: Twilio (v5.3.5)
- **AI**: OpenAI (v6.9.1), ElevenLabs (voice)
- **Meta**: Facebook Conversions API (Meta Pixel)
- **Email**: Nodemailer (v7.0.12)

### Security
- **Helmet.js**: HTTP headers security
- **express-mongo-sanitize**: NoSQL injection prevention
- **express-rate-limit**: Rate limiting
- **express-validator**: Input validation
- **File Validation**: Custom validation in `utils/fileValidation.js`

### DevOps
- **Version Control**: Git/GitHub
- **CI/CD**: Vercel auto-deploy
- **Monitoring**: Morgan (HTTP logging)
- **Cron Jobs**: node-cron (v4.2.1) - e.g., insurance reminders

---

## Key MongoDB Models

### Customer (`models/Customer.js`)
**Purpose**: Unified customer data hub for leads, prospects, and customers

**Key Fields**:
- **Identity**: `customId` (PM-25-00001), `name`, `email`, `mobile`, `alternatePhones[]`, `areaCity`
- **Classification**: 
  - `source`: Walk-in | TeleCRM | GoogleSheet | Website | Workshop | Facebook | Import | Other | Voice Agent
  - `lifecycleStage`: Lead | Prospect | Customer | Churned
  - `tags[]`: Flexible labels (VIP, Difficult, etc.)
- **Vehicles**: Array of owned vehicles (regNumber, chassisNo, make, model, etc.)
- **Prime Membership**: `primeStatus` (isActive, tier, expiryDate, benefits, servicesAvailed)
- **E-commerce**: `cart[]`, `orders[]`, `addresses[]`, `wishlist[]`
- **Preferences**: `brands[]`, `budgetRange`, `bodyTypes[]`, `transmission`, `fuelType`
- **Notes**: Timeline notes with `addedBy` (User ref) and `createdAt`

**Pre-save Middleware**:
- Normalizes mobile (last 10 digits only)
- Lowercases and trims email

### Other Core Models
- **User** (`models/user.js`): Admin/Employee authentication
- **Employee**: Staff with permissions, documents, assets
- **Dealer**: Partner dealers (for auctions)
- **Listing** (`models/listing.js`): Used car inventory
- **InspectionReport** (`models/InspectionReport.js`): 180+ field vehicle inspection
- **InspectionBooking**: Booking requests (supports BS_INSPECTION & PDI types)
- **InsurancePolicy**: Insurance CRM (5492 bytes schema)
- **Auction/Bid**: Live auction system
- **TestDriveBooking, WorkshopBooking, ScrapRequest, SellRequest**: Customer requests
- **CallLog**: Telephony tracking
- **Interaction**: Customer interaction history
- **JobListing/JobApplication**: HR module
- **Blog, Video, Testimonial**: Content management

---

## Authentication & Authorization

### Auth Middleware (`middleware/auth.js`)
- `requireAuth()`: Validates JWT cookie
- `requireRole(...allowed)`: RBAC + Permission checks
  - **Super Admin**: `role: 'admin'` → Full access
  - **Role-based**: employee, bookingManager, dealer
  - **Permission-based**: Granular permissions array (e.g., 'workshop.manage')

### JWT Payload
```javascript
{
  id: user._id,
  role: 'admin' | 'employee' | 'bookingManager' | 'dealer',
  permissions: ['workshop.manage', 'inspection.view'],
  email: 'user@example.com'
}
```

---

## File Upload Architecture

### S3 Upload Flow
**File**: `routes/uploadRoutes.js`

Three endpoints:
1. **POST `/api/upload`**: Multiple images (inspections) - max 20 images, 5MB each
2. **POST `/api/upload/single`**: Single media (testimonials) - images/videos, 50MB
3. **POST `/api/upload/documents`**: Employee documents - PDF/images/Word, 5MB

**S3 Configuration**:
```javascript
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});
```

**Folder Structure**:
- `inspection-images/`: Vehicle inspection photos
- `testimonial-images/`: Customer testimonial images
- `testimonial-videos/`: Customer testimonial videos
- `employee-documents/`: Employee docs (Aadhaar, PAN, etc.)

**Security**:
- Filename sanitization via `utils/fileValidation.js`
- MIME type validation
- File type detection beyond extension

---

## Environment Variables

**File**: `server/.env.example`

```bash
# Core
PORT=4000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret_here
FRONTEND_URL=https://poddar-motors-rv.vercel.app

# AWS S3
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=ap-south-1
AWS_S3_BUCKET=realvaluestorage

# Twilio (SMS/WhatsApp)
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+91XXXXXXXXXX
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Business
BUSINESS_NAME=Poddar Motors RV
BUSINESS_ADDRESS=Your showroom address here
BUSINESS_PHONE=+91XXXXXXXXXX
WEBSITE_URL=https://poddarmotors.com
SALES_FORWARDING_NUMBER=+91XXXXXXXXXX

# Meta Conversions API
META_PIXEL_ID=your_pixel_id
META_API_ACCESS_TOKEN=your_access_token
```

---

## Frontend Structure

### Directory Layout
```
client/src/
├── app/                    # Next.js App Router
│   ├── admin/              # Admin portal pages
│   ├── dealer/             # Dealer portal pages
│   ├── employee/           # Employee portal pages
│   ├── customer/           # Customer-facing pages
│   └── ...
└── components/             # Reusable React components
```

### Context Providers
- **Customer Context**: Customer authentication state
- Likely others for Admin/Employee auth (pattern observed)

---

## Existing Integrations

### OpenAI (Already Installed)
- **Package**: `openai` v6.9.1 (server-side)
- **Use Cases**: Blog generation (`blogGeneratorController.js`)
- **Ready for**: Audio analysis integration

### Twilio
- **Controllers**: `controllers/twilioController.js` (17.8KB - extensive)
- **Routes**: `routes/twilioRoutes.js`
- **Capabilities**: SMS, WhatsApp, voice calls
- **Use Cases**: Customer notifications, OTP, marketing

### ElevenLabs
- **Controller**: `controllers/elevenLabsController.js` (14.9KB)
- **Routes**: `routes/elevenLabsRoutes.js`
- **Use Cases**: Text-to-speech for voice agent

### Meta Conversions API
- **Controller**: `controllers/metaController.js`
- **Purpose**: Track conversions for Facebook ads

---

## Development Workflow

### Running Locally
**Commands** (as seen in terminal):
- Server: `npm run start` (in `/server`) - Uses nodemon
- Client: `npm run dev` (in `/client`) - Next.js dev server

### Deployment
- **Platform**: Vercel
- **Constraints**: 
  - 4.5MB request limit (critical for file uploads)
  - 10s execution timeout for serverless functions
- **Solution for Large Files**: Upload to S3 first, pass URL to backend

---

## Custom Workflows

### Available Workflows
Located in `.agent/workflows/`:
1. **`/add_admin_feature`**: Add features to Admin Portal (RBAC, navigation, design)
2. **`/pre_deploy_check`**: Safety checks before deployment
3. **`/scaffold_feature`**: Full-stack feature scaffolding

---

## Key Business Logic Patterns

### Customer ID Generation
Uses `Counter` model to auto-increment IDs (e.g., PM-25-00001)

### Role-Based Dashboard Access
- **Admin**: Full CRUD on all entities
- **Employee**: Permission-based (e.g., 'inspection.create', 'customer.view')
- **Dealer**: Auction bidding, listing submission
- **Customer**: View own data, book services

### Data Normalization
- Mobile numbers: Last 10 digits only
- Emails: Lowercased and trimmed
- Filenames: Sanitized before S3 upload

---

## Important Notes

### DO NOT ASK ABOUT:
1. ✅ **S3 Integration** - Already configured, use `uploadRoutes.js` patterns
2. ✅ **Customer Model** - Documented above, read `models/Customer.js`
3. ✅ **Authentication** - JWT cookie-based, `middleware/auth.js`
4. ✅ **OpenAI** - Already installed, v6.9.1
5. ✅ **Environment Variables** - See `.env.example`

### VERIFY BEFORE ASKING:
1. Check if model exists in `server/models/`
2. Check if route exists in `server/routes/`
3. Check if controller exists in `server/controllers/`
4. Check if package is in `server/package.json` or `client/package.json`

---

## Common Code Patterns

### S3 Upload Pattern
```javascript
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

const params = {
  Bucket: process.env.AWS_S3_BUCKET,
  Key: `folder/${timestamp}-${filename}`,
  Body: fileBuffer,
  ContentType: 'image/jpeg',
  ACL: 'public-read',
};

await s3Client.send(new PutObjectCommand(params));
const url = `https://${bucketName}.s3.ap-south-1.amazonaws.com/${filename}`;
```

### Protected Route Pattern
```javascript
router.post('/endpoint', requireAuth, requireRole('admin', 'employee'), async (req, res) => {
  // Controller logic
});
```

### Customer Update Pattern
```javascript
const customer = await Customer.findOne({ mobile: normalizedMobile });
if (customer) {
  // Update existing
  customer.field = newValue;
  await customer.save();
} else {
  // Create new
  const newCustomer = new Customer({ ... });
  await newCustomer.save();
}
```

---

**Last Updated**: 2026-01-29 (Auto-generated from codebase analysis)
