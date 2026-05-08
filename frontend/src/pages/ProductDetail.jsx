import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Truck, RotateCcw, Heart, ChevronDown, X, ZoomIn, Ruler, FileText, Award, Flame } from "lucide-react";
import { PRODUCTS, StarRating } from "./ThemePreview";
import { useWishlist } from "../hooks/useWishlist";

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

  // Lock body scroll for lightbox
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);

  const handleAdd = () => {
    setAdding(true);
    setTimeout(() => setAdding(false), 1200);
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

      {/* HEADER */}
      <header style={{ background: "var(--color-bg)", borderBottom: "2px solid rgba(31,41,55,0.08)", padding: "1rem 0" }}>
        <div className="container" style={{ display: "flex", justifyContent: "center" }}>
          <Link to="/preview" data-testid="product-logo-link"><img src={LOGO_URL} alt="Molly & Sophie" style={{ height: 96 }} className="header-logo-img" /></Link>
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

      {/* FREQUENTLY BOUGHT TOGETHER (Pack Bundle) */}
      <section id="bundle" style={{ padding: "4rem 0", background: "var(--color-bg)" }} className="reveal" data-testid="bundle-section">
        <div className="container" style={{ maxWidth: 980 }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ display: "inline-block", fontFamily: "var(--font-heading)", fontSize: ".85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".15em", color: "var(--color-secondary)", marginBottom: ".75rem" }}>Build Your Pack</div>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", margin: 0 }}>Frequently bought <em>together</em></h2>
          </div>
          {(() => {
            const bundleItems = [product, ...PRODUCTS.filter(p => p.slug !== product.slug).slice(0, 2)];
            const bundleTotal = bundleItems.reduce((s, p) => s + p.price, 0);
            const bundleCompareAt = bundleItems.reduce((s, p) => s + (p.compareAt || p.price), 0);
            const bundleSave = (bundleCompareAt - bundleTotal + bundleTotal * 0.05).toFixed(2); // mock 5% extra discount
            const bundlePrice = (bundleTotal * 0.95).toFixed(2);
            return (
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem", alignItems: "center" }} className="bundle-grid-md">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: ".75rem", flexWrap: "wrap" }}>
                  {bundleItems.map((p, i) => (
                    <React.Fragment key={p.slug}>
                      <div style={{ background: p.bg, borderRadius: 18, width: 130, height: 130, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: ".5rem", flexShrink: 0 }} data-testid={`bundle-item-${i}`}>
                        <div style={{ fontSize: "3rem" }}>{p.emoji}</div>
                        <div style={{ fontSize: ".7rem", fontFamily: "var(--font-heading)", fontWeight: 700, marginTop: ".25rem", lineHeight: 1.2 }}>{p.name}</div>
                      </div>
                      {i < bundleItems.length - 1 && <span style={{ fontSize: "1.5rem", color: "var(--color-primary)", fontWeight: 800 }}>+</span>}
                    </React.Fragment>
                  ))}
                </div>
                <div style={{ background: "var(--color-cream)", borderRadius: 24, padding: "1.75rem", textAlign: "center" }}>
                  <div style={{ fontSize: ".85rem", color: "rgba(31,41,55,0.6)", textDecoration: "line-through", marginBottom: ".25rem" }}>${bundleCompareAt.toFixed(2)}</div>
                  <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "2rem", color: "var(--color-primary)", lineHeight: 1 }} data-testid="bundle-total">Bundle: ${bundlePrice}</div>
                  <div style={{ display: "inline-block", marginTop: ".5rem", background: "rgba(95,180,184,0.15)", color: "var(--color-secondary)", padding: ".25rem .75rem", borderRadius: 999, fontSize: ".8rem", fontWeight: 700 }}>You save ${bundleSave}</div>
                  <button onClick={handleAdd} className="btn btn-primary btn-block" style={{ marginTop: "1.25rem" }} data-testid="add-bundle-btn">
                    <ShoppingBag size={18} /> Add Bundle to Cart
                  </button>
                  <p style={{ fontSize: ".75rem", color: "rgba(31,41,55,0.55)", marginTop: ".75rem", margin: ".75rem 0 0" }}>5% off when bought together</p>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* FREQUENTLY ASKED — promoted from the in-product accordion column
          so the bundle upsell sits directly under the buy box. */}
      <section id="faq" style={{ padding: "4rem 0", background: "var(--color-cream)" }} className="reveal" data-testid="faq-section">
        <div className="container" style={{ maxWidth: 820 }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ display: "inline-block", fontFamily: "var(--font-heading)", fontSize: ".85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".15em", color: "var(--color-secondary)", marginBottom: ".75rem" }}>Curious Pups</div>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", margin: 0 }}>Frequently <em>asked</em></h2>
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
                  <li key={it} style={{ padding: ".5rem 0", display: "flex", alignItems: "center", gap: ".75rem" }}>
                    <span style={{ color: "var(--color-secondary)", fontWeight: 800, fontSize: "1.25rem" }}>✓</span> {it}
                  </li>
                ))}
              </ul>
            </Accordion>
            <Accordion id="ship" title="Shipping & returns" open={openAccordion === "ship"} onClick={() => setOpenAccordion(openAccordion === "ship" ? "" : "ship")}>
              <p style={{ margin: 0 }}>Free shipping on orders over $50. We ship within 1–3 business days from the USA. Not loving it? Return within 30 days for a full refund.</p>
            </Accordion>
            <Accordion id="give" title="How your purchase helps" open={openAccordion === "give"} onClick={() => setOpenAccordion(openAccordion === "give" ? "" : "give")}>
              <p style={{ margin: 0 }}>1% of every order is donated each month to a trusted pet rescue we hand-pick ourselves. We're not affiliated with any single charity — we like to spread the love around.</p>
            </Accordion>
          </div>
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
