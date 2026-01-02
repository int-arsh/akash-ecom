import './CartIcon.css';

/**
 * CartIcon Component
 * Displays a shopping cart icon with item count badge
 */

export default function CartIcon({ itemCount, onClick }) {
  return (
    <div className="cart-icon" onClick={onClick}>
      {/* Cart Icon */}
      <span className="cart-icon-symbol">🛒</span>

      {/* Item Count Badge - Only show if itemCount > 0 */}
      {itemCount > 0 && (
        <span className="cart-badge">{itemCount}</span>
      )}
    </div>
  );
}
