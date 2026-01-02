// ========================================
// MAIN EXPRESS SERVER CONFIGURATION
// ========================================
// This is the entry point for the backend API
// Handles all middleware setup, route mounting, and server initialization

// ========================================
// 1. IMPORT CORE DEPENDENCIES
// ========================================
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

console.log('Starting application...');

// ========================================
// 2. IMPORT APPLICATION MODULES
// ========================================
// Database and Models
import { connectDB } from './config/database.js';
import Order from './models/order.js';

// Middleware
import { errorHandler } from './middleware/errorHandler.js';

// Routes
import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payments.js';

// Webhooks
import { handleStripeWebhook } from './webhooks/stripeWebhook.js';

console.log('All imports loaded successfully');

// ========================================
// 3. INITIALIZE EXPRESS APP
// ========================================
const app = express();

// ========================================
// 4. CONFIGURE CORS MIDDLEWARE
// ========================================
// Allow requests from the frontend URL specified in environment variables
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));

// ========================================
// 5. STRIPE WEBHOOK ROUTE
// ========================================
// IMPORTANT: This MUST come BEFORE express.json() middleware
// because Stripe requires the raw request body to verify the signature
app.post(
  '/api/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  handleStripeWebhook
);

// ========================================
// 6. BODY PARSING MIDDLEWARE
// ========================================
// Parse incoming JSON requests
app.use(express.json());

// Parse incoming URL-encoded requests (form data)
app.use(express.urlencoded({ extended: true }));

// ========================================
// 7. API ROUTES
// ========================================
// Mount order routes
app.use('/api/orders', orderRoutes);

// Mount payment routes
app.use('/api/payments', paymentRoutes);

// ========================================
// 8. HEALTH CHECK ENDPOINT
// ========================================
// Simple endpoint to verify that the server is running
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// ========================================
// 9. ERROR HANDLING MIDDLEWARE
// ========================================
// This should be the last middleware to catch all errors
app.use(errorHandler);

// ========================================
// 10. START SERVER FUNCTION
// ========================================
/**
 * Initializes database connection and starts the Express server
 * 
 * This function:
 * - Connects to the local MongoDB database
 * - Starts the Express server on the specified port
 * - Logs connection status with visual indicators
 * - Handles errors gracefully by exiting the process
 */
async function startServer() {
  try {
    console.log('Starting server...');
    
    // Connect to MongoDB (local instance)
    console.log(' Connecting to MongoDB database...');
    await connectDB();
    console.log(' MongoDB connected successfully');

    // Get port from environment or use default
    const PORT = process.env.PORT || 5000;

    // Start the Express server
    app.listen(PORT, () => {
      console.log('=================================');
      console.log(`✅ Server started successfully`);
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
      console.log('=================================');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

console.log('Calling startServer...');
startServer();

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

// ========================================
// 11. EXPORT & INITIALIZE
// ========================================
// Export app for testing purposes
export default app;

// Start the server if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}
