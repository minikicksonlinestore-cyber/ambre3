# AMBRE — Sculpting Shorts Landing Page

A single product landing page for the AMBRE High-Waist Sculpting Shorts, built as
plain HTML/CSS/JS — no build step, no framework, no dependencies.

## Project structure

```
ambre-landing/
├── index.html              Main page
├── css/
│   └── style.css           All styles
├── js/
│   └── script.js           All interactivity (selectors, countdown, reviews, admin)
├── assets/
│   └── images/
│       └── product-front.jpg   Product photo (reused via CSS crops across the page)
└── README.md
```

## Deploying on Vercel

1. Push this folder to a GitHub repository (keep the folder structure as-is —
   don't flatten it).
2. In Vercel, "Add New Project" → import the repo.
3. Framework preset: **Other** (or leave it on auto-detect — Vercel will treat
   this as a static site since there's no `package.json`).
4. Leave build command and output directory blank. Deploy.

No environment variables or build configuration are required. `index.html` at
the project root is served directly.

## Editing the basics

- **WhatsApp number**: search `js/script.js` for `919061082040` and replace it
  (keep the country code, no `+` or spaces).
- **Price / pack pricing**: in `index.html`, look for the `.pack-btn` buttons
  (`data-price`, `data-compare`, `data-qty`) and the matching `selectedPack`
  default in `js/script.js`.
- **Stock count**: `STOCK_LEFT` / `STOCK_TOTAL` near the top of the "URGENCY"
  section in `js/script.js`.
- **Admin passcode**: search `js/script.js` for `ambre349` and change it.
- **Product photo**: replace `assets/images/product-front.jpg` with your own
  image (same filename, or update the four `<img src="...">` references in
  `index.html`).

## ⚠️ Important: the reviews & admin system on Vercel

The review submission, approval workflow, and admin panel were originally
built using Claude.ai's built-in artifact storage (`window.storage`), which
only exists inside Claude's own preview environment.

**This project automatically falls back to the browser's `localStorage`**
when `window.storage` isn't available — which will always be the case once
this is deployed on Vercel. That means it will run without errors, but with
one real limitation:

> **Reviews submitted by a customer are saved only in that customer's own
> browser.** They are not shared with other visitors, and you (the site
> owner) won't see them from a different device. The admin panel
> (`?admin=1`) will only show reviews submitted from that same browser.

This is fine for demoing the page or for a short-term soft launch, but it is
**not a real shared review system** once live. If you want genuine
cross-visitor reviews (customer submits on their phone, you approve it, it
shows to everyone), you'll need a small real backend — for example a
Supabase project with a `reviews` table and a couple of API routes, similar
to the storefront/admin setup already built for your "poured." project. Happy
to help wire that up when you're ready — it's a relatively small change since
the approve/reject UI and logic here are already built, they'd just point at
a real database instead of `localStorage`.

## Fonts

The page loads **Fraunces** and **Archivo** from Google Fonts via a CDN
`<link>` in `index.html`. This requires the visitor to have internet access
(normal for a live site) — no font files are bundled locally.

## Browser support

Built and tested against current Chrome. Uses standard CSS Grid, Flexbox, and
Pointer Events — all well-supported in current Chrome, Safari, Firefox, and
Edge.
