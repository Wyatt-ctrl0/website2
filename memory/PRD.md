# Molly & Sophie — Shopify Theme

## Original Problem Statement
Build a Shopify drop-shipping theme (delivered as ZIP) for a pet store at mollyandsophie.com inspired by three rescue dogs (Jack, Sophie, Molly). Warm/friendly home vibe, Petco/PetSmart inspired aesthetic. Required features: welcome promo popup (10% off over $50), free-shipping bar at $50 in cart drawer, promo code field in cart, contact page (support@mollyandsophie.com, (570) 671-1534), about page, thank-you page after order (highlights 1% donation to humanepa.org), footer links (returns/shipping/order lookup/help/contact), Klaviyo-ready email signup, social links (IG @shopmollyandsophie, FB mollyandsophie, TikTok mollyandsophie.com).

## User Choices
- Output format: **Shopify theme as importable ZIP** (not React app)
- Free shipping threshold: **$50**
- Welcome popup: **10% off, orders over $50** (code: `WELCOME10`)
- Checkout: **Mocked / Shopify-powered** (no Stripe needed in theme)
- Email: **Klaviyo via Shopify app** (theme has signup form ready)

## Architecture
- **`/app/shopify-theme/molly-and-sophie/`** — The actual Shopify Liquid theme (43 files)
  - `layout/theme.liquid` — Master layout
  - `templates/` — index.json, product.json, collection.json, cart.json, page.about.json, page.contact.json, page.thank-you.json, 404.liquid, search.liquid, customers/*
  - `sections/` — header, footer, hero, our-rescues, donation-banner, newsletter, featured-categories, featured-collection, testimonials, main-product, main-collection, main-cart, main-page, main-about, main-contact, main-thank-you, header-group.json, footer-group.json
  - `snippets/` — product-card, cart-drawer (with free-shipping bar + promo code), promo-popup, meta-tags
  - `assets/` — theme.css (~16KB), theme.js (~9KB)
  - `config/` — settings_schema.json (theme customizer), settings_data.json (defaults)
  - `locales/en.default.json`
- **`/app/backend/server.py`** (FastAPI):
  - `GET /api/theme/info` — returns theme metadata
  - `GET /api/theme/download` — serves the ZIP file
  - `POST /api/theme/rebuild` — rebuild ZIP from source
  - `POST /api/contact` — saves contact form submissions to MongoDB
  - `POST /api/newsletter` — saves newsletter signups to MongoDB
- **`/app/frontend/src/`** (React):
  - `pages/LandingPage.jsx` — Marketing/download page with theme info, features, install steps
  - `pages/ThemePreview.jsx` — Live HTML simulation of the Shopify storefront

## Tasks Done (May 7, 2026 — Conversion Pack Update)
- ✅ Fixed "Show all" button breaking the products grid (IntersectionObserver re-observes new cards on filter change; stable slug keys)
- ✅ Star ratings + review counts on every product card (homepage + PDP)
- ✅ Trust strip under hero (Free shipping / 30-day returns / 1% to rescues / Secure checkout)
- ✅ Donation Impact Counter section with 4 live stats ($4,287 donated, 12 rescues, 8,341 orders, 100% receipts) + CTA to IG receipts
- ✅ FAQ accordion section (6 prefilled Q&A) + email-support fallback
- ✅ Instagram UGC strip (6 tiles, hover overlay, link to profile)
- ✅ Stock urgency banner on PDP ("Only X left — selling fast") for stock ≤ 10
- ✅ "Frequently Bought Together" pack bundle on PDP with 5% bundle discount + savings badge
- ✅ Reviews section on PDP with 5-star average, distribution bars, 3 verified review cards
- ✅ Sticky mobile add-to-cart bar on PDP (visible on viewports < 768px)
- ✅ Custom 404 page with paw-print mascot and routes back to home / shop
- ✅ Mirrored all four homepage upgrades into the Shopify theme as proper sections with `{% schema %}` (theme customizer-editable):
  - `sections/trust-strip.liquid`
  - `sections/donation-impact.liquid`
  - `sections/faq.liquid`
  - `sections/instagram-feed.liquid`
- ✅ Updated `templates/index.json` order: Hero → Trust Strip → Categories → Featured → Rescues → Donation Impact → Testimonials → FAQ → Instagram

## Tasks Done (May 7, 2026)
- ✅ Built complete Shopify theme structure (Liquid + JSON + CSS + JS, 43 files)
- ✅ Brand colors derived from logo: coral `#E8765A`, teal `#5FB4B8`, navy `#1F2937`, cream `#F5EBD8`, mint `#B5D6CD`
- ✅ Welcome promo popup (data-testid: promo-popup) with `WELCOME10` code, copy button
- ✅ Cart drawer with live free-shipping progress bar ($50 threshold) and promo code field (4 valid codes: WELCOME10, PETS15, FREESHIP, RESCUE20)
- ✅ "Meet The Pack" rescues section pre-loaded with Jack/Sophie/Molly photos and bios
- ✅ 1% donation banner linking to humanepa.org
- ✅ Custom Thank You page highlighting the 1% rescue donation
- ✅ Contact page with support@mollyandsophie.com and (570) 671-1534
- ✅ About page with pre-written rescue origin story
- ✅ Footer with Returns / Shipping Info / Order Lookup / Help / Contact + social links (Instagram, Facebook, TikTok)
- ✅ Klaviyo-ready newsletter signup with required disclaimer text
- ✅ FastAPI ZIP download endpoint and rebuild logic
- ✅ React landing page with hero, features, install steps, download CTA
- ✅ React `/preview` route — fully interactive HTML simulation of the storefront (cart, popup, free-shipping bar all functional)
- ✅ Bug fixes: clipboard catch in /preview, newsletter form wired to /api/newsletter, real social links

## What's Implemented
| Feature | Where | Status |
|---|---|---|
| Welcome popup (10% off >$50) | snippets/promo-popup.liquid + assets/theme.js | ✅ |
| Free shipping bar at $50 | snippets/cart-drawer.liquid + theme.js | ✅ |
| Promo code field in cart | snippets/cart-drawer.liquid + theme.js | ✅ |
| Contact page (email + phone) | sections/main-contact.liquid + templates/page.contact.json | ✅ |
| About page (3 rescues story) | sections/main-about.liquid | ✅ |
| Thank You page | sections/main-thank-you.liquid | ✅ |
| Footer links + Klaviyo signup | sections/footer.liquid + sections/newsletter.liquid | ✅ |
| Social links (IG/FB/TT) | sections/footer.liquid | ✅ |
| Theme customizer | config/settings_schema.json | ✅ |
| Sample products (placeholders when no Shopify data) | sections/featured-collection.liquid | ✅ |

## Next Action Items
- **P1 — Logo upload**: User uploads PNG of the Molly & Sophie logo to Shopify Admin → Online Store → Themes → Customize → Theme Settings → Branding (currently uses a colored text fallback)
- **P1 — Discount codes**: Create matching Shopify discount codes (`WELCOME10`, `PETS15`, `FREESHIP`, `RESCUE20`) in Shopify → Discounts
- **P2 — Klaviyo integration**: Replace native Shopify customer signup with the Klaviyo embed code in `sections/newsletter.liquid`
- **P2 — Order Status redirect**: Settings → Checkout → add link to `/pages/thank-you` after purchase
- **P2 — Real product imagery**: Add actual product photos to Shopify products (theme falls back to emoji placeholders)
- **P3 — Custom domain**: Connect mollyandsophie.com in Shopify → Domains
- **P3 — Additional sections**: Could add a "blog" template, "FAQ" page, "Gift cards" support

## Backlog
- Wishlist functionality (P3)
- Multi-language support (already structured via locales/en.default.json) (P3)
- Subscription products (P3)
- Loyalty program (P3)
