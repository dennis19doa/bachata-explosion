# Friday Party 2026 — gallery publication checklist

The new site route is `/bbf-2026/friday-party-2026/`. It follows the Friday Workshops 2026 design, including responsive uncropped photos and a full-screen keyboard-accessible viewer.

**Status (3 November 2026):** Website code is prepared on a feature branch. The NAS folder contents were not accessible to the ChatGPT session, so no photo inventory, Cloudflare R2 upload or live photo verification has taken place. Do not merge the page until gallery assets are online.

## Private source (preserve unchanged)

`/volume1/WebsiteMedia/BachataExplosion/00_Incoming/berlin-bachata-festival-2026/friday-party/WEBP`

## Prepare gallery files on a NAS-connected computer

Run from the website repository, with Python and Pillow installed. Use the corresponding mounted path if on macOS.

```bash
python3 -m pip install -r scripts/media/requirements.txt
python3 scripts/media/prepare_gallery.py \
  --source "/volume1/WebsiteMedia/BachataExplosion/00_Incoming/berlin-bachata-festival-2026/friday-party/WEBP" \
  --nas-root "/volume1/WebsiteMedia/BachataExplosion" \
  --event "berlin-bachata-festival-2026-friday-party" \
  --title "Friday Party 2026 — Berlin Bachata Festival"
```

The script creates these files under `BachataExplosion/Public/`:

- `events/berlin-bachata-festival-2026-friday-party/480/*.webp`
- `events/berlin-bachata-festival-2026-friday-party/960/*.webp`
- `events/berlin-bachata-festival-2026-friday-party/1600/*.webp`
- `manifests/berlin-bachata-festival-2026-friday-party.json`

The generator creates responsive WebP derivatives, removes embedded EXIF/GPS data, skips exact duplicates and naturally sorts numbered filenames. It does not modify incoming originals.

## Upload to Cloudflare R2

The public hostname `https://media.bachataexplosion.com` is backed by R2 bucket `bachata-explosion-media`, not the local NAS. Upload the generated `events/...` folder tree and the manifest to their matching R2 keys; preserve relative paths. The Cloudflare dashboard may require batches of at most 100 files.

Check the following before merging:

1. `https://media.bachataexplosion.com/manifests/berlin-bachata-festival-2026-friday-party.json` is publicly readable.
2. Manifest count matches the approved photo inventory; image variants return HTTP 200.
3. The R2 manifest allows cross-origin GET from `https://bachataexplosion.com` (configure R2 CORS if necessary).
4. Portrait and landscape photos retain their proportions, and only approved images are present.

## Deploy and verify

After the media upload, merge this PR into `main` and let the existing GitHub-to-Cloudflare Workers pipeline deploy. Check the photo count, first/middle/last photos, gallery loading, next/previous/close controls, mobile layout and links from the festival page and site navigation. The target is `https://bachataexplosion.com/bbf-2026/friday-party-2026/`.
