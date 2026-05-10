# Molly & Sophie — Shopify Theme

A warm, family-friendly Shopify theme built for the Molly & Sophie pet drop-shipping store.

## What's Included

- **Beautiful homepage** — Hero, featured categories, featured products, "Meet the Pack" rescues section, donation banner, testimonials, newsletter
- **Welcome promo popup** — Auto-shows on first visit with a customizable promo code (default: WELCOME10)
- **Cart drawer with free-shipping bar** — Live progress toward $50 free shipping threshold
- **Promo code field in cart** — Try `WELCOME10`, `PETS15`, `FREESHIP`, or `RESCUE20`
- **Custom Thank You page** — Highlights the 1% donation to pet rescues after a successful order
- **Contact page** — With email, phone, and a contact form
- **About page** — Pre-written story about the three rescues
- **Product & collection pages** — With variants, gallery, and quick add
- **Footer** — Returns, Shipping Info, Order Lookup, Help, Contact, and social links (Instagram, Facebook, TikTok)
- **Klaviyo-ready newsletter form** — Drop in your Klaviyo embed or use Shopify's native customer signup

## Brand Colors (from logo)

- **Coral / Primary**: `#E8765A`
- **Teal / Secondary**: `#5FB4B8`
- **Navy / Accent**: `#1F2937`
- **Cream**: `#F5EBD8`
- **Mint**: `#B5D6CD`
- **Background**: `#FDF8EE`

All editable in **Online Store → Themes → Customize → Theme Settings → Brand Colors**.

## How to Install

1. **Download** this folder as a `.zip` (the entire `molly-and-sophie` folder)
2. Log in to your Shopify admin
3. Go to **Online Store → Themes**
4. Click **"Add theme" → "Upload zip file"**
5. Upload this zip and click **"Publish"** when ready

> ⚠️ **If `Preview` looks broken right after upload**, that's expected — Shopify renders the theme using YOUR store's data, and a fresh import has no products, no pages, and no theme settings configured yet. Walk through the **Setup After Install** checklist below; pieces like the wishlist tab, the Contact tab in the footer, and "How It Works" links only resolve once their corresponding Shopify pages exist.

## Setup After Install

1. **Customize → Theme settings**
   - Upload your **logo** (PNG of the Molly & Sophie wordmark) under "Branding"
   - Upload **favicon**
   - Verify **brand colors** match your logo
   - Set **free shipping threshold** (default: $50)
   - Enable/disable the **welcome promo popup** + customize text/code
   - Add your **Instagram / Facebook / TikTok** URLs

2. **Pages** — Create these in Shopify (Online Store → Pages → Add page). For each one, set the **Theme template** field on the right side of the editor to the matching template:

   | Page handle | Template to assign | What it powers |
   |---|---|---|
   | `about` | `page.about` | Header "Our Story" link, footer "Our Story" link |
   | `contact` | `page.contact` | Header **Contact** link, footer **Contact Us** link |
   | `thank-you` | `page.thank-you` | Custom thank-you page after checkout |
   | `wishlist` | `page.wishlist` | The **Wishlist** tab in the header — without this page the icon's link 404s |
   | `jack` / `sophie` / `molly` | `page.jack` / `page.sophie` / `page.molly` | "Read [name]'s story" links from Meet the Pack |
   | `giving-back` | (default) | The **"How It Works"** button on the homepage Donation Banner |
   | `returns` / `shipping-info` / `order-lookup` / `help` | (default) | Footer Customer Care links |

   Page handle = the URL slug. Title can be whatever you want; Shopify derives the handle from the title automatically.

3. **Discounts** — Create matching discount codes in Shopify (Discounts → Create):
   - `WELCOME10` — 10% off, minimum order $50
   - `PETS15`, `FREESHIP`, `RESCUE20` (optional)

4. **Klaviyo** — In Theme Settings or via the Klaviyo Shopify app, replace the newsletter form with your Klaviyo signup embed.

5. **Order Status Page** — Go to **Settings → Checkout → Order status page** and add a redirect/link to `/pages/thank-you` after successful purchase.

6. **Sale prices** — To show a struck-through "compare-at" price + the **Save $X** pill on a product, set the **Compare-at price** field on the product variant (or set it on the product itself for single-variant products). The placeholder demo on a fresh store shows two products with sample compare-at prices so you can see the layout.

## Troubleshooting

- **"Wishlist" icon in the header takes me to a 404.** Create a page with handle `wishlist` and assign the `page.wishlist` template (see step 2 above). The wishlist itself works without this page — it persists in the visitor's browser via localStorage — but the dedicated Wishlist *page* needs the page to exist.
- **"Contact" link goes to a 404.** Create a page with handle `contact` and assign the `page.contact` template.
- **"How It Works" button goes to a 404.** Create a page with handle `giving-back` (any plain Shopify page is fine — explain how the 1% donation works in your own words).
- **No sale prices showing.** Set a **Compare-at price** on at least one product variant; the theme will then render the struck-through original + Save pill automatically.
- **Header logo missing.** Either upload your logo in **Customize → Theme settings → Branding**, or rely on the bundled `assets/logo.png` fallback (which the theme uses out of the box).

## Theme Structure

```
molly-and-sophie/
├── assets/         theme.css, theme.js
├── config/         settings_schema.json, settings_data.json
├── layout/         theme.liquid
├── locales/        en.default.json
├── sections/       header, footer, hero, our-rescues, etc.
├── snippets/       product-card, cart-drawer, promo-popup
└── templates/      index, product, collection, cart, page.about, page.contact, page.thank-you, 404
```

## Support

Questions? Email **support@mollyandsophie.com** or call **(570) 671-1534**.

Made with 🐾 for Jack, Sophie, and Molly.
