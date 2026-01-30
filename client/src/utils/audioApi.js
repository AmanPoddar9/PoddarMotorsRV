import API_URL from '../app/config/api';

/**
 * Upload audio file to S3 with progress tracking
 * @param {File} audioFile - The audio file to upload
 * @param {Function} onProgress - Callback for upload progress (0-100)
 * @returns {Promise<string>} - The S3 URL of the uploaded file
 */
/**
 * Upload audio file to S3 with progress tracking (using XHR)
 * @param {File} audioFile - The audio file to upload
 * @param {Function} onProgress - Callback for upload progress (0-100)
 * @returns {Promise<string>} - The S3 URL of the uploaded file
 */
export async function uploadAudioToS3(audioFile, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('audio', audioFile);

    xhr.open('POST', `${API_URL}/api/upload/audio`);
    xhr.withCredentials = true; // Include JWT cookie

    // Upload progress event
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percentCompleted = Math.round((event.loaded * 100) / event.total);
        onProgress(percentCompleted);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response.url);
        } catch (error) {
          reject(new Error('Invalid server response'));
        }
      } else {
        try {
          const error = JSON.parse(xhr.responseText);
          reject(new Error(error.message || 'Failed to upload audio'));
        } catch (e) {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error during upload'));
    };

    xhr.send(formData);
  });
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
