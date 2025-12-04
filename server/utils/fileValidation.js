// const fileType = require('file-type'); // Removed: file-type is ESM only

// Allowed image MIME types
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

// Allowed video MIME types
const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime'
];

// Maximum file size
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB for images
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB for videos

/**
 * Validate file type using magic number detection  
 * Prevents attacks where file extension doesn't match actual content
 */
const validateFileType = async (fileBuffer) => {
  // Dynamic import for ESM module
  const { fileTypeFromBuffer } = await import('file-type');
  const type = await fileTypeFromBuffer(fileBuffer);
  
  if (!type) {
    return { valid: false, error: 'Unable to determine file type' };
  }

  const isImage = ALLOWED_IMAGE_TYPES.includes(type.mime);
  const isVideo = ALLOWED_VIDEO_TYPES.includes(type.mime);

  if (!isImage && !isVideo) {
    return { 
      valid: false, 
      error: `Invalid file type: ${type.mime}. Only JPEG, PNG, WebP images and MP4, WebM, MOV videos are allowed.` 
    };
  }

  return { valid: true, mime: type.mime, isVideo };
};

/**
 * Validate file size
 */
const validateFileSize = (fileBuffer, isVideo = false) => {
  const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
  const maxSizeMB = isVideo ? 50 : 5;
  
  if (fileBuffer.length > maxSize) {
    return { 
      valid: false, 
      error: `File too large: ${(fileBuffer.length / 1024 / 1024).toFixed(2)}MB. Maximum size is ${maxSizeMB}MB.` 
    };
  }
  return { valid: true };
};

/**
 * Sanitize filename - remove special characters
 */
const sanitizeFilename = (filename) => {
  return filename
    .replace(/[^a-z0-9.]/gi, '_')  // Replace special chars with underscore
    .toLowerCase()
    .substring(0, 100);  // Limit length
};

/**
 * Complete file validation
 */
const validateFile = async (file) => {
  const errors = [];

  // Check if file exists
  if (!file) {
    return { valid: false, errors: ['No file provided'] };
  }

  // Check file type first to determine if it's a video
  const typeCheck = await validateFileType(file.buffer || file);
  if (!typeCheck.valid) {
    errors.push(typeCheck.error);
  }

  // Check file size with appropriate limit based on file type
  const sizeCheck = validateFileSize(file.buffer || file, typeCheck.isVideo);
  if (!sizeCheck.valid) {
    errors.push(sizeCheck.error);
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, mime: typeCheck.mime, isVideo: typeCheck.isVideo };
};

module.exports = {
  validateFileType,
  validateFileSize,
  sanitizeFilename,
  validateFile,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE
};
