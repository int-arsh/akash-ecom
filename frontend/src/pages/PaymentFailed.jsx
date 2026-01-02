import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { updateOrderStatus } from '../services/api';
import './PaymentFailed.css';

/**
 * PaymentFailed Component
 * Displays payment failure message and marks order as failed
 */

export default function PaymentFailed() {
  // Router hooks
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  /**
   * Mark order as failed when user lands on this page
   */
  useEffect(() => {
    const markOrderAsFailed = async () => {
      try {
        // Get orderId from URL query params if available
        const orderId = searchParams.get('orderId');

        if (orderId) {
          // Update order status to 'failed'
          await updateOrderStatus(orderId, 'failed');
          console.log(`Order ${orderId} marked as failed`);
        }
      } catch (err) {
        // Silently fail - don't disrupt user experience
        console.error('Error updating order status:', err.message);
      }
    };

    markOrderAsFailed();
  }, [searchParams]);

  /**
   * Handle retry checkout
   * Navigates back to checkout page to try again
   */
  const handleTryAgain = () => {
    navigate('/checkout');
  };

  /**
   * Handle return to products
   * Navigates back to products page
   */
  const handleBackToProducts = () => {
    navigate('/');
  };

  return (
    <div className="payment-failed-page">
      <div className="payment-failed">
        {/* Error Icon */}
        <div className="error-icon">❌</div>

        {/* Error Heading */}
        <h2>Payment Failed</h2>

        {/* Error Message */}
        <p className="error-message">
          We were unable to process your payment. This could be due to
          insufficient funds, incorrect card details, or a temporary issue
          with your bank.
        </p>

        {/* Suggestion Message */}
        <p className="suggestion-message">
          Please check your payment method and try again. If the problem
          persists, please contact your bank or try a different payment method.
        </p>

        {/* Action Buttons */}
        <div className="payment-failed-buttons">
          <button className="btn-try-again" onClick={handleTryAgain}>
            Try Again
          </button>
          <button className="btn-back-to-products" onClick={handleBackToProducts}>
            Back to Products
          </button>
        </div>
      </div>
    </div>
  );
}
