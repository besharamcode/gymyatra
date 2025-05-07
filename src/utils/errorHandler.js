/**
 * Utility functions for improved error handling
 */

/**
 * Get a user-friendly error message from various error response formats
 * @param {Object|string} error - The error object from the API response
 * @returns {string} - User-friendly error message
 */
export const getErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';

  // Handle string errors
  if (typeof error === 'string') return error;

  // Handle axios error response
  if (error.response && error.response.data) {
    const { data } = error.response;
    
    // Handle message in data
    if (data.message) return data.message;
    
    // Handle errors array
    if (data.errors && Array.isArray(data.errors)) {
      return data.errors.map(err => err.msg || err.message || err).join('. ');
    }
    
    // Handle simple data string
    if (typeof data === 'string') return data;
  }

  // Handle network errors
  if (error.message && error.message.includes('Network Error')) {
    return 'Unable to connect to the server. Please check your internet connection.';
  }

  // Handle timeout errors
  if (error.code === 'ECONNABORTED') {
    return 'The request took too long to complete. Please try again later.';
  }

  // Handle other error types with message property
  if (error.message) return error.message;

  // Default fallback
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Map common error messages to more user-friendly versions
 * @param {string} message - The original error message
 * @returns {string} - User-friendly error message
 */
export const getUserFriendlyError = (message) => {
  const errorMap = {
    // Authentication errors
    'Invalid credentials': 'The email or password you entered is incorrect.',
    'Email already exists': 'This email is already registered. Please use a different email or try logging in.',
    'User not found': 'We couldn\'t find an account with that email. Please check your email or register.',
    'Invalid token': 'Your session has expired. Please log in again.',
    'Token expired': 'Your session has expired. Please log in again.',
    
    // Validation errors
    'Password must be at least 6 characters': 'Please use a password with at least 6 characters for better security.',
    'Invalid email format': 'Please enter a valid email address.',
    
    // Permission errors
    'Not authorized': 'You don\'t have permission to perform this action.',
    'Access denied': 'You don\'t have permission to access this resource.',
    
    // Server errors
    'Server error': 'Something went wrong on our end. Please try again later.',
    'Database error': 'We\'re having trouble connecting to our database. Please try again later.',
    
    // Request errors
    'Bad request': 'The request could not be processed. Please check your input and try again.',
    'Not found': 'The requested resource was not found.',
  };

  // Find exact matches
  if (errorMap[message]) return errorMap[message];
  
  // Check for partial matches if no exact match found
  for (const [key, value] of Object.entries(errorMap)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }
  
  // Return the original message if no matches found
  return message;
};

/**
 * Format specific validation errors for form fields
 * @param {Object} errors - Object with field names as keys and error messages as values
 * @returns {Object} - Formatted errors object
 */
export const formatFieldErrors = (errors) => {
  const formattedErrors = {};
  
  if (!errors) return formattedErrors;
  
  // Handle array of errors from express-validator
  if (Array.isArray(errors)) {
    errors.forEach(err => {
      if (err.param) {
        formattedErrors[err.param] = getUserFriendlyError(err.msg);
      }
    });
    return formattedErrors;
  }
  
  // Handle object with field keys
  Object.keys(errors).forEach(field => {
    formattedErrors[field] = getUserFriendlyError(errors[field]);
  });
  
  return formattedErrors;
}; 