import express from 'express';
import paymentController from '../controllers/paymentController.js';

const router = express.Router();

// Create Stripe checkout session
router.post('/create-checkout-session', paymentController.createCheckoutSession);

// Create payment intent
router.post('/create-payment-intent', paymentController.createPaymentIntent);

// Get checkout session details
router.get('/session/:sessionId', paymentController.getCheckoutSession);

// Verify payment completion
router.post('/verify', paymentController.verifyPayment);

export default router;
