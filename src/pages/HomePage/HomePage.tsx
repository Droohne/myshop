import { useState, useMemo } from "react";
import { products } from "../../data/products";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";
import "./HomePage.css"; 

export default function HomePage() {
  const [category, setCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart } = useCart();

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))];

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const byCategory = category === "all" || p.category === category;
      const byPrice = maxPrice === "" ? true : p.price <= Number(maxPrice || 0);
      const bySearch = searchTerm === "" || 
        p.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      return byCategory && byPrice && bySearch;
    });
  }, [category, maxPrice, searchTerm]);

  return (
    <div className="homepage">
      <h1 className="homepage__title">Products ({filtered.length})</h1>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label className="filter-label">🔍 Search products</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="e.g. hoodie, mug, react..."
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">🏷️ Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">💰 Max price</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="No limit"
            className="filter-input"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {filtered.length === 0 ? (
          <div className="no-products">
            <h3>No products found 😔</h3>
            <p>Try adjusting your search, category, or price filter</p>
          </div>
        ) : (
          filtered.map((p) => (
            <Link 
              to={`/item/${p.id}`}
              key={p.id} 
              className="product-card-link"
            >
              <div className="product-card">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="product-image"
                />
                <h3 className="product-name">{p.name}</h3>
                <p className="product-description">{p.description}</p>
                <p className="product-price">€{p.price.toFixed(2)}</p>
                <button 
                  onClick={(e) => {
                    e.preventDefault(); // Prevent navigation
                    e.stopPropagation(); // Stop bubbling
                    addToCart(p);
                  }}
                  className="btn btn-primary"
                >
                  Add to cart
                </button>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
