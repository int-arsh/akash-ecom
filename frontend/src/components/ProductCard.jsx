import './ProductCard.css';

/**
 * ProductCard Component
 * Displays a single product with image, details, and add to cart button
 */

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      {/* Product Image */}
      <img
        src={product.image}
        alt={product.name}
        className="product-image"
      />

      {/* Product Information */}
      <div className="product-info">
        {/* Product Name */}
        <h3 className="product-name">{product.name}</h3>

        {/* Product Description */}
        <p className="product-description">{product.description}</p>

        {/* Product Price */}
        <div className="product-footer">
          <span className="product-price">
            ${product.price.toFixed(2)}
          </span>

          {/* Add to Cart Button */}
          <button
            className="btn-add-to-cart"
            onClick={() => onAddToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
