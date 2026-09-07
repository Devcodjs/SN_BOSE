/**
 * Input validation helpers — returns array of error messages (empty = valid)
 */

const validateRegister = (body) => {
  const errors = [];
  const { name, email, password } = body;

  if (!name || name.trim().length === 0) {
    errors.push('Name is required');
  } else if (name.trim().length > 100) {
    errors.push('Name cannot exceed 100 characters');
  }

  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.push('Please provide a valid email');
  }

  if (!password) {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  return errors;
};

const validateLogin = (body) => {
  const errors = [];
  const { email, password } = body;

  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  }

  if (!password) {
    errors.push('Password is required');
  }

  return errors;
};

const validateIssue = (body) => {
  const errors = [];
  const { title, description, category } = body;

  const validCategories = ['Roads', 'Garbage', 'Water', 'Electricity', 'Sanitation', 'Other'];

  if (!title || title.trim().length === 0) {
    errors.push('Title is required');
  } else if (title.trim().length > 100) {
    // Must match Issue schema's `title.maxlength` (100) and the frontend's
    // maxLength on the title input. Previously this said 200, so a
    // 101-200 char title would pass here, upload images to Cloudinary,
    // and only then fail at issue.save() with a confusing 500-ish error —
    // leaving orphaned images behind.
    errors.push('Title cannot exceed 100 characters');
  }

  if (!description || description.trim().length === 0) {
    errors.push('Description is required');
  } else if (description.trim().length > 2000) {
    errors.push('Description cannot exceed 2000 characters');
  }

  if (!category) {
    errors.push('Category is required');
  } else if (!validCategories.includes(category)) {
    errors.push(`Category must be one of: ${validCategories.join(', ')}`);
  }

  // Adding severity validation
  const validSeverities = ['Low', 'Medium', 'High', 'Critical'];
  if (body.severity && !validSeverities.includes(body.severity)) {
    errors.push(`Severity must be one of: ${validSeverities.join(', ')}`);
  }

  return errors;
};

const validateStatusUpdate = (body) => {
  const errors = [];
  const { status } = body;

  const validStatuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

  if (!status) {
    errors.push('Status is required');
  } else if (!validStatuses.includes(status)) {
    errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
  }

  return errors;
};

const { validateVerhoeff } = require('../utils/verhoeff');

const validateAadhaarRequest = (body) => {
  const errors = [];
  const { aadhaarNumber } = body;

  if (!aadhaarNumber || typeof aadhaarNumber !== 'string') {
    errors.push('Aadhaar number is required');
    return errors;
  }

  const cleanNumber = aadhaarNumber.replace(/\s+/g, '');
  if (!/^\d{12}$/.test(cleanNumber)) {
    errors.push('Aadhaar number must consist of exactly 12 digits');
  } else if (!/^[2-9]\d{11}$/.test(cleanNumber)) {
    errors.push('Invalid Aadhaar number format');
  } else if (!validateVerhoeff(cleanNumber)) {
    errors.push('Invalid Aadhaar number checksum');
  }

  return errors;
};

const validateAadhaarVerify = (body) => {
  const errors = [];
  const { transactionId, otp } = body;

  if (!transactionId || typeof transactionId !== 'string' || transactionId.trim().length === 0) {
    errors.push('Transaction ID is required');
  }

  if (!otp || typeof otp !== 'string') {
    errors.push('OTP is required');
  } else if (!/^\d{6}$/.test(otp.trim())) {
    errors.push('OTP must be a 6-digit number');
  }

  return errors;
};

module.exports = {
  validateRegister,
  validateLogin,
  validateIssue,
  validateStatusUpdate,
  validateAadhaarRequest,
  validateAadhaarVerify,
};


