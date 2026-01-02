import './CartModal.css';

/**
 * CartModal Component
 * Displays shopping cart items in a modal overlay
 */

export default function CartModal({
  isOpen,
  onClose,
  cartItems,
  onCheckout,
  onRemoveItem,
}) {
  // Return nothing if modal is not open
  if (!isOpen) return null;

  // Calculate total amount
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* Modal Content */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2>Your Cart</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Cart Items or Empty Message */}
        <div className="modal-body">
          {cartItems.length === 0 ? (
            <p className="empty-cart-message">Your cart is empty</p>
          ) : (
            <div className="cart-items-list">
              {/* Render each cart item */}
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  {/* Item Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-image"
                  />

                  {/* Item Details */}
                  <div className="cart-item-details">
                    <h4 className="cart-item-name">{item.name}</h4>
                    <p className="cart-item-price">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>

                  {/* Item Total */}
                  <div className="cart-item-total">
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>

                  {/* Remove Button */}
                  <button
                    className="btn-remove"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {cartItems.length > 0 && (
          <div className="modal-footer">
            {/* Total Amount */}
            <div className="total-amount">
              <span className="total-label">Total:</span>
              <span className="total-value">${total.toFixed(2)}</span>
            </div>

            {/* Action Buttons */}
            <div className="modal-buttons">
              <button className="btn-continue" onClick={onClose}>
                Continue Shopping
              </button>
              <button className="btn-checkout" onClick={onCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
