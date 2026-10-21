# Friday Workshops 2026 — publication status

Updated 22 October 2026. Media uploaded and verified; ready for production deployment.

- Source: `/Volumes/WebsiteMedia/BachataExplosion/00_Incoming/berlin-bachata-festival-2026/friday-workshops`.
- 315 originals converted to 945 WebP variants (480, 960, 1600 pixels), 60.6 MiB total. Originals untouched.
- Exports: ignored `nas-media/Public/events/berlin-bachata-festival-2026-friday-workshops/` and matching manifest under `nas-media/Public/manifests/`.
- All 945 images plus manifest copied to the NAS's existing `BachataExplosion/Public/` and verified by SHA-256: 946/946 matched. Use copyfile, not copytree's default metadata preservation, for this SMB share.
- Gallery manifest is also in `src/data/friday-workshops-2026.json`, sorted numerically by original filename.
- Page: `/bbf-2026/friday-workshops-2026/`. Responsive uncropped masonry, srcset, lazy loading, dialog photo viewer with keyboard navigation.
- Retired the old venue, schedule, competition, passes, travel and FAQ sections from BBF 2026 and added the gallery link. Preserved the latest 2027 homepage, global ticket promotion and Code of Conduct updates from origin/main (`2b15b2b`).
- Production build and internal-link audit pass. Browser verified 315 items, loaded images, next/close viewer actions, and no horizontal overflow at 390px and 1440px.

## Media hosting

The public media hostname is backed by Cloudflare R2 bucket `bachata-explosion-media`, not directly by the NAS. Uploaded all 945 WebPs and the manifest through the existing signed-in Cloudflare dashboard. All 945 public image URLs returned HTTP 200 with matching file sizes. No DNS or access-control changes were needed.

Cloudflare dashboard permits at most 100 files per upload; used ten folder batches preserving the event/width paths. Originals and optimized backup remain on UGREEN.

## Validation and deployment

A fresh production build and internal-link audit passed after upload. Source and build use `https://media.bachataexplosion.com`; there are no local preview image paths in the production build. Production is deployed by the existing GitHub main → Cloudflare Workers pipeline.

The unrelated, pre-existing untracked `public/media/motion/explosion-particles.mov` was left untouched and is not part of the commit. No gallery binaries were committed to Git.
