# UGREEN media transition runbook

## Target

The Bachata Explosion website remains a lightweight static site. Full galleries are stored outside GitHub and served from a read-only public folder on the UGREEN NAS.

```text
bachataexplosion.com/archive/{event}/
  → https://media.bachataexplosion.com/manifests/{event}.json
  → https://media.bachataexplosion.com/events/{event}/{width}/{image}.webp
  → Cloudflare Tunnel
  → UGREEN/BachataExplosion/Public/
```

## Local and NAS folders

```text
BachataExplosion/
  00_Incoming/       photographer deliveries and migration staging
  01_Masters/        retained originals, never public
  02_WebExports/     working responsive derivatives
  03_Manifests/      working metadata
  Public/
    manifests/       public JSON manifests
    events/          public WebP gallery images
  99_Quarantine/     damaged, unexpected or unapproved files
```

Only `Public/` is served over HTTP. NAS administration, SMB, SSH, originals, backups and form uploads are not exposed.

## Migration phases

1. Finish the IONOS transfer and verify all archive files against their expected sizes.
2. Test every ZIP, generate SHA-256 checksums and preserve the untouched backup set.
3. Extract uploads into a private staging folder and inventory images by WordPress year/month and event reference.
4. Move approved originals into `01_Masters/{year}/{event}/` without changing the backup set.
5. Run `scripts/media/prepare_gallery.py` for one pilot event.
6. Review the pilot for orientation, quality, credits, mobile size and private content.
7. Configure a read-only NAS web service for `Public/` and allow manifest requests from `https://bachataexplosion.com`.
8. Route `media.bachataexplosion.com` through Cloudflare Tunnel to that read-only service.
9. Set `PUBLIC_ARCHIVE_MEDIA_ORIGIN=https://media.bachataexplosion.com` for the deployed website.
10. Test the pilot, then publish the remaining events in batches.

## Gallery preparation

The preparation tool:

- accepts only common image formats;
- removes embedded EXIF/GPS metadata from public derivatives;
- creates WebP versions up to 480, 960 and 1,600 pixels wide;
- avoids upscaling small images;
- skips exact duplicate source files;
- generates the JSON manifest already consumed by the archive page;
- does not delete or modify originals.

Example:

```bash
python3 scripts/media/prepare_gallery.py \
  --source "/private/path/to/approved-event" \
  --nas-root "/private/path/to/BachataExplosion" \
  --event "role-rotation-2026" \
  --title "Role Rotation" \
  --credit "Photographer name"
```

## Three-site separation

Use one tunnel but separate read-only roots and media hostnames:

```text
media.bachataexplosion.com → UGREEN/BachataExplosion/Public/
media.elitedancestudio.de  → UGREEN/EliteDanceStudio/Public/
media.third-site.example   → UGREEN/ThirdSite/Public/
```

No manifest may reference files outside its own media hostname. GitHub contains only site code, small covers and configuration—not the historical galleries.

## Required NAS information

Before connecting the actual server, record:

- exact UGREEN model and UGOS version;
- local NAS address and whether Docker is available;
- usable storage and RAID layout;
- backup destination outside the NAS;
- whether the domains already use Cloudflare DNS.

## NAS inventory — 24 August 2026

- Device: UGREEN DH2300 running UGOS Pro 1.17.0.0095
- CPU / memory: RK3576, 8 cores, 4 GB RAM
- Network: 1 Gbps LAN
- Primary storage: one 3.5 TB ext4 volume on a Basic pool, approximately 2.3 TB available
- Secondary disk: approximately 465.7 GB, shown as external storage
- Shared media root created: `WebsiteMedia/BachataExplosion/`
- Bachata Explosion private/public subfolder structure created
- SMB enabled for local-network migration access
- Restricted standard migration user created with read/write access only to `WebsiteMedia`, no personal folder and no access to other shares
- Verified dated recovery copy stored at `BachataExplosion/00_Incoming/ionos-2026-08-23/`
- All 118 historical media archives and all supporting recovery files passed independent local-to-NAS SHA-256 comparisons
- Complete live WordPress rescue stored as the checksum-verified `02-webspace/current-site-complete.tar.gz`
- Transfer and checksum manifests stored in `00-manifests/` inside the dated recovery copy
- No internet-facing gallery service enabled yet

The primary pool currently has no RAID redundancy. It has ample capacity for the current archive, but the untouched IONOS export must remain on a separate disk until an independent NAS backup has been created and tested. RAID would still not replace that backup.

The temporary migration user should be disabled or removed after the owner confirms that no further Mac-to-NAS migration sessions are needed. Do not expose SMB or the NAS administration interface to the internet.
