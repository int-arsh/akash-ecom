import stripeService from '../services/stripeService.js';
import { Order } from '../models/index.js';

/**
 * Main Stripe Webhook Handler
 * 
 * Receives and processes webhook events from Stripe including
 * checkout session completion, payment success/failure, and session expiration.
 */
export async function handleStripeWebhook(req, res) {
  try {
    // Get the stripe signature from the headers
    const signature = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not configured');
      return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    // Verify the webhook signature to ensure it's from Stripe
    let event;
    try {
      event = stripeService.constructWebhookEvent(
        req.body,
        signature,
        webhookSecret
      );
    } catch (error) {
      console.error('Webhook signature verification failed:', error.message);
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;

      case 'checkout.session.expired':
        await handleCheckoutSessionExpired(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return success response to Stripe
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error.message);
    return res.status(500).json({ error: 'Webhook handler failed' });
  }
}

/**
 * Handle Checkout Session Completed Event
 * 
 * Triggered when a customer completes the checkout process
 */
async function handleCheckoutSessionCompleted(session) {
  console.log('Checkout session completed:', session.id);

  try {
    // Get the order ID from session metadata
    const orderId = session.metadata?.orderId;

    if (orderId) {
      const order = await Order.findById(orderId);

      if (order) {
        // Update order with successful payment status
        order.paymentStatus = 'success';
        order.transactionId = session.payment_intent;
        order.stripePaymentIntentId = session.id;
        await order.save();

        console.log(`Order ${orderId} marked as paid successfully`);
      }
    }
  } catch (error) {
    console.error('Error handling checkout session completed:', error.message);
  }
}

/**
 * Handle Payment Intent Succeeded Event
 * 
 * Triggered when a payment is successfully processed
 */
async function handlePaymentIntentSucceeded(paymentIntent) {
  console.log('Payment intent succeeded:', paymentIntent.id);

  try {
    // Get the order ID from payment intent metadata
    const orderId = paymentIntent.metadata?.orderId;

    if (orderId) {
      const order = await Order.findById(orderId);

      if (order) {
        // Update order with successful payment status
        order.paymentStatus = 'success';
        order.transactionId = paymentIntent.id;
        await order.save();

        console.log(`Payment confirmed for order ${orderId}`);
      }
    }
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error.message);
  }
}

/**
 * Handle Payment Intent Failed Event
 * 
 * Triggered when a payment fails
 */
async function handlePaymentIntentFailed(paymentIntent) {
  console.log('Payment intent failed:', paymentIntent.id);

  try {
    // Get the order ID from payment intent metadata
    const orderId = paymentIntent.metadata?.orderId;

    if (orderId) {
      const order = await Order.findById(orderId);

      if (order) {
        // Update order with failed payment status
        order.paymentStatus = 'failed';
        order.transactionId = paymentIntent.id;
        await order.save();

        console.log(`Payment failed for order ${orderId}`);
      }
    }
  } catch (error) {
    console.error('Error handling payment intent failed:', error.message);
  }
}

/**
 * Handle Checkout Session Expired Event
 * 
 * Triggered when a checkout session expires without completion
 */
async function handleCheckoutSessionExpired(session) {
  console.log('Checkout session expired:', session.id);

  try {
    // Get the order ID from session metadata
    const orderId = session.metadata?.orderId;

    if (orderId) {
      const order = await Order.findById(orderId);

      // Only update if order is still pending
      if (order && order.paymentStatus === 'pending') {
        order.paymentStatus = 'failed';
        await order.save();

        console.log(`Order ${orderId} marked as failed due to session expiration`);
      }
    }
  } catch (error) {
    console.error('Error handling checkout session expired:', error.message);
  }
}
