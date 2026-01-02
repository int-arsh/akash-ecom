import stripeService from '../services/stripeService.js';
import { Order } from '../models/index.js';

/**
 * Payment Controller Class
 * 
 * Handles payment processing via Stripe including checkout sessions,
 * payment intents, and payment verification.
 */
class PaymentController {
  /**
   * Create a Stripe Checkout Session
   * POST /api/payments/create-checkout-session
   */
  async createCheckoutSession(req, res, next) {
    try {
      const { items, customerEmail, orderId } = req.body;

      // Make sure we have the essentials
      if (!items || !customerEmail) {
        return res.status(400).json({
          success: false,
          message: 'Items and customerEmail are required',
        });
      }

      // Calculate total amount from items
      const totalAmount = items.reduce((sum, item) => {
        return sum + item.price * item.quantity;
      }, 0);

      let order;

      // Use existing order or create a new one
      if (orderId) {
        order = await Order.findById(orderId);
        if (!order) {
          return res.status(404).json({
            success: false,
            message: 'Order not found',
          });
        }
      } else {
        // Create new order with pending payment status
        order = await Order.create({
          customerEmail,
          items,
          totalAmount,
          paymentStatus: 'pending',
        });
      }

      // Build URLs for success and cancel redirects
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const successUrl = `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${frontendUrl}/cancel`;

      // Create Stripe checkout session with order metadata
      const session = await stripeService.createCheckoutSession(
        items,
        customerEmail,
        successUrl,
        cancelUrl,
        { orderId: order._id.toString() }
      );

      // Store the session ID in the order for tracking
      order.stripePaymentIntentId = session.id;
      await order.save();

      return res.status(200).json({
        success: true,
        sessionId: session.id,
        url: session.url,
        orderId: order._id,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a Stripe Payment Intent
   * POST /api/payments/create-payment-intent
   */
  async createPaymentIntent(req, res, next) {
    try {
      const { amount, currency, orderId } = req.body;

      // Amount is required to create a payment intent
      if (!amount) {
        return res.status(400).json({
          success: false,
          message: 'Amount is required',
        });
      }

      // Add orderId to metadata if provided
      const metadata = {};
      if (orderId) {
        metadata.orderId = orderId;
      }

      // Create payment intent via Stripe
      const paymentIntent = await stripeService.createPaymentIntent(
        amount,
        currency || 'usd',
        metadata
      );

      return res.status(200).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a Checkout Session by ID
   * GET /api/payments/checkout-session/:sessionId
   */
  async getCheckoutSession(req, res, next) {
    try {
      const { sessionId } = req.params;

      // Retrieve session details from Stripe
      const session = await stripeService.retrieveCheckoutSession(sessionId);

      return res.status(200).json({
        success: true,
        data: session,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify payment status and update order
   * POST /api/payments/verify
   */
  async verifyPayment(req, res, next) {
    try {
      const { sessionId } = req.body;

      // Session ID is required for verification
      if (!sessionId) {
        return res.status(400).json({
          success: false,
          message: 'Session ID is required',
        });
      }

      // Get session details from Stripe
      const session = await stripeService.retrieveCheckoutSession(sessionId);

      // Check if payment was successful
      if (session.payment_status === 'paid') {
        // Extract order ID from session metadata
        const orderId = session.metadata?.orderId;

        if (orderId) {
          // Find and update the order status
          const order = await Order.findById(orderId);

          if (order) {
            order.paymentStatus = 'success';
            order.transactionId = session.payment_intent;
            await order.save();
          }
        }

        return res.status(200).json({
          success: true,
          message: 'Payment verified successfully',
          status: 'paid',
          orderId,
        });
      }

      // Payment not completed yet
      return res.status(200).json({
        success: false,
        message: 'Payment not completed',
        status: session.payment_status,
      });
    } catch (error) {
      next(error);
    }
  }
}

// Export singleton instance of PaymentController
export default new PaymentController();
