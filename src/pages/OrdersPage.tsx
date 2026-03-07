import { useEffect, useState } from "react";
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

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(stored);
  }, []);

  if (orders.length === 0) {
    return <p>No orders yet.</p>;
  }

  return (
    <div>
      <h1>Your orders</h1>
      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            border: "1px solid #ddd",
            marginBottom: "1rem",
            padding: "0.5rem",
          }}
        >
          <p>
            Order #{order.id} – {new Date(order.createdAt).toLocaleString()}
          </p>
          <p>Name: {order.name}</p>
          <p>Address: {order.address}</p>
          <p>Total: {order.total.toFixed(2)} €</p>
          <ul>
            {order.items.map((it) => (
              <li key={it.id}>
                {it.name} × {it.quantity}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
