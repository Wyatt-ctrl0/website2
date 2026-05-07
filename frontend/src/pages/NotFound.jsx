import React from "react";
import { Link } from "react-router-dom";
import { Home, ShoppingBag } from "lucide-react";
import { PawPrint } from "./ThemePreview";

const LOGO_URL = "/img/logo.png";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", display: "flex", flexDirection: "column" }} data-testid="not-found-page">
      <header style={{ background: "var(--color-bg)", borderBottom: "2px solid rgba(31,41,55,0.08)", padding: "1rem 0" }}>
        <div className="container" style={{ display: "flex", justifyContent: "center" }}>
          <Link to="/" data-testid="not-found-logo"><img src={LOGO_URL} alt="Molly & Sophie" style={{ height: 96 }} /></Link>
        </div>
      </header>

      <section style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 1rem" }}>
        <div style={{ textAlign: "center", maxWidth: 560 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem", animation: "wobble 2.5s ease-in-out infinite" }}>
            <PawPrint size={120} color="var(--color-primary)" />
          </div>
          <div style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(4rem, 12vw, 7rem)", fontWeight: 800, lineHeight: 1, color: "var(--color-primary)", marginBottom: ".5rem" }}>404</div>
          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", marginBottom: "1rem" }}>This page <em>ran off</em> chasing a squirrel</h1>
          <p style={{ color: "rgba(31,41,55,0.7)", fontSize: "1.05rem", marginBottom: "2rem", maxWidth: 440, marginLeft: "auto", marginRight: "auto" }}>
            We can't find what you're looking for, but the pack is still here. Try heading home or browsing the shop.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/" className="btn btn-primary" data-testid="not-found-home-btn"><Home size={18} /> Back home</Link>
            <Link to="/preview" className="btn btn-outline" data-testid="not-found-shop-btn"><ShoppingBag size={18} /> Shop the pack</Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes wobble {
          0%, 100% { transform: rotate(-4deg); }
          50% { transform: rotate(4deg); }
        }
      `}</style>
    </div>
  );
}
