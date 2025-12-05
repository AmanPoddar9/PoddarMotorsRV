/**
 * Error handling utilities for consistent error management
 */

/**
 * Log error with context for debugging
 * @param {string} context - Where the error occurred
 * @param {string} message - Error message
 * @param {Error} error - The error object
 */
export function logError(context, message, error) {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context}]`, message, error);
  }
  
  // In production, you would send this to an error tracking service like Sentry
  // trackError(context, message, error);
}

/**
 * Get user-friendly error message
 * @param {Error} error - The error object
 * @returns {string} User-friendly error message
 */
export function getUserFriendlyMessage(error) {
  // Network errors
  if (error.message.includes('fetch') || error.message.includes('network')) {
    return 'Unable to connect. Please check your internet connection and try again.';
  }
  
  // Timeout errors
  if (error.message.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }
  
  // Server errors
  if (error.status >= 500) {
    return 'Something went wrong on our end. Please try again later.';
  }
  
  // Client errors
  if (error.status >= 400 && error.status < 500) {
    return error.message || 'Invalid request. Please check your input.';
  }
  
  // Default
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Fetch with error handling
 * @param {string} url - URL to fetch
 * @param {object} options - Fetch options
 * @param {string} context - Context for error logging
 * @returns {Promise} Fetch response
 */
export async function fetchWithErrorHandling(url, options = {}, context = 'API') {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
      error.status = response.status;
      throw error;
    }
    
    return await response.json();
  } catch (error) {
    logError(context, `Failed to fetch ${url}`, error);
    throw error;
  }
}

/**
 * Retry fetch with exponential backoff
 * @param {Function} fetchFn - Fetch function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Initial delay in ms
 * @returns {Promise} Result of fetch
 */
export async function retryFetch(fetchFn, maxRetries = 3, delay = 1000) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetchFn();
    } catch (error) {
      lastError = error;
      
      if (i < maxRetries - 1) {
        // Exponential backoff: delay * 2^i
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
}
