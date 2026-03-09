"use client";

import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";
import "./CartPage.css"; 

export default function CartPage() {
  const { items, removeFromCart, total, updateQuantity } = useCart();

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    updateQuantity(id, newQuantity);
  };

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty__icon">🛒</div>
        <h1 className="cart-empty__title">Your cart is empty</h1>
        <p className="cart-empty__text">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link to="/" className="cart-empty__btn">
          🛍️ Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1 className="cart-title">
          🛒 Shopping Cart ({items.length} items)
        </h1>
        <Link to="/" className="cart-continue">
          ← Continue Shopping
        </Link>
      </div>

      {/* Cart Items */}
      <div className="cart-items">
        {items.map((item) => (
          <div key={item.id} className="cart-item">
            {/* Product Image */}
            <img
              src={item.image}
              alt={item.name}
              className="cart-item__image"
            />

            {/* Product Details */}
            <div className="cart-item__details">
              <h3 className="cart-item__name">{item.name}</h3>
              <p className="cart-item__category">{item.category.toUpperCase()}</p>
              <p className="cart-item__price">€{item.price.toFixed(2)}</p>
              <p className="cart-item__description">{item.description}</p>
            </div>

            {/* Quantity & Price Controls */}
            <div className="cart-item__controls">
              {/* Quantity Controls */}
              <div className="quantity-control">
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  className="quantity-btn"
                >
                  −
                </button>
                <span className="quantity">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>

              {/* Item Total */}
              <div className="cart-item__total">
                €{(item.price * item.quantity).toFixed(2)}
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="cart-item__remove"
              >
                🗑️ Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="order-summary">
        <h2 className="order-summary__title">Order Summary</h2>
        
        <div className="summary-row">
          <span>Items ({items.length}):</span>
          <span>{items.length}</span>
        </div>
        
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>€{total.toFixed(2)}</span>
        </div>
        
        <div className="summary-row">
          <span>Tax (10%):</span>
          <span>€{(total * 0.1).toFixed(2)}</span>
        </div>
        
        <div className="summary-total">
          <span>Total:</span>
          <span>€{(total * 1.1).toFixed(2)}</span>
        </div>

        {/* Action Buttons */}
        <div className="summary-actions">
          <Link to="/checkout" className="btn btn-checkout">
            💳 Proceed to Checkout €{(total * 1.1).toFixed(2)}
          </Link>
          <Link to="/" className="btn btn-secondary">
            🛍️ Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
