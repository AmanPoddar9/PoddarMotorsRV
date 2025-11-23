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
  region: 'ap-south-1',
  credentials: {
    accessKeyId: 'AKIAZQ3DNQ6CJUV7YGIH',
    secretAccessKey: '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',
  },
});

const bucketName = 'realvaluestorage';

// Upload image endpoint
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided',
      });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `blog-images/${timestamp}-${req.file.originalname.replace(/\s+/g, '-')}`;

    // Upload to S3
    const params = {
      Bucket: bucketName,
      Key: filename,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    // Construct the public URL
    const imageUrl = `https://${bucketName}.s3.ap-south-1.amazonaws.com/${filename}`;

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      url: imageUrl,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message,
    });
  }
});

module.exports = router;
