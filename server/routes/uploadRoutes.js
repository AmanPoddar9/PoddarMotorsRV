const express = require('express');
const router = express.Router();
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
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

// Upload multiple images endpoint
router.post('/', upload.array('images', 20), async (req, res) => {
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

      // Sanitize filename
      const safeFilename = sanitizeFilename(file.originalname);
      const timestamp = Date.now();
      const filename = `inspection-images/${timestamp}-${Math.random().toString(36).substring(7)}-${safeFilename}`;

      // Upload to S3
      constparams = {
        Bucket: bucketName,
        Key: filename,
        Body: file.buffer,
        ContentType: validation.mime,
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
      message: 'Failed to upload images',
      error: error.message,
    });
  }
});

module.exports = router;
