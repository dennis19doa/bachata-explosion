# IONOS design-asset recovery inventory

Date: 24 August 2026

## Outcome

The IONOS recovery is complete enough to rebuild the visual identity without relying on the live WordPress installation. The untouched source archive remains the recovery source of truth; a small design-review set has been extracted locally but has not been copied into the public website.

The full recovery contains:

- 118 tested WordPress/Updraft upload archives;
- 47,526,450,764 bytes of historical uploads;
- 101,510 archive entries, including 100,959 image entries;
- the current WordPress database and Elementor template data;
- post-backup uploads and a complete current-site rescue archive;
- exact local-to-NAS hash verification of the recovery set.

The private recovery is also stored on the UGREEN NAS at `WebsiteMedia/BachataExplosion/00_Incoming/ionos-2026-08-23/`.

## Original global header recovered

The database contains the original Elementor template named **Explosion Header**. Its desktop presentation was:

1. black base layer;
2. a ten-second orange/gold particle video;
3. a dark poster image while the video loads or cannot play;
4. the framed Explosion logo;
5. the original multi-level menu and gold ticket action;
6. dark overlays to keep the navigation readable.

This confirms that motion, warm gold, black and the framed logo are part of the established identity. They should be refined, not replaced by an unrelated minimalist theme.

## Recovered core assets

| Asset | Technical details | Original role | Assessment |
| --- | --- | --- | --- |
| `Explosion-Background-UP.mp4` | 13,648,755 bytes; 1758×1080; 10.07 s; approximately 10.8 Mbps | Elementor header background | Best source for the signature orange/gold motion. Too heavy in its current form for a global header on every route. |
| `background-video.mp4` | 9,814,207 bytes; 1758×1080; 10.07 s; approximately 7.8 Mbps | Earlier background-video version | Visually similar and smaller, useful as a comparison source. Still needs web optimization. |
| `freepik_assistant_1753224542635.mp4` | 45,225,536 bytes; 1836×1128; 10.04 s; approximately 36 Mbps | Original particle-animation source | Master-quality source, not suitable for direct delivery to visitors. Retain privately. |
| `Screenshot-2025-08-23-123906.webp` | 144,732 bytes; 1671×870 | Header fallback/poster | Good resilient fallback and reduced-motion image. |
| `Explosion_LOGO_Revised_FrameBackground-copy.webp` | 70,656 bytes; 2407×1274; alpha channel | Framed header logo | Strong identity asset. Retain; prepare smaller responsive variants later. |
| `12251.mp4` | 49,974,342 bytes; 1280×720; 107.03 s; approximately 3.7 Mbps | BBF 2026 MOA venue video | Valuable venue proof, but it should be click-to-play or loaded only on the BBF page. |
| `12251-1.mp4` | Same dimensions, duration, size and SHA-256 as `12251.mp4` | Duplicate BBF venue upload | One public copy is enough; retain both only in the untouched recovery archive. |

The review copies live in the ignored private staging folder `migration/assets-from-ionos/`. They are deliberately outside `public/` and will not be uploaded to GitHub.

## Current event artwork recovered

Representative event-defining assets were also staged:

- Berlin Bachata Festival 2026 main poster, 2048×2560;
- Role Rotation 2026 main poster, 1200×1500;
- Elite Dance #3 main poster, 1080×1350;
- Elite Dance weekend/J&J variant, 1080×1350;
- Elite Dance schedule poster, 1080×1350;
- MOA Berlin venue photograph, 531×454.

These reveal three related but distinct visual families:

- **Berlin Bachata Festival:** fire, gold, deep red, monumental Berlin imagery;
- **Role Rotation:** electric pink, violet, cyan and a more playful club character;
- **Elite Dance editions:** pink/blue paint, Berlin landmarks and a more intimate local-event tone.

The future website should use one shared structural system while letting each event family keep its own accent palette.

## Page-to-asset matching

The WordPress public-page export contains 85 pages. The most important current pages already point to recoverable assets:

| Content area | Recovered media pattern |
| --- | --- |
| Home | current BBF, Role Rotation and Elite posters plus real community/event photos |
| BBF 2026 | main poster, 20+ artist/DJ posters, MOA venue images, venue video and schedule artwork |
| Role Rotation 2026 | main poster, artist-pair posters, schedule, venue images and social-dance photography |
| Elite Dance #3 | main poster, schedule, artist posters and the event competition variant |
| History and Past Events | representative cover images across editions from 2022 onward |
| Photo pages | the complete event/day/session gallery references preserved in the page export |

The page export currently preserves 12,061 public-page media references. The historical originals and WordPress derivatives remain inside the verified archive while albums are curated for the NAS.

## Missing or obsolete references

The WordPress database also contains references to `Explosion-Video.mp4` and `12253.mp4`, but neither filename exists in the verified 118-part upload archive. These appear to be obsolete or removed WordPress references rather than required unique sources:

- `Explosion-Background-UP.mp4`, `background-video.mp4` and their fallback image preserve the header effect;
- `12251.mp4` preserves the active BBF venue-video content.

Nothing should be deleted from the recovery set based on this finding. The two unresolved names should simply remain marked as historical/orphaned references.

## Public-asset rule

When a design is approved:

- small logos, icons, posters and one event cover may be optimized into the website repository;
- the short header loop may live with the site only if the optimized result is small enough;
- the 107-second venue video and full galleries should be served through `media.bachataexplosion.com` from the NAS;
- originals, backups, form uploads and photographer deliveries must never be public;
- form attachments are private personal data and are intentionally excluded from this design inventory.
