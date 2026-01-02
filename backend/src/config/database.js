import mongoose from 'mongoose';

// Get MongoDB connection URI from environment or use local default
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stripe_checkout';

/**
 * Connect to local MongoDB database using Mongoose
 * Handles connection errors and logs connection status
 */
export async function connectDB() {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('URI:', MONGODB_URI);
    
    // Connect to MongoDB with specified options
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Log successful connection details
    const host = conn.connection.host;
    const name = conn.connection.name;
    console.log('MongoDB connected');
    console.log(`Host: ${host}`);
    console.log(`Database: ${name}`);

    return conn;
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }
}
