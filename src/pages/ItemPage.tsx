import { useParams, Link } from "react-router-dom";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import { useCompare } from "../context/CompareContext"; // 👈 FIXED: Import

const categoryConfigs = {
  clothes: {
    icon: "👕",
    badge: "Apparel",
    specs: ["100% Cotton", "Machine Wash", "Regular Fit"],
    sizeGuide: true,
    colorOptions: ["Red", "Blue", "Black", "White"],
  },
  home: {
    icon: "🏠",
    badge: "Home & Living",
    specs: ["Ceramic", "Dishwasher Safe", "Indoor Use"],
    dimensions: true,
    material: true,
  },
  electronics: {
    icon: "📱",
    badge: "Electronics",
    specs: ["Bluetooth 5.0", "USB-C", "1 Year Warranty"],
    compatibility: true,
    battery: true,
  },
  books: {
    icon: "📚",
    badge: "Books",
    specs: ["Paperback", "300 Pages", "English"],
    author: "John Doe",
    pages: 350,
  },
  sports: {
    icon: "⚽",
    badge: "Sports",
    specs: ["Non-slip", "Durable", "Lightweight"],
    weight: "1.2kg",
  },
  toys: {
    icon: "🧸",
    badge: "Toys",
    specs: ["Ages 6+", "Plastic", "Battery Free"],
    ageRating: "6+",
  },
  beauty: {
    icon: "💄",
    badge: "Beauty",
    specs: ["Cruelty Free", "Vegan", "30ml"],
    skinType: "All Types",
  },
  food: {
    icon: "🍎",
    badge: "Food",
    specs: ["Organic", "Gluten Free", "250g"],
    expiry: "6 months",
  },
};

export default function ItemPage() {
  const { id } = useParams();
  const productId = Number(id);
  const product = products.find((p) => p.id === productId);
  const { addToCart } = useCart();
  const { addToCompare, hasProduct } = useCompare(); // 👈 FIXED: Proper destructuring

  if (!product) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Product not found</h2>
        <Link to="/">← Back to catalog</Link>
      </div>
    );
  }

  const config = categoryConfigs[product.category as keyof typeof categoryConfigs];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: "2rem", color: "#64748b" }}>
        <Link to="/">Catalog</Link> 
        {' > '}
        <Link to={`/?category=${product.category}`}>{product.category}</Link> 
        {' > '}
        <span style={{ fontWeight: 500 }}>{product.name}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }}>
        
        {/* Image Section */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            style={{ 
              width: "100%", 
              height: 500, 
              objectFit: "cover",
              borderRadius: "16px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
            }}
          />
          
          {/* Category Badge */}
          <div style={{
            display: "inline-flex",
            background: "#3b82f6",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "999px",
            fontSize: "0.875rem",
            fontWeight: 500,
            marginTop: "1rem",
            gap: "0.5rem"
          }}>
            {config.icon} {config.badge}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
            {product.name}
          </h1>
          
          <div style={{ 
            fontSize: "2rem", 
            fontWeight: 700, 
            color: "#ec4899", 
            marginBottom: "2rem" 
          }}>
            €{product.price.toFixed(2)}
          </div>

          <p style={{ 
            color: "#64748b", 
            lineHeight: "1.7", 
            marginBottom: "2rem",
            fontSize: "1.1rem"
          }}>
            {product.description}
          </p>

          {/* Category-specific specs */}
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem", color: "#1e293b" }}>
              📋 Key Features
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              {config.specs.map((spec, index) => (
                <span
                  key={index}
                  style={{
                    background: "#f1f5f9",
                    padding: "0.5rem 1rem",
                    borderRadius: "20px",
                    fontSize: "0.9rem",
                    fontWeight: 500
                  }}
                >
                  {spec}
                </span>
              ))}
            </div>

            {/* Extra category-specific fields */}
            {config.sizeGuide && (
              <div style={{ marginTop: "1rem" }}>
                <details style={{ cursor: "pointer" }}>
                  <summary style={{ color: "#3b82f6", fontWeight: 500 }}>📏 Size Guide</summary>
                  <div style={{ marginTop: "0.5rem", padding: "1rem", background: "#f8fafc" }}>
                    <strong>Sizes:</strong> XS (34"), S (36"), M (38"), L (40"), XL (42")
                  </div>
                </details>
              </div>
            )}

            {config.dimensions && (
              <div style={{ marginTop: "1rem" }}>
                <span style={{ color: "#64748b" }}>📐 Dimensions: 10x10x12 cm</span>
              </div>
            )}

            {config.battery && (
              <div style={{ marginTop: "1rem" }}>
                <span style={{ color: "#64748b" }}>🔋 Battery: 20h playback</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <button 
              onClick={() => addToCart(product)}
              style={{
                flex: 1,
                padding: "1.25rem",
                background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "1.1rem",
                fontWeight: 600,
                boxShadow: "0 10px 25px rgba(59,130,246,0.4)",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 15px 35px rgba(59,130,246,0.5)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 25px rgba(59,130,246,0.4)";
              }}
            >
              🛒 Add to Cart
            </button>
            
            <button 
              onClick={() => addToCompare(product)} // 👈 FIXED: Now works!
              style={{
                padding: "1.25rem",
                background: "transparent",
                color: "#3b82f6",
                border: "2px solid #3b82f6",
                borderRadius: "12px",
                fontSize: "1.1rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
                minWidth: "120px"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#3b82f6";
                e.currentTarget.style.color = "white";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#3b82f6";
              }}
            >
              ♻️ {hasProduct(product.id) ? "Added" : "Compare"}
            </button>
          </div>

          {/* Back link */}
          <Link 
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "#64748b",
              textDecoration: "none",
              fontWeight: 500
            }}
          >
            ← Back to Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
