# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Current Prototype Decisions

- The selected visual source is homepage concept 3: Modular OEM Systems.
- Implement the local prototype with Next.js App Router under `src/app`.
- Use the real product images supplied in `D:\ZT`; do not invent products, customer logos, certifications, contact details, or factory imagery.
- Keep the homepage conversion path centered on Build Your Solution, Get a Quote, and the RFQ form.
- The deliverable is a real local website, not a rasterized long-image page. Every visible navigation item, product/application card, FAQ control, CTA, and RFQ control should respond to clicks.
- The desktop header should use a premium centered mega menu with a frosted-glass treatment; preserve a compact, usable expandable version on mobile.
- Provide a dedicated `/inquiry` B2B RFQ page using the same industrial visual system. Name, email, and international phone are required; optional fields stay optional. Submissions must be validated in the browser and on the server, protected by a honeypot, stored locally by default, and optionally forwarded to email or a webhook through environment configuration.
- Provide a professional single-article blog template with an article-top quick table of contents and a right rail that combines a personal-IP introduction with a compact inquiry form. Keep the full right rail sticky on desktop so it follows reading progress, and collapse it into the article flow on smaller screens.
- Keep the contact/inquiry page grounded with a premium OpenStreetMap location section that displays the supplied USA office address, provides a live interactive map, and links out to OpenStreetMap.
- Use the selected Product Design direction 2, Engineering Breakdown, as the visual source for the product-detail template. Preserve the evidence-led B2B structure: interactive gallery, verified specifications, compatibility review, kit components, technical resources, related systems, and a prominent engineering-quote path instead of consumer checkout.
- Route both homepage Fish Finder Mounts entrances to `/products/fish-finder-mounts`. The collection uses 36 locally stored catalog products and 251 local images, with clickable product cards and dynamic detail routes.
- Keep catalog and dynamic product-detail pages quotation-led: never display prices, Add to cart, Buy with Shop, or other consumer checkout controls. Use compatibility review and engineering RFQ actions instead.
- Route the Transducer Pole Mounts product card and mega-menu entry to `/products/transducer-pole-systems`, backed by 23 localized products and 157 localized source images with dynamic detail pages.
- Use one top-level `PRODUCTS` mega-menu trigger. Remove the former standalone PRODUCTS navigation link and rename the former SYSTEMS trigger to PRODUCTS while preserving hover and mobile-toggle behavior.
- Add `Industrial & Agricultural Mounts` and `Accessories` to both the homepage systems grid and PRODUCTS mega menu. Back them with 10 products / 55 localized images and 28 products / 181 localized images respectively, including dynamic detail pages and B2B quotation flows without prices or checkout.
- Keep a fourth global floating action below Email labeled `Download Catalog`. Until a catalog file is supplied, route it to the catalog-request inquiry state so the control remains functional.
- Keep a magnifying-glass product finder immediately after `ABOUT US` in the main navigation. It should open the VELPAW black/yellow search dialog, support both keyword/model search and guided catalog filtering, and return clickable local product-detail results without prices or checkout controls.
- Provide a lightweight `/admin` content backend with credential login, category management, product CRUD, multi-image upload and draft/published status. Keep admin code isolated from public routes, store local development content in SQLite under `.data`, preserve seeded category URLs, and do not add articles, orders, plugins or consumer-commerce features.
