import { useEffect, useState, useMemo, useCallback } from "react";
import type { CartItem } from "../context/CartContext";

type Order = {
  id: string;
  name: string;
  address: string;
  total: number;
  items: CartItem[];
  createdAt: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "recent">("all");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("orders") || "[]");
      setOrders(stored);
    } catch (error) {
      console.error("Failed to load orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredOrders = useMemo(() => {
    if (filter === "recent") {
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      return orders.filter(order => new Date(order.createdAt).getTime() > weekAgo);
    }
    return orders;
  }, [orders, filter]);

  const totalOrders = filteredOrders.length;
  const totalSpent = useMemo(
    () => filteredOrders.reduce((sum, order) => sum + order.total, 0),
    [filteredOrders]
  );

  const reorder = useCallback((orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      console.log("Reordering:", order.items);
    }
  }, [orders]);

  if (loading) {
    return (
      <div style={{ maxWidth: 1200, margin: "2rem auto", padding: "2rem", textAlign: "center" }}>
        <div style={{ 
          width: 48, height: 48, border: "3px solid #e5e7eb", 
          borderTop: "3px solid #3b82f6", borderRadius: "50%", 
          animation: "spin 1s linear infinite", margin: "0 auto 1rem" 
        }} />
        <p style={{ color: "#6b7280" }}>Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={{ maxWidth: 1200, margin: "2rem auto", padding: "4rem 2rem", textAlign: "center" }}>
        <div style={{ maxWidth: 400, margin: "0 auto" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem", opacity: 0.3 }}>📦</div>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem", color: "#1f2937" }}>
            No orders yet
          </h2>
          <p style={{ color: "#6b7280", fontSize: "1.1rem" }}>
            Your order history will appear here once you place your first order.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "2rem auto", padding: "0 1rem" }}>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .order-card { animation: slideIn 0.4s ease-out; }
        .status-badge { position: absolute; top: 1rem; right: 1rem; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
      `}</style>

      {/* Header */}
      <div style={{ 
        marginBottom: "2.5rem", paddingBottom: "1.5rem",
        borderBottom: "1px solid #e5e7eb"
      }}>
        <div style={{ 
          display: "flex", justifyContent: "space-between", 
          alignItems: "flex-end", flexWrap: "wrap", gap: "1rem"
        }}>
          <div>
            <h1 style={{ 
              fontSize: "2.5rem", fontWeight: 800, 
              background: "linear-gradient(135deg, #1e293b, #334155)", 
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              margin: 0, lineHeight: 1.1
            }}>
              Order History
            </h1>
            <p style={{ color: "#6b7280", margin: "0.5rem 0 0", fontSize: "1.1rem" }}>
              {totalOrders} order{totalOrders !== 1 ? "s" : ""} • {totalSpent.toFixed(2)}€ total
            </p>
          </div>
          
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button
              onClick={() => setFilter("all")}
              style={{
                padding: "0.75rem 1.5rem", borderRadius: "12px",
                border: filter === "all" ? "none" : "2px solid #e5e7eb",
                background: filter === "all" ? "#3b82f6" : "white",
                color: filter === "all" ? "white" : "#374151",
                fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
              }}
            >
              All ({orders.length})
            </button>
            <button
              onClick={() => setFilter("recent")}
              style={{
                padding: "0.75rem 1.5rem", borderRadius: "12px",
                border: filter === "recent" ? "none" : "2px solid #e5e7eb",
                background: filter === "recent" ? "#10b981" : "white",
                color: filter === "recent" ? "white" : "#374151",
                fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
              }}
            >
              Recent (7 days)
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div style={{ display: "grid", gap: "2rem" }}>
        {filteredOrders
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((order) => {
            const orderDate = new Date(order.createdAt);
            const daysAgo = Math.floor((Date.now() - orderDate.getTime()) / (24 * 60 * 60 * 1000));
            const isRecent = daysAgo < 7;

            return (
              <div
                key={order.id}
                className="order-card"
                style={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                  border: "1px solid #f1f5f9",
                  background: "white",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 10px 40px rgba(0,0,0,0.1)";
                }}
              >
                {/* Header */}
                <div style={{ 
                  padding: "1.5rem 2rem", 
                  background: isRecent 
                    ? "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" 
                    : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                  color: isRecent ? "white" : "#1e2937",
                  position: "relative"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                    <div>
                      <div style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                        Order #{order.id.slice(-8).toUpperCase()}
                      </div>
                      <div style={{ fontSize: "0.95rem", opacity: isRecent ? 0.95 : 0.8 }}>
                        {orderDate.toLocaleDateString()} at {orderDate.toLocaleTimeString([], { 
                          hour: '2-digit', minute: '2-digit' 
                        })}
                        {daysAgo > 0 && ` • ${daysAgo}d ago`}
                      </div>
                    </div>
                    <div style={{ 
                      fontSize: "1.5rem", fontWeight: 800, 
                      textShadow: isRecent ? "0 2px 4px rgba(0,0,0,0.2)" : "none"
                    }}>
                      {order.total.toFixed(2)} €
                    </div>
                  </div>

                  <div className="status-badge" style={{
                    background: isRecent ? "#10b981" : "#10b98160",
                    color: isRecent ? "white" : "#059669",
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    fontWeight: 600
                  }}>
                    {isRecent ? "New" : "Delivered"}
                  </div>
                </div>

                {/* Content - FIXED RESPONSIVE */}
                <div style={{ padding: "2rem" }}>
                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", 
                    gap: "2rem", 
                    marginBottom: "2rem"
                  }}>
                    <div>
                      <h4 style={{ fontSize: "1rem", fontWeight: 700, margin: "0 0 0.75rem", color: "#374151" }}>
                        Delivered to
                      </h4>
                      <p style={{ margin: 0, color: "#6b7280", lineHeight: 1.5 }}>
                        {order.name}
                      </p>
                      <p style={{ margin: "0.25rem 0 0", fontSize: "0.95rem" }}>
                        {order.address.split(', ').slice(0, 3).join(', ')}
                        {order.address.split(', ').length > 3 && '...'}
                      </p>
                    </div>
                    
                    <div>
                      <h4 style={{ fontSize: "1rem", fontWeight: 700, margin: "0 0 0.75rem", color: "#374151" }}>
                        Items ordered
                      </h4>
                      <p style={{ margin: 0, color: "#6b7280" }}>
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </p>
                      <p style={{ margin: "0.25rem 0 0", fontSize: "0.9rem", color: "#9ca3af" }}>
                        {order.items.map(i => i.name.split(' ')[0]).slice(0, 2).join(', ')}
                        {order.items.length > 2 && '...'}
                      </p>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <h4 style={{ fontSize: "1rem", fontWeight: 700, margin: "0 0 1rem", color: "#374151" }}>
                        Total
                      </h4>
                      <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#1e293b" }}>
                        {order.total.toFixed(2)} €
                      </div>
                      <button
                        onClick={() => reorder(order.id)}
                        style={{
                          marginTop: "1rem", padding: "0.75rem 1.5rem",
                          background: "#3b82f6", color: "white",
                          border: "none", borderRadius: "10px",
                          fontWeight: 600, cursor: "pointer",
                          transition: "all 0.2s"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#2563eb"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "#3b82f6"}
                      >
                        Order Again
                      </button>
                    </div>
                  </div>

                  {/* Items List */}
                  <div style={{ 
                    marginTop: "1.5rem", 
                    paddingTop: "1.5rem", 
                    borderTop: "1px solid #f1f5f9"
                  }}>
                    <div style={{ 
                      display: "grid", 
                      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                      gap: "1rem"
                    }}>
                      {order.items.map((item) => (
                        <div key={item.id} style={{
                          display: "flex", gap: "1rem", padding: "1rem",
                          background: "#f8fafc", borderRadius: "12px",
                          border: "1px solid #f1f5f9"
                        }}>
                          <div style={{
                            width: 64, height: 64,
                            background: `linear-gradient(135deg, ${item.name.includes('Pizza') ? '#ef4444' : '#3b82f6'}, ${item.name.includes('Burger') ? '#f59e0b' : '#10b981'})`,
                            borderRadius: "10px", display: "flex",
                            alignItems: "center", justifyContent: "center",
                            color: "white", fontWeight: 700, fontSize: "1.1rem"
                          }}>
                            {item.name.split(' ')[0][0]}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: "1rem", marginBottom: "0.25rem" }}>
                              {item.name}
                            </div>
                            <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>
                              Qty: {item.quantity ?? 1} • {(item.price * (item.quantity ?? 1)).toFixed(2)} €
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
