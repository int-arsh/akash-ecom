/**
 * Global Error Handler Middleware
 * 
 * Catches all errors thrown in the application and returns
 * formatted error responses to the client.
 */

export function errorHandler(err, req, res, next) {
  // Log error for debugging
  console.error('Error occurred:', err);

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors,
    });
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      message: `Duplicate entry for ${field}. This value already exists.`,
    });
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}. Please provide a valid ID format.`,
    });
  }

  // Handle Stripe card errors
  if (err.type === 'StripeCardError') {
    return res.status(400).json({
      success: false,
      message: err.message || 'Card error occurred',
    });
  }

  // Handle Stripe invalid request errors
  if (err.type === 'StripeInvalidRequestError') {
    return res.status(400).json({
      success: false,
      message: err.message || 'Invalid request to Stripe',
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token. Please authenticate again.',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired. Please authenticate again.',
    });
  }

  // Default error handler
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  // Prepare response object
  const errorResponse = {
    success: false,
    message: message,
  };

  // Include stack trace only in development mode
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  return res.status(statusCode).json(errorResponse);
}
