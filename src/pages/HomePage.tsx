import { useState } from "react";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [category, setCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [searchTerm, setSearchTerm] = useState(""); // 👈 NEW SEARCH STATE
  const { addToCart } = useCart();

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))];

  const filtered = products.filter((p) => {
    const byCategory = category === "all" || p.category === category;
    const byPrice = maxPrice === "" ? true : p.price <= Number(maxPrice || 0);
    const bySearch = searchTerm === "" || // 👈 NEW SEARCH FILTER
      p.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return byCategory && byPrice && bySearch;
  });

  return (
    <div>
      <h1>Products ({filtered.length})</h1>

      {/* 👈 NEW SEARCH + FILTERS SECTION */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
          padding: "1.5rem",
          background: "#f8fafc",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
        }}
      >
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
            🔍 Search products
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="e.g. hoodie, mug, react..."
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "2px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "1rem",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
            🏷️ Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "2px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "1rem",
            }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
            💰 Max price
          </label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="No limit"
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "2px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "1rem",
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: "1.5rem",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        }}
      >
        {filtered.length === 0 ? (
          <div style={{ 
            gridColumn: "1 / -1", 
            textAlign: "center", 
            padding: "4rem 2rem",
            color: "#64748b"
          }}>
            <h3 style={{ marginBottom: "1rem" }}>No products found 😔</h3>
            <p>Try adjusting your search, category, or price filter</p>
          </div>
        ) : (
          filtered.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "1.25rem",
                background: "white",
                boxShadow: "0 4px 6px -1px rgba(0, 0,0, 0.1)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 10px 25px -3px rgba(0, 0,0, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0,0, 0.1)";
              }}
            >
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                style={{ 
                  width: "100%", 
                  height: 160, 
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "1rem"
                }}
                onLoad={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
              />
              <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                {p.name}
              </h3>
              <p style={{ color: "#64748b", marginBottom: "1rem", fontSize: "0.95rem" }}>
                {p.description}
              </p>
              <p style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1e293b" }}>
                €{p.price.toFixed(2)}
              </p>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                <button 
                  onClick={() => addToCart(p)}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    background: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Add to cart
                </button>
                <Link 
                  to={`/item/${p.id}`}
                  style={{
                    padding: "0.75rem",
                    background: "transparent",
                    color: "#3b82f6",
                    textDecoration: "none",
                    border: "2px solid #3b82f6",
                    borderRadius: "8px",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                  }}
                >
                  View
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
