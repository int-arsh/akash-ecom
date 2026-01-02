import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CheckoutForm from '../components/CheckoutForm';
import { createCheckoutSession } from '../services/api';
import './CheckoutPage.css';

/**
 * CheckoutPage Component
 * Handles checkout form and Stripe payment session creation
 */

export default function CheckoutPage() {
  // Router hooks
  const navigate = useNavigate();
  const location = useLocation();

  // Get cart data from navigation state
  const cartData = location.state;

  // State for loading and error handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Handle checkout process
   * Creates a Stripe checkout session and redirects to Stripe Checkout
   * @param {Object} checkoutData - Contains email, items, and totalAmount
   */
  const handleCheckout = async (checkoutData) => {
    setLoading(true);
    setError(null);

    try {
      // Validate cart items exist
      if (!checkoutData.items || checkoutData.items.length === 0) {
        throw new Error('Your cart is empty. Please add items before checking out.');
      }

      // Call API to create checkout session
      const response = await createCheckoutSession({
        items: checkoutData.items,
        customerEmail: checkoutData.email,
      });

      // Check if session was created successfully
      if (!response.url) {
        throw new Error('Failed to create checkout session. Please try again.');
      }

      // Redirect to Stripe Checkout using the session URL
      window.location.href = response.url;
    } catch (err) {
      // Set error message to display to user
      setError(err.message || 'An error occurred during checkout. Please try again.');
      console.error('Checkout error:', err);
      setLoading(false);
    }
  };

  /**
   * Handle cancel action
   * Navigates back to products page
   */
  const handleCancel = () => {
    navigate('/');
  };

  // If no cart data, show empty message
  if (!cartData || !cartData.items || cartData.items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-cart-container">
          <h2>Your Cart is Empty</h2>
          <p>You need to add items before checking out.</p>
          <button className="btn-back-to-products" onClick={handleCancel}>
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {/* Loading State */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <p>Processing your checkout...</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button
            className="close-error"
            onClick={() => setError(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* Checkout Form */}
      <CheckoutForm
        cartItems={cartData.items}
        totalAmount={cartData.totalAmount}
        onSubmit={handleCheckout}
        onCancel={handleCancel}
      />
    </div>
  );
}
