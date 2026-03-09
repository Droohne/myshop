import { useParams, Link } from "react-router-dom";
import { products } from "../../data/products";
import { useCart } from "../../context/CartContext";
import { useCompare } from "../../context/CompareContext";
import "./ItemPage.css";

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
  const { addToCompare, hasProduct } = useCompare();

  if (!product) {
    return (
      <div className="not-found">
        <h2>Product not found</h2>
        <Link to="/">← Back to catalog</Link>
      </div>
    );
  }

  const config = categoryConfigs[product.category as keyof typeof categoryConfigs];

  return (
    <div className="item-page-container">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/">Catalog</Link> 
        {' > '}
        <Link to={`/?category=${product.category}`}>{product.category}</Link> 
        {' > '}
        <span className="breadcrumb-current">{product.name}</span>
      </nav>

      <div className="item-page-grid">
        {/* Image Section */}
        <div className="image-section">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="product-image"
          />
          
          {/* Category Badge */}
          <div className="category-badge">
            {config.icon} {config.badge}
          </div>
        </div>

        {/* Product Details */}
        <div className="product-details">
          <h1 className="product-title">{product.name}</h1>
          
          <div className="product-price">€{product.price.toFixed(2)}</div>

          <p className="product-description">{product.description}</p>

          {/* Category-specific specs */}
          <div className="features-section">
            <h3 className="features-title">📋 Key Features</h3>
            <div className="features-list">
              {config.specs.map((spec, index) => (
                <span key={index} className="feature-tag">{spec}</span>
              ))}
            </div>

            {/* Extra category-specific fields */}
            {config.sizeGuide && (
              <div className="extra-info">
                <details className="size-guide">
                  <summary className="size-guide-trigger">📏 Size Guide</summary>
                  <div className="size-guide-content">
                    <strong>Sizes:</strong> XS (34"), S (36"), M (38"), L (40"), XL (42")
                  </div>
                </details>
              </div>
            )}

            {config.dimensions && (
              <div className="extra-info">
                <span className="extra-spec">📐 Dimensions: 10x10x12 cm</span>
              </div>
            )}

            {config.battery && (
              <div className="extra-info">
                <span className="extra-spec">🔋 Battery: 20h playback</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              onClick={() => addToCart(product)}
              className="add-to-cart-btn"
            >
              🛒 Add to Cart
            </button>
            
            <button 
              onClick={() => addToCompare(product)}
              className="compare-btn"
            >
              ♻️ {hasProduct(product.id) ? "Added" : "Compare"}
            </button>
          </div>

          {/* Back link */}
          <Link to="/" className="back-link">
            ← Back to Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
