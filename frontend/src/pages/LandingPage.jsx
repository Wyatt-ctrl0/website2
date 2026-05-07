import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Download, Package, Sparkles, ShoppingBag, Phone, Mail, Heart, ExternalLink, CheckCircle2, Eye } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const LOGO_URL = "/img/logo.png";

const FEATURES = [
  { icon: <Sparkles size={22} />, title: "Welcome promo popup", desc: "10% off code shown to first-time visitors. Fully editable in the theme settings." },
  { icon: <ShoppingBag size={22} />, title: "Cart drawer + free shipping bar", desc: "Live progress bar to $50 free shipping, with promo code field built in." },
  { icon: <Heart size={22} />, title: "Meet the Pack section", desc: "Jack, Sophie & Molly pre-loaded with photos and bios — fully editable." },
  { icon: <Package size={22} />, title: "Custom thank-you page", desc: "Highlights the 1% rescue donation after every successful order." },
  { icon: <Mail size={22} />, title: "Klaviyo-ready newsletter", desc: "Drop in your Klaviyo embed or use Shopify's native customer signup." },
  { icon: <Phone size={22} />, title: "Contact + footer links", desc: "Returns, Shipping, Order Lookup, Help & Contact — all wired up." },
];

const STEPS = [
  { num: "01", title: "Download the ZIP", desc: "Click the download button and save molly-and-sophie-theme.zip to your computer." },
  { num: "02", title: "Upload to Shopify", desc: "In Shopify Admin → Online Store → Themes → Add theme → Upload zip file." },
  { num: "03", title: "Customize & publish", desc: "Edit colors, copy, and product collections in Theme Customizer, then click Publish." },
  { num: "04", title: "Set up discount codes", desc: "Create matching discount codes (WELCOME10, etc.) in Shopify Discounts → Create." },
];

export default function LandingPage() {
  const [info, setInfo] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await axios.get(`${API}/theme/info`);
        setInfo(r.data);
      } catch (e) {
        // Set fallback so UI still renders
        setInfo({ name: "Molly & Sophie", version: "1.0.0", size_kb: 48, files: 30 });
      }
    })();
  }, []);

  const handleDownload = () => {
    setDownloading(true);
    const a = document.createElement("a");
    a.href = `${API}/theme/download`;
    a.download = "molly-and-sophie-theme.zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setDownloading(false), 1500);
  };

  return (
    <div data-testid="landing-page">
      {/* HEADER */}
      <header style={{ background: "var(--color-bg)", borderBottom: "1px solid rgba(31,41,55,0.08)", position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(8px)" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }} data-testid="header-brand">
            <img src={LOGO_URL} alt="Molly & Sophie" style={{ height: 80, width: "auto" }} />
          </div>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <Link to="/preview" className="btn btn-outline" style={{ padding: "0.65rem 1.25rem", fontSize: "0.85rem" }} data-testid="header-preview-btn">
              <Eye size={16} /> Live Preview
            </Link>
            <button className="btn btn-primary" style={{ padding: "0.65rem 1.25rem", fontSize: "0.85rem" }} onClick={handleDownload} data-testid="header-download-btn">
              <Download size={16} /> Download
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section style={{ background: "var(--color-mint)", padding: "5rem 0 6rem", position: "relative", overflow: "hidden" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem", alignItems: "center" }} className="hero-grid-md">
            <div className="fade-up">
              <span style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", background: "var(--color-cream)", padding: ".4rem 1rem", borderRadius: 999, fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.85rem", marginBottom: "1.5rem" }}>
                <Sparkles size={14} /> Shopify theme · Ready to import
              </span>
              <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.75rem)", marginBottom: "1.25rem" }}>
                Your <em>Molly & Sophie</em><br />Shopify theme is ready
              </h1>
              <p style={{ fontSize: "1.125rem", maxWidth: 540, marginBottom: "2rem", color: "rgba(31,41,55,0.75)" }}>
                A warm, family-friendly Shopify theme built around Jack, Sophie & Molly — packaged as a single ZIP you can import into Shopify in under 60 seconds.
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <button className="btn btn-primary btn-lg" onClick={handleDownload} data-testid="hero-download-btn">
                  <Download size={20} /> {downloading ? "Downloading..." : "Download ZIP"}
                  {info && <span style={{ opacity: 0.85, fontWeight: 500, fontSize: "0.85rem", marginLeft: ".5rem" }}>· {info.size_kb}KB</span>}
                </button>
                <Link to="/preview" className="btn btn-outline btn-lg" data-testid="hero-preview-btn">
                  <Eye size={20} /> Live Preview
                </Link>
              </div>

              {info && (
                <div style={{ display: "flex", gap: "2rem", marginTop: "2.5rem", flexWrap: "wrap" }} data-testid="theme-stats">
                  <div><div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.75rem" }}>{info.files}+</div><div style={{ fontSize: ".85rem", color: "rgba(31,41,55,0.6)" }}>Theme files</div></div>
                  <div><div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.75rem" }}>v{info.version}</div><div style={{ fontSize: ".85rem", color: "rgba(31,41,55,0.6)" }}>Latest version</div></div>
                  <div><div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.75rem" }}>1%</div><div style={{ fontSize: ".85rem", color: "rgba(31,41,55,0.6)" }}>To rescues</div></div>
                </div>
              )}
            </div>

            <div style={{ position: "relative" }} className="fade-up">
              <div style={{ background: "var(--color-bg)", borderRadius: 32, padding: "2rem", boxShadow: "0 30px 60px -20px rgba(31,41,55,0.3)", transform: "rotate(-2deg)" }}>
                <img src={LOGO_URL} alt="Logo preview" style={{ width: "100%", borderRadius: 16 }} />
                <div style={{ marginTop: "1rem", fontSize: ".85rem", color: "rgba(31,41,55,0.6)", textAlign: "center" }}>Your brand · Built into the theme</div>
              </div>
              <div className="wobble" style={{ position: "absolute", bottom: -20, left: -20, background: "var(--color-primary)", color: "#fff", borderRadius: "50%", width: 130, height: 130, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: ".9rem", padding: "1rem", boxShadow: "0 8px 0 0 rgba(0,0,0,0.1)" }}>
                Ready to<br />import 🐾
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RESCUE PHOTOS */}
      <section style={{ padding: "4rem 0", background: "var(--color-cream)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{ display: "inline-block", fontFamily: "var(--font-heading)", fontSize: ".85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".15em", color: "var(--color-secondary)", marginBottom: "1rem" }}>The Inspiration</div>
            <h2 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)" }}>Built for <em>Jack, Sophie & Molly</em></h2>
            <p style={{ color: "rgba(31,41,55,0.65)", maxWidth: 540, margin: "0 auto" }}>The three rescues that started it all. Their photos and stories are pre-loaded in the theme — ready to go live.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2rem", maxWidth: 900, margin: "0 auto" }}>
            {[
              { name: "Jack", role: "The Old Soul", img: "https://customer-assets.emergentagent.com/job_6d3e1c7b-f001-4e06-8ed8-3843020b086b/artifacts/q86lwpgi_IMG_1473.jpg", bio: "His previous owners traveled often and couldn't give him the attention he needed." },
              { name: "Sophie", role: "The Fluffy Diplomat", img: "https://customer-assets.emergentagent.com/job_6d3e1c7b-f001-4e06-8ed8-3843020b086b/artifacts/g2hrd7bt_IMG_9494.jpg", bio: "Left behind during quarantine — now the loudest welcome in the house." },
              { name: "Molly", role: "The Sunshine", img: "https://customer-assets.emergentagent.com/job_6d3e1c7b-f001-4e06-8ed8-3843020b086b/artifacts/yvrv5cn8_IMG_9662.jpg", bio: "Lost her first home when her family couldn't afford to care for her." },
            ].map((p) => (
              <div key={p.name} style={{ textAlign: "center", background: "var(--color-bg)", padding: "2rem 1.5rem", borderRadius: 28, border: "3px dashed rgba(31,41,55,0.15)" }} data-testid={`rescue-card-${p.name.toLowerCase()}`}>
                <div style={{ width: 160, height: 160, margin: "0 auto 1.25rem", borderRadius: "50%", overflow: "hidden", border: "6px solid var(--color-mint)", boxShadow: "0 10px 25px -10px rgba(0,0,0,0.2)" }}>
                  <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <h3 style={{ fontSize: "1.75rem", color: "var(--color-primary)", marginBottom: ".25rem" }}>{p.name}</h3>
                <div style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", color: "var(--color-secondary)", marginBottom: ".75rem" }}>{p.role}</div>
                <p style={{ fontSize: ".9rem", color: "rgba(31,41,55,0.7)", margin: 0 }}>{p.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "5rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ display: "inline-block", fontFamily: "var(--font-heading)", fontSize: ".85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".15em", color: "var(--color-secondary)", marginBottom: "1rem" }}>What's Included</div>
            <h2 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)" }}>Everything you asked for, <em>baked in</em></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ background: "#fff", padding: "2rem", borderRadius: 24, border: "2px solid rgba(31,41,55,0.06)", transition: "all .25s ease" }} data-testid={`feature-card-${i}`}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--color-mint)", color: "var(--color-text)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>{f.icon}</div>
                <h3 style={{ fontSize: "1.15rem", marginBottom: ".5rem" }}>{f.title}</h3>
                <p style={{ color: "rgba(31,41,55,0.7)", margin: 0, fontSize: ".95rem" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW TO INSTALL */}
      <section style={{ padding: "5rem 0", background: "var(--color-cream)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ display: "inline-block", fontFamily: "var(--font-heading)", fontSize: ".85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".15em", color: "var(--color-secondary)", marginBottom: "1rem" }}>Setup</div>
            <h2 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)" }}>Live in <em>under 60 seconds</em></h2>
            <p style={{ color: "rgba(31,41,55,0.65)", maxWidth: 540, margin: "0 auto" }}>Four quick steps and your shop is open for business.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", maxWidth: 1100, margin: "0 auto" }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ background: "var(--color-bg)", padding: "2rem", borderRadius: 24, position: "relative" }} data-testid={`install-step-${i + 1}`}>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "3rem", color: "var(--color-primary)", lineHeight: 1, marginBottom: ".5rem" }}>{s.num}</div>
                <h3 style={{ fontSize: "1.15rem", marginBottom: ".5rem" }}>{s.title}</h3>
                <p style={{ color: "rgba(31,41,55,0.7)", margin: 0, fontSize: ".95rem" }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <button className="btn btn-primary btn-lg" onClick={handleDownload} data-testid="install-download-btn">
              <Download size={20} /> Download the Theme
            </button>
          </div>
        </div>
      </section>

      {/* INCLUDED PAGES */}
      <section style={{ padding: "5rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ display: "inline-block", fontFamily: "var(--font-heading)", fontSize: ".85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".15em", color: "var(--color-secondary)", marginBottom: "1rem" }}>Pages</div>
            <h2 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)" }}>Pre-built page <em>templates</em></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", maxWidth: 1100, margin: "0 auto" }}>
            {[
              "Homepage", "Product page", "Collection page", "Cart drawer",
              "About page", "Contact page", "Thank You page", "404 page",
            ].map((p, i) => (
              <div key={i} style={{ background: "#fff", padding: "1.25rem", borderRadius: 16, border: "2px solid rgba(31,41,55,0.06)", display: "flex", alignItems: "center", gap: ".75rem" }} data-testid={`included-page-${i}`}>
                <CheckCircle2 size={20} style={{ color: "var(--color-secondary)", flexShrink: 0 }} />
                <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DONATION CALLOUT */}
      <section style={{ padding: "4rem 0", background: "linear-gradient(135deg, var(--color-secondary), #4ea3a7)", color: "#fff" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem", alignItems: "center", textAlign: "center" }}>
            <div>
              <Heart size={36} style={{ marginBottom: "1rem" }} />
              <h2 style={{ color: "#fff", fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)" }}>1% of every order. Donated monthly.</h2>
              <p style={{ color: "rgba(255,255,255,0.9)", maxWidth: 580, margin: "0 auto 1.5rem" }}>You're not partnered with any single charity — every month, you hand-pick a trusted pet rescue and donate 1% of orders directly to them. The donation banner and Thank You page reflect that, just like you asked.</p>
              <a href="https://humanepa.org/donate/" target="_blank" rel="noopener noreferrer" className="btn btn-light" data-testid="donation-link">
                Example: humanepa.org <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: "5rem 0", background: "var(--color-mint)", textAlign: "center" }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>Ready to <em>open the doors</em>?</h2>
          <p style={{ fontSize: "1.1rem", color: "rgba(31,41,55,0.7)", marginBottom: "2rem" }}>Download the ZIP and import it into Shopify in under a minute.</p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn btn-primary btn-lg" onClick={handleDownload} data-testid="footer-download-btn">
              <Download size={20} /> Download Theme {info && <span style={{ opacity: 0.85, fontWeight: 500, fontSize: ".85rem" }}>· {info.size_kb}KB ZIP</span>}
            </button>
            <Link to="/preview" className="btn btn-outline btn-lg" data-testid="footer-preview-btn">
              <Eye size={20} /> See Live Preview
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "var(--color-text)", color: "var(--color-cream)", padding: "3rem 0 1.5rem" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 700 }}>
              <span style={{ color: "var(--color-primary)" }}>Molly</span> <span style={{ color: "var(--color-secondary)" }}>& Sophie</span>
            </div>
            <p style={{ margin: ".5rem 0 0", color: "rgba(255,255,255,0.6)", fontSize: ".9rem" }}>Made with 🐾 for pets everywhere.</p>
          </div>
          <div style={{ fontSize: ".85rem", color: "rgba(255,255,255,0.6)" }}>
            <a href="mailto:support@mollyandsophie.com" style={{ marginRight: "1rem" }}>support@mollyandsophie.com</a>
            <a href="tel:+15706711534">(570) 671-1534</a>
          </div>
        </div>
      </footer>

      <style>{`
        @media (min-width: 768px) {
          .hero-grid-md { grid-template-columns: 1.1fr 1fr !important; gap: 4rem !important; }
        }
      `}</style>
    </div>
  );
}
