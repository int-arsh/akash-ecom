import { stripe } from '../config/stripe.js';

/**
 * Stripe Service Class
 * 
 * Handles all Stripe API interactions including payment intents,
 * checkout sessions, and webhook event verification.
 */
class StripeService {
  /**
   * Create a Stripe Payment Intent
   * 
   * @param {number} amount - Amount in dollars (will be converted to cents)
   * @param {string} currency - Currency code (default: 'usd')
   * @param {object} metadata - Additional metadata to attach to the payment intent
   * @returns {Promise<object>} The created payment intent
   */
  async createPaymentIntent(amount, currency = 'usd', metadata = {}) {
    try {
      // Convert amount to cents and round to avoid decimals
      const amountInCents = Math.round(amount * 100);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency,
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return paymentIntent;
    } catch (error) {
      console.error('Error creating payment intent:', error.message);
      throw error;
    }
  }

  /**
   * Create a Stripe Checkout Session
   * 
   * @param {Array} items - Array of items with name, price, quantity, description, images
   * @param {string} customerEmail - Customer's email address
   * @param {string} successUrl - URL to redirect after successful payment
   * @param {string} cancelUrl - URL to redirect if payment is cancelled
   * @param {object} metadata - Additional metadata to attach to the session
   * @returns {Promise<object>} The created checkout session
   */
  async createCheckoutSession(items, customerEmail, successUrl, cancelUrl, metadata = {}) {
    try {
      // Transform items to Stripe line_items format
      const lineItems = items.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: item.description || '',
            images: item.images || [],
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: lineItems,
        customer_email: customerEmail,
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata,
      });

      return session;
    } catch (error) {
      console.error('Error creating checkout session:', error.message);
      throw error;
    }
  }

  /**
   * Retrieve a Stripe Payment Intent
   * 
   * @param {string} paymentIntentId - The ID of the payment intent to retrieve
   * @returns {Promise<object>} The payment intent object
   */
  async retrievePaymentIntent(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      console.error('Error retrieving payment intent:', error.message);
      throw error;
    }
  }

  /**
   * Retrieve a Stripe Checkout Session
   * 
   * @param {string} sessionId - The ID of the checkout session to retrieve
   * @returns {Promise<object>} The checkout session object
   */
  async retrieveCheckoutSession(sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      return session;
    } catch (error) {
      console.error('Error retrieving checkout session:', error.message);
      throw error;
    }
  }

  /**
   * Construct and verify a Stripe webhook event
   * 
   * @param {string|Buffer} payload - The raw request body from Stripe
   * @param {string} signature - The Stripe-Signature header value
   * @param {string} secret - The webhook endpoint secret
   * @returns {object} The verified webhook event
   */
  constructWebhookEvent(payload, signature, secret) {
    try {
      const event = stripe.webhooks.constructEvent(payload, signature, secret);
      return event;
    } catch (error) {
      console.error('Error constructing webhook event:', error.message);
      throw error;
    }
  }
}

// Export a singleton instance of StripeService
export default new StripeService();
