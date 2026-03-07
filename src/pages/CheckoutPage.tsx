import { FormEvent, useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useCart, CartItem } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    ol: any;
  }
}

type Order = {
  id: string;
  name: string;
  address: string;
  total: number;
  items: CartItem[];
  createdAt: string;
};

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<{ name?: boolean; address?: boolean; email?: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerFeature = useRef<any>(null);

  const isNameValid = name.trim().length >= 2;
  const isAddressValid = address.trim().length >= 5;
  const isEmailValid = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid = isNameValid && isAddressValid && isEmailValid && items.length > 0;

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + (item.quantity ?? 1), 0),
    [items]
  );

  // Load OpenLayers dynamically
  useEffect(() => {
    if (window.ol) return;

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/ol@v10.2.1/dist/ol.js';
    script.async = true;
    script.onload = () => {};
    document.head.appendChild(script);

    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://cdn.jsdelivr.net/npm/ol@v10.2.1/ol.css';
    document.head.appendChild(css);
  }, []);

  // Initialize OpenLayers map - FIXED
  const initMap = useCallback(() => {
    if (!mapRef.current || !window.ol || mapInstance.current) return;

    const Map = window.ol.Map;
    const View = window.ol.View;
    const TileLayer = window.ol.layer.Tile;
    const OSM = window.ol.source.OSM;
    const VectorLayer = window.ol.layer.Vector;
    const VectorSource = window.ol.source.Vector;  // ✅ FIXED: Proper constructor path
    const Point = window.ol.geom.Point;
    const Style = window.ol.style.Style;
    const Icon = window.ol.style.Icon;

    // Create map
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM({
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          })
        })
      ],
      view: new View({
        center: window.ol.proj.fromLonLat([4.9041, 52.3676]), // Amsterdam
        zoom: 13
      })
    });

    // Add marker
    const markerSource = new VectorSource({});  // ✅ FIXED: Proper instantiation
    const markerStyle = new Style({
      image: new Icon({
        src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDOC43MTUyOCAyIDQgNS43MTU0NyA0IDEyQzQgMTguMjg0NiA3LjE5Mjg5IDIxIDExLjUgMjFDMTMuMjg0NiAyMSAxNiAxOC4yODQ2IDE2IDEyQzE2IDUuNzE1NDcgMTMuMjg0NiAyIDExLjUgMkMxMC4yOTI5IDIgOS4wOTI4OSAyLjI5MDQzIDguNDk5OTkgMi40OTk0MUwxMiAxMFYxMkgxMkwxNS41MDAxIDE1LjUwMDA2QzE1LjcwOTcgMTUuMDk5IDE2LjAwMDcgMTQuNzA5IDE2LjAwMDcgMTQuNUMxNiAwOS4yODQ2IDEzLjI4NDYgNiAxMS41IDZDNS43MTU0NyA2IDIgOS4yODQ2IDIgMTJDMiAxOC4yODQ2IDUuNzE1NDcgMjEgMTEuNSAyMUMxNy4yODQ2IDIxIDIwIDE4LjI4NDYgMjAgMTJDMjAgNS43MTU0NyAxNy4yODQ2IDIgMTEuNSAyWkZpbGw9IiM0RTY2RkYiLz4KPC9zdmc+',
        scale: 0.8
      })
    });

    markerFeature.current = new window.ol.Feature({
      geometry: new Point(window.ol.proj.fromLonLat([4.9041, 52.3676]))
    });
    markerFeature.current.setStyle(markerStyle);
    markerSource.addFeature(markerFeature.current);

    const vectorLayer = new VectorLayer({
      source: markerSource
    });
    map.addLayer(vectorLayer);

    // ✅ FIXED CLICK HANDLER
    map.on('singleclick', (evt: any) => {
      const coord = evt.coordinate;
      const lonLat = window.ol.proj.toLonLat(coord);
      markerFeature.current!.getGeometry()!.setCoordinates(coord);
      reverseGeocode(lonLat[0], lonLat[1]);
    });

    mapInstance.current = map;
  }, []);

  // Reverse geocoding
  const reverseGeocode = async (lng: number, lat: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      if (data.display_name) {
        setAddress(data.display_name);
      }
    } catch (err) {
      console.error('Geocoding failed');
    }
  };

  // Get user location
  const getUserLocation = useCallback(async () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        if (mapInstance.current) {
          mapInstance.current.getView().setCenter(window.ol.proj.fromLonLat([longitude, latitude]));
          mapInstance.current.getView().setZoom(15);
          markerFeature.current!.getGeometry()!.setCoordinates(window.ol.proj.fromLonLat([longitude, latitude]));
          reverseGeocode(longitude, latitude);
        }
      },
      () => {
        setAddress("Amsterdam, Netherlands");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const handleAddressSearch = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setAddress(value);
    
    if (value.length >= 3) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=1&countrycodes=NL`
        );
        const [result] = await response.json();
        if (result && mapInstance.current) {
          const lon = parseFloat(result.lon);
          const lat = parseFloat(result.lat);
          mapInstance.current.getView().setCenter(window.ol.proj.fromLonLat([lon, lat]));
          mapInstance.current.getView().setZoom(16);
          markerFeature.current!.getGeometry()!.setCoordinates(window.ol.proj.fromLonLat([lon, lat]));
        }
      } catch (err) {
        console.error('Search failed');
      }
    }
  };

  // ✅ FIXED: Initialize map and handle show/hide
  useEffect(() => {
    if (!window.ol || !mapRef.current) return;

    if (!mapInstance.current) {
      // Initialize map
      setTimeout(initMap, 100);
    } else if (showMap) {
      // Show map - update size
      mapInstance.current.setTarget(mapRef.current);
      setTimeout(() => {
        mapInstance.current.updateSize();
      }, 400);
    }
  }, [showMap, initMap]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isFormValid) {
      setTouched({ name: true, address: true, email: true });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      try {
        const orderId = Date.now().toString();
        const existing: Order[] = JSON.parse(localStorage.getItem("orders") || "[]");
        const newOrder: Order = {
          id: orderId,
          name: name.trim(),
          address: address.trim(),
          total,
          items,
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem("orders", JSON.stringify([newOrder, ...existing]));
        clearCart();
        navigate("/orders");
      } catch (err) {
        setError("Something went wrong placing your order.");
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: 600, margin: "2rem auto", padding: "1.5rem" }}>
        <h1>Checkout</h1>
        <p>Your cart is empty. Add some items before checking out.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", padding: "1.5rem", display: "grid", gridTemplateColumns: "2fr 1.5fr", gap: "2rem" }}>
      <div>
        <h1 style={{ marginBottom: "0.5rem" }}>Checkout</h1>
        <p style={{ color: "#555", marginBottom: "1.5rem" }}>
          Complete your details to place your order.
        </p>

        {error && (
          <div style={{ marginBottom: "1rem", padding: "0.75rem 1rem", borderRadius: 4, background: "#ffe6e6", color: "#b00020", fontSize: 14 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Name field */}
          <div style={{ marginBottom: "0.75rem" }}>
            <label style={{ fontWeight: 500, display: "block", marginBottom: 4 }}>Full name</label>
            <input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              onBlur={() => setTouched((t) => ({ ...t, name: true }))} 
              required 
              placeholder="e.g. Andrej Petrov" 
              style={{ width: "100%", padding: "0.5rem 0.6rem", borderRadius: 4, border: `1px solid ${touched.name && !isNameValid ? "#b00020" : "#ccc"}` }} 
            />
            {touched.name && !isNameValid && <span style={{ color: "#b00020", fontSize: 12 }}>Please enter at least 2 characters.</span>}
          </div>

          {/* Email field */}
          <div style={{ marginBottom: "0.75rem" }}>
            <label style={{ fontWeight: 500, display: "block", marginBottom: 4 }}>Email (optional)</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              onBlur={() => setTouched((t) => ({ ...t, email: true }))} 
              placeholder="you@example.com" 
              style={{ width: "100%", padding: "0.5rem 0.6rem", borderRadius: 4, border: `1px solid ${touched.email && !isEmailValid ? "#b00020" : "#ccc"}` }} 
            />
            {touched.email && !isEmailValid && <span style={{ color: "#b00020", fontSize: 12 }}>Please enter a valid email address.</span>}
          </div>

          {/* Address + Map */}
          <div style={{ marginBottom: "0.75rem" }}>
            <label style={{ fontWeight: 500, display: "block", marginBottom: 4 }}>Delivery address</label>
            
            <button 
              type="button" 
              onClick={() => setShowMap(!showMap)} 
              style={{ width: "100%", padding: "0.7rem", marginBottom: "0.5rem", background: showMap ? "#ef4444" : "#059669", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500 }}
            >
              {showMap ? "❌ Hide map" : "🗺️ Show OpenLayers map"}
            </button>

            <textarea
              value={address}
              onChange={handleAddressSearch}
              onBlur={() => setTouched((t) => ({ ...t, address: true }))}
              required
              rows={3}
              placeholder="Click map, type address, or use your location"
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: 6,
                border: `1px solid ${touched.address && !isAddressValid ? "#b00020" : "#e5e7eb"}`,
                resize: "vertical",
                marginBottom: "0.5rem"
              }}
            />
            {touched.address && !isAddressValid && <span style={{ color: "#b00020", fontSize: 12 }}>Please enter a full delivery address.</span>}

            {/* ✅ FIXED: Added explicit width + proper height handling */}
            <div
              ref={mapRef}
              style={{
                width: "100%",           // ✅ CRITICAL: Explicit width
                height: showMap ? "320px" : "0px",
                minHeight: showMap ? "320px" : "0px",
                overflow: "hidden",
                borderRadius: 8,
                border: showMap ? "2px solid #059669" : "none",
                transition: "all 0.3s ease",
                marginBottom: "0.75rem"
              }}
            />

            <button 
              type="button" 
              onClick={getUserLocation} 
              style={{ width: "100%", padding: "0.6rem", background: "#f59e0b", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500 }}
            >
              📍 Use my current location
            </button>
          </div>

          {/* Notes field */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ fontWeight: 500, display: "block", marginBottom: 4 }}>Order notes (optional)</label>
            <textarea 
              value={note} 
              onChange={(e) => setNote(e.target.value)} 
              rows={2} 
              placeholder="E.g. Ring the bell, leave at reception" 
              style={{ width: "100%", padding: "0.5rem 0.6rem", borderRadius: 4, border: "1px solid #ccc", resize: "vertical" }} 
            />
          </div>

          <button 
            type="submit" 
            disabled={!isFormValid || loading} 
            style={{ width: "100%", padding: "0.8rem", border: "none", borderRadius: 6, background: !isFormValid || loading ? "#d1d5db" : "#111827", color: "#fff", fontWeight: 600, fontSize: 16, cursor: !isFormValid || loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Placing order..." : `Place order – ${total.toFixed(2)} €`}
          </button>
        </form>
      </div>

      {/* Order summary */}
      <aside style={{ borderLeft: "1px solid #e5e7eb", paddingLeft: "1.5rem" }}>
        <h2 style={{ marginBottom: "0.75rem" }}>Order summary</h2>
        <p style={{ fontSize: 14, color: "#555", marginBottom: "0.75rem" }}>
          {itemCount} item{itemCount !== 1 ? "s" : ""} in your cart
        </p>
        <div style={{ maxHeight: 260, overflowY: "auto", marginBottom: "1rem", paddingRight: "0.5rem" }}>
          {items.map((item) => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 14, padding: "0.4rem 0", borderBottom: "1px solid #f3f4f6" }}>
              <div style={{ marginRight: "0.5rem" }}>
                <div style={{ fontWeight: 500 }}>{item.name}</div>
                <div style={{ color: "#6b7280" }}>Qty: {item.quantity ?? 1}</div>
              </div>
              <div style={{ whiteSpace: "nowrap" }}>{(item.price * (item.quantity ?? 1)).toFixed(2)} €</div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "0.75rem", fontSize: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
            <span>Subtotal</span><span>{total.toFixed(2)} €</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
            <span>Shipping</span><span>Free</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, marginTop: "0.25rem" }}>
            <span>Total</span><span>{total.toFixed(2)} €</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
