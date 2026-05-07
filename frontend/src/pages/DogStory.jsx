import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { RESCUE_IMG } from "./ThemePreview";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_6d3e1c7b-f001-4e06-8ed8-3843020b086b/artifacts/qgnbhbs7_image.png";

const STORIES = {
  jack: {
    name: "Jack",
    role: "The Old Soul",
    bg: "#d2efef",
    tagline: "Quiet eyes. Patient heart. The first rescue that taught us what this was all about.",
    hero: RESCUE_IMG.jack,
    sections: [
      { type: "h", text: "Where Jack came from" },
      { type: "p", text: "Before us, Jack lived in a house where the people he loved were always leaving. His previous owners traveled frequently for work — long stretches at a time — and they couldn't give him the attention or care he needed. He was often left alone, often neglected, often confused about whether anyone was coming back." },
      { type: "p", text: "When we brought Jack home, he didn't believe in laps yet. He didn't believe in being looked at directly. He didn't believe that food would be there in the morning. It took time, patience, and a lot of soft voices to convince him." },
      { type: "q", text: "The first time Jack fell asleep on the couch with us — actually relaxed, snoring, paws twitching — we knew this was the start of something." },
      { type: "h", text: "Who Jack is now" },
      { type: "p", text: "Today, Jack is our resident philosopher. He is the calmest member of the pack — the one who watches Sophie and Molly do zoomies with the wise expression of someone who has seen things. He has a favorite sunbeam in the kitchen at 2pm. He has a favorite blanket. He has a family that isn't going anywhere." },
      { type: "p", text: "Jack is the reason we started Molly & Sophie. Because every dog like him deserves a couch, a sunbeam, and someone coming home." },
    ],
    photos: [
      { src: RESCUE_IMG.jack, caption: "Jack, mid-thoughtful blink." },
      { src: RESCUE_IMG.jack, caption: "Sunbeam mode, engaged." },
      { src: RESCUE_IMG.jack, caption: "Wise old soul, certified." },
      { src: RESCUE_IMG.jack, caption: "Couch boss." },
    ],
  },
  sophie: {
    name: "Sophie",
    role: "The Fluffy Diplomat",
    bg: "#ffe4d4",
    tagline: "Left behind when the world went quiet — now the loudest welcome in the house.",
    hero: RESCUE_IMG.sophie,
    sections: [
      { type: "h", text: "Where Sophie came from" },
      { type: "p", text: "Sophie's old life ended during quarantine. Her previous family decided they couldn't keep her — too much, too long, too uncertain — and she was left behind. Just like that. A dog who had been someone's whole world the week before, suddenly wasn't anyone's." },
      { type: "p", text: "When we met Sophie, she was anxious, attached, terrified of being left alone in any room. Closing a door behind us was a small heartbreak. She thought every goodbye was the last one." },
      { type: "q", text: "It took weeks for Sophie to believe we were really coming back. And once she did — she decided everyone in the world was her new best friend." },
      { type: "h", text: "Who Sophie is now" },
      { type: "p", text: "Sophie is, simply, a celebration. She greets every guest like they're family she hasn't seen in years. She wags her whole back end. She melts at the sound of someone saying her name. She has the kind of love that fills a room." },
      { type: "p", text: "Her old family's loss became our luckiest day. And every time we ship an order, a tiny piece of it goes back to dogs still waiting for a Sophie-sized welcome of their own." },
    ],
    photos: [
      { src: RESCUE_IMG.sophie, caption: "Sophie at her favorite snack station." },
      { src: RESCUE_IMG.sophie, caption: "Resident greeter." },
      { src: RESCUE_IMG.sophie, caption: "Diplomat in training." },
      { src: RESCUE_IMG.sophie, caption: "Tail-wagging professional." },
    ],
  },
  molly: {
    name: "Molly",
    role: "The Sunshine",
    bg: "#fce8da",
    tagline: "She lost her first home to circumstance. She earned her second one in pure puppy joy.",
    hero: RESCUE_IMG.molly,
    sections: [
      { type: "h", text: "Where Molly came from" },
      { type: "p", text: "Molly's first family loved her — they just couldn't afford to keep her. Vet bills, food, time, everything a growing puppy needs — life had become too much, and they had to let her go. It happens more often than people realize. It doesn't make the goodbye any easier." },
      { type: "p", text: "When we picked her up, she was tiny, scared, and had no idea what was happening. She slept in our arms the whole drive home. She didn't have a name yet. She had no idea she was about to become the brightest part of this house." },
      { type: "q", text: "Molly is the reason this shop exists. Every order helps a pet whose family is doing their best — but needs a little help." },
      { type: "h", text: "Who Molly is now" },
      { type: "p", text: "Molly is loud, gold, and made entirely of zoomies. She wears a pink harness like she invented pink. She believes every blanket is a fort and every couch is a trampoline. She has decided that mornings are her best work." },
      { type: "p", text: "She's also the reason we put a name on the door. Because if a dog this good can lose her home through no fault of her own — then a small shop run from our living room can quietly chip away at the problem, one order at a time." },
    ],
    photos: [
      { src: RESCUE_IMG.molly, caption: "Molly's signature smile." },
      { src: RESCUE_IMG.molly, caption: "Pink harness, full sunshine." },
      { src: RESCUE_IMG.molly, caption: "Zoomies in progress." },
      { src: RESCUE_IMG.molly, caption: "The reason this exists." },
    ],
  },
};

export default function DogStory() {
  const { slug } = useParams();
  const dog = STORIES[slug] || STORIES.jack;

  return (
    <div style={{ background: "var(--color-bg)" }} data-testid={`dog-story-${slug}`}>
      {/* PREVIEW BAR */}
      <div style={{ background: "var(--color-text)", color: "var(--color-cream)", padding: "0.75rem 1rem", textAlign: "center", fontSize: "0.85rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: ".75rem" }}>
        <Link to="/preview" style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", color: "var(--color-cream)" }} data-testid="dog-back-store">
          <ArrowLeft size={16} /> Back to store
        </Link>
        <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}>📖 {dog.name}'s Story</div>
        <Link to="/" style={{ color: "var(--color-cream)", fontSize: ".8rem" }}>← Theme info</Link>
      </div>

      {/* HEADER */}
      <header style={{ background: "var(--color-bg)", borderBottom: "2px solid rgba(31,41,55,0.08)", padding: "1rem 0" }}>
        <div className="container" style={{ display: "flex", justifyContent: "center" }}>
          <Link to="/preview"><img src={LOGO_URL} alt="Molly & Sophie" style={{ height: 56 }} /></Link>
        </div>
      </header>

      {/* HERO */}
      <section style={{ background: dog.bg, padding: "4rem 0 5rem" }} data-testid="dog-story-hero">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem", alignItems: "center" }} className="dog-hero-grid-md">
            <div>
              <Link to="/preview#about" style={{ display: "inline-flex", alignItems: "center", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: ".9rem", opacity: 0.7, marginBottom: "1rem" }}>← Back to Our Story</Link>
              <span style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", background: "var(--color-bg)", padding: ".4rem 1rem", borderRadius: 999, fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: ".85rem", marginBottom: "1.5rem" }}>
                🐾 Meet {dog.name}
              </span>
              <h1 style={{ fontSize: "clamp(3rem, 7vw, 6rem)", marginBottom: "1rem", lineHeight: 0.95 }}>{dog.name}<br /><em style={{ color: "var(--color-primary)", fontStyle: "italic" }}>{dog.role}</em></h1>
              <p style={{ fontSize: "1.15rem", maxWidth: 460 }}>{dog.tagline}</p>
            </div>
            <div style={{ borderRadius: 32, overflow: "hidden", aspectRatio: "4/5", boxShadow: "0 30px 60px -20px rgba(31,41,55,0.3)" }} data-testid="dog-story-hero-image">
              <img src={dog.hero} alt={dog.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section style={{ padding: "4rem 0" }}>
        <div className="container" style={{ maxWidth: 760 }}>
          {dog.sections.map((s, i) => {
            if (s.type === "h") return <h2 key={i} style={{ marginTop: i === 0 ? 0 : "3rem", marginBottom: "1rem", fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}>{s.text}</h2>;
            if (s.type === "p") return <p key={i} style={{ marginBottom: "1.5rem", fontSize: "1.1rem", lineHeight: 1.8, color: "rgba(31,41,55,0.85)" }}>{s.text}</p>;
            if (s.type === "q") return <blockquote key={i} style={{ borderLeft: "4px solid var(--color-primary)", padding: "0.5rem 0 0.5rem 1.5rem", margin: "2.5rem 0", fontStyle: "italic", fontFamily: "var(--font-heading)", fontSize: "1.4rem", color: "var(--color-secondary)", lineHeight: 1.4 }}>"{s.text}"</blockquote>;
            return null;
          })}
        </div>
      </section>

      {/* PHOTO BOOTH */}
      <section style={{ padding: "4rem 0", background: "var(--color-cream)" }} data-testid="photo-booth">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{ display: "inline-block", fontFamily: "var(--font-heading)", fontSize: ".85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".15em", color: "var(--color-secondary)", marginBottom: "1rem" }}>{dog.name}'s Photo Booth</div>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}>Captured <em>moments</em></h2>
            <p style={{ color: "rgba(31,41,55,0.6)", fontSize: ".95rem" }}>Drop more photos in your Shopify theme settings to fill the booth.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }} className="photobooth-grid-md">
            {dog.photos.map((ph, i) => (
              <div key={i} style={{ position: "relative", borderRadius: 24, overflow: "hidden", aspectRatio: "4/5", border: "4px solid var(--color-bg)", boxShadow: "0 8px 20px -10px rgba(0,0,0,0.15)", transform: `rotate(${[-2, 1.5, -1, 2][i % 4]}deg)`, transition: "transform .35s ease, box-shadow .35s ease" }} className="photobooth-tile" data-testid={`photo-${i}`}>
                <img src={ph.src} alt={ph.caption} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)", color: "#fff", padding: "1.5rem 1rem 1rem", fontFamily: "var(--font-heading)", fontStyle: "italic", fontSize: ".9rem" }}>{ph.caption}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "5rem 0", background: "var(--color-mint)", textAlign: "center" }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <h2 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}>Help us help more like {dog.name} <em>find homes</em></h2>
          <p style={{ fontSize: "1.05rem", color: "rgba(31,41,55,0.7)", marginBottom: "2rem" }}>1% of every order is donated each month to a trusted pet rescue we believe in. Every purchase makes a difference.</p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/preview" className="btn btn-primary" data-testid="dog-cta-shop">Shop the Pack</Link>
            <Link to="/preview" className="btn btn-outline" data-testid="dog-cta-meet">Meet the Whole Pack</Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (min-width: 768px) {
          .dog-hero-grid-md { grid-template-columns: 1.1fr 1fr !important; gap: 4rem !important; }
          .photobooth-grid-md { grid-template-columns: repeat(4, 1fr) !important; gap: 1.5rem !important; }
        }
        .photobooth-tile:hover { transform: rotate(0) translateY(-6px) scale(1.03) !important; box-shadow: 0 20px 40px -15px rgba(0,0,0,0.25) !important; z-index: 2; }
      `}</style>
    </div>
  );
}
