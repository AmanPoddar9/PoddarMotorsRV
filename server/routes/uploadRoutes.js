const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { requireAuth } = require('../middleware/auth'); // Import auth middleware

// Configure multer for memory storage
const storage = multer.memoryStorage();

// Multer for images only (inspections)
const uploadImages = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Multer for images and videos (testimonials)
const uploadMedia = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for videos
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'));
    }
  }
})

// Multer for employee documents (PDFs, images, Word docs)
const uploadDocuments = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, images, and Word documents are allowed'));
    }
  }
});

// S3 Client configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const bucketName = process.env.AWS_S3_BUCKET || 'realvaluestorage';

const { validateFile, sanitizeFilename } = require('../utils/fileValidation');

// Upload single image/video endpoint (for testimonials)
router.post('/single', requireAuth, uploadMedia.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided',
        error: 'Please upload an image or video file'
      });
    }

    // Validate file
    const validation = await validateFile(req.file);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: 'File validation failed',
        error: validation.errors.join(', ')
      });
    }

    // Sanitize filename
    const safeFilename = sanitizeFilename(req.file.originalname);
    const timestamp = Date.now();
    const folder = validation.isVideo ? 'testimonial-videos' : 'testimonial-images';
    const filename = `${folder}/${timestamp}-${Math.random().toString(36).substring(7)}-${safeFilename}`;

    // Upload to S3
    const params = {
      Bucket: bucketName,
      Key: filename,
      Body: req.file.buffer,
      ContentType: validation.mime,
      ACL: 'public-read',
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    const url = `https://${bucketName}.s3.ap-south-1.amazonaws.com/${filename}`;

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      url: url,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: `Failed to upload file: ${error.message}`,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Upload multiple images endpoint (for inspections)
router.post('/', requireAuth, uploadImages.array('images', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files provided',
      });
    }

    const uploadPromises = req.files.map(async (file) => {
      // Validate file
      const validation = await validateFile(file);
      if (!validation.valid) {
        throw new Error(`Invalid file ${file.originalname}: ${validation.errors.join(', ')}`);
      }

      // Use file buffer directly (compression handled client-side)
      // This saves Vercel execution time and costs
      const imageBuffer = file.buffer;
      
      console.log(`Uploading client-compressed image: ${(file.size / 1024).toFixed(0)}KB`);

      // Sanitize filename
      const safeFilename = sanitizeFilename(file.originalname);
      const timestamp = Date.now();
      const filename = `inspection-images/${timestamp}-${Math.random().toString(36).substring(7)}-${safeFilename.replace(/\.[^/.]+$/, '.jpg')}`; // Force .jpg extension

      // Upload to S3
      const params = {
        Bucket: bucketName,
        Key: filename,
        Body: imageBuffer,
        ContentType: 'image/jpeg',
        ACL: 'public-read',
      };

      const command = new PutObjectCommand(params);
      await s3Client.send(command);

      return `https://${bucketName}.s3.ap-south-1.amazonaws.com/${filename}`;
    });

    const imageUrls = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      urls: imageUrls,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: `Failed to upload images: ${error.message}`,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
});

// Upload employee documents endpoint
router.post('/documents', requireAuth, uploadDocuments.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided',
        error: 'Please upload a document file'
      });
    }

    // Validate file
    const validation = await validateFile(req.file);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: 'File validation failed',
        error: validation.errors.join(', ')
      });
    }

    // Sanitize filename
    const safeFilename = sanitizeFilename(req.file.originalname);
    const timestamp = Date.now();
    const folder = req.body.folder || 'employee-documents';
    const filename = `${folder}/${timestamp}-${Math.random().toString(36).substring(7)}-${safeFilename}`;

    // Upload to S3
    const params = {
      Bucket: bucketName,
      Key: filename,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'public-read',
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    const url = `https://${bucketName}.s3.ap-south-1.amazonaws.com/${filename}`;

    res.status(200).json({
      success: true,
      message: 'Document uploaded successfully',
      url: url,
    });
  } catch (error) {
    console.error('Document upload error:', error);
    
    // Check for multer file size error
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large',
        error: 'File size must be less than 5MB'
      });
    }
    
    res.status(500).json({
      success: false,
      message: `Failed to upload document: ${error.message}`,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;
