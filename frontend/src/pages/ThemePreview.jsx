import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Download, ShoppingBag, Search, User, Menu, X, ArrowLeft, Heart, Star, ChevronRight } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_6d3e1c7b-f001-4e06-8ed8-3843020b086b/artifacts/qgnbhbs7_image.png";

const RESCUE_IMG = {
  jack: "https://customer-assets.emergentagent.com/job_6d3e1c7b-f001-4e06-8ed8-3843020b086b/artifacts/q86lwpgi_IMG_1473.jpg",
  sophie: "https://customer-assets.emergentagent.com/job_6d3e1c7b-f001-4e06-8ed8-3843020b086b/artifacts/g2hrd7bt_IMG_9494.jpg",
  molly: "https://customer-assets.emergentagent.com/job_6d3e1c7b-f001-4e06-8ed8-3843020b086b/artifacts/yvrv5cn8_IMG_9662.jpg",
};

const PRODUCTS = [
  { name: "Salmon Soft Treats", price: 14.99, emoji: "🦴", bg: "#ffe4d4", badge: "Bestseller" },
  { name: "Cozy Donut Bed", price: 49.99, emoji: "🛏️", bg: "#d2efef" },
  { name: "Squeaky Plush Carrot", price: 18.99, emoji: "🎾", bg: "#fce8da" },
  { name: "Adventure Harness", price: 34.99, emoji: "🦮", bg: "#e8f0d4", badge: "New" },
  { name: "Calming Chew Sticks", price: 22.99, emoji: "🌿", bg: "#ffe4d4" },
  { name: "Catnip Mouse Trio", price: 12.99, emoji: "🐱", bg: "#d2efef" },
  { name: "Premium Kibble Bowl", price: 26.99, emoji: "🥣", bg: "#fce8da" },
  { name: "Plaid Travel Coat", price: 44.99, emoji: "🧥", bg: "#e8f0d4" },
];

const CATEGORIES = [
  { title: "Dog Treats", emoji: "🦴", bg: "#ffe4d4" },
  { title: "Cozy Beds", emoji: "🛏️", bg: "#d2efef" },
  { title: "Toys & Play", emoji: "🎾", bg: "#fce8da" },
  { title: "Cat Corner", emoji: "🐱", bg: "#e8f0d4" },
];

export default function ThemePreview() {
  const [cartOpen, setCartOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(true);
  const [cart, setCart] = useState([]);
  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState(null);
  const [promoMsg, setPromoMsg] = useState("");
  const [codeCopied, setCodeCopied] = useState(false);
  const [newsletterMsg, setNewsletterMsg] = useState("");

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

  const copyCode = () => {
    try {
      const p = navigator.clipboard?.writeText("WELCOME10");
      if (p && typeof p.catch === "function") p.catch(() => {});
    } catch (_) {
      // iframe / sandboxed: silently ignore
    }
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
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
    document.body.style.overflow = popupOpen || cartOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [popupOpen, cartOpen]);

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
            <a href="#shop" style={{ fontSize: "1rem" }}>Shop All</a>
            <a href="#dogs" style={{ fontSize: "1rem" }}>Dogs</a>
            <a href="#cats" style={{ fontSize: "1rem" }}>Cats</a>
            <a href="#about" style={{ fontSize: "1rem" }}>Our Story</a>
          </nav>
          <a href="#" style={{ display: "flex", justifyContent: "center" }}>
            <img src={LOGO_URL} alt="Molly & Sophie" style={{ height: 64, width: "auto" }} />
          </a>
          <div style={{ display: "flex", gap: ".75rem", alignItems: "center", justifyContent: "flex-end" }}>
            <button style={iconBtnStyle}><Search size={20} /></button>
            <button style={iconBtnStyle}><User size={20} /></button>
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
                🐾 Family-run since 2024
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

      {/* CATEGORIES */}
      <section style={{ padding: "5rem 0" }} data-testid="preview-categories">
        <div className="container">
          <SectionHead eyebrow="Shop by Pet" title={<>Find what makes them <em>wag</em></>} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.5rem" }}>
            {CATEGORIES.map((c, i) => (
              <a key={i} href="#" style={{ background: c.bg, padding: "2rem 1.25rem", borderRadius: 24, textAlign: "center", transition: "transform .25s ease" }} className="hover-lift">
                <div style={{ fontSize: "3rem", marginBottom: ".75rem" }}>{c.emoji}</div>
                <h3 style={{ fontSize: "1.125rem", margin: 0 }}>{c.title}</h3>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section id="products" style={{ padding: "5rem 0" }} data-testid="preview-products">
        <div className="container">
          <SectionHead eyebrow="Best Sellers" title={<>Tail-wagging <em>favorites</em></>} sub="Hand-picked goodies our pack approves of." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
            {PRODUCTS.map((p, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 24, overflow: "hidden", border: "2px solid transparent", transition: "all .25s ease", display: "flex", flexDirection: "column" }} className="product-card-hover" data-testid={`preview-product-${i}`}>
                <div style={{ aspectRatio: "1", background: p.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "5rem", position: "relative" }}>
                  {p.emoji}
                  {p.badge && <span style={{ position: "absolute", top: "1rem", left: "1rem", background: "var(--color-primary)", color: "#fff", padding: ".35rem .75rem", borderRadius: 999, fontSize: ".75rem", fontWeight: 700, fontFamily: "var(--font-heading)" }}>{p.badge}</span>}
                </div>
                <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ fontSize: ".75rem", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--color-secondary)", fontWeight: 700, fontFamily: "var(--font-heading)", marginBottom: ".4rem" }}>Molly &amp; Sophie</div>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.05rem", margin: "0 0 .5rem" }}>{p.name}</h3>
                  <div style={{ fontWeight: 800, marginBottom: ".75rem" }}>${p.price.toFixed(2)}</div>
                  <button onClick={() => addToCart(p)} className="btn btn-secondary" style={{ padding: ".55rem 1rem", fontSize: ".85rem", marginTop: "auto" }} data-testid={`preview-add-${i}`}>Add to Cart</button>
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
              { name: "Jack", role: "The Old Soul", img: RESCUE_IMG.jack, bio: "Our scruffy little gentleman with the wisest eyes. Now the calmest member of the pack." },
              { name: "Sophie", role: "The Fluffy Diplomat", img: RESCUE_IMG.sophie, bio: "Greets everyone — human or pup — like they're her best friend. Pure goofy love." },
              { name: "Molly", role: "The Sunshine", img: RESCUE_IMG.molly, bio: "Pure smiles, pink harnesses, and zoomies on demand. The pup that started it all." },
            ].map((r) => (
              <div key={r.name} style={{ textAlign: "center", background: "var(--color-bg)", padding: "2rem 1.5rem", borderRadius: 28, border: "3px dashed rgba(31,41,55,0.15)" }} className="hover-lift">
                <div style={{ width: 180, height: 180, margin: "0 auto 1.5rem", borderRadius: "50%", overflow: "hidden", border: "6px solid var(--color-mint)", boxShadow: "0 10px 25px -10px rgba(0,0,0,0.2)" }}>
                  <img src={r.img} alt={r.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <h3 style={{ fontSize: "2rem", color: "var(--color-primary)", marginBottom: ".5rem" }}>{r.name}</h3>
                <div style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", color: "var(--color-secondary)", marginBottom: "1rem" }}>{r.role}</div>
                <p style={{ color: "rgba(31,41,55,0.75)", fontSize: ".95rem", margin: 0 }}>{r.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DONATION */}
      <section style={{ padding: "3rem 0", background: "linear-gradient(135deg, var(--color-secondary), #4ea3a7)", color: "#fff" }} data-testid="preview-donation">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem", alignItems: "center" }} className="donation-grid-md">
            <div>
              <h2 style={{ color: "#fff", margin: "0 0 .5rem" }}>1% of every order helps rescue pets.</h2>
              <p style={{ color: "rgba(255,255,255,0.9)", margin: 0 }}>We partner with the Humane Society of the Poconos to fund food, shelter, and medical care.</p>
            </div>
            <a href="https://humanepa.org/donate/" target="_blank" rel="noreferrer" className="btn btn-light">Meet Our Partner</a>
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
      <footer style={{ background: "var(--color-text)", color: "var(--color-cream)", padding: "4rem 0 2rem" }} data-testid="preview-footer">
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
            <FooterCol title="Customer Care" items={["Returns", "Shipping Info", "Order Lookup", "Help Center", "Contact Us"]} />
            <FooterCol title="About" items={["Our Story", "Meet the Pack", "Giving Back", "Blog"]} />
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
            <div style={{ background: "var(--color-mint)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", minHeight: 280, fontSize: "8rem" }}>🐾</div>
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
      `}</style>
    </div>
  );
}

const iconBtnStyle = { width: 44, height: 44, display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "transparent", border: "none", cursor: "pointer", position: "relative", color: "var(--color-text)" };
const qtyBtnStyle = { width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, background: "transparent", border: "none", cursor: "pointer" };

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
  return (
    <div>
      <h4 style={{ color: "var(--color-cream)", fontSize: "1rem", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: "1rem" }}>{title}</h4>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {items.map((it) => (
          <li key={it} style={{ marginBottom: ".6rem" }}>
            <a href="#" style={{ color: "rgba(255,255,255,0.7)" }}>{it}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
