# Bachata Explosion — Cloudflare Workers cutover

Updated: 29 August 2026

## Target architecture

```text
GitHub: dennis19doa/bachata-explosion
        │
        ├─ main -> production build
        └─ feature branches -> preview builds
                     │
                     v
Cloudflare Workers Static Assets
        │
        ├─ bachataexplosion.com
        └─ www.bachataexplosion.com -> canonical domain

media.bachataexplosion.com
        └─ Cloudflare Tunnel -> read-only UGREEN NAS public gallery

Mail
        └─ Zoho Mail (independent of website hosting)
```

The live IONOS WordPress installation remains untouched until the new site, mail and forms have passed the launch checklist.

## Repository configuration

The Astro production command is:

```bash
pnpm build
```

This repository's build pipeline moves the final browser assets into:

```text
dist/client/
```

`wrangler.jsonc` therefore points Workers Static Assets at `./dist/client/`.

The Worker configuration also uses:

- `not_found_handling: "404-page"`
- `html_handling: "auto-trailing-slash"`

A real case-sensitive `/BBF-2026/` compatibility copy is generated because preserved WordPress pages historically linked to that uppercase URL.

## Cloudflare dashboard setup

1. Add `bachataexplosion.com` to the correct Cloudflare account/zone if it is not already there.
2. Go to **Workers & Pages** -> **Create application** -> **Import a repository**.
3. Connect GitHub and select `dennis19doa/bachata-explosion`.
4. Use `main` as the production branch.
5. Enable builds for non-production branches so pull requests receive Worker preview deployments.
6. Build command: `pnpm build`.
7. Deploy command: `npx wrangler deploy`.
8. Leave the root directory at the repository root.
9. Add the public form variables listed in `.env.example` to the build environment. They are endpoint URLs, never email-provider passwords or API secrets.
10. Deploy first to the generated `workers.dev` URL and verify the site before attaching the domain.

Cloudflare Workers Builds uses `npx wrangler deploy` as its default production deploy command and `npx wrangler versions upload` for preview builds. Non-production branch builds provide isolated previews without promoting them to the active production deployment.

## Required build variables

```text
PUBLIC_ARCHIVE_MEDIA_ORIGIN
PUBLIC_CONTACT_FORM_ENDPOINT
PUBLIC_TICKETS_FORM_ENDPOINT
PUBLIC_GROUPS_FORM_ENDPOINT
PUBLIC_PARTNERS_FORM_ENDPOINT
PUBLIC_MEDIA_FORM_ENDPOINT
PUBLIC_VOLUNTEER_FORM_ENDPOINT
PUBLIC_AMBASSADOR_FORM_ENDPOINT
PUBLIC_JJ_FORM_ENDPOINT
PUBLIC_NEWSLETTER_FORM_ENDPOINT
```

Topic-specific contact endpoints may remain empty at first; they fall back to `PUBLIC_CONTACT_FORM_ENDPOINT`. Jack & Jill deliberately does not fall back because its photo upload needs an upload-compatible endpoint.

## Custom domain cutover

Do not point the production domain at the Worker until the Worker preview has passed:

- desktop homepage and BBF 2026 review
- mobile navigation and sticky ticket action
- contact-topic routing
- volunteer and ambassador form submissions
- newsletter double opt-in
- Jack & Jill upload flow, or an explicitly disabled/preview registration state
- legal/privacy content matching the selected providers
- redirects and legacy URL checks
- archive fallback with NAS offline

When ready:

1. Attach `bachataexplosion.com` to the Worker as a Cloudflare Custom Domain.
2. Configure `www.bachataexplosion.com` to redirect to the canonical domain.
3. Keep all Zoho MX/SPF/DKIM/DMARC records intact; the website host change must not alter mail delivery.
4. Verify the apex and `www` versions over HTTPS from phone and desktop.
5. Keep IONOS hosting available during a rollback window.
6. Cancel WordPress/hosting only after traffic, forms and redirects remain healthy.

## Cloudflare versus IONOS responsibilities after cutover

| Responsibility | New owner |
| --- | --- |
| Website source | GitHub |
| Website builds/deployment | Cloudflare Workers Builds |
| DNS / HTTPS | Cloudflare |
| Business email | Zoho Mail |
| Standard contact/application forms | Formspark or selected protected form provider |
| Newsletter | dedicated double-opt-in newsletter provider |
| Historical full-resolution gallery serving | UGREEN NAS through Cloudflare Tunnel |
| WordPress/Elementor | retired after verification |

## Rollback

If a production issue is discovered after DNS/domain cutover, restore the previous Cloudflare Worker deployment or temporarily route the site back to the existing IONOS origin. Do not delete the verified WordPress recovery copy or the IONOS service until the new stack is proven stable.
