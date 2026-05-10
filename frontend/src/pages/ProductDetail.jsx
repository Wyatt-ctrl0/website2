import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Truck, RotateCcw, Heart, ChevronDown, X, ZoomIn, Ruler, FileText, Award, Flame, Search, User, Menu } from "lucide-react";
import { PRODUCTS, StarRating } from "./ThemePreview";
import { useWishlist } from "../hooks/useWishlist";
import { useCart } from "../hooks/useCart";

const LOGO_URL = "/img/logo.png";

const SPECS_BY_TYPE = {
  default: {
    specs: [
      { label: "Material", value: "Premium pet-safe blend" },
      { label: "Care", value: "Spot-clean or hand-wash" },
      { label: "Country of origin", value: "USA" },
      { label: "Best for", value: "Small to large breeds" },
    ],
    dimensions: [
      { label: "Small", value: "5 × 4 × 1 in · 0.3 lb" },
      { label: "Medium", value: "7 × 5 × 1.5 in · 0.5 lb" },
      { label: "Large", value: "9 × 6 × 2 in · 0.8 lb" },
    ],
    tester: { name: "Sophie", note: "Approved with three full tail-wags and a stolen sock as celebration. She tried to share with Molly. Molly declined. We call that 5 stars." },
  },
};

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = PRODUCTS.find((p) => p.slug === slug) || PRODUCTS[0];
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("Medium");
  const [color, setColor] = useState("Coral");
  const [openAccordion, setOpenAccordion] = useState("love");
  const [adding, setAdding] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  // 4 view variants — same emoji shown at different scales/rotations so
  // swapping thumbnails is visually obvious in this preview (real Shopify
  // products render distinct image URLs here).
  const imageVariants = [
    { transform: "none" },
    { transform: "scale(1.1) rotate(-7deg)" },
    { transform: "scale(0.92) rotate(9deg) translateX(8px)" },
    { transform: "scale(1.04) rotate(-3deg) translateY(-6px)" },
  ];
  const [pdpToast, setPdpToast] = useState(null);
  // Header drawers / popups so the cart/wishlist/account icons in the
  // sticky nav actually do something on the product page (used to
  // redirect back to /preview).
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const cartHook = useCart();
  const wishlist = useWishlist();
  const liked = wishlist.has(product.slug);
  const otherProducts = PRODUCTS.filter((p) => p.slug !== product.slug).slice(0, 4);
  const specsRef = useRef(null);
  const specs = SPECS_BY_TYPE.default;

  // Scroll to top on mount + when slug changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  // Reveal animations
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [slug]);

  // Lock body scroll while any modal/drawer is open.
  useEffect(() => {
    document.body.style.overflow = (lightboxOpen || cartOpen || wishlistOpen || accountOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen, cartOpen, wishlistOpen, accountOpen]);

  const handleAdd = () => {
    cartHook.add(product, qty);
    setAdding(true);
    setTimeout(() => setAdding(false), 1200);
    // Show a toast at the top of the screen instead of jumping the user
    // into the cart drawer. They can keep shopping and click the cart
    // icon themselves when ready.
    setPdpToast({ msg: `Added ${product.name} to cart 🛒`, tone: "love", id: Date.now() });
    setTimeout(() => setPdpToast(null), 2200);
  };

  const handleWishlist = () => {
    const wasAdded = wishlist.toggle(product.slug);
    setPdpToast({ msg: wasAdded ? `Saved ${product.name} 💛` : "Removed from wishlist", tone: wasAdded ? "love" : "muted", id: Date.now() });
    setTimeout(() => setPdpToast(null), 2200);
  };

  const savings = product.compareAt ? (product.compareAt - product.price).toFixed(2) : null;

  return (
    <div style={{ background: "var(--color-bg)" }} data-testid="product-detail-page">
      {/* PREVIEW BAR */}
      <div style={{ background: "var(--color-text)", color: "var(--color-cream)", padding: "0.75rem 1rem", textAlign: "center", fontSize: "0.85rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: ".75rem" }}>
        <Link to="/preview" style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", color: "var(--color-cream)" }} data-testid="product-back-store">
          <ArrowLeft size={16} /> Back to store
        </Link>
        <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}>👀 Live Theme Preview</div>
        <Link to="/" style={{ color: "var(--color-cream)", fontSize: ".8rem" }}>← Theme info</Link>
      </div>

      {/* HEADER — same hub-nav as the /preview landing so the user has the
          same navigation, search, account, wishlist, and cart entry points. */}
      <header style={{ background: "var(--color-bg)", borderBottom: "2px solid rgba(31,41,55,0.08)", position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(8px)" }} data-testid="product-header">
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: "1rem", padding: ".5rem 0" }}>
          <nav className="product-nav" style={{ display: "flex", gap: "1.5rem", alignItems: "center", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: ".95rem" }} aria-label="Main">
            <button aria-label="Open menu" style={{ width: 44, height: 44, display: "none", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "transparent", border: "none", cursor: "pointer", color: "var(--color-text)" }} className="product-mobile-menu-btn" data-testid="product-mobile-menu">
              <Menu size={22} />
            </button>
            <Link to="/preview" style={{ color: "var(--color-text)" }} data-testid="product-nav-shop">Shop All</Link>
            <Link to="/preview" style={{ color: "var(--color-text)" }} data-testid="product-nav-story">Our Story</Link>
            <Link to="/preview" style={{ color: "var(--color-text)" }} data-testid="product-nav-contact">Contact</Link>
          </nav>
          <Link to="/preview" data-testid="product-logo-link" style={{ display: "inline-flex", justifyContent: "center" }}>
            <img src={LOGO_URL} alt="Molly & Sophie" style={{ height: 80 }} className="header-logo-img" />
          </Link>
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: ".25rem" }}>
            {/* Search drawer lives on /preview. Pass ?search=1 so the modal
                opens automatically the moment we land there. */}
            <Link to="/preview?search=1" aria-label="Search" data-testid="product-header-search" style={pdpIconBtn}>
              <Search size={20} />
            </Link>
            <button type="button" onClick={() => setAccountOpen(true)} aria-label="Account" data-testid="product-header-account" style={{ ...pdpIconBtn, background: "transparent" }}>
              <User size={20} />
            </button>
            <button type="button" onClick={() => setWishlistOpen(true)} aria-label="Wishlist" data-testid="product-header-wishlist" style={{ ...pdpIconBtn, background: "transparent", position: "relative" }}>
              <Heart size={20} fill={wishlist.count > 0 ? "var(--color-primary)" : "none"} stroke={wishlist.count > 0 ? "var(--color-primary)" : "currentColor"} />
              {wishlist.count > 0 && (
                <span style={{ position: "absolute", top: 4, right: 4, minWidth: 18, height: 18, background: "var(--color-primary)", color: "#fff", borderRadius: 999, fontSize: ".65rem", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }} data-testid="product-header-wishlist-count">{wishlist.count}</span>
              )}
            </button>
            <button type="button" onClick={() => setCartOpen(true)} aria-label="Cart" data-testid="product-header-cart" style={{ ...pdpIconBtn, background: "transparent", position: "relative" }}>
              <ShoppingBag size={20} />
              {cartHook.itemCount > 0 && (
                <span style={{ position: "absolute", top: 4, right: 4, minWidth: 18, height: 18, background: "var(--color-primary)", color: "#fff", borderRadius: 999, fontSize: ".65rem", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }} data-testid="product-header-cart-count">{cartHook.itemCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* PRODUCT */}
      <section style={{ padding: "2.5rem 0 4rem" }}>
        <div className="container">
          <nav style={{ fontSize: ".85rem", color: "rgba(31,41,55,0.6)", marginBottom: "1.5rem" }} data-testid="breadcrumbs">
            <Link to="/preview" style={{ color: "rgba(31,41,55,0.6)" }}>Home</Link>
            <span style={{ margin: "0 .5rem" }}>›</span>
            <Link to="/preview" style={{ color: "rgba(31,41,55,0.6)" }}>Shop</Link>
            <span style={{ margin: "0 .5rem" }}>›</span>
            <span style={{ color: "var(--color-text)" }}>{product.name}</span>
          </nav>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem" }} className="product-grid-md">
            {/* Gallery */}
            <div className="reveal">
              <div onClick={() => setLightboxOpen(true)} style={{ aspectRatio: "1", background: product.bg, borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10rem", position: "relative", overflow: "hidden", cursor: "zoom-in" }} data-testid="product-main-image" className="product-main-image">
                <span style={{ display: "inline-block", transform: imageVariants[activeImage].transform, transition: "transform .35s cubic-bezier(.2,.8,.2,1)", lineHeight: 1 }} data-testid="product-main-emoji">
                  {product.emoji}
                </span>
                {product.badge && <span style={{ position: "absolute", top: "1.25rem", left: "1.25rem", background: "var(--color-primary)", color: "#fff", padding: ".5rem 1rem", borderRadius: 999, fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: ".85rem" }}>{product.badge}</span>}
                {product.compareAt && <span style={{ position: "absolute", top: "1.25rem", right: "1.25rem", background: "var(--color-secondary)", color: "#fff", padding: ".5rem 1rem", borderRadius: 999, fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: ".85rem" }}>SALE</span>}
                <div className="zoom-hint" style={{ position: "absolute", bottom: "1rem", right: "1rem", background: "rgba(255,255,255,0.95)", borderRadius: 999, padding: ".5rem .85rem", display: "inline-flex", alignItems: "center", gap: ".4rem", fontSize: ".8rem", fontFamily: "var(--font-heading)", fontWeight: 700 }}>
                  <ZoomIn size={14} /> Click to enlarge
                </div>
              </div>
              <div style={{ display: "flex", gap: ".75rem", marginTop: "1rem", flexWrap: "wrap" }} role="tablist" aria-label="Product images">
                {imageVariants.map((variant, idx) => {
                  const active = activeImage === idx;
                  return (
                    <button
                      key={idx}
                      onClick={(e) => { e.stopPropagation(); setActiveImage(idx); }}
                      style={{ width: 80, height: 80, borderRadius: 12, background: product.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", border: active ? "2px solid var(--color-primary)" : "2px solid transparent", cursor: "pointer", transition: "transform .2s ease, border-color .2s ease", padding: 0, overflow: "hidden" }}
                      className="thumb-btn"
                      role="tab"
                      aria-selected={active}
                      aria-label={`View ${idx + 1}`}
                      data-testid={`product-thumb-${idx}`}
                    >
                      <span style={{ display: "inline-block", transform: variant.transform, lineHeight: 1 }}>{product.emoji}</span>
                    </button>
                  );
                })}
              </div>

              {/* BUNDLE BOX — sits directly under the gallery so the user
                  sees it without scrolling far past the product image. */}
              <div id="bundle" data-testid="bundle-section" style={{ marginTop: "2rem", background: "var(--color-bg)", border: "2px solid var(--color-cream)", borderRadius: 24, padding: "1.5rem 1.25rem" }}>
                <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
                  <div style={{ display: "inline-block", fontFamily: "var(--font-heading)", fontSize: ".75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".15em", color: "var(--color-secondary)", marginBottom: ".5rem" }}>Build Your Pack</div>
                  <h3 style={{ fontSize: "1.35rem", margin: 0 }}>Frequently bought <em>together</em></h3>
                </div>
                {(() => {
                  const bundleItems = [product, ...PRODUCTS.filter(p => p.slug !== product.slug).slice(0, 2)];
                  const bundleTotal = bundleItems.reduce((s, p) => s + p.price, 0);
                  const bundleCompareAt = bundleItems.reduce((s, p) => s + (p.compareAt || p.price), 0);
                  const bundleSave = (bundleCompareAt - bundleTotal + bundleTotal * 0.05).toFixed(2);
                  const bundlePrice = (bundleTotal * 0.95).toFixed(2);
                  return (
                    <>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: ".5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                        {bundleItems.map((p, i) => (
                          <React.Fragment key={p.slug}>
                            <div style={{ background: p.bg, borderRadius: 14, width: 96, height: 96, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: ".4rem", flexShrink: 0 }} data-testid={`bundle-item-${i}`}>
                              <div style={{ fontSize: "2.25rem", lineHeight: 1 }}>{p.emoji}</div>
                              <div style={{ fontSize: ".62rem", fontFamily: "var(--font-heading)", fontWeight: 700, marginTop: ".25rem", lineHeight: 1.15 }}>{p.name}</div>
                            </div>
                            {i < bundleItems.length - 1 && <span style={{ fontSize: "1.25rem", color: "var(--color-primary)", fontWeight: 800 }}>+</span>}
                          </React.Fragment>
                        ))}
                      </div>
                      <div style={{ background: "var(--color-cream)", borderRadius: 18, padding: "1rem 1.25rem", textAlign: "center" }}>
                        <div style={{ fontSize: ".8rem", color: "rgba(31,41,55,0.55)", textDecoration: "line-through" }}>${bundleCompareAt.toFixed(2)}</div>
                        <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.65rem", color: "var(--color-primary)", lineHeight: 1.1 }} data-testid="bundle-total">Bundle: ${bundlePrice}</div>
                        <div style={{ display: "inline-block", marginTop: ".4rem", background: "rgba(95,180,184,0.15)", color: "var(--color-secondary)", padding: ".2rem .65rem", borderRadius: 999, fontSize: ".75rem", fontWeight: 700 }}>You save ${bundleSave}</div>
                        <button onClick={handleAdd} className="btn btn-primary btn-block" style={{ marginTop: "1rem" }} data-testid="add-bundle-btn">
                          <ShoppingBag size={16} /> Add Bundle to Cart
                        </button>
                        <p style={{ fontSize: ".7rem", color: "rgba(31,41,55,0.55)", margin: ".5rem 0 0" }}>5% off when bought together</p>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* FAQ BOX — directly below the bundle box, same square-card style. */}
              <div id="faq" data-testid="faq-section" style={{ marginTop: "1rem", background: "var(--color-cream)", border: "2px solid transparent", borderRadius: 24, padding: "1.5rem 1.25rem" }}>
                <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                  <div style={{ display: "inline-block", fontFamily: "var(--font-heading)", fontSize: ".75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".15em", color: "var(--color-secondary)", marginBottom: ".5rem" }}>Curious Pups</div>
                  <h3 style={{ fontSize: "1.35rem", margin: 0 }}>Frequently <em>asked</em></h3>
                </div>
                <div>
                  <Accordion id="love" title="What pet parents love" open={openAccordion === "love"} onClick={() => setOpenAccordion(openAccordion === "love" ? "" : "love")}>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {[
                        "Curated by real pet parents (us!)",
                        "Tested and approved by Jack, Sophie & Molly",
                        "1% donated monthly to a hand-picked rescue",
                        "Easy 30-day returns — no questions asked",
                        "Ships in 1–3 business days from the USA",
                      ].map((it) => (
                        <li key={it} style={{ padding: ".4rem 0", display: "flex", alignItems: "flex-start", gap: ".5rem", fontSize: ".9rem" }}>
                          <span style={{ color: "var(--color-secondary)", fontWeight: 800, fontSize: "1.1rem", lineHeight: 1.4 }}>✓</span> {it}
                        </li>
                      ))}
                    </ul>
                  </Accordion>
                  <Accordion id="ship" title="Shipping & returns" open={openAccordion === "ship"} onClick={() => setOpenAccordion(openAccordion === "ship" ? "" : "ship")}>
                    <p style={{ margin: 0, fontSize: ".9rem" }}>Free shipping on orders over $50. We ship within 1–3 business days from the USA. Not loving it? Return within 30 days for a full refund.</p>
                  </Accordion>
                  <Accordion id="give" title="How your purchase helps" open={openAccordion === "give"} onClick={() => setOpenAccordion(openAccordion === "give" ? "" : "give")}>
                    <p style={{ margin: 0, fontSize: ".9rem" }}>1% of every order is donated each month to a trusted pet rescue we hand-pick ourselves. We're not affiliated with any single charity — we like to spread the love around.</p>
                  </Accordion>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="reveal">
              <div style={{ fontSize: ".75rem", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--color-secondary)", fontWeight: 700, fontFamily: "var(--font-heading)", marginBottom: ".5rem" }}>{product.vendor || "Molly & Sophie"}</div>
              <h1 style={{ fontSize: "clamp(1.75rem, 3vw, 2.75rem)", marginBottom: ".75rem" }} data-testid="product-name">{product.name}</h1>

              <div style={{ display: "flex", gap: ".5rem", alignItems: "center", marginBottom: "1rem" }}>
                <StarRating rating={product.rating || 4.8} reviews={product.reviews || 124} size=".95rem" />
                <a href="#reviews" onClick={(e) => { e.preventDefault(); document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth" }); }} style={{ color: "var(--color-secondary)", fontSize: ".85rem", fontWeight: 600 }} data-testid="see-reviews-link">See reviews</a>
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                {product.compareAt && <span style={{ color: "rgba(31,41,55,0.5)", textDecoration: "line-through", marginRight: ".5rem", fontSize: "1.25rem", fontWeight: 500 }}>${product.compareAt.toFixed(2)}</span>}
                <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "2rem", color: "var(--color-primary)" }} data-testid="product-detail-price">${product.price.toFixed(2)}</span>
                {savings && <span style={{ marginLeft: ".75rem", background: "rgba(95,180,184,0.15)", color: "var(--color-secondary)", padding: ".25rem .75rem", borderRadius: 999, fontSize: ".85rem", fontWeight: 700 }}>Save ${savings}</span>}
              </div>

              <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                <TrustPill icon={<Truck size={14} />} text="Free shipping over $50" />
                <TrustPill icon={<RotateCcw size={14} />} text="30-day returns" />
                <TrustPill icon={<Heart size={14} />} text="1% to rescues" />
              </div>

              {/* Stock urgency */}
              {(product.stock || 0) > 0 && (product.stock || 99) <= 10 && (
                <div style={{ display: "flex", alignItems: "center", gap: ".75rem", background: "rgba(232,118,90,0.1)", border: "1.5px dashed var(--color-primary)", borderRadius: 14, padding: ".75rem 1rem", marginBottom: "1.25rem" }} data-testid="stock-urgency">
                  <Flame size={18} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
                  <div style={{ fontSize: ".9rem", fontWeight: 700, color: "var(--color-text)" }}>
                    Only <span style={{ color: "var(--color-primary)" }}>{product.stock} left</span> — selling fast
                  </div>
                </div>
              )}

              <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "rgba(31,41,55,0.85)", marginBottom: "1.5rem" }} data-testid="product-description">{product.desc}</p>

              {/* Color */}
              <div style={{ marginBottom: "1.25rem" }}>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: ".5rem" }}>Color: <span style={{ color: "var(--color-primary)" }}>{color}</span></div>
                <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
                  {[
                    { name: "Coral", val: "#E8765A" },
                    { name: "Teal", val: "#5FB4B8" },
                    { name: "Cream", val: "#F5EBD8" },
                    { name: "Mint", val: "#B5D6CD" },
                  ].map((c) => (
                    <button key={c.name} onClick={() => setColor(c.name)} style={{ width: 40, height: 40, borderRadius: "50%", background: c.val, border: color === c.name ? "3px solid var(--color-text)" : "2px solid rgba(31,41,55,0.15)", cursor: "pointer", transition: "transform .2s ease, border-color .2s ease" }} className="color-swatch" aria-label={c.name} data-testid={`color-${c.name.toLowerCase()}`} />
                  ))}
                </div>
              </div>

              {/* Size */}
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: ".5rem" }}>Size: <span style={{ color: "var(--color-primary)" }}>{size}</span></div>
                <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
                  {["Small", "Medium", "Large", "X-Large"].map((s) => (
                    <button key={s} onClick={() => setSize(s)} style={{ padding: ".5rem 1rem", border: size === s ? "2px solid var(--color-text)" : "1.5px solid rgba(31,41,55,0.15)", background: size === s ? "var(--color-text)" : "transparent", color: size === s ? "var(--color-bg)" : "var(--color-text)", borderRadius: 999, fontSize: ".9rem", cursor: "pointer", fontWeight: size === s ? 700 : 500, transition: "all .2s ease" }} data-testid={`size-${s.toLowerCase()}`}>{s}</button>
                  ))}
                </div>
              </div>

              {/* Qty + Add */}
              <div style={{ display: "flex", gap: ".75rem", alignItems: "center", marginBottom: ".75rem" }}>
                <div style={{ display: "inline-flex", alignItems: "center", border: "1.5px solid rgba(31,41,55,0.15)", borderRadius: 999, overflow: "hidden" }}>
                  <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 40, height: 44, fontWeight: 700, background: "transparent", border: "none", cursor: "pointer" }} data-testid="qty-decrease">−</button>
                  <span style={{ width: 40, textAlign: "center", fontWeight: 700 }} data-testid="qty-value">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} style={{ width: 40, height: 44, fontWeight: 700, background: "transparent", border: "none", cursor: "pointer" }} data-testid="qty-increase">+</button>
                </div>
                <button onClick={handleAdd} className="btn btn-primary" style={{ flex: 1 }} data-testid="product-add-to-cart">
                  <ShoppingBag size={18} />
                  {adding ? "✓ Added!" : `Add to Cart · $${(product.price * qty).toFixed(2)}`}
                </button>
                <button onClick={handleWishlist} aria-label={liked ? "Remove from wishlist" : "Save to wishlist"} aria-pressed={liked} className="pdp-heart-btn" data-testid="pdp-wishlist-toggle" style={{ width: 48, height: 48, borderRadius: "50%", background: liked ? "rgba(232,118,90,0.12)" : "var(--color-cream)", border: liked ? "2px solid var(--color-primary)" : "2px solid rgba(31,41,55,0.12)", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all .2s ease" }}>
                  <Heart size={20} fill={liked ? "var(--color-primary)" : "none"} stroke={liked ? "var(--color-primary)" : "var(--color-text)"} strokeWidth={2.2} />
                </button>
              </div>
              <button className="btn btn-secondary btn-block" data-testid="buy-now-btn">⚡ Buy It Now</button>

              {/* Specs / Dimensions / Tester's Note - directly below add to cart */}
              <div ref={specsRef} style={{ marginTop: "2.5rem" }} data-testid="product-specs-section" className="reveal">
                <h3 style={{ fontSize: "1.25rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: ".5rem" }}><Award size={20} style={{ color: "var(--color-primary)" }} /> Product details</h3>

                {/* Specs */}
                <div style={{ background: "var(--color-cream)", padding: "1.5rem", borderRadius: 20, marginBottom: "1rem" }} data-testid="specs-block">
                  <div style={{ display: "flex", alignItems: "center", gap: ".5rem", fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: "1rem", fontSize: "1rem" }}><FileText size={16} /> Specs</div>
                  <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", columnGap: "1.5rem", rowGap: ".6rem", margin: 0, fontSize: ".95rem" }}>
                    {specs.specs.map((s) => (
                      <React.Fragment key={s.label}>
                        <dt style={{ fontWeight: 700, color: "rgba(31,41,55,0.8)" }}>{s.label}</dt>
                        <dd style={{ margin: 0, color: "rgba(31,41,55,0.7)" }}>{s.value}</dd>
                      </React.Fragment>
                    ))}
                  </dl>
                </div>

                {/* Dimensions */}
                <div style={{ background: "var(--color-cream)", padding: "1.5rem", borderRadius: 20, marginBottom: "1rem" }} data-testid="dimensions-block">
                  <div style={{ display: "flex", alignItems: "center", gap: ".5rem", fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: "1rem", fontSize: "1rem" }}><Ruler size={16} /> Dimensions</div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".95rem" }}>
                    <tbody>
                      {specs.dimensions.map((d) => (
                        <tr key={d.label} style={{ borderBottom: "1px dashed rgba(31,41,55,0.12)" }}>
                          <td style={{ padding: ".5rem .25rem .5rem 0", fontWeight: 700 }}>{d.label}</td>
                          <td style={{ padding: ".5rem 0", color: "rgba(31,41,55,0.7)", textAlign: "right" }}>{d.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Tester's Note */}
                <div style={{ background: "var(--color-mint)", padding: "1.5rem", borderRadius: 20, position: "relative" }} data-testid="tester-note-block">
                  <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "1rem" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--color-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-heading)", fontWeight: 800, color: "var(--color-primary)" }}>{specs.tester.name[0]}</div>
                    <div>
                      <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: ".95rem" }}>{specs.tester.name}'s tester note</div>
                      <div style={{ fontSize: ".8rem", color: "rgba(31,41,55,0.65)" }}>Chief product officer (4 paws, 2 ears)</div>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontStyle: "italic", color: "rgba(31,41,55,0.85)", fontSize: ".95rem", lineHeight: 1.6 }}>"{specs.tester.note}"</p>
                </div>
              </div>

              {/* (Frequently-asked accordions used to live here. They were
                  promoted to a dedicated section below the bundle so the
                  bundle upsell hits the eye immediately after the buy box.) */}
            </div>
          </div>
        </div>
      </section>

      {/* TEST-RESULTS GRAPH — Amazon-style detail panel that sits at the
          bottom of the page (below the in-gallery Bundle + FAQ). */}
      <section id="test-results" style={{ padding: "4rem 0", background: "var(--color-bg)" }} className="reveal" data-testid="test-results-section">
        <div className="container" style={{ maxWidth: 1080 }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ display: "inline-block", fontFamily: "var(--font-heading)", fontSize: ".85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".15em", color: "var(--color-secondary)", marginBottom: ".75rem" }}>Real Results</div>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", margin: 0 }}>The numbers <em>tell the story</em></h2>
          </div>
          {(() => {
            // Category-aware chart copy — different products tell a different story.
            const meta = {
              treats: { yLabel: "Freshness %", yMin: 70, yMax: 100, xLabel: "Days after opening", title: "Salmon Soft Treats vs leading brand", desc: { headline: "Stays soft, stays fresh.", body: "Our slow-baked salmon treats keep their give-and-tear texture for 30+ days after opening. Most leading brands harden by day 14 — your pup notices, even if you don't." } },
              beds: { yLabel: "Comfort score", yMin: 6, yMax: 10, xLabel: "Hours of sleep", title: "Cozy Donut Bed vs leading brand", desc: { headline: "Pressure-relieving from minute one.", body: "Sophie-tested. The bolstered edge keeps its shape for 3+ years; the inner cushion bounces back after every nap. Most plush beds flatten by month 6." } },
              toys: { yLabel: "Squeaks remaining", yMin: 40, yMax: 100, xLabel: "Play sessions", title: "Squeaky Plush Carrot vs leading brand", desc: { headline: "Survives the zoomies.", body: "Reinforced double-stitched seams + an inner squeaker pouch. After 30 zoomies it still squeaks 80%+ of the time. Leading plush toys are silent by session 12." } },
              walks: { yLabel: "Pull reduction %", yMin: 0, yMax: 100, xLabel: "Walks", title: "Adventure Harness vs leading brand", desc: { headline: "No-pull that actually pulls less.", body: "Front-clip distributes pressure across the chest, not the throat. Pull force drops 65% by walk 10. Most no-pull harnesses plateau around 20%." } },
            };
            const m = meta[product.category] || meta.treats;
            // Two series: M&S (winning, flat-high) vs leading brand (declining)
            const points = 9;
            const ms = Array.from({ length: points }, (_, i) => {
              const t = i / (points - 1);
              return m.yMax - (m.yMax - m.yMin) * 0.15 * t; // gentle decline
            });
            const other = Array.from({ length: points }, (_, i) => {
              const t = i / (points - 1);
              return m.yMax - (m.yMax - m.yMin) * (0.18 + 0.95 * t); // steep decline
            });
            const W = 520, H = 300, padL = 48, padR = 16, padT = 16, padB = 40;
            const innerW = W - padL - padR, innerH = H - padT - padB;
            const xAt = (i) => padL + (innerW * i) / (points - 1);
            const yAt = (v) => padT + innerH - (innerH * (v - m.yMin)) / (m.yMax - m.yMin);
            const pathFor = (arr) => arr.map((v, i) => `${i === 0 ? "M" : "L"} ${xAt(i).toFixed(1)} ${yAt(v).toFixed(1)}`).join(" ");
            const yTicks = 5;
            return (
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem", alignItems: "center" }} className="bundle-grid-md">
                <div style={{ background: "#fff", border: "2px solid var(--color-secondary)", borderRadius: 18, padding: "1.25rem", overflow: "hidden" }} data-testid="test-results-chart">
                  <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={m.title} style={{ width: "100%", height: "auto", display: "block" }}>
                    <text x={padL - 36} y={padT + 4} fontSize="11" fill="var(--color-secondary)" fontFamily="var(--font-heading)" fontWeight="700">{m.yLabel.split(" ")[0]}</text>
                    {/* Y grid + ticks */}
                    {Array.from({ length: yTicks + 1 }).map((_, i) => {
                      const v = m.yMin + ((m.yMax - m.yMin) * i) / yTicks;
                      const y = yAt(v);
                      return (
                        <g key={`y-${i}`}>
                          <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="rgba(31,41,55,0.08)" />
                          <text x={padL - 8} y={y + 4} fontSize="10" textAnchor="end" fill="rgba(31,41,55,0.55)">{Math.round(v)}</text>
                        </g>
                      );
                    })}
                    {/* X axis ticks */}
                    {Array.from({ length: points }).map((_, i) => {
                      const x = xAt(i);
                      return (
                        <g key={`x-${i}`}>
                          <line x1={x} y1={H - padB} x2={x} y2={H - padB + 4} stroke="rgba(31,41,55,0.3)" />
                          <text x={x} y={H - padB + 18} fontSize="10" textAnchor="middle" fill="rgba(31,41,55,0.55)">{i === 0 ? 0 : Math.round((i / (points - 1)) * (m.category === "treats" ? 30 : m.category === "beds" ? 12 : m.category === "walks" ? 20 : 30))}</text>
                        </g>
                      );
                    })}
                    {/* Axis lines */}
                    <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="rgba(31,41,55,0.4)" />
                    <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="rgba(31,41,55,0.4)" />
                    {/* X axis label */}
                    <text x={(padL + W - padR) / 2} y={H - 4} fontSize="11" textAnchor="middle" fill="var(--color-secondary)" fontFamily="var(--font-heading)" fontWeight="700">{m.xLabel}</text>
                    {/* Other-brand line */}
                    <path d={pathFor(other)} fill="none" stroke="rgba(31,41,55,0.45)" strokeWidth="2.5" strokeDasharray="4 4" />
                    {other.map((v, i) => <circle key={`o-${i}`} cx={xAt(i)} cy={yAt(v)} r="3.5" fill="rgba(31,41,55,0.55)" />)}
                    {/* M&S line */}
                    <path d={pathFor(ms)} fill="none" stroke="var(--color-primary)" strokeWidth="3" />
                    {ms.map((v, i) => <circle key={`m-${i}`} cx={xAt(i)} cy={yAt(v)} r="4" fill="var(--color-primary)" />)}
                    {/* Legend */}
                    <g transform={`translate(${W - padR - 170}, ${padT + 12})`}>
                      <rect x="0" y="0" width="170" height="48" rx="8" fill="rgba(255,255,255,0.95)" stroke="rgba(31,41,55,0.12)" />
                      <circle cx="14" cy="16" r="4" fill="var(--color-primary)" />
                      <text x="26" y="20" fontSize="11" fontFamily="var(--font-heading)" fontWeight="700" fill="var(--color-text)">Molly &amp; Sophie</text>
                      <circle cx="14" cy="34" r="4" fill="rgba(31,41,55,0.55)" />
                      <text x="26" y="38" fontSize="11" fontFamily="var(--font-heading)" fontWeight="700" fill="rgba(31,41,55,0.7)">Leading brand</text>
                    </g>
                  </svg>
                  <div style={{ textAlign: "center", marginTop: ".5rem", fontSize: ".75rem", color: "rgba(31,41,55,0.55)", fontStyle: "italic" }}>* {m.title} — internal testing</div>
                </div>
                <div data-testid="test-results-copy">
                  <h3 style={{ fontSize: "1.4rem", marginBottom: ".75rem", color: "var(--color-primary)" }}>{m.desc.headline}</h3>
                  <p style={{ fontSize: "1rem", lineHeight: 1.65, color: "rgba(31,41,55,0.85)", margin: "0 0 1rem" }}>{m.desc.body}</p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {[
                      "Tested in real homes by real pet parents",
                      "Backed by our 30-day no-questions returns",
                      "1% of every order goes to a hand-picked rescue",
                    ].map((it) => (
                      <li key={it} style={{ padding: ".4rem 0", display: "flex", alignItems: "flex-start", gap: ".5rem", fontSize: ".95rem" }}>
                        <span style={{ color: "var(--color-secondary)", fontWeight: 800, fontSize: "1.1rem", lineHeight: 1.4 }}>✓</span> {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* RECOMMENDATIONS */}
      <section style={{ padding: "4rem 0", background: "var(--color-cream)" }} className="reveal">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{ display: "inline-block", fontFamily: "var(--font-heading)", fontSize: ".85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".15em", color: "var(--color-secondary)", marginBottom: "1rem" }}>You'll Also Love</div>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}>More for the <em>pack</em></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
            {otherProducts.map((p) => (
              <div key={p.slug} onClick={() => navigate(`/preview/product/${p.slug}`)} style={{ background: "var(--color-bg)", borderRadius: 24, overflow: "hidden", cursor: "pointer", transition: "all .25s ease" }} className="product-card-hover" data-testid={`related-product-${p.slug}`}>
                <div style={{ aspectRatio: "1", background: p.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "5rem" }}>{p.emoji}</div>
                <div style={{ padding: "1.25rem" }}>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.05rem", margin: "0 0 .5rem" }}>{p.name}</h3>
                  <div style={{ fontWeight: 800 }}>${p.price.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" style={{ padding: "4rem 0", background: "var(--color-bg)" }} className="reveal" data-testid="reviews-section">
        <div className="container" style={{ maxWidth: 920 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem", marginBottom: "2.5rem" }} className="reviews-summary-md">
            <div style={{ textAlign: "center", background: "var(--color-cream)", borderRadius: 24, padding: "2rem 1.5rem" }}>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "3.5rem", color: "var(--color-primary)", lineHeight: 1 }} data-testid="reviews-avg">{(product.rating || 4.8).toFixed(1)}</div>
              <div style={{ color: "#f5b800", fontSize: "1.4rem", letterSpacing: ".1em", marginTop: ".25rem" }}>★★★★★</div>
              <div style={{ fontSize: ".9rem", color: "rgba(31,41,55,0.65)", marginTop: ".5rem" }}>Based on {product.reviews || 124} verified reviews</div>
            </div>
            <div>
              {[5, 4, 3, 2, 1].map((s) => {
                const pct = s === 5 ? 78 : s === 4 ? 18 : s === 3 ? 3 : s === 2 ? 1 : 0;
                return (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: ".5rem" }} data-testid={`rating-bar-${s}`}>
                    <span style={{ fontSize: ".85rem", fontWeight: 700, width: 24 }}>{s}★</span>
                    <div style={{ flex: 1, height: 8, background: "rgba(31,41,55,0.08)", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: "var(--color-primary)" }} />
                    </div>
                    <span style={{ fontSize: ".8rem", color: "rgba(31,41,55,0.6)", width: 36, textAlign: "right" }}>{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
            {[
              { name: "Hannah B.", pet: "Mom of Bella", rating: 5, text: "My pup is OBSESSED. We've ordered three times already. The packaging note had me tearing up." },
              { name: "Diego R.", pet: "Dad of Cooper", rating: 5, text: "Quality is unreal for the price. And knowing 1% goes to rescue is the cherry on top." },
              { name: "Tara K.", pet: "Mom of Olive & Pip", rating: 4, text: "Great product. Shipping was a touch slow but customer service was incredibly kind." },
            ].map((r, i) => (
              <div key={i} style={{ background: "#fff", padding: "1.5rem", borderRadius: 20, boxShadow: "0 4px 16px -8px rgba(0,0,0,0.08)" }} data-testid={`review-card-${i}`}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: ".75rem" }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}>{r.name}</div>
                    <div style={{ fontSize: ".8rem", color: "rgba(31,41,55,0.6)" }}>{r.pet}</div>
                  </div>
                  <span style={{ background: "rgba(95,180,184,0.15)", color: "var(--color-secondary)", fontSize: ".7rem", fontWeight: 700, padding: ".25rem .55rem", borderRadius: 999 }}>✓ Verified</span>
                </div>
                <div style={{ color: "#f5b800", letterSpacing: ".1em", marginBottom: ".5rem" }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                <p style={{ margin: 0, fontSize: ".95rem", color: "rgba(31,41,55,0.85)", lineHeight: 1.6 }}>"{r.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PDP TOAST */}
      {pdpToast && (
        <div role="status" aria-live="polite" data-testid="pdp-toast" style={{ position: "fixed", top: "1rem", right: "1rem", background: pdpToast.tone === "love" ? "var(--color-primary)" : "var(--color-text)", color: "#fff", padding: ".75rem 1.25rem", borderRadius: 999, fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: ".9rem", boxShadow: "0 10px 30px -8px rgba(0,0,0,0.25)", zIndex: 400, animation: "toastIn .25s ease", maxWidth: "calc(100vw - 2rem)" }}>
          {pdpToast.msg}
        </div>
      )}

      {/* CART DRAWER — same UI as the /preview cart drawer, backed by the
          shared useCart() hook so items added here also show up there. */}
      {cartOpen && <div onClick={() => setCartOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100 }} data-testid="pdp-cart-overlay" />}
      <aside data-testid="pdp-cart-drawer" style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(95vw, 460px)", background: "var(--color-bg)", zIndex: 101, transform: cartOpen ? "translateX(0)" : "translateX(100%)", transition: "transform .35s ease", display: "flex", flexDirection: "column", boxShadow: "-30px 0 60px -20px rgba(0,0,0,0.4)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 1.5rem", borderBottom: "2px solid rgba(31,41,55,0.08)" }}>
          <h3 style={{ margin: 0, fontSize: "1.5rem" }}>Your Pack <span style={{ fontSize: "1rem", color: "rgba(31,41,55,0.5)", fontWeight: 400 }}>({cartHook.itemCount})</span></h3>
          <button onClick={() => setCartOpen(false)} style={{ ...pdpIconBtn, background: "transparent" }} data-testid="pdp-cart-close" aria-label="Close cart"><X size={22} /></button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.5rem" }}>
          {cartHook.items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem" }} data-testid="pdp-cart-empty">
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🐾</div>
              <h3>Your pack is empty</h3>
              <p style={{ color: "rgba(31,41,55,0.6)" }}>Add some goodies to spoil your furry friend.</p>
            </div>
          ) : cartHook.items.map((item) => (
            <div key={item.name} style={{ display: "grid", gridTemplateColumns: "70px 1fr auto", gap: "1rem", padding: "1rem 0", borderBottom: "1px solid rgba(31,41,55,0.08)" }} data-testid={`pdp-cart-item-${item.name}`}>
              <div style={{ width: 70, height: 70, borderRadius: 12, background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.25rem" }}>{item.emoji}</div>
              <div>
                <h4 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: ".95rem", margin: "0 0 .5rem" }}>{item.name}</h4>
                <div style={{ display: "inline-flex", alignItems: "center", border: "1.5px solid rgba(31,41,55,0.15)", borderRadius: 999 }}>
                  <button onClick={() => cartHook.updateQty(item.name, -1)} style={{ width: 28, height: 28, background: "transparent", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: 700 }}>−</button>
                  <span style={{ padding: "0 .5rem", minWidth: 24, textAlign: "center", fontWeight: 700, fontSize: ".85rem" }}>{item.qty}</span>
                  <button onClick={() => cartHook.updateQty(item.name, 1)} style={{ width: 28, height: 28, background: "transparent", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: 700 }}>+</button>
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 700, textAlign: "right" }}>${(item.price * item.qty).toFixed(2)}</div>
                <button onClick={() => cartHook.remove(item.name)} style={{ background: "none", border: "none", color: "rgba(31,41,55,0.5)", fontSize: ".75rem", textDecoration: "underline", padding: 0, marginTop: ".25rem", cursor: "pointer" }}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        {cartHook.items.length > 0 && (
          <div style={{ borderTop: "2px solid rgba(31,41,55,0.08)", padding: "1.25rem 1.5rem", background: "var(--color-cream)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}>Subtotal</div>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.5rem", color: "var(--color-primary)" }} data-testid="pdp-cart-subtotal">${cartHook.subtotal.toFixed(2)}</div>
            </div>
            <button
              onClick={() => { setCartOpen(false); navigate("/preview"); setTimeout(() => { document.querySelector('[data-testid="cart-toggle"], [data-testid="preview-cart-toggle"]')?.click(); }, 50); }}
              className="btn btn-primary btn-block"
              data-testid="pdp-cart-checkout"
            >Checkout →</button>
            <p style={{ textAlign: "center", fontSize: ".75rem", color: "rgba(31,41,55,0.55)", margin: ".75rem 0 0" }}>Promo code & checkout-bundle popup are on the main shop</p>
          </div>
        )}
      </aside>

      {/* WISHLIST DRAWER */}
      {wishlistOpen && (
        <div onClick={() => setWishlistOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 250, display: "flex", justifyContent: "flex-end" }} data-testid="pdp-wishlist-drawer">
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--color-bg)", width: "100%", maxWidth: 460, height: "100%", display: "flex", flexDirection: "column", boxShadow: "-30px 0 60px -20px rgba(0,0,0,0.4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 1.5rem", borderBottom: "2px solid rgba(31,41,55,0.08)" }}>
              <h2 style={{ fontSize: "1.5rem", margin: 0, display: "inline-flex", alignItems: "center", gap: ".5rem" }}>
                <Heart size={20} fill="var(--color-primary)" stroke="var(--color-primary)" /> Wishlist
                {wishlist.count > 0 && <span style={{ fontSize: ".95rem", color: "rgba(31,41,55,0.55)", fontWeight: 500 }}>({wishlist.count})</span>}
              </h2>
              <button onClick={() => setWishlistOpen(false)} style={{ ...pdpIconBtn, background: "transparent" }} data-testid="pdp-wishlist-close" aria-label="Close wishlist"><X size={20} /></button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.5rem" }}>
              {wishlist.count === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem 1rem" }} data-testid="pdp-wishlist-empty">
                  <div style={{ width: 80, height: 80, margin: "0 auto 1rem", borderRadius: "50%", background: "var(--color-mint)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Heart size={36} color="var(--color-secondary)" />
                  </div>
                  <h3 style={{ fontSize: "1.25rem", marginBottom: ".5rem" }}>Your wishlist is empty</h3>
                  <p style={{ color: "rgba(31,41,55,0.6)", marginBottom: "1.5rem", fontSize: ".95rem" }}>Tap the heart on any product to save it for later.</p>
                  <button onClick={() => { setWishlistOpen(false); navigate("/preview"); }} className="btn btn-primary" data-testid="pdp-wishlist-shop-btn">Browse the shop</button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }} data-testid="pdp-wishlist-items">
                  {wishlist.slugs.map((slug) => {
                    const p = PRODUCTS.find((x) => x.slug === slug);
                    if (!p) return null;
                    return (
                      <div key={slug} style={{ display: "flex", gap: "1rem", background: "var(--color-cream)", borderRadius: 18, padding: ".75rem", alignItems: "center" }} data-testid={`pdp-wishlist-item-${slug}`}>
                        <div onClick={() => { setWishlistOpen(false); navigate(`/preview/product/${p.slug}`); }} style={{ width: 72, height: 72, background: p.bg, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", flexShrink: 0, cursor: "pointer" }}>{p.emoji}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div onClick={() => { setWishlistOpen(false); navigate(`/preview/product/${p.slug}`); }} style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: ".95rem", marginBottom: ".15rem", cursor: "pointer", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                          <div style={{ fontSize: ".85rem", color: "var(--color-primary)", fontWeight: 800, fontFamily: "var(--font-heading)" }}>${p.price.toFixed(2)}</div>
                          <div style={{ display: "flex", gap: ".5rem", marginTop: ".4rem" }}>
                            <button onClick={() => { cartHook.add(p, 1); wishlist.remove(slug); setPdpToast({ msg: `Added ${p.name} to cart`, tone: "love", id: Date.now() }); setTimeout(() => setPdpToast(null), 2000); }} style={{ background: "var(--color-secondary)", color: "#fff", border: "none", borderRadius: 999, padding: ".3rem .75rem", fontSize: ".75rem", fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-heading)" }} data-testid={`pdp-wishlist-add-${slug}`}>+ Cart</button>
                            <button onClick={() => { wishlist.remove(slug); setPdpToast({ msg: "Removed from wishlist", tone: "muted", id: Date.now() }); setTimeout(() => setPdpToast(null), 2000); }} style={{ background: "transparent", color: "rgba(31,41,55,0.6)", border: "1.5px solid rgba(31,41,55,0.15)", borderRadius: 999, padding: ".3rem .75rem", fontSize: ".75rem", fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-heading)" }} data-testid={`pdp-wishlist-remove-${slug}`}>Remove</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {wishlist.count > 0 && (
              <div style={{ padding: "1rem 1.5rem", borderTop: "2px solid rgba(31,41,55,0.08)", display: "flex", gap: ".75rem" }}>
                <button onClick={() => { const moved = wishlist.slugs.length; wishlist.slugs.forEach((s) => { const p = PRODUCTS.find((x) => x.slug === s); if (p) cartHook.add(p, 1); }); wishlist.clear(); setWishlistOpen(false); setPdpToast({ msg: `Moved ${moved} item${moved === 1 ? "" : "s"} to cart`, tone: "love", id: Date.now() }); setTimeout(() => setPdpToast(null), 2200); }} className="btn btn-primary" style={{ flex: 1 }} data-testid="pdp-wishlist-move-all">Move all to cart</button>
                <button onClick={() => { wishlist.clear(); setPdpToast({ msg: "Wishlist cleared", tone: "muted", id: Date.now() }); setTimeout(() => setPdpToast(null), 1800); }} className="btn btn-outline" data-testid="pdp-wishlist-clear">Clear</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ACCOUNT POPUP */}
      {accountOpen && (
        <div onClick={() => setAccountOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 250, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} data-testid="pdp-account-popup">
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--color-bg)", borderRadius: 24, padding: "2rem 1.75rem", maxWidth: 380, width: "100%", textAlign: "center", position: "relative" }}>
            <button onClick={() => setAccountOpen(false)} style={{ position: "absolute", top: ".75rem", right: ".75rem", width: 36, height: 36, borderRadius: "50%", background: "rgba(31,41,55,0.06)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} data-testid="pdp-account-close" aria-label="Close"><X size={18} /></button>
            <div style={{ width: 80, height: 80, margin: "0 auto 1.25rem", borderRadius: "50%", background: "var(--color-mint)", display: "flex", alignItems: "center", justifyContent: "center" }}><User size={36} /></div>
            <h2 style={{ fontSize: "1.5rem", marginBottom: ".5rem" }}>Welcome <em>back</em></h2>
            <p style={{ color: "rgba(31,41,55,0.65)", marginBottom: "1.5rem", fontSize: ".95rem" }}>Login &amp; accounts will be powered by Shopify once your store is live.</p>
            <button onClick={() => setAccountOpen(false)} className="btn btn-primary btn-block" data-testid="pdp-account-ok">Got it</button>
          </div>
        </div>
      )}

      {/* LIGHTBOX */}
      {lightboxOpen && (
        <div onClick={() => setLightboxOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", cursor: "zoom-out" }} data-testid="image-lightbox">
          <button onClick={() => setLightboxOpen(false)} style={{ position: "absolute", top: "1.5rem", right: "1.5rem", width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} data-testid="lightbox-close"><X size={24} /></button>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "min(85vw, 900px)", aspectRatio: "1", background: product.bg, borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20rem", animation: "lightboxIn .35s ease" }}>
            {product.emoji}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .product-grid-md { grid-template-columns: 1fr 1fr !important; gap: 4rem !important; }
          .bundle-grid-md { grid-template-columns: 1.4fr 1fr !important; gap: 2.5rem !important; }
          .reviews-summary-md { grid-template-columns: 260px 1fr !important; align-items: center; gap: 3rem !important; }
        }
        @media (max-width: 767px) {
          .pdp-sticky-cta { display: flex !important; }
          body { padding-bottom: 80px; }
        }
        .header-logo-img { transition: transform .35s ease; }
        .header-logo-img:hover { transform: scale(1.05) rotate(-2deg); }
        .product-main-image { transition: transform .35s ease; }
        .product-main-image:hover { transform: scale(1.01); }
        .product-main-image:hover .zoom-hint { opacity: 1; transform: translateY(0); }
        .zoom-hint { opacity: 0.85; transition: all .25s ease; }
        .thumb-btn:hover { transform: translateY(-3px); border-color: var(--color-secondary) !important; }
        .color-swatch:hover { transform: scale(1.12); }
        .product-card-hover { transition: all .25s ease; }
        .product-card-hover:hover { transform: translateY(-6px); box-shadow: 0 18px 40px -15px rgba(0,0,0,0.18); }
        @keyframes lightboxIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(-12px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .pdp-heart-btn:hover { transform: scale(1.06); }
        .pdp-heart-btn:active { transform: scale(0.94); }
      `}</style>

      {/* STICKY MOBILE ADD-TO-CART */}
      <div className="pdp-sticky-cta" style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "var(--color-bg)", borderTop: "2px solid rgba(31,41,55,0.08)", padding: ".75rem 1rem", display: "none", alignItems: "center", gap: ".75rem", zIndex: 50, boxShadow: "0 -10px 30px -10px rgba(0,0,0,0.1)" }} data-testid="sticky-add-cart">
        <div style={{ flexShrink: 0 }}>
          <div style={{ fontFamily: "var(--font-heading)", fontSize: ".75rem", fontWeight: 700, color: "rgba(31,41,55,0.6)", textTransform: "uppercase", letterSpacing: ".08em" }}>{product.name.length > 18 ? product.name.slice(0, 18) + "…" : product.name}</div>
          <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.1rem", color: "var(--color-primary)" }}>${(product.price * qty).toFixed(2)}</div>
        </div>
        <button onClick={handleAdd} className="btn btn-primary" style={{ flex: 1 }} data-testid="sticky-add-btn">
          <ShoppingBag size={16} /> {adding ? "✓ Added!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

const pdpIconBtn = { width: 40, height: 40, display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "transparent", border: "none", cursor: "pointer", color: "var(--color-text)", textDecoration: "none" };

function TrustPill({ icon, text }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", background: "var(--color-cream)", padding: ".5rem .875rem", borderRadius: 999, fontSize: ".8rem", fontWeight: 700, fontFamily: "var(--font-heading)" }}>
      {icon} {text}
    </span>
  );
}

function Accordion({ title, children, open, onClick, id }) {
  return (
    <div style={{ borderTop: "1.5px solid rgba(31,41,55,0.1)", padding: "1rem 0" }} data-testid={`accordion-${id}`}>
      <button onClick={onClick} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "transparent", border: "none", cursor: "pointer", padding: 0, fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1rem" }}>
        <span>{title}</span>
        <ChevronDown size={20} style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform .2s ease" }} />
      </button>
      {open && <div style={{ paddingTop: "1rem", fontSize: ".95rem", color: "rgba(31,41,55,0.85)", lineHeight: 1.7 }}>{children}</div>}
    </div>
  );
}
