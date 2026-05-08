import { useState, useEffect, useCallback } from "react";

const KEY = "ms_wishlist_v1";

const read = () => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
};

const write = (slugs) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(slugs));
    window.dispatchEvent(new CustomEvent("wishlist:change", { detail: slugs }));
  } catch (_) {}
};

export function useWishlist() {
  const [slugs, setSlugs] = useState(() => read());

  useEffect(() => {
    const onChange = (e) => setSlugs(e.detail || read());
    const onStorage = (e) => { if (e.key === KEY) setSlugs(read()); };
    window.addEventListener("wishlist:change", onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("wishlist:change", onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const has = useCallback((slug) => slugs.includes(slug), [slugs]);

  // Functional updaters so multiple toggle/remove calls in the same tick
  // (e.g. "Move all to cart" iterating) all observe the latest state.
  const toggle = useCallback((slug) => {
    let wasAdded = false;
    setSlugs((prev) => {
      const isIn = prev.includes(slug);
      wasAdded = !isIn;
      const next = isIn ? prev.filter((s) => s !== slug) : [...prev, slug];
      write(next);
      return next;
    });
    return wasAdded;
  }, []);

  const remove = useCallback((slug) => {
    setSlugs((prev) => {
      const next = prev.filter((s) => s !== slug);
      write(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setSlugs([]);
    write([]);
  }, []);

  return { slugs, count: slugs.length, has, toggle, remove, clear };
}
