import { Routes, Route, NavLink } from "react-router-dom";
import { useCart } from "./context/CartContext";        // 👈 CORRECT path
import { useCompare } from "./context/CompareContext";  // 👈 CORRECT path
import HomePage from "./pages/HomePage";
import ItemPage from "./pages/ItemPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import ComparePage from "./pages/ComparePage"; // 👈 ADDED

const navItems = [
  { to: "/", label: "Catalog", icon: "🏪" },
  { to: "/cart", label: "Cart", icon: "🛒" },
  { to: "/checkout", label: "Checkout", icon: "💳" },
  { to: "/orders", label: "Orders", icon: "📦" },
  { to: "/compare", label: "Compare", icon: "⚖️" }, // 👈 ADDED
];

function App() {
  const { items: cartItems } = useCart();
  const { items: compareItems } = useCompare(); // 👈 FIXED: Added compare badge

  return (
    <div className="App">
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backdropFilter: "blur(8px)",
          background:
            "linear-gradient(90deg, #0f172a 0%, #111827 40%, #020617 100%)",
          borderBottom: "1px solid rgba(148, 163, 184, 0.4)",
        }}
      >
        <div
          style={{
            maxWidth: "960px",
            margin: "0 auto",
            padding: "0.75rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "#e5e7eb",
              fontWeight: 600,
              letterSpacing: "0.04em",
            }}
          >
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: "999px",
                background:
                  "radial-gradient(circle at 30% 30%, #22c55e, #16a34a 40%, #065f46 100%)",
                boxShadow: "0 0 25px rgba(34,197,94,0.6)",
              }}
            />
            <span className="logo">Магазин</span>
          </div>

          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              fontSize: "0.95rem",
            }}
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "nav-link",
                    isActive ? "nav-link-active" : "nav-link-inactive",
                  ].join(" ")
                }
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    position: "relative",
                  }}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  <span>{item.label}</span>
                  
                  {/* 👈 Cart & Compare badges */}
                  {item.to === "/cart" && cartItems.length > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: -6,
                        right: -6,
                        background: "#3b82f6",
                        color: "white",
                        borderRadius: "999px",
                        width: 18,
                        height: 18,
                        fontSize: "0.7rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {cartItems.length}
                    </span>
                  )}
                  
                  {item.to === "/compare" && compareItems.length > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: -6,
                        right: -6,
                        background: "#ef4444",
                        color: "white",
                        borderRadius: "999px",
                        width: 18,
                        height: 18,
                        fontSize: "0.7rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {compareItems.length}
                    </span>
                  )}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/item/:id" element={<ItemPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/compare" element={<ComparePage />} /> {/* 👈 ADDED */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
