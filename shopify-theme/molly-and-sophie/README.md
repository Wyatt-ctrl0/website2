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

## Setup After Install

1. **Customize → Theme settings**
   - Upload your **logo** (PNG of the Molly & Sophie wordmark) under "Branding"
   - Upload **favicon**
   - Verify **brand colors** match your logo
   - Set **free shipping threshold** (default: $50)
   - Enable/disable the **welcome promo popup** + customize text/code
   - Add your **Instagram / Facebook / TikTok** URLs

2. **Pages** — Create these pages in Shopify (Online Store → Pages):
   - `about` (uses About template)
   - `contact` (uses Contact template)
   - `thank-you` (uses Thank You template — link this from your Order Status page)
   - `returns`, `shipping-info`, `order-lookup`, `help` (regular pages)

3. **Discounts** — Create matching discount codes in Shopify (Discounts → Create):
   - `WELCOME10` — 10% off, minimum order $50
   - `PETS15`, `FREESHIP`, `RESCUE20` (optional)

4. **Klaviyo** — In Theme Settings or via the Klaviyo Shopify app, replace the newsletter form with your Klaviyo signup embed.

5. **Order Status Page** — Go to **Settings → Checkout → Order status page** and add a redirect/link to `/pages/thank-you` after successful purchase.

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
