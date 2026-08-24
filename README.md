# Bachata Explosion

The local-first rebuild of [bachataexplosion.com](https://bachataexplosion.com), replacing the current WordPress and Elementor installation with a small, fast Astro website.

![Bachata Explosion social preview](public/og.png)

## Current status

This repository contains the working preview—not the current production website. The existing WordPress site remains unchanged while content, forms, newsletter data, and historical galleries are migrated and verified.

The current build includes:

- a redesigned homepage focused on Berlin Bachata Festival 2026
- festival information, passes, schedule structure, FAQ, venue and competition sections
- a filterable archive covering 16 event collections from 2022–2026
- an internal detail route for every archived event
- a gallery loader prepared for a UGREEN NAS media source
- graceful gallery fallback when the NAS is offline or not connected
- provider-ready contact and newsletter forms that remain non-sending in preview mode
- a complete operating plan for domain email, forms, newsletter and NAS media
- contact, imprint, sitemap, redirects, social metadata and a custom 404 page
- preview-only form states until the final newsletter and form providers are selected

## Website routes

- `/` — homepage
- `/festival/` — Berlin Bachata Festival 2026
- `/archive/` — complete event archive index
- `/archive/{event}/` — individual collection pages
- `/contact/` — contact form preview
- `/imprint/` — legal imprint

## Archive architecture

The website repository deliberately contains only event covers and normal design assets. The thousands of historical photographs will not be committed to GitHub.

The planned production flow is:

```text
bachataexplosion.com/archive/{event}/
  ├── page design and event information → static website
  └── gallery manifest and photographs  → media.bachataexplosion.com
                                              └── Cloudflare Tunnel
                                                    └── read-only UGREEN NAS folder
```

Set `PUBLIC_ARCHIVE_MEDIA_ORIGIN` to the public, read-only media hostname when the NAS pilot is ready. See `.env.example`. Originals, uploads, private migration exports, database dumps, tunnel credentials, and NAS administration details must never be committed.

The implementation and migration decisions are documented in [`docs/email-forms-media-plan.md`](docs/email-forms-media-plan.md). The current IONOS export state and cutover safeguards are tracked in [`docs/ionos-migration-status.md`](docs/ionos-migration-status.md). The NAS publishing workflow is defined in [`docs/ugreen-transition-runbook.md`](docs/ugreen-transition-runbook.md).

## Local development

Requirements: Node.js 22+ and pnpm 10.

```bash
pnpm install
pnpm dev
```

The development site runs at `http://127.0.0.1:4322/`.

To create and verify a production build:

```bash
pnpm build
pnpm check:site
```

## Migration safety

Do not cancel IONOS or remove WordPress until all uploads, subscriber consent records, forms, registrations, domain email and historical albums are exported and verified. The domain currently still relies on IONOS for DNS and email routing.
