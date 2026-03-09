import { useEffect, useState, useMemo, useCallback } from "react";
import type { CartItem } from "../../context/CartContext";
import "./OrdersPage.css";

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
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

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
    }``
  }, [orders]);

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p className="loading-text">Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📦</div>
        <h2 className="empty-title">No orders yet</h2>
        <p className="empty-subtitle">
          Your order history will appear here once you place your first order.
        </p>
      </div>
    );
  }

  return (
    <div className="orders-page">
      {/* Header */}
      <header className="orders-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="page-title">Order History</h1>
            <p className="stats">
              {totalOrders} order{totalOrders !== 1 ? "s" : ""} • {totalSpent.toFixed(2)}€ total
            </p>
          </div>
          
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All ({orders.length})
            </button>
            <button
              className={`filter-btn ${filter === "recent" ? "active" : ""}`}
              onClick={() => setFilter("recent")}
            >
              Recent (7 days)
            </button>
          </div>
        </div>
      </header>

      {/* Orders List */}
      <div className="orders-grid">
        {filteredOrders
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((order) => {
            const orderDate = new Date(order.createdAt);
            const daysAgo = Math.floor((Date.now() - orderDate.getTime()) / (24 * 60 * 60 * 1000));
            const isRecent = daysAgo < 7;
            const isExpanded = expandedOrder === order.id;

            return (
              <article key={order.id} className="order-card">
                {/* Header - Click to expand */}
                <div className={`order-header ${isRecent ? "recent" : ""}`} onClick={() => toggleExpand(order.id)}>
                  <div className="order-header-content">
                    <div className="order-info">
                      <div className="order-number">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </div>
                      <div className="order-date">
                        {orderDate.toLocaleDateString()} at {orderDate.toLocaleTimeString([], { 
                          hour: '2-digit', minute: '2-digit' 
                        })}
                        {daysAgo > 0 && ` • ${daysAgo}d ago`}
                      </div>
                    </div>
                    <div className="order-total">
                      {order.total.toFixed(2)} €
                    </div>
                  </div>

                  <div className="status-badge">
                    {isRecent ? "New" : "Delivered"}
                  </div>
                  <div className={`expand-icon ${isExpanded ? "expanded" : ""}`}>
                    {isExpanded ? "−" : "+"}
                  </div>
                </div>

                {/* Content - Shows FULL on expand */}
                {isExpanded && (
                  <div className="order-content">
                    <div className={`order-details-grid ${isMobile ? "mobile" : ""}`}>
                      <div className="detail-section">
                        <h4 className="detail-title">Delivered to</h4>
                        <p className="detail-text">{order.name}</p>
                        <p className="detail-text full-address">{order.address}</p>
                      </div>
                      
                      <div className="detail-section">
                        <h4 className="detail-title">Items ordered</h4>
                        <p className="detail-text">
                          {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                        </p>
                        <div className="items-preview">
                          {order.items.map((item, index) => (
                            <div key={item.id} className="preview-item">
                              {item.name}
                              {index < order.items.length - 1 && ', '}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="detail-section total-section">
                        <h4 className="detail-title">Total</h4>
                        <div className="order-amount">
                          {order.total.toFixed(2)} €
                        </div>
                        <button
                          className="reorder-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            reorder(order.id);
                          }}
                        >
                          Order Again
                        </button>
                      </div>
                    </div>

                    {/* Full Items List */}
                    <div className="items-section">
                      <div className="items-grid">
                        {order.items.map((item) => {
                          const qty = item.quantity ?? 1;
                          const itemTotal = (item.price * qty).toFixed(2);
                          return (
                            <div key={item.id} className="item-card">
                              <div 
                                className="item-icon"
                                style={{ 
                                  background: `linear-gradient(135deg, ${item.name.includes('Pizza') ? '#ef4444' : '#3b82f6'}, ${item.name.includes('Burger') ? '#f59e0b' : '#10b981'})`
                                }}
                              >
                                {item.name.split(' ')[0][0]}
                              </div>
                              <div className="item-details">
                                <div className="item-name">
                                  {item.name} <span className="item-qty-inline">x{qty}</span>
                                </div>
                                <div className="item-price">{itemTotal} €</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
      </div>
    </div>
  );
}
