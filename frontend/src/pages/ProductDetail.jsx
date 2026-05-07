import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Truck, RotateCcw, Heart, ChevronDown, Star, Shield } from "lucide-react";
import { PRODUCTS } from "./ThemePreview";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_6d3e1c7b-f001-4e06-8ed8-3843020b086b/artifacts/qgnbhbs7_image.png";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = PRODUCTS.find((p) => p.slug === slug) || PRODUCTS[0];
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("Medium");
  const [color, setColor] = useState("Coral");
  const [openAccordion, setOpenAccordion] = useState("love");
  const [adding, setAdding] = useState(false);

  const otherProducts = PRODUCTS.filter((p) => p.slug !== product.slug).slice(0, 4);

  const handleAdd = () => {
    setAdding(true);
    setTimeout(() => setAdding(false), 1200);
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

      {/* SIMPLE HEADER */}
      <header style={{ background: "var(--color-bg)", borderBottom: "2px solid rgba(31,41,55,0.08)", padding: "1rem 0" }}>
        <div className="container" style={{ display: "flex", justifyContent: "center" }}>
          <Link to="/preview"><img src={LOGO_URL} alt="Molly & Sophie" style={{ height: 56 }} /></Link>
        </div>
      </header>

      {/* PRODUCT */}
      <section style={{ padding: "2.5rem 0 4rem" }}>
        <div className="container">
          {/* Breadcrumbs */}
          <nav style={{ fontSize: ".85rem", color: "rgba(31,41,55,0.6)", marginBottom: "1.5rem" }} data-testid="breadcrumbs">
            <Link to="/preview" style={{ color: "rgba(31,41,55,0.6)" }}>Home</Link>
            <span style={{ margin: "0 .5rem" }}>›</span>
            <Link to="/preview" style={{ color: "rgba(31,41,55,0.6)" }}>Shop</Link>
            <span style={{ margin: "0 .5rem" }}>›</span>
            <span style={{ color: "var(--color-text)" }}>{product.name}</span>
          </nav>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem" }} className="product-grid-md">
            {/* Gallery */}
            <div>
              <div style={{ aspectRatio: "1", background: product.bg, borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10rem", position: "relative", overflow: "hidden" }} data-testid="product-main-image">
                {product.emoji}
                {product.badge && <span style={{ position: "absolute", top: "1.25rem", left: "1.25rem", background: "var(--color-primary)", color: "#fff", padding: ".5rem 1rem", borderRadius: 999, fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: ".85rem" }}>{product.badge}</span>}
                {product.compareAt && <span style={{ position: "absolute", top: "1.25rem", right: "1.25rem", background: "var(--color-secondary)", color: "#fff", padding: ".5rem 1rem", borderRadius: 999, fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: ".85rem" }}>SALE</span>}
              </div>
              <div style={{ display: "flex", gap: ".75rem", marginTop: "1rem", flexWrap: "wrap" }}>
                {[1, 2, 3, 4].map((i) => (
                  <button key={i} style={{ width: 80, height: 80, borderRadius: 12, background: product.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", border: i === 1 ? "2px solid var(--color-primary)" : "2px solid transparent", cursor: "pointer" }} data-testid={`product-thumb-${i}`}>{product.emoji}</button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div>
              <div style={{ fontSize: ".75rem", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--color-secondary)", fontWeight: 700, fontFamily: "var(--font-heading)", marginBottom: ".5rem" }}>{product.vendor || "Molly & Sophie"}</div>
              <h1 style={{ fontSize: "clamp(1.75rem, 3vw, 2.75rem)", marginBottom: ".75rem" }} data-testid="product-name">{product.name}</h1>

              <div style={{ display: "flex", gap: ".5rem", alignItems: "center", marginBottom: "1rem" }}>
                <span style={{ color: "#f5b800", letterSpacing: ".1em" }}>★★★★★</span>
                <span style={{ color: "rgba(31,41,55,0.6)", fontSize: ".9rem" }}>(124 happy pets)</span>
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
                    <button key={c.name} onClick={() => setColor(c.name)} style={{ width: 40, height: 40, borderRadius: "50%", background: c.val, border: color === c.name ? "3px solid var(--color-text)" : "2px solid rgba(31,41,55,0.15)", cursor: "pointer" }} aria-label={c.name} data-testid={`color-${c.name.toLowerCase()}`} />
                  ))}
                </div>
              </div>

              {/* Size */}
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: ".5rem" }}>Size: <span style={{ color: "var(--color-primary)" }}>{size}</span></div>
                <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
                  {["Small", "Medium", "Large", "X-Large"].map((s) => (
                    <button key={s} onClick={() => setSize(s)} style={{ padding: ".5rem 1rem", border: size === s ? "2px solid var(--color-text)" : "1.5px solid rgba(31,41,55,0.15)", background: size === s ? "var(--color-text)" : "transparent", color: size === s ? "var(--color-bg)" : "var(--color-text)", borderRadius: 999, fontSize: ".9rem", cursor: "pointer", fontWeight: size === s ? 700 : 500 }} data-testid={`size-${s.toLowerCase()}`}>{s}</button>
                  ))}
                </div>
              </div>

              {/* Qty + Add */}
              <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: ".75rem" }}>
                <div style={{ display: "inline-flex", alignItems: "center", border: "1.5px solid rgba(31,41,55,0.15)", borderRadius: 999, overflow: "hidden" }}>
                  <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 40, height: 44, fontWeight: 700, background: "transparent", border: "none", cursor: "pointer" }} data-testid="qty-decrease">−</button>
                  <span style={{ width: 40, textAlign: "center", fontWeight: 700 }} data-testid="qty-value">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} style={{ width: 40, height: 44, fontWeight: 700, background: "transparent", border: "none", cursor: "pointer" }} data-testid="qty-increase">+</button>
                </div>
                <button onClick={handleAdd} className="btn btn-primary" style={{ flex: 1 }} data-testid="product-add-to-cart">
                  <ShoppingBag size={18} />
                  {adding ? "✓ Added!" : `Add to Cart · $${(product.price * qty).toFixed(2)}`}
                </button>
              </div>
              <button className="btn btn-secondary btn-block" data-testid="buy-now-btn">⚡ Buy It Now</button>

              {/* Accordions */}
              <div style={{ marginTop: "2rem" }}>
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
          </div>
        </div>
      </section>

      {/* RECOMMENDATIONS */}
      <section style={{ padding: "4rem 0", background: "var(--color-cream)" }}>
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

      <style>{`
        @media (min-width: 768px) {
          .product-grid-md { grid-template-columns: 1fr 1fr !important; gap: 4rem !important; }
        }
      `}</style>
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
