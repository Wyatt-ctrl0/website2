import { useState, useEffect, useCallback } from "react";

// localStorage-backed cart so the cart drawer on the landing page and the
// cart drawer on the product detail page share state. Mirrors the shape of
// useWishlist (event + storage listeners), but stores full cart-line objects
// instead of just slugs.
const KEY = "ms_cart_v1";

const read = () => {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
};

const write = (items) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("cart:change", { detail: items }));
  } catch (_) {}
};

export function useCart() {
  const [items, setItems] = useState(() => read());

  useEffect(() => {
    const onChange = (e) => setItems(Array.isArray(e.detail) ? e.detail : read());
    const onStorage = (e) => { if (e.key === KEY) setItems(read()); };
    window.addEventListener("cart:change", onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("cart:change", onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const add = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((x) => x.name === product.name);
      const next = found
        ? prev.map((x) => x.name === product.name ? { ...x, qty: x.qty + qty } : x)
        : [...prev, { ...product, qty }];
      write(next);
      return next;
    });
  }, []);

  const updateQty = useCallback((name, delta) => {
    setItems((prev) => {
      const next = prev.flatMap((x) => x.name === name ? (x.qty + delta <= 0 ? [] : [{ ...x, qty: x.qty + delta }]) : [x]);
      write(next);
      return next;
    });
  }, []);

  const remove = useCallback((name) => {
    setItems((prev) => {
      const next = prev.filter((x) => x.name !== name);
      write(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    write([]);
  }, []);

  const itemCount = items.reduce((s, x) => s + x.qty, 0);
  const subtotal = items.reduce((s, x) => s + x.price * x.qty, 0);

  return { items, itemCount, subtotal, add, updateQty, remove, clear };
}
