import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyPayment } from '../services/api';
import './PaymentSuccess.css';

/**
 * PaymentSuccess Component
 * Verifies Stripe payment and displays success/error status
 */

export default function PaymentSuccess() {
  // Router hooks
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // State for payment verification
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(null);
  const [orderData, setOrderData] = useState(null);

  /**
   * Verify payment on component mount
   * Gets session_id from URL and calls verification API
   */
  useEffect(() => {
    const verifyPaymentSession = async () => {
      try {
        // Get session_id from URL query parameters
        const sessionId = searchParams.get('session_id');

        if (!sessionId) {
          throw new Error('No session ID found. Payment verification cannot be completed.');
        }

        // Call API to verify payment
        const response = await verifyPayment(sessionId);

        // Set verified state and order data
        setVerified(true);
        setOrderData(response);
      } catch (err) {
        // Set error message if verification fails
        setError(
          err.message ||
            'Payment verification failed. Please contact support if your payment was charged.'
        );
        console.error('Payment verification error:', err);
      } finally {
        // Always stop loading
        setLoading(false);
      }
    };

    verifyPaymentSession();
  }, [searchParams]);

  /**
   * Handle continue shopping
   * Navigates back to products page
   */
  const handleContinueShopping = () => {
    navigate('/');
  };

  // Loading State
  if (loading) {
    return (
      <div className="payment-success-page">
        <div className="payment-loading">
          <p>Verifying your payment...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="payment-success-page">
        <div className="payment-error">
          <h2>Payment Verification Failed</h2>
          <p>{error}</p>
          <button className="btn-continue-shopping" onClick={handleContinueShopping}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // Success State
  if (verified) {
    return (
      <div className="payment-success-page">
        <div className="payment-success">
          {/* Success Checkmark */}
          <div className="success-checkmark">✓</div>

          {/* Success Message */}
          <h2>Thank You for Your Purchase!</h2>
          <p className="success-message">
            Your payment has been successfully processed.
          </p>

          {/* Order Details */}
          {orderData && (
            <div className="order-details">
              <h3>Order Details</h3>
              {orderData.orderId && (
                <p>
                  <strong>Order ID:</strong> {orderData.orderId}
                </p>
              )}
              {orderData.email && (
                <p>
                  <strong>Confirmation Email:</strong> {orderData.email}
                </p>
              )}
              {orderData.amount && (
                <p>
                  <strong>Amount Paid:</strong> ${(orderData.amount / 100).toFixed(2)}
                </p>
              )}
              <p className="confirmation-message">
                A confirmation email has been sent to your inbox.
              </p>
            </div>
          )}

          {/* Continue Shopping Button */}
          <button className="btn-continue-shopping" onClick={handleContinueShopping}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // Fallback (should not reach here)
  return null;
}
