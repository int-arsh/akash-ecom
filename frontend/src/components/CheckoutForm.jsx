import { useState } from 'react';
import './CheckoutForm.css';

/**
 * CheckoutForm Component
 * Collects customer email before processing payment
 */

export default function CheckoutForm({
  cartItems,
  totalAmount,
  onSubmit,
  onCancel,
}) {
  // State for email input and validation
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  /**
   * Handle email input change
   * Updates email state and clears error message
   */
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError(''); // Clear error when user starts typing
  };

  /**
   * Validate email format
   * Checks if email is not empty and matches valid email pattern
   * @returns {boolean} True if email is valid, false otherwise
   */
  const validateEmail = () => {
    // Check if email is empty
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }

    // Regular expression for valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  /**
   * Handle form submission
   * Validates email and calls onSubmit with checkout data
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate email before proceeding
    if (!validateEmail()) {
      return;
    }

    // Call onSubmit with checkout data
    onSubmit({
      email,
      items: cartItems,
      totalAmount,
    });
  };

  return (
    <div className="checkout-form">
      {/* Form Title */}
      <h2>Checkout</h2>

      {/* Cart Items Summary */}
      <div className="checkout-summary">
        <h3>Order Summary</h3>
        <div className="checkout-items">
          {cartItems.map((item) => (
            <div key={item.id} className="checkout-item">
              <span className="checkout-item-name">{item.name}</span>
              <span className="checkout-item-qty">x{item.quantity}</span>
              <span className="checkout-item-price">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Total Amount */}
        <div className="checkout-total">
          <span className="checkout-total-label">Total:</span>
          <span className="checkout-total-amount">
            ${totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Checkout Form */}
      <form onSubmit={handleSubmit} className="checkout-form-fields">
        {/* Email Input */}
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="your.email@example.com"
            className={`form-input ${emailError ? 'error' : ''}`}
          />

          {/* Email Error Message */}
          {emailError && (
            <span className="error-message">{emailError}</span>
          )}
        </div>

        {/* Form Action Buttons */}
        <div className="form-buttons">
          <button
            type="button"
            className="btn-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-payment"
            disabled={!email}
          >
            Proceed to Payment
          </button>
        </div>
      </form>
    </div>
  );
}
