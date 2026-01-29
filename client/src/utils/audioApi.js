import API_URL from '../app/config/api';

/**
 * Upload audio file to S3
 * @param {File} audioFile - The audio file to upload
 * @returns {Promise<string>} - The S3 URL of the uploaded file
 */
export async function uploadAudioToS3(audioFile) {
  const formData = new FormData();
  formData.append('audio', audioFile);
  
  const response = await fetch(`${API_URL}/api/upload/audio`, {
    method: 'POST',
    body: formData,
    credentials: 'include' // Include JWT cookie
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to upload audio');
  }
  
  const data = await response.json();
  return data.url; // S3 URL
}

/**
 * Analyze audio call
 * @param {string} audioUrl - S3 URL of the audio file
 * @param {number} duration - Duration in seconds
 * @returns {Promise<object>} - Analysis ID and status
 */
export async function analyzeAudioCall(audioUrl, duration) {
  const response = await fetch(`${API_URL}/api/audio/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ audioUrl, duration }),
    credentials: 'include'
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to analyze audio');
  }
  
  return await response.json();
}

/**
 * Get call analysis details
 * @param {string} analysisId - The analysis ID
 * @returns {Promise<object>} - Call analysis data
 */
export async function getCallAnalysis(analysisId) {
  const response = await fetch(`${API_URL}/api/audio/${analysisId}`, {
    method: 'GET',
    credentials: 'include'
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch analysis');
  }
  
  const data = await response.json();
  return data.data;
}

/**
 * Get call history
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<object>} - Call history with pagination
 */
export async function getCallHistory(page = 1, limit = 20) {
  const response = await fetch(
    `${API_URL}/api/audio/history?page=${page}&limit=${limit}`,
    {
      method: 'GET',
      credentials: 'include'
    }
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch call history');
  }
  
  return await response.json();
}

/**
 * Confirm customer action (create/update/discard)
 * @param {string} analysisId - The analysis ID
 * @param {string} action - create | update | discard
 * @param {object} customerData - Customer data to save
 * @param {string} customerId - Customer ID for update action
 * @returns {Promise<object>} - Response data
 */
export async function confirmCustomerAction(analysisId, action, customerData, customerId = null) {
  const response = await fetch(`${API_URL}/api/audio/${analysisId}/confirm-customer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action,
      customerData,
      customerId
    }),
    credentials: 'include'
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to confirm customer action');
  }

  return await response.json();
}
