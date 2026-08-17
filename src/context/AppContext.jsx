import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { products } from "../data/products";

const AppContext = createContext(null);

const CART_KEY = "bobs-cart";

export function AppProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  });
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      /* ignore quota errors */
    }
  }, [cart]);

  const showToast = useCallback((message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const addToCart = useCallback(
    (slug, note = "") => {
      setCart((prev) => [...prev, { slug, note }]);
      const item = products.find((p) => p.slug === slug);
      if (item) showToast(`Added ${item.name} to cart`);
    },
    [showToast]
  );

  const removeFromCart = useCallback((index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartItems = cart
    .map((entry) => {
      const slug = typeof entry === "string" ? entry : entry.slug;
      const note = typeof entry === "object" ? (entry.note || "") : "";
      const product = products.find((p) => p.slug === slug);
      return product ? { ...product, note } : null;
    })
    .filter(Boolean);

  const value = {
    cart,
    cartItems,
    cartCount: cart.length,
    addToCart,
    removeFromCart,
    clearCart,
    toast,
    showToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
