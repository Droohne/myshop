"use client";

import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function CartPage() {
  const { items, removeFromCart, total, updateQuantity } = useCart();

  // 👈 NEW: Update quantity function (you'll need to add this to CartContext)
  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    // Update quantity logic here (add to CartContext later)
  };

  if (items.length === 0) {
    return (
      <div style={{ padding: "4rem 2rem", textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ 
          width: 120, 
          height: 120, 
          margin: "0 auto 2rem", 
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "3rem"
        }}>
          🛒
        </div>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#1e293b" }}>
          Your cart is empty
        </h1>
        <p style={{ color: "#64748b", fontSize: "1.1rem", marginBottom: "2rem" }}>
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link 
          to="/" 
          style={{
            padding: "1.25rem 3rem",
            background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
            color: "white",
            textDecoration: "none",
            borderRadius: "12px",
            fontWeight: 600,
            fontSize: "1.1rem",
            boxShadow: "0 10px 25px rgba(59,130,246,0.4)",
          }}
        >
          🛍️ Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "2rem" 
      }}>
        <h1 style={{ fontSize: "2.5rem", color: "#1e293b" }}>
          🛒 Shopping Cart ({items.length} items)
        </h1>
        <Link 
          to="/" 
          style={{
            color: "#64748b",
            textDecoration: "none",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          ← Continue Shopping
        </Link>
      </div>

      {/* Cart Items */}
      <div style={{ display: "grid", gap: "1.5rem", marginBottom: "3rem" }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              display: "grid",
              gridTemplateColumns: "120px 1fr auto",
              gap: "1.5rem",
              alignItems: "start",
              padding: "1.5rem",
              background: "white",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            {/* Product Image */}
            <img
              src={item.image}
              alt={item.name}
              style={{
                width: "100%",
                height: 120,
                objectFit: "cover",
                borderRadius: "12px",
              }}
            />

            {/* Product Details */}
            <div style={{ flex: 1 }}>
              <h3 style={{ 
                fontSize: "1.25rem", 
                marginBottom: "0.5rem", 
                color: "#1e293b",
                lineHeight: "1.3"
              }}>
                {item.name}
              </h3>
              <p style={{ color: "#64748b", marginBottom: "1rem" }}>
                {item.category.toUpperCase()}
              </p>
              <p style={{ 
                fontSize: "1.1rem", 
                fontWeight: 700, 
                color: "#ec4899",
                marginBottom: "1rem"
              }}>
                €{item.price.toFixed(2)}
              </p>
              <p style={{ color: "#475569", fontSize: "0.95rem" }}>
                {item.description}
              </p>
            </div>

            {/* Quantity & Price Controls */}
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              gap: "1rem",
              minWidth: "140px"
            }}>
              {/* Quantity Controls */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "#f8fafc",
                padding: "0.75rem",
                borderRadius: "12px",
                border: "1px solid #e2e8f0"
              }}>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  style={{
                    width: 32,
                    height: 32,
                    border: "none",
                    background: "#e2e8f0",
                    borderRadius: "8px",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  −
                </button>
                <span style={{ 
                  fontWeight: 600, 
                  minWidth: 30, 
                  textAlign: "center",
                  fontSize: "1.1rem"
                }}>
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  style={{
                    width: 32,
                    height: 32,
                    border: "none",
                    background: "#e2e8f0",
                    borderRadius: "8px",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  +
                </button>
              </div>

              {/* Item Total */}
              <div style={{ 
                fontSize: "1.2rem", 
                fontWeight: 700, 
                color: "#1e293b",
                textAlign: "center"
              }}>
                €{(item.price * item.quantity).toFixed(2)}
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeFromCart(item.id)}
                style={{
                  padding: "0.75rem 1rem",
                  background: "#fee2e2",
                  color: "#dc2626",
                  border: "1px solid #fecaca",
                  borderRadius: "8px",
                  fontWeight: 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                🗑️ Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div style={{
        background: "white",
        padding: "2rem",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ fontSize: "1.75rem", marginBottom: "1.5rem", color: "#1e293b" }}>
          Order Summary
        </h2>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          marginBottom: "1rem",
          fontSize: "1.1rem"
        }}>
          <span>Items ({items.length}):</span>
          <span>{items.length}</span>
        </div>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          marginBottom: "1.5rem",
          fontSize: "1.1rem",
          color: "#64748b"
        }}>
          <span>Subtotal:</span>
          <span>€{total.toFixed(2)}</span>
        </div>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          fontSize: "1.25rem",
          color: "#64748b",
          marginBottom: "2rem"
        }}>
          <span>Tax (10%):</span>
          <span>€{(total * 0.1).toFixed(2)}</span>
        </div>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.5rem",
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          borderRadius: "12px",
          marginBottom: "2rem"
        }}>
          <span style={{ fontSize: "1.5rem", fontWeight: 600 }}>Total:</span>
          <span style={{ 
            fontSize: "2rem", 
            fontWeight: 700, 
            color: "#ec4899" 
          }}>
            €{(total * 1.1).toFixed(2)}
          </span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link
            to="/checkout"
            style={{
              flex: 1,
              padding: "1.25rem",
              background: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
              color: "white",
              textDecoration: "none",
              borderRadius: "12px",
              fontSize: "1.1rem",
              fontWeight: 600,
              textAlign: "center",
              boxShadow: "0 10px 25px rgba(236,72,153,0.4)",
            }}
          >
            💳 Proceed to Checkout €{(total * 1.1).toFixed(2)}
          </Link>
          <Link
            to="/"
            style={{
              flex: 1,
              padding: "1.25rem",
              background: "transparent",
              color: "#3b82f6",
              textDecoration: "none",
              border: "2px solid #3b82f6",
              borderRadius: "12px",
              fontSize: "1.1rem",
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            🛍️ Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
