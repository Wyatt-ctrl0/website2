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

  const toggle = useCallback((slug) => {
    const next = slugs.includes(slug) ? slugs.filter((s) => s !== slug) : [...slugs, slug];
    write(next);
    setSlugs(next);
    return !slugs.includes(slug); // returns true if it was added
  }, [slugs]);

  const remove = useCallback((slug) => {
    const next = slugs.filter((s) => s !== slug);
    write(next);
    setSlugs(next);
  }, [slugs]);

  const clear = useCallback(() => {
    write([]);
    setSlugs([]);
  }, []);

  return { slugs, count: slugs.length, has, toggle, remove, clear };
}
