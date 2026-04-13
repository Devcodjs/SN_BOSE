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
  } else if (title.trim().length > 200) {
    errors.push('Title cannot exceed 200 characters');
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

module.exports = {
  validateRegister,
  validateLogin,
  validateIssue,
  validateStatusUpdate,
};
