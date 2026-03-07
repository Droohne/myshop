import { Link } from "react-router-dom";                    // 👈 CORRECT: Import from react-router-dom
import { useCompare } from "../context/CompareContext";     // 👈 Context ONLY
import { products } from "../data/products";

export default function ComparePage() {
  const { items, removeFromCompare, clearCompare } = useCompare();

  if (items.length === 0) {
    return (
      <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          Nothing to compare 😕
        </h2>
        <p style={{ color: "#64748b", marginBottom: "2rem" }}>
          Add products using the Compare button
        </p>
        <Link 
          to="/" 
          style={{
            padding: "1rem 2rem",
            background: "#3b82f6",
            color: "white",
            textDecoration: "none",
            borderRadius: "12px",
            fontWeight: 600,
          }}
        >
          → Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "2rem" 
      }}>
        <h1 style={{ fontSize: "2.5rem" }}>Compare Products ({items.length}/4)</h1>
        <button
          onClick={clearCompare}
          style={{
            padding: "0.75rem 1.5rem",
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Clear All
        </button>
      </div>

      <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        {items.map((product) => (
          <div 
            key={product.id} 
            style={{ 
              border: "1px solid #e2e8f0", 
              borderRadius: "12px",
              padding: "1.5rem",
              boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
            }}
          >
            <img 
              src={product.image} 
              alt={product.name} 
              style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: "8px", marginBottom: "1rem" }} 
            />
            <h3 style={{ marginBottom: "0.5rem" }}>{product.name}</h3>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#ec4899", marginBottom: "1rem" }}>
              €{product.price.toFixed(2)}
            </div>
            <div style={{ color: "#64748b", marginBottom: "1rem" }}>{product.category}</div>
            <p style={{ color: "#475569", marginBottom: "1.5rem" }}>{product.description}</p>
            <button
              onClick={() => removeFromCompare(product.id)}
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div style={{ 
        textAlign: "center", 
        marginTop: "3rem" 
      }}>
        <Link 
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "1rem 2rem",
            background: "#10b981",
            color: "white",
            textDecoration: "none",
            borderRadius: "12px",
            fontWeight: 600,
          }}
        >
          🛍️ Continue Shopping
        </Link>
      </div>
    </div>
  );
}
