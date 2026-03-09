import { Link } from "react-router-dom";
import { useCompare } from "../../context/CompareContext";

import "./ComparePage.css";

export default function ComparePage() {
  const { items, removeFromCompare, clearCompare } = useCompare();

  if (items.length === 0) {
    return (
      <div className="compare-empty">
        <h2 className="compare-empty__title">Nothing to compare 😕</h2>
        <p className="compare-empty__text">
          Add products using the Compare button
        </p>
        <Link to="/" className="compare-empty__btn">
          → Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="compare-page">
      <div className="compare-header">
        <h1 className="compare-title">Compare Products ({items.length}/4)</h1>
        <button onClick={clearCompare} className="compare-clear-btn">
          Clear All
        </button>
      </div>

      <div className="compare-grid">
        {items.map((product) => (
          <div key={product.id} className="compare-product">
            <img 
              src={product.image} 
              alt={product.name} 
              className="compare-product__image"
            />
            <h3 className="compare-product__name">{product.name}</h3>
            <div className="compare-product__price">
              €{product.price.toFixed(2)}
            </div>
            <div className="compare-product__category">
              {product.category}
            </div>
            <p className="compare-product__description">
              {product.description}
            </p>
            <button
              onClick={() => removeFromCompare(product.id)}
              className="compare-product__remove"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="compare-footer">
        <Link to="/" className="compare-shop-btn">
          🛍️ Continue Shopping
        </Link>
      </div>
    </div>
  );
}
