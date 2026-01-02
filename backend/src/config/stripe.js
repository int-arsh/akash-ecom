import Stripe from 'stripe';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Stripe API client with secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export { stripe };
