/**
 * Validation Middleware
 * 
 * Contains reusable validation functions for request data
 */

/**
 * Validate email format using regex
 * 
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate order data before creating an order
 * Middleware function to ensure all required fields are present and valid
 */
export function validateOrder(req, res, next) {
  const { customerEmail, items, totalAmount } = req.body;

  // Check if customer email is provided
  if (!customerEmail) {
    return res.status(400).json({
      success: false,
      message: 'Customer email is required',
    });
  }

  // Validate email format
  if (!validateEmail(customerEmail)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format',
    });
  }

  // Check if items is an array
  if (!Array.isArray(items)) {
    return res.status(400).json({
      success: false,
      message: 'Items must be an array',
    });
  }

  // Check if items array is not empty
  if (items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Items array cannot be empty',
    });
  }

  // Validate each item in the array
  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    // Check if item has name
    if (!item.name) {
      return res.status(400).json({
        success: false,
        message: `Item at index ${i} is missing 'name' field`,
      });
    }

    // Check if item has price
    if (item.price === undefined || item.price === null) {
      return res.status(400).json({
        success: false,
        message: `Item at index ${i} is missing 'price' field`,
      });
    }

    // Validate price is a positive number
    if (typeof item.price !== 'number' || item.price <= 0) {
      return res.status(400).json({
        success: false,
        message: `Item at index ${i} has invalid price. Price must be a positive number`,
      });
    }

    // Check if item has quantity
    if (!item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Item at index ${i} is missing 'quantity' field`,
      });
    }

    // Validate quantity is a positive number
    if (typeof item.quantity !== 'number' || item.quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: `Item at index ${i} has invalid quantity. Quantity must be a positive number`,
      });
    }
  }

  // Check if totalAmount is provided
  if (totalAmount === undefined || totalAmount === null) {
    return res.status(400).json({
      success: false,
      message: 'Total amount is required',
    });
  }

  // Validate totalAmount is a positive number
  if (typeof totalAmount !== 'number' || totalAmount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Total amount must be a positive number',
    });
  }

  // All validations passed, proceed to next middleware
  next();
}
