import { FormEvent, useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useCart, CartItem } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./CheckoutPage.css";

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
  const [showMap, setShowMap] = useState(true); 
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
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

  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);


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


  const reverseGeocode = useCallback(async (lng: number, lat: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      if (data.display_name) {
        setAddress(data.display_name);
      }
    } catch (err) {
    }
  }, []);


  const initMap = useCallback(() => {
    if (!mapRef.current || !window.ol || mapInstance.current) return;


    if (mapInstance.current) {
      mapInstance.current.setTarget(undefined);
      mapInstance.current = null;
    }

    const Map = window.ol.Map;
    const View = window.ol.View;
    const TileLayer = window.ol.layer.Tile;
    const OSM = window.ol.source.OSM;
    const VectorLayer = window.ol.layer.Vector;
    const VectorSource = window.ol.source.Vector;
    const Point = window.ol.geom.Point;
    const Style = window.ol.style.Style;
    const Icon = window.ol.style.Icon;

    const moscowCenter = window.ol.proj.fromLonLat([37.6173, 55.7558]);

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
        center: moscowCenter,  
        zoom: 12               
      })
    });

    const markerSource = new VectorSource({});
    const markerStyle = new Style({
      image: new Icon({
        src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDOC43MTUyOCAyIDQgNS43MTU0NyA0IDEyQzQgMTguMjg0NiA3LjE5Mjg5IDIxIDExLjUgMjFDMTMuMjg0NiAyMSAxNiAxOC4yODQ2IDE2IDEyQzE2IDUuNzE1NDcgMTMuMjg0NiAyIDExLjUgMkMxMC4yOTI5IDIgOS4wOTI4OSAyLjI5MDQzIDguNDk5OTYgMi40OTk0MUwxMiAxMFYxMkgxMkwxNS41MDAxIDE1LjUwMDA2QzE1LjcwOTcgMTUuMDk5IDE2LjAwMDcgMTQuNzA5IDE2LjAwMDcgMTQuNUMxNiAwOS4yODQ2IDEzLjI4NDYgNiAxMS41IDZDNS43MTU0NyA2IDIgOS4yODQ2IDIgMTJDMiAxOC4yODQ2IDUuNzE1NDcgMjEgMTEuNSAyMUMxNy4yODQ2IDIxIDIwIDE4LjI4NDYgMjAgMTJDMjAgNS43MTU0NyAxNy4yODQ2IDIgMTEuNSAyWkZpbGw9IiM0RTY2RkYiLz4KPC9zdmc+',
        scale: 0.8
      })
    });

    markerFeature.current = new window.ol.Feature({
      geometry: new Point(moscowCenter)  
    });
    markerFeature.current.setStyle(markerStyle);
    markerSource.addFeature(markerFeature.current);

    const vectorLayer = new VectorLayer({
      source: markerSource
    });
    map.addLayer(vectorLayer);


    reverseGeocode(37.6173, 55.7558);

    map.on('singleclick', (evt: any) => {
      const coord = evt.coordinate;
      const lonLat = window.ol.proj.toLonLat(coord);
      markerFeature.current!.getGeometry()!.setCoordinates(coord);
      reverseGeocode(lonLat[0], lonLat[1]);
      setShowSuccessMessage(true);
    });

    mapInstance.current = map;
  }, [reverseGeocode]);


  const getUserLocation = useCallback(async () => {    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        
        if (mapInstance.current && markerFeature.current) {
          const center = window.ol.proj.fromLonLat([longitude, latitude]);
          mapInstance.current.getView().setCenter(center);
          mapInstance.current.getView().setZoom(15);
          markerFeature.current!.getGeometry()!.setCoordinates(center);
          reverseGeocode(longitude, latitude);
        }
      },
      (error) => {
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000,
        maximumAge: 0 
      }
    );
  }, [reverseGeocode]);


  const handleAddressSearch = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setAddress(value);
    
    if (value.length >= 3) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=1&countrycodes=RU` 
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
      }
    }
  };


  useEffect(() => {
    if (!window.ol || !mapRef.current) return;

    const timeoutId = setTimeout(() => {
      initMap();
    }, 100); 

    return () => {
      clearTimeout(timeoutId);
      if (mapInstance.current) {
        mapInstance.current.setTarget(undefined);
        mapInstance.current = null;
      }
    };
  }, [initMap]); 

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
      <div className="empty-cart">
        <h1>Checkout</h1>
        <p>Your cart is empty. Add some items before checking out.</p>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div>
        <h1 className="checkout-title">Checkout</h1>
        <p className="checkout-subtitle">
          Complete your details to place your order.
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Full name</label>
            <input 
              className={`form-input ${touched.name && !isNameValid ? 'input-error' : ''}`}
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              onBlur={() => setTouched((t) => ({ ...t, name: true }))} 
              required 
              placeholder="e.g. Andrej Petrov" 
            />
            {touched.name && !isNameValid && <span className="error-text">Please enter at least 2 characters.</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Email (optional)</label>
            <input 
              className={`form-input form-input-email ${touched.email && !isEmailValid ? 'input-error' : ''}`}
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              onBlur={() => setTouched((t) => ({ ...t, email: true }))} 
              placeholder="you@example.com" 
            />
            {touched.email && !isEmailValid && <span className="error-text">Please enter a valid email address.</span>}
          </div>

          <div className="form-group map-section">
            <label className="form-label">Delivery address</label>
            
            {/* ✅ HIDE BUTTON - MAP ALWAYS VISIBLE */}
            <textarea
              className={`form-textarea-address ${touched.address && !isAddressValid ? 'input-error' : ''}`}
              value={address}
              onChange={handleAddressSearch}
              onBlur={() => setTouched((t) => ({ ...t, address: true }))}
              required
              rows={3}
              placeholder="Moscow address auto-filled. Click map or type to change."
            />
            {touched.address && !isAddressValid && <span className="error-text">Please enter a full delivery address.</span>}

            {showSuccessMessage && (
              <div className={`success-toast ${showMap ? 'map-showing' : 'map-hidden'}`}>
                ✅ Address successfully changed
              </div>
            )}

            {/* ✅ MAP ALWAYS VISIBLE */}
            <div
              ref={mapRef}
              className="map-container map-show"
            />

            <button 
              type="button" 
              className="location-btn"
              onClick={getUserLocation}
            >
              📍 Use my current location
            </button>
          </div>

          <div className="form-group">
            <label className="form-label">Order notes (optional)</label>
            <textarea 
              className="note-textarea"
              value={note} 
              onChange={(e) => setNote(e.target.value)} 
              rows={2} 
              placeholder="E.g. Ring the bell, leave at reception" 
            />
          </div>

          <button 
            type="submit" 
            className={`submit-btn ${!isFormValid || loading ? 'submit-disabled' : ''}`}
            disabled={!isFormValid || loading}
          >
            {loading ? "Placing order..." : `Place order – ${total.toFixed(2)} €`}
          </button>
        </form>
      </div>

      <aside className="order-summary">
        <h2>Order summary</h2>
        <p className="summary-text">
          {itemCount} item{itemCount !== 1 ? "s" : ""} in your cart
        </p>
        <div className="items-scroll">
          {items.map((item) => {
            const qty = item.quantity ?? 1;
            const itemTotal = (item.price * qty).toFixed(2);
            return (
              <div key={item.id} className="cart-item-row">
                <div className="item-details">
                  <div className="item-name">
                    {item.name} <span className="item-qty-inline">x{qty}</span>
                  </div>
                </div>
                <div className="item-price">{itemTotal} €</div>
              </div>
            );
          })}
        </div>
        <div className="order-totals">
          <div className="total-row">
            <span>Subtotal</span><span>{total.toFixed(2)} €</span>
          </div>
          <div className="total-row">
            <span>Shipping</span><span>Free</span>
          </div>
          <div className="total-row total-final">
            <span>Total</span><span>{total.toFixed(2)} €</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
