import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Download, ShoppingBag, Search, User, Menu, X, ArrowLeft, Heart, Star, ChevronRight } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const LOGO_URL = "/img/logo.png";

// Mud paw print SVG (used in promo popup)
export const PawPrint = ({ size = 120, color = "#5C3A2E", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
    <ellipse cx="32" cy="42" rx="14" ry="12" fill={color} />
    <ellipse cx="14" cy="22" rx="6" ry="8" fill={color} transform="rotate(-15 14 22)" />
    <ellipse cx="50" cy="22" rx="6" ry="8" fill={color} transform="rotate(15 50 22)" />
    <ellipse cx="22" cy="10" rx="5" ry="6.5" fill={color} />
    <ellipse cx="42" cy="10" rx="5" ry="6.5" fill={color} />
  </svg>
);

export const RESCUE_IMG = {
  jack: "https://customer-assets.emergentagent.com/job_6d3e1c7b-f001-4e06-8ed8-3843020b086b/artifacts/q86lwpgi_IMG_1473.jpg",
  sophie: "https://customer-assets.emergentagent.com/job_6d3e1c7b-f001-4e06-8ed8-3843020b086b/artifacts/g2hrd7bt_IMG_9494.jpg",
  molly: "https://customer-assets.emergentagent.com/job_6d3e1c7b-f001-4e06-8ed8-3843020b086b/artifacts/yvrv5cn8_IMG_9662.jpg",
};

const PRODUCTS = [
  { slug: "salmon-soft-treats", category: "treats", name: "Salmon Soft Treats", price: 14.99, compareAt: 19.99, emoji: "🦴", bg: "#ffe4d4", badge: "Bestseller", vendor: "Molly & Sophie", rating: 4.9, reviews: 312, stock: 8, desc: "Slow-baked, soft, and irresistible. Made with real wild-caught salmon and zero junk — Jack approved." },
  { slug: "cozy-donut-bed", category: "beds", name: "Cozy Donut Bed", price: 49.99, emoji: "🛏️", bg: "#d2efef", rating: 4.8, reviews: 246, stock: 14, desc: "A plush, calming donut bed with raised edges for that secure 'I am safe and loved' feeling. Sophie's nightly choice." },
  { slug: "squeaky-plush-carrot", category: "toys", name: "Squeaky Plush Carrot", price: 18.99, emoji: "🎾", bg: "#fce8da", rating: 4.7, reviews: 158, stock: 22, desc: "Crinkles, squeaks, and survives at least three rounds of zoomies. Tested rigorously by Molly." },
  { slug: "adventure-harness", category: "walks", name: "Adventure Harness", price: 34.99, emoji: "🦮", bg: "#e8f0d4", badge: "New", rating: 4.9, reviews: 89, stock: 11, desc: "Padded, no-pull, comes in five colors. Great for hikes, casual sniff walks, and dramatic photo shoots." },
  { slug: "calming-chew-sticks", category: "treats", name: "Calming Chew Sticks", price: 22.99, emoji: "🌿", bg: "#ffe4d4", rating: 4.6, reviews: 134, stock: 19, desc: "Natural calming chews with chamomile and L-theanine. Perfect for vet visits, fireworks, and stressful Mondays." },
  { slug: "premium-kibble-bowl", category: "beds", name: "Premium Kibble Bowl", price: 26.99, emoji: "🥣", bg: "#fce8da", rating: 4.8, reviews: 201, stock: 6, desc: "Slow-feeder ceramic bowl that prevents gulping and looks gorgeous on your floor." },
  { slug: "plaid-travel-coat", category: "walks", name: "Plaid Travel Coat", price: 44.99, emoji: "🧥", bg: "#e8f0d4", rating: 4.7, reviews: 73, stock: 9, desc: "Water-resistant plaid coat with reflective trim. Because chilly walks deserve style." },
  { slug: "salmon-jerky-bites", category: "treats", name: "Salmon Jerky Bites", price: 16.99, compareAt: 21.99, emoji: "🐟", bg: "#d2efef", rating: 4.9, reviews: 287, stock: 4, desc: "High-protein single-ingredient training treats. Tiny pieces, big tail-wags." },
];

// Reusable star rating component (also used by ProductDetail)
export const StarRating = ({ rating = 5, reviews, size = ".8rem", showCount = true, color = "#f5b800" }) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", fontSize: size, fontFamily: "var(--font-heading)", fontWeight: 700 }} data-testid="star-rating">
      <span style={{ color, letterSpacing: ".05em" }}>
        {"★".repeat(full)}{half ? "½" : ""}{"☆".repeat(5 - full - (half ? 1 : 0))}
      </span>
      <span style={{ color: "rgba(31,41,55,0.6)", fontWeight: 600 }}>{rating.toFixed(1)}</span>
      {showCount && reviews != null && <span style={{ color: "rgba(31,41,55,0.5)", fontWeight: 500 }}>({reviews})</span>}
    </span>
  );
};

export { PRODUCTS };

const CATEGORIES = [
  { key: "treats", title: "Dog Treats", emoji: "🦴", bg: "#ffe4d4" },
  { key: "beds", title: "Cozy Beds", emoji: "🛏️", bg: "#d2efef" },
  { key: "toys", title: "Toys & Play", emoji: "🎾", bg: "#fce8da" },
  { key: "walks", title: "Walks & Travel", emoji: "🦮", bg: "#e8f0d4" },
];

export default function ThemePreview() {
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [popupOpen, setPopupOpen] = useState(true);
  const [cart, setCart] = useState([]);
  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState(null);
  const [promoMsg, setPromoMsg] = useState("");
  const [codeCopied, setCodeCopied] = useState(false);
  const [newsletterMsg, setNewsletterMsg] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const addToCart = (p) => {
    setCart((prev) => {
      const found = prev.find((x) => x.name === p.name);
      if (found) return prev.map((x) => x.name === p.name ? { ...x, qty: x.qty + 1 } : x);
      return [...prev, { ...p, qty: 1 }];
    });
    setCartOpen(true);
  };
  const updateQty = (name, delta) => {
    setCart((prev) => prev.flatMap((x) => x.name === name ? (x.qty + delta <= 0 ? [] : [{ ...x, qty: x.qty + delta }]) : [x]));
  };
  const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const threshold = 50;
  const remaining = Math.max(0, threshold - subtotal);
  const progress = Math.min(100, (subtotal / threshold) * 100);

  const validCodes = {
    WELCOME10: { label: "10% off", type: "percent", value: 10 },
    PETS15: { label: "15% off", type: "percent", value: 15 },
    FREESHIP: { label: "Free shipping", type: "ship" },
    RESCUE20: { label: "20% off", type: "percent", value: 20 },
  };
  const applyPromo = (e) => {
    e.preventDefault();
    const code = promoInput.toUpperCase().trim();
    if (validCodes[code]) {
      setPromoApplied({ code, ...validCodes[code] });
      setPromoMsg(`✓ Code accepted! ${validCodes[code].label} applied.`);
      setPromoInput("");
    } else {
      setPromoApplied(null);
      setPromoMsg("✗ Invalid code. Try WELCOME10!");
    }
  };

  const copyCode = async () => {
    const text = "WELCOME10";
    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        copied = true;
      }
    } catch (_) { /* fall through */ }
    if (!copied) {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.top = "-1000px";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        ta.setSelectionRange(0, text.length);
        copied = document.execCommand("copy");
        document.body.removeChild(ta);
      } catch (_) { /* swallow */ }
    }
    setCodeCopied(copied);
    setTimeout(() => setCodeCopied(false), 2200);
  };

  const submitNewsletter = async (e) => {
    e.preventDefault();
    const email = e.target.elements.newsletter_email.value;
    if (!email) return;
    try {
      await fetch(`${API}/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      e.target.reset();
      setNewsletterMsg("✓ You're on the list! Welcome to the pack.");
    } catch (_) {
      setNewsletterMsg("Something went wrong. Try again.");
    }
    setTimeout(() => setNewsletterMsg(""), 4000);
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = `${API}/theme/download`;
    a.download = "molly-and-sophie-theme.zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  useEffect(() => {
    document.body.style.overflow = popupOpen || cartOpen || searchOpen || accountOpen || lightboxOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [popupOpen, cartOpen, searchOpen, accountOpen, lightboxOpen]);

  // Scroll-reveal animations — re-runs when the visible product set changes
  // so newly inserted cards are observed (and not stuck at opacity:0).
  useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.is-visible)");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [activeCategory]);

  const filteredProducts = searchQuery.trim() ? PRODUCTS.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())) : [];

  return (
    <div style={{ background: "var(--color-bg)" }} data-testid="theme-preview">
      {/* PREVIEW BAR */}
      <div style={{ background: "var(--color-text)", color: "var(--color-cream)", padding: "0.75rem 1rem", textAlign: "center", fontSize: "0.85rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: ".75rem" }} data-testid="preview-bar">
        <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", color: "var(--color-cream)" }} data-testid="preview-back-btn">
          <ArrowLeft size={16} /> Back to download
        </Link>
        <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}>👀 Live Theme Preview</div>
        <button onClick={handleDownload} className="btn btn-primary" style={{ padding: ".5rem 1rem", fontSize: ".8rem" }} data-testid="preview-download-btn">
          <Download size={14} /> Download ZIP
        </button>
      </div>

      {/* ANNOUNCEMENT BAR */}
      <div style={{ background: "var(--color-text)", color: "var(--color-cream)", textAlign: "center", padding: "0.6rem 1rem", fontSize: "0.875rem" }}>
        🐾 1% of every order goes to rescuing pets in need
      </div>

      {/* HEADER */}
      <header style={{ background: "var(--color-bg)", borderBottom: "2px solid rgba(31,41,55,0.08)", position: "sticky", top: 0, zIndex: 30 }} data-testid="theme-header">
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", padding: "1rem", gap: "1rem" }}>
          <nav style={{ display: "flex", gap: "2rem", fontFamily: "var(--font-heading)", fontWeight: 600 }} className="hide-mobile">
            <button onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })} style={{ background: "none", border: "none", fontFamily: "inherit", fontWeight: "inherit", fontSize: "1rem", cursor: "pointer", color: "inherit" }} data-testid="nav-shop-all">Shop All</button>
            <button onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })} style={{ background: "none", border: "none", fontFamily: "inherit", fontWeight: "inherit", fontSize: "1rem", cursor: "pointer", color: "inherit" }} data-testid="nav-our-story">Our Story</button>
            <button onClick={() => document.getElementById("footer-contact")?.scrollIntoView({ behavior: "smooth" })} style={{ background: "none", border: "none", fontFamily: "inherit", fontWeight: "inherit", fontSize: "1rem", cursor: "pointer", color: "inherit" }} data-testid="nav-contact">Contact</button>
          </nav>
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ display: "flex", justifyContent: "center" }} data-testid="logo-link">
            <img src={LOGO_URL} alt="Molly & Sophie" style={{ height: 96, width: "auto" }} className="header-logo-img" />
          </a>
          <div style={{ display: "flex", gap: ".75rem", alignItems: "center", justifyContent: "flex-end" }}>
            <button style={iconBtnStyle} onClick={() => setSearchOpen(true)} data-testid="search-toggle" aria-label="Search"><Search size={20} /></button>
            <button style={iconBtnStyle} onClick={() => setAccountOpen(true)} data-testid="account-toggle" aria-label="Account"><User size={20} /></button>
            <button style={iconBtnStyle} onClick={() => setCartOpen(true)} data-testid="preview-cart-toggle">
              <ShoppingBag size={20} />
              {cart.length > 0 && (
                <span style={{ position: "absolute", top: 4, right: 4, minWidth: 20, height: 20, background: "var(--color-primary)", color: "#fff", borderRadius: 999, fontSize: ".7rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>{cart.reduce((s, x) => s + x.qty, 0)}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section style={{ background: "var(--color-mint)", padding: "4rem 0 6rem", overflow: "hidden" }} data-testid="preview-hero">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem", alignItems: "center" }} className="hero-grid-md">
            <div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", background: "var(--color-cream)", padding: ".4rem 1rem", borderRadius: 999, fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: ".85rem", marginBottom: "1.5rem" }}>
                🐾 Family-run with love
              </span>
              <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.75rem)", marginBottom: "1.25rem" }}>
                Treats, toys & love<br />for the <em>whole pack</em>
              </h1>
              <p style={{ fontSize: "1.125rem", maxWidth: 480, marginBottom: "2rem" }}>
                Curated pet essentials inspired by three rescue pups. Every wag, woof, and order helps fund animal rescues we love.
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <a href="#products" className="btn btn-primary">Shop the Pack</a>
                <a href="#about" className="btn btn-outline">Our Story</a>
              </div>
            </div>
            <div style={{ position: "relative" }}>
              <div style={{ borderRadius: 32, overflow: "hidden", aspectRatio: "4/5", boxShadow: "0 30px 60px -20px rgba(31,41,55,0.3)" }}>
                <img src={RESCUE_IMG.molly} alt="Happy puppy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div className="wobble" style={{ position: "absolute", bottom: -20, left: -20, background: "var(--color-primary)", color: "#fff", borderRadius: "50%", width: 130, height: 130, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: ".9rem", padding: "1rem", boxShadow: "0 8px 0 0 rgba(0,0,0,0.1)" }}>
                1% to Pet<br />Rescues 🐾
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BADGES STRIP */}
      <section style={{ background: "var(--color-bg)", borderBottom: "1px dashed rgba(31,41,55,0.1)", padding: "1.25rem 0" }} data-testid="preview-trust-strip">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", textAlign: "center" }}>
            {[
              { icon: "🚚", title: "Free shipping $50+", sub: "Ships from the USA" },
              { icon: "↩️", title: "30-day returns", sub: "No questions asked" },
              { icon: "💝", title: "1% to rescues", sub: "Every single order" },
              { icon: "🔒", title: "Secure checkout", sub: "256-bit encryption" },
            ].map((b) => (
              <div key={b.title} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: ".75rem" }} data-testid={`trust-${b.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
                <div style={{ fontSize: "1.65rem" }} aria-hidden>{b.icon}</div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: ".9rem", lineHeight: 1.2 }}>{b.title}</div>
                  <div style={{ fontSize: ".75rem", color: "rgba(31,41,55,0.6)" }}>{b.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: "5rem 0" }} data-testid="preview-categories">
        <div className="container">
          <SectionHead eyebrow="Shop by Pet" title={<>Find what makes them <em>wag</em></>} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.5rem" }}>
            {CATEGORIES.map((c) => (
              <button key={c.key} onClick={() => { setActiveCategory(c.key); document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); }} style={{ background: c.bg, padding: "2rem 1.25rem", borderRadius: 24, textAlign: "center", transition: "transform .25s ease, box-shadow .25s ease", border: activeCategory === c.key ? "3px solid var(--color-primary)" : "3px solid transparent", cursor: "pointer", fontFamily: "inherit" }} className="hover-lift" data-testid={`category-${c.key}`}>
                <div style={{ fontSize: "3rem", marginBottom: ".75rem" }}>{c.emoji}</div>
                <h3 style={{ fontSize: "1.125rem", margin: 0 }}>{c.title}</h3>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section id="products" style={{ padding: "5rem 0" }} data-testid="preview-products" className="reveal">
        <div className="container">
          <SectionHead eyebrow="Best Sellers" title={<>Tail-wagging <em>favorites</em></>} sub="Hand-picked goodies our pack approves of." />
          {activeCategory !== "all" && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: ".75rem", marginBottom: "2rem", flexWrap: "wrap" }} data-testid="active-filter">
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.95rem" }}>Showing: <span style={{ color: "var(--color-primary)" }}>{CATEGORIES.find(c => c.key === activeCategory)?.title}</span></span>
              <button onClick={() => setActiveCategory("all")} className="btn btn-outline" style={{ padding: ".4rem 1rem", fontSize: ".8rem" }} data-testid="clear-filter">Show all</button>
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
            {(activeCategory === "all" ? PRODUCTS : PRODUCTS.filter(p => p.category === activeCategory)).map((p, i) => (
              <div key={p.slug} style={{ background: "#fff", borderRadius: 24, overflow: "hidden", border: "2px solid transparent", transition: "all .25s ease", display: "flex", flexDirection: "column", cursor: "pointer" }} className="product-card-hover reveal" data-testid={`preview-product-${i}`} onClick={() => { window.scrollTo(0, 0); navigate(`/preview/product/${p.slug}`); }}>
                <div style={{ aspectRatio: "1", background: p.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "5rem", position: "relative" }}>
                  {p.emoji}
                  {p.badge && <span style={{ position: "absolute", top: "1rem", left: "1rem", background: "var(--color-primary)", color: "#fff", padding: ".35rem .75rem", borderRadius: 999, fontSize: ".75rem", fontWeight: 700, fontFamily: "var(--font-heading)" }}>{p.badge}</span>}
                  {p.compareAt && <span style={{ position: "absolute", top: "1rem", right: "1rem", background: "var(--color-secondary)", color: "#fff", padding: ".35rem .75rem", borderRadius: 999, fontSize: ".75rem", fontWeight: 700, fontFamily: "var(--font-heading)" }}>SALE</span>}
                </div>
                <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ fontSize: ".75rem", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--color-secondary)", fontWeight: 700, fontFamily: "var(--font-heading)", marginBottom: ".4rem" }}>Molly &amp; Sophie</div>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.05rem", margin: "0 0 .5rem" }}>{p.name}</h3>
                  <div style={{ marginBottom: ".5rem" }}>
                    <StarRating rating={p.rating} reviews={p.reviews} />
                  </div>
                  <div style={{ marginBottom: ".75rem" }}>
                    {p.compareAt && <span style={{ color: "rgba(31,41,55,0.5)", textDecoration: "line-through", marginRight: ".5rem", fontWeight: 500 }}>${p.compareAt.toFixed(2)}</span>}
                    <span style={{ fontWeight: 800 }}>${p.price.toFixed(2)}</span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); addToCart(p); }} className="btn btn-secondary" style={{ padding: ".55rem 1rem", fontSize: ".85rem", marginTop: "auto" }} data-testid={`preview-add-${i}`}>Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESCUES */}
      <section id="about" style={{ padding: "5rem 0", background: "var(--color-cream)" }} data-testid="preview-rescues">
        <div className="container">
          <SectionHead eyebrow="Meet The Pack" title={<>Three rescues. <em>One mission.</em></>} sub="These three goofballs are the heart of everything we do." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2rem", maxWidth: 1100, margin: "0 auto" }}>
            {[
              { name: "Jack", slug: "jack", role: "The Old Soul", img: RESCUE_IMG.jack, bio: "His previous owners traveled often for work and couldn't give him the attention he needed. Today, Jack is the calmest member of the pack." },
              { name: "Sophie", slug: "sophie", role: "The Fluffy Diplomat", img: RESCUE_IMG.sophie, bio: "Sophie was left behind during quarantine. Their loss; our luckiest day. She greets everyone like a long-lost friend." },
              { name: "Molly", slug: "molly", role: "The Sunshine", img: RESCUE_IMG.molly, bio: "Molly's first owners couldn't afford to care for her. Now she's pure goofy puppy joy and the reason this shop exists." },
            ].map((r) => (
              <div key={r.name} onClick={() => { window.scrollTo(0, 0); navigate(`/preview/dog/${r.slug}`); }} style={{ textAlign: "center", background: "var(--color-bg)", padding: "2rem 1.5rem", borderRadius: 28, border: "3px dashed rgba(31,41,55,0.15)", cursor: "pointer" }} className="hover-lift reveal" data-testid={`preview-rescue-card-${r.slug}`}>
                <div style={{ width: 180, height: 180, margin: "0 auto 1.5rem", borderRadius: "50%", overflow: "hidden", border: "6px solid var(--color-mint)", boxShadow: "0 10px 25px -10px rgba(0,0,0,0.2)" }}>
                  <img src={r.img} alt={r.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <h3 style={{ fontSize: "2rem", color: "var(--color-primary)", marginBottom: ".5rem" }}>{r.name}</h3>
                <div style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", color: "var(--color-secondary)", marginBottom: "1rem" }}>{r.role}</div>
                <p style={{ color: "rgba(31,41,55,0.75)", fontSize: ".95rem", margin: 0 }}>{r.bio}</p>
                <span style={{ display: "inline-block", marginTop: "1rem", fontFamily: "var(--font-heading)", fontWeight: 700, color: "var(--color-primary)", fontSize: ".95rem" }}>Read {r.name}'s story →</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DONATION IMPACT COUNTER */}
      <section style={{ padding: "4rem 0", background: "linear-gradient(135deg, var(--color-secondary), #4ea3a7)", color: "#fff" }} data-testid="preview-donation">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{ display: "inline-block", fontFamily: "var(--font-heading)", fontSize: ".85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".2em", color: "rgba(255,255,255,0.85)", marginBottom: "1rem" }}>Real Impact, Real Receipts</div>
            <h2 style={{ color: "#fff", margin: "0 0 .75rem", fontSize: "clamp(1.85rem, 4vw, 3rem)" }}>Together, the pack has given <em>back</em></h2>
            <p style={{ color: "rgba(255,255,255,0.9)", margin: 0, maxWidth: 620, marginLeft: "auto", marginRight: "auto" }}>Every order chips in. Here's the impact this community has made so far:</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.5rem", maxWidth: 920, margin: "0 auto 2.5rem" }} data-testid="impact-stats">
            {[
              { num: "$4,287", label: "Donated to rescues", testid: "impact-donated" },
              { num: "12", label: "Rescues supported", testid: "impact-rescues" },
              { num: "8,341", label: "Orders shipped", testid: "impact-orders" },
              { num: "100%", label: "Receipts posted", testid: "impact-receipts" },
            ].map((s) => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(6px)", borderRadius: 24, padding: "1.75rem 1rem", textAlign: "center", border: "1px solid rgba(255,255,255,0.2)" }} data-testid={s.testid}>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 2.75rem)", lineHeight: 1, marginBottom: ".5rem" }}>{s.num}</div>
                <div style={{ fontSize: ".9rem", color: "rgba(255,255,255,0.85)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#giving-back" onClick={(e) => { e.preventDefault(); document.getElementById("giving-back")?.scrollIntoView({ behavior: "smooth" }); }} className="btn btn-light" data-testid="how-it-works-btn">How It Works</a>
            <a href="https://instagram.com/shopmollyandsophie" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ borderColor: "rgba(255,255,255,0.7)", color: "#fff" }} data-testid="see-receipts-btn">See the Receipts on IG</a>
          </div>
        </div>
      </section>

      {/* GIVING BACK SECTION */}
      <section id="giving-back" style={{ padding: "5rem 0", background: "var(--color-bg)" }} data-testid="giving-back" className="reveal">
        <div className="container" style={{ maxWidth: 880 }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ display: "inline-block", fontFamily: "var(--font-heading)", fontSize: ".85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".15em", color: "var(--color-secondary)", marginBottom: "1rem" }}>How It Works</div>
            <h2 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)" }}>Small shop, <em>real impact</em></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
            {[
              { num: "01", title: "You shop", desc: "Every order, every product — no minimums, no fine print." },
              { num: "02", title: "We set aside 1%", desc: "From every single order, automatically. We keep track every month." },
              { num: "03", title: "We hand-pick a rescue", desc: "Each month we choose a different small, trusted pet rescue we believe in. We're not partnered with any single charity — just spreading the love." },
              { num: "04", title: "We donate. You see proof.", desc: "We post the donation receipt on Instagram so you know it actually happened." },
            ].map((s, i) => (
              <div key={i} style={{ background: "var(--color-cream)", padding: "2rem 1.5rem", borderRadius: 24 }} className="reveal" data-testid={`giving-step-${i + 1}`}>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "2.5rem", color: "var(--color-primary)", lineHeight: 1, marginBottom: ".5rem" }}>{s.num}</div>
                <h3 style={{ fontSize: "1.1rem", marginBottom: ".5rem" }}>{s.title}</h3>
                <p style={{ color: "rgba(31,41,55,0.7)", margin: 0, fontSize: ".95rem" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "5rem 0" }} data-testid="preview-testimonials">
        <div className="container">
          <SectionHead eyebrow="Wagging Reviews" title={<>Happy pets, <em>happier humans</em></>} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {[
              { text: "Salmon treats are a HIT in my house. Bonus points for the donation to rescues!", name: "Sarah M.", pet: "Mom of Biscuit" },
              { text: "Such warm, thoughtful packaging. You can tell real pet parents are behind this brand.", name: "Marcus T.", pet: "Dad of Olive" },
              { text: "Knowing 1% goes to rescues makes every purchase feel meaningful.", name: "Priya K.", pet: "Mom of Toby" },
            ].map((t, i) => (
              <div key={i} style={{ background: "#fff", padding: "2rem", borderRadius: 24, boxShadow: "0 4px 20px -8px rgba(0,0,0,0.08)", position: "relative" }}>
                <div style={{ color: "#f5b800", marginBottom: "1rem", letterSpacing: ".15em" }}>★★★★★</div>
                <p style={{ fontStyle: "italic", color: "rgba(31,41,55,0.85)", marginBottom: "1rem" }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--color-mint)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontFamily: "var(--font-heading)" }}>{t.name[0]}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: ".95rem" }}>{t.name}</div>
                    <div style={{ fontSize: ".8rem", color: "rgba(31,41,55,0.6)" }}>{t.pet}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="preview-faq" style={{ padding: "5rem 0", background: "var(--color-bg)" }} data-testid="preview-faq">
        <div className="container" style={{ maxWidth: 820 }}>
          <SectionHead eyebrow="Curious Pups" title={<>Frequently <em>asked</em></>} sub="Quick answers from real humans (and one drooling dog)." />
          <div style={{ display: "grid", gap: ".75rem" }}>
            {[
              { q: "How fast do orders ship?", a: "Most orders leave our hands within 1–3 business days. Once shipped, you'll get a tracking link to obsess over (we do too)." },
              { q: "Do you offer free shipping?", a: "Yes! Spend $50 or more and shipping is on us within the U.S. Otherwise, flat-rate shipping is calculated at checkout." },
              { q: "What's your return policy?", a: "30-day, no-questions-asked returns on unused items. If your pup didn't approve, send it back and we'll make it right." },
              { q: "How does the 1% donation work?", a: "We automatically set aside 1% of every order's revenue. At the end of each month we hand-pick a small, trusted pet rescue and donate the full amount — then post the receipt on Instagram." },
              { q: "Can I cancel or change my order?", a: "Reach out to support@mollyandsophie.com within 12 hours of placing your order and we'll do everything we can to update or cancel it before it ships." },
              { q: "Do you ship internationally?", a: "Currently we only ship within the United States, but international shipping is on the roadmap. Sign up for our newsletter to be the first to know." },
            ].map((f, i) => (
              <FAQItem key={i} index={i} question={f.q} answer={f.a} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <p style={{ color: "rgba(31,41,55,0.7)", marginBottom: ".75rem" }}>Still have a question?</p>
            <a href="mailto:support@mollyandsophie.com" className="btn btn-outline" data-testid="faq-contact-btn">Email Support</a>
          </div>
        </div>
      </section>

      {/* INSTAGRAM / UGC STRIP */}
      <section style={{ padding: "5rem 0", background: "var(--color-cream)" }} data-testid="preview-instagram">
        <div className="container">
          <SectionHead eyebrow="@shopmollyandsophie" title={<>From the <em>pack</em> to yours</>} sub="Tag #mollyandsophie for a chance to be featured." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: ".75rem" }} data-testid="ugc-grid">
            {[
              { src: RESCUE_IMG.molly, caption: "Molly's first walk in her harness ✨" },
              { src: RESCUE_IMG.sophie, caption: "Sophie won't share the bed" },
              { src: RESCUE_IMG.jack, caption: "Jack post-treat stare-down" },
              { src: RESCUE_IMG.molly, caption: "Adventure mode: activated" },
              { src: RESCUE_IMG.sophie, caption: "Salmon = pure joy" },
              { src: RESCUE_IMG.jack, caption: "Old soul, big naps" },
            ].map((p, i) => (
              <a key={i} href="https://instagram.com/shopmollyandsophie" target="_blank" rel="noopener noreferrer" style={{ position: "relative", aspectRatio: "1", borderRadius: 18, overflow: "hidden", display: "block", cursor: "pointer" }} className="ugc-tile" data-testid={`ugc-tile-${i}`}>
                <img src={p.src} alt={p.caption} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .4s ease" }} />
                <div className="ugc-overlay" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(31,41,55,0.85), rgba(31,41,55,0))", opacity: 0, transition: "opacity .25s ease", display: "flex", alignItems: "flex-end", padding: ".75rem", color: "#fff", fontSize: ".75rem", fontFamily: "var(--font-heading)", fontWeight: 600 }}>
                  📸 {p.caption}
                </div>
              </a>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <a href="https://instagram.com/shopmollyandsophie" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" data-testid="follow-instagram-btn">Follow on Instagram</a>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={{ padding: "5rem 0", background: "var(--color-mint)" }} data-testid="preview-newsletter">
        <div className="container" style={{ maxWidth: 640, textAlign: "center" }}>
          <div style={{ display: "inline-block", fontFamily: "var(--font-heading)", fontSize: ".85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".15em", color: "var(--color-secondary)", marginBottom: "1rem" }}>Keep In Touch</div>
          <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}>Treats, news & <em>tail wags</em></h2>
          <p>Sign up for first-dibs on new arrivals, exclusive promos, and rescue stories from the pack.</p>
          <form style={{ display: "flex", gap: ".75rem", marginTop: "1.5rem", flexWrap: "wrap" }} onSubmit={submitNewsletter}>
            <input name="newsletter_email" type="email" placeholder="your@email.com" required style={{ flex: "1 1 200px", padding: "1rem 1.5rem", borderRadius: 999, border: "2px solid transparent", background: "var(--color-bg)", fontSize: "1rem", outline: "none" }} data-testid="newsletter-input" />
            <button type="submit" className="btn btn-primary" data-testid="newsletter-submit">Subscribe</button>
          </form>
          {newsletterMsg && <div style={{ marginTop: ".75rem", fontSize: ".9rem", color: "var(--color-secondary)", fontWeight: 700 }} data-testid="newsletter-message">{newsletterMsg}</div>}
          <p style={{ fontSize: ".8rem", color: "rgba(31,41,55,0.6)", marginTop: "1rem", lineHeight: 1.5 }}>By signing up, you consent to receive updates, special offers, program communications and other information via email from us.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="footer-contact" style={{ background: "var(--color-text)", color: "var(--color-cream)", padding: "4rem 0 2rem" }} data-testid="preview-footer">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2.5rem", paddingBottom: "3rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            <div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}>
                <span style={{ color: "var(--color-primary)" }}>Molly</span> <span style={{ color: "var(--color-secondary)" }}>& Sophie</span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.7)", maxWidth: 360, marginBottom: "1.5rem" }}>A small, family-run pet shop inspired by our three rescues — Jack, Sophie & Molly.</p>
              <div style={{ display: "flex", gap: ".75rem" }} data-testid="footer-socials">
                {[
                  { label: "Instagram", href: "https://instagram.com/shopmollyandsophie", testid: "social-instagram", icon: "IG" },
                  { label: "Facebook", href: "https://facebook.com/mollyandsophie", testid: "social-facebook", icon: "FB" },
                  { label: "TikTok", href: "https://tiktok.com/@mollyandsophie.com", testid: "social-tiktok", icon: "TT" },
                ].map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} data-testid={s.testid} style={{ width: 42, height: 42, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.2)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: ".75rem", fontWeight: 700, color: "var(--color-cream)", transition: "all .2s ease" }}>{s.icon}</a>
                ))}
              </div>
            </div>
            <FooterCol title="Customer Care" items={[
              { label: "Returns", target: "preview-faq" },
              { label: "Shipping Info", target: "preview-faq" },
              { label: "Order Lookup", href: "mailto:support@mollyandsophie.com?subject=Order%20lookup" },
              { label: "Help Center", target: "preview-faq" },
              { label: "Contact Us", target: "footer-contact" },
            ]} />
            <FooterCol title="About" items={[
              { label: "Our Story", target: "about" },
              { label: "Meet the Pack", target: "about" },
              { label: "Giving Back", target: "giving-back" },
              { label: "Blog", href: "#" },
            ]} />
            <div>
              <h4 style={{ color: "var(--color-cream)", fontSize: "1rem", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: "1rem" }}>Get in Touch</h4>
              <p style={{ color: "rgba(255,255,255,0.7)", margin: ".4rem 0", fontSize: ".95rem" }}>support@mollyandsophie.com</p>
              <p style={{ color: "rgba(255,255,255,0.7)", margin: ".4rem 0", fontSize: ".95rem" }}>(570) 671-1534</p>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "2rem", flexWrap: "wrap", gap: "1rem", fontSize: ".85rem", color: "rgba(255,255,255,0.5)" }}>
            <div>© 2026 Molly &amp; Sophie. Made with 🐾 for pets everywhere.</div>
            <div>Privacy · Terms</div>
          </div>
        </div>
      </footer>

      {/* CART DRAWER */}
      {cartOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100 }} onClick={() => setCartOpen(false)} data-testid="cart-drawer-overlay" />
      )}
      <aside data-testid="cart-drawer" style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(95vw, 460px)", background: "var(--color-bg)", zIndex: 101, transform: cartOpen ? "translateX(0)" : "translateX(100%)", transition: "transform .35s ease", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem", borderBottom: "2px solid rgba(31,41,55,0.08)" }}>
          <h3 style={{ margin: 0, fontSize: "1.5rem" }}>Your Pack <span style={{ fontSize: "1rem", color: "rgba(31,41,55,0.5)", fontWeight: 400 }}>({cart.reduce((s, x) => s + x.qty, 0)})</span></h3>
          <button style={iconBtnStyle} onClick={() => setCartOpen(false)} data-testid="cart-close">
            <X size={22} />
          </button>
        </div>

        <div style={{ padding: "1rem 1.5rem 0" }}>
          <div style={{ background: "var(--color-mint)", padding: "1rem 1.5rem", borderRadius: 16 }} data-testid="shipping-bar">
            <div style={{ fontSize: ".875rem", fontWeight: 600, marginBottom: ".5rem" }}>
              {subtotal >= threshold ? <>🎉 You've unlocked <strong style={{ color: "var(--color-primary)" }}>FREE SHIPPING!</strong></> : <>Spend <strong style={{ color: "var(--color-primary)" }}>${remaining.toFixed(2)}</strong> more for FREE shipping</>}
            </div>
            <div style={{ width: "100%", height: 8, background: "rgba(31,41,55,0.1)", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ width: `${progress}%`, height: "100%", background: subtotal >= threshold ? "var(--color-secondary)" : "var(--color-primary)", transition: "width .4s ease" }} />
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem" }} data-testid="cart-empty">
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🐾</div>
              <h3>Your pack is empty</h3>
              <p style={{ color: "rgba(31,41,55,0.6)" }}>Add some goodies to spoil your furry friend.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.name} style={{ display: "grid", gridTemplateColumns: "80px 1fr auto", gap: "1rem", padding: "1rem 0", borderBottom: "1px solid rgba(31,41,55,0.08)" }} data-testid={`cart-item-${item.name}`}>
                <div style={{ width: 80, height: 80, borderRadius: 12, background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>{item.emoji}</div>
                <div>
                  <h4 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: ".95rem", margin: "0 0 .5rem" }}>{item.name}</h4>
                  <div style={{ display: "inline-flex", alignItems: "center", border: "1.5px solid rgba(31,41,55,0.15)", borderRadius: 999 }}>
                    <button style={qtyBtnStyle} onClick={() => updateQty(item.name, -1)}>−</button>
                    <span style={{ padding: "0 .5rem", minWidth: 24, textAlign: "center", fontWeight: 700, fontSize: ".85rem" }}>{item.qty}</span>
                    <button style={qtyBtnStyle} onClick={() => updateQty(item.name, 1)}>+</button>
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, textAlign: "right" }}>${(item.price * item.qty).toFixed(2)}</div>
                  <button onClick={() => updateQty(item.name, -item.qty)} style={{ background: "none", border: "none", color: "rgba(31,41,55,0.5)", fontSize: ".75rem", textDecoration: "underline", padding: 0, marginTop: ".25rem", cursor: "pointer" }}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ borderTop: "2px solid rgba(31,41,55,0.08)", padding: "1.5rem", background: "var(--color-cream)" }}>
            <div style={{ margin: "0 0 1rem", padding: "1rem", background: "var(--color-bg)", borderRadius: 12, border: "1.5px dashed rgba(31,41,55,0.2)" }}>
              <label style={{ display: "block", fontWeight: 700, fontSize: ".85rem", marginBottom: ".5rem" }}>Have a promo code?</label>
              <form onSubmit={applyPromo} style={{ display: "flex", gap: ".5rem" }}>
                <input value={promoInput} onChange={(e) => setPromoInput(e.target.value)} placeholder="Enter code (try WELCOME10)" style={{ flex: 1, padding: ".65rem 1rem", border: "1.5px solid rgba(31,41,55,0.15)", borderRadius: 999, fontSize: ".9rem", outline: "none" }} data-testid="promo-input" />
                <button type="submit" className="btn btn-secondary" style={{ padding: ".55rem 1rem", fontSize: ".85rem" }} data-testid="promo-apply">Apply</button>
              </form>
              {promoMsg && <div style={{ fontSize: ".8rem", marginTop: ".5rem", color: promoApplied ? "#2c7a4f" : "#c0392b" }} data-testid="promo-message">{promoMsg}</div>}
              {promoApplied && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".5rem 1rem", background: "var(--color-mint)", borderRadius: 999, fontSize: ".85rem", marginTop: ".5rem" }}>
                  <span><strong>{promoApplied.code}</strong> · {promoApplied.label}</span>
                  <button onClick={() => { setPromoApplied(null); setPromoMsg(""); }} style={{ background: "none", border: "none", color: "rgba(31,41,55,0.5)", cursor: "pointer", textDecoration: "underline", fontSize: ".8rem" }}>Remove</button>
                </div>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}>Subtotal</div>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.5rem", color: "var(--color-primary)" }} data-testid="cart-subtotal">${subtotal.toFixed(2)}</div>
            </div>
            <button className="btn btn-primary btn-block" data-testid="cart-checkout">Checkout →</button>
            <p style={{ textAlign: "center", fontSize: ".8rem", color: "rgba(31,41,55,0.55)", margin: ".75rem 0 0" }}>Taxes & shipping calculated at checkout</p>
          </div>
        )}
      </aside>

      {/* PROMO POPUP */}
      {popupOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} data-testid="promo-popup">
          <div style={{ background: "var(--color-bg)", borderRadius: 32, maxWidth: 880, width: "100%", display: "grid", gridTemplateColumns: "1fr", overflow: "hidden", position: "relative", maxHeight: "92vh", overflowY: "auto" }} className="popup-grid-md">
            <button onClick={() => setPopupOpen(false)} style={{ position: "absolute", top: "1rem", right: "1rem", width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5, border: "none", cursor: "pointer" }} data-testid="popup-close">
              <X size={20} />
            </button>
            <div className="popup-hero" style={{ background: "var(--color-mint)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.75rem", minHeight: 280, position: "relative", overflow: "hidden" }}>
              {/* decorative scattered paws */}
              <div style={{ position: "absolute", top: "8%", left: "10%", opacity: 0.18, transform: "rotate(-18deg)" }} aria-hidden><PawPrint size={48} color="#3a2218" /></div>
              <div style={{ position: "absolute", top: "16%", right: "12%", opacity: 0.14, transform: "rotate(22deg)" }} aria-hidden><PawPrint size={36} color="#3a2218" /></div>
              <div style={{ position: "absolute", bottom: "14%", left: "16%", opacity: 0.16, transform: "rotate(28deg)" }} aria-hidden><PawPrint size={42} color="#3a2218" /></div>
              <div style={{ position: "absolute", bottom: "8%", right: "10%", opacity: 0.20, transform: "rotate(-12deg)" }} aria-hidden><PawPrint size={56} color="#3a2218" /></div>

              {/* hero photo */}
              <div style={{ position: "relative", width: "min(78%, 220px)", aspectRatio: "1", borderRadius: "50%", overflow: "hidden", boxShadow: "0 18px 40px -12px rgba(0,0,0,0.35)", border: "6px solid var(--color-bg)" }}>
                <img src={RESCUE_IMG.molly} alt="Molly the rescue puppy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>

              {/* 1% rescue badge floating */}
              <div style={{ position: "absolute", bottom: "8%", left: "50%", transform: "translateX(-50%)", background: "var(--color-primary)", color: "#fff", borderRadius: 999, padding: ".45rem 1rem", fontFamily: "var(--font-heading)", fontSize: ".75rem", fontWeight: 800, letterSpacing: ".05em", boxShadow: "0 6px 0 rgba(0,0,0,0.08)", display: "inline-flex", alignItems: "center", gap: ".4rem", whiteSpace: "nowrap" }}>
                🐾 1% to pet rescues
              </div>
            </div>
            <div style={{ padding: "2.5rem", textAlign: "center" }}>
              <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", marginBottom: ".5rem" }}>Welcome to <em>the Pack</em></h2>
              <p style={{ color: "rgba(31,41,55,0.65)" }}>10% off your first order over $50</p>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "4rem", fontWeight: 800, color: "var(--color-primary)", lineHeight: 1, margin: ".5rem 0" }}>10% OFF</div>
              <div style={{ background: "var(--color-cream)", border: "2px dashed var(--color-primary)", padding: "1rem", borderRadius: 12, margin: "1.5rem 0", fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.5rem", letterSpacing: ".15em", color: "var(--color-primary)" }}>WELCOME10</div>
              <p style={{ fontSize: ".85rem", color: "rgba(31,41,55,0.55)", marginBottom: "1rem" }}>Valid on orders $50+. Apply at checkout.</p>
              <button onClick={copyCode} className="btn btn-primary btn-block" data-testid="popup-copy">{codeCopied ? "✓ Copied!" : "Copy Code"}</button>
              <button onClick={() => setPopupOpen(false)} className="btn btn-outline btn-block" style={{ marginTop: ".75rem" }}>Start Shopping</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .hero-grid-md { grid-template-columns: 1.1fr 1fr !important; gap: 4rem !important; }
          .donation-grid-md { grid-template-columns: 1fr auto !important; gap: 3rem !important; }
          .popup-grid-md { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 767px) {
          .hide-mobile { display: none !important; }
        }
        .product-card-hover:hover { transform: translateY(-6px); box-shadow: 0 18px 40px -15px rgba(0,0,0,0.18); border-color: var(--color-secondary) !important; }
        .hover-lift { transition: transform .25s ease, box-shadow .25s ease; }
        .hover-lift:hover { transform: translateY(-6px); }
        .reveal { opacity: 0; transform: translateY(28px); transition: opacity .8s ease, transform .8s ease; }
        .reveal.is-visible { opacity: 1; transform: translateY(0); }
        .header-logo-img { transition: transform .35s ease; }
        .header-logo-img:hover { transform: scale(1.05) rotate(-2deg); }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .ugc-tile { transition: transform .25s ease; }
        .ugc-tile:hover { transform: translateY(-4px); }
        .ugc-tile:hover img { transform: scale(1.06); }
        .ugc-tile:hover .ugc-overlay { opacity: 1; }
        .footer-link:hover { color: var(--color-cream) !important; }
      `}</style>

      {/* SEARCH MODAL */}
      {searchOpen && (
        <div onClick={() => setSearchOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 250, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "8vh 1rem 1rem" }} data-testid="search-modal">
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--color-bg)", borderRadius: 24, width: "100%", maxWidth: 640, padding: "1.5rem", boxShadow: "0 30px 60px -20px rgba(0,0,0,0.4)" }}>
            <div style={{ display: "flex", gap: ".75rem", alignItems: "center", borderBottom: "2px solid rgba(31,41,55,0.1)", paddingBottom: "1rem" }}>
              <Search size={22} style={{ color: "var(--color-primary)" }} />
              <input autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search treats, beds, toys..." style={{ flex: 1, border: "none", background: "transparent", fontSize: "1.15rem", outline: "none", fontFamily: "var(--font-heading)", fontWeight: 600 }} data-testid="search-input" />
              <button onClick={() => setSearchOpen(false)} style={iconBtnStyle} data-testid="search-close"><X size={20} /></button>
            </div>
            <div style={{ marginTop: "1rem", maxHeight: "50vh", overflowY: "auto" }}>
              {searchQuery.trim() === "" ? (
                <div style={{ color: "rgba(31,41,55,0.5)", fontSize: ".95rem", padding: "1rem 0" }}>Try "salmon", "bed", "harness"...</div>
              ) : filteredProducts.length === 0 ? (
                <div style={{ color: "rgba(31,41,55,0.5)", fontSize: ".95rem", padding: "1rem 0" }}>No products match "{searchQuery}".</div>
              ) : filteredProducts.map((p) => (
                <button key={p.slug} onClick={() => { setSearchOpen(false); setSearchQuery(""); window.scrollTo(0, 0); navigate(`/preview/product/${p.slug}`); }} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: ".75rem", borderRadius: 12, width: "100%", textAlign: "left", border: "none", background: "transparent", cursor: "pointer", transition: "background .2s ease" }} className="search-result-item" data-testid={`search-result-${p.slug}`}>
                  <div style={{ width: 56, height: 56, borderRadius: 12, background: p.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", flexShrink: 0 }}>{p.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}>{p.name}</div>
                    <div style={{ fontSize: ".85rem", color: "rgba(31,41,55,0.6)" }}>${p.price.toFixed(2)}</div>
                  </div>
                  <ChevronRight size={18} style={{ color: "rgba(31,41,55,0.3)" }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ACCOUNT MODAL */}
      {accountOpen && (
        <div onClick={() => setAccountOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 250, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} data-testid="account-modal">
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--color-bg)", borderRadius: 24, width: "100%", maxWidth: 460, padding: "2.5rem 2rem", textAlign: "center", boxShadow: "0 30px 60px -20px rgba(0,0,0,0.4)" }}>
            <button onClick={() => setAccountOpen(false)} style={{ ...iconBtnStyle, position: "absolute", margin: "1rem", top: 0, right: 0 }} data-testid="account-close"><X size={20} /></button>
            <div style={{ width: 80, height: 80, margin: "0 auto 1.25rem", borderRadius: "50%", background: "var(--color-mint)", display: "flex", alignItems: "center", justifyContent: "center" }}><User size={36} /></div>
            <h2 style={{ fontSize: "1.75rem", marginBottom: ".5rem" }}>Welcome <em>back</em></h2>
            <p style={{ color: "rgba(31,41,55,0.65)", marginBottom: "1.5rem" }}>Login & accounts will be powered by Shopify once your store is live.</p>
            <button onClick={() => setAccountOpen(false)} className="btn btn-primary btn-block" data-testid="account-ok">Got it</button>
            <p style={{ fontSize: ".8rem", color: "rgba(31,41,55,0.55)", marginTop: "1rem" }}>This is a theme preview — Shopify handles real customer accounts.</p>
          </div>
        </div>
      )}
    </div>
  );
}

const iconBtnStyle = { width: 44, height: 44, display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "transparent", border: "none", cursor: "pointer", position: "relative", color: "var(--color-text)" };

function SectionHead({ eyebrow, title, sub }) {
  return (
    <div style={{ textAlign: "center", marginBottom: "3rem", maxWidth: 720, marginLeft: "auto", marginRight: "auto" }}>
      <div style={{ display: "inline-block", fontFamily: "var(--font-heading)", fontSize: ".85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".15em", color: "var(--color-secondary)", marginBottom: "1rem" }}>{eyebrow}</div>
      <h2 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)" }}>{title}</h2>
      {sub && <p style={{ color: "rgba(31,41,55,0.65)", fontSize: "1.05rem" }}>{sub}</p>}
    </div>
  );
}

function FooterCol({ title, items }) {
  const handleClick = (e, item) => {
    if (item.target) {
      e.preventDefault();
      const el = document.getElementById(item.target);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div>
      <h4 style={{ color: "var(--color-cream)", fontSize: "1rem", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: "1rem" }}>{title}</h4>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {items.map((it) => {
          const item = typeof it === "string" ? { label: it, href: "#" } : it;
          return (
            <li key={item.label} style={{ marginBottom: ".6rem" }}>
              <a href={item.href || "#"} onClick={(e) => handleClick(e, item)} style={{ color: "rgba(255,255,255,0.7)", transition: "color .2s ease" }} className="footer-link" data-testid={`footer-link-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>{item.label}</a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function FAQItem({ question, answer, index }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div style={{ background: "var(--color-cream)", borderRadius: 18, overflow: "hidden", border: "2px solid transparent", transition: "border-color .25s ease" }} data-testid={`faq-item-${index}`}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", background: "transparent", border: "none", padding: "1.25rem 1.5rem", textAlign: "left", cursor: "pointer", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.05rem", color: "var(--color-text)" }} data-testid={`faq-toggle-${index}`} aria-expanded={open}>
        <span>{question}</span>
        <ChevronRight size={20} style={{ flexShrink: 0, transform: open ? "rotate(90deg)" : "rotate(0)", transition: "transform .25s ease", color: "var(--color-primary)" }} />
      </button>
      {open && (
        <div style={{ padding: "0 1.5rem 1.25rem", color: "rgba(31,41,55,0.78)", fontSize: ".95rem", lineHeight: 1.65 }} data-testid={`faq-answer-${index}`}>
          {answer}
        </div>
      )}
    </div>
  );
}
