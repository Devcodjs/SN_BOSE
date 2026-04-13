/**
 * Standardized API response helpers
 */

const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    // If data has pagination info, spread it
    if (data.pagination) {
      response.count = data.count;
      response.pagination = data.pagination;
      response.data = data.data;
    } else {
      response.data = data;
    }
  }

  return res.status(statusCode).json(response);
};

const sendError = (res, message = 'Server Error', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

module.exports = { sendSuccess, sendError };
