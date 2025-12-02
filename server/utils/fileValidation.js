// const fileType = require('file-type'); // Removed: file-type is ESM only

// Allowed image MIME types
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

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

  if (!ALLOWED_IMAGE_TYPES.includes(type.mime)) {
    return { 
      valid: false, 
      error: `Invalid file type: ${type.mime}. Only JPEG, PNG, and WebP images are allowed.` 
    };
  }

  return { valid: true, mime: type.mime };
};

/**
 * Validate file size
 */
const validateFileSize = (fileBuffer) => {
  if (fileBuffer.length > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: `File too large: ${(fileBuffer.length / 1024 / 1024).toFixed(2)}MB. Maximum size is 5MB.` 
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

  // Check file size
  const sizeCheck = validateFileSize(file.buffer || file);
  if (!sizeCheck.valid) {
    errors.push(sizeCheck.error);
  }

  // Check file type
  const typeCheck = await validateFileType(file.buffer || file);
  if (!typeCheck.valid) {
    errors.push(typeCheck.error);
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, mime: typeCheck.mime };
};

module.exports = {
  validateFileType,
  validateFileSize,
  sanitizeFilename,
  validateFile,
  ALLOWED_IMAGE_TYPES,
  MAX_FILE_SIZE
};
