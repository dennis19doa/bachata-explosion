# IONOS migration status — 24 August 2026

This document records the migration state without storing passwords, subscriber data, form entries or private file links in the website repository.

## Secured locally and on the UGREEN NAS

- Current WordPress database export (112 MB)
- WordPress content, Elementor submission, Newsletter Plugin and WPForms table structures
- Verified restricted SFTP access to only the Bachata Explosion installation
- All 118 historical Updraft upload archives (47,526,450,764 bytes)
- Matching Updraft database, plugins, themes, must-use plugins and site-configuration packages, all archive-tested successfully
- Post-backup May and July 2026 uploads and the current Elementor form-upload folder
- Complete current WordPress core/plugin/theme rescue: 13,461 files, retained locally as a folder and on the NAS as the tested `current-site-complete.tar.gz` recovery archive

The media filenames and sizes match the live IONOS SFTP listing exactly. Every ZIP passed a full integrity test. Independent SHA-256 reads of the local and NAS copies match for all 118 archives, the complete current-site recovery archive, and the 105 supporting database/form/live-delta/system files.

The dated NAS copy lives at `WebsiteMedia/BachataExplosion/00_Incoming/ionos-2026-08-23/`. The partial small-file SMB experiment was moved to `BachataExplosion/99_Quarantine/` and is not part of the verified recovery set.

The private export lives outside this app repository in the workspace `exports/` directory, which is excluded from Git.

## Important discovery

The IONOS webspace contains roughly two copies of the historical media:

1. the current `wp-content/uploads` library; and
2. a complete Updraft backup dated 29 May 2026, split into approximately 118 media archives.

The Updraft set is the verified historical baseline. The post-backup live changes and current form-upload folders are retained separately. This preserves the archive without paying to place tens of gigabytes in GitHub or duplicating the same material unnecessarily.

The dated live-upload check found files added on 30 May and 20 July 2026. The June and August 2026 folders are empty. The complete May folder is being retained to make the backup-date boundary safe, followed by July and the current Elementor form-upload directory.

## Media inventory

- 101,510 total archive entries
- 100,959 image entries
- approximately 12,856 likely originals after excluding WordPress dimension-suffixed thumbnails and `-scaled` derivatives

The last number is a safe curation starting point, not a deletion list. The untouched archives remain the source of truth.

## Remaining cutover work

- Record WordPress page/event content and redirect mappings
- Export newsletter subscribers with active, unsubscribed, bounced and consent states intact as an operator-friendly CSV; the source tables are already retained in the database backup
- Export contact and registration submissions into an operator-friendly private format; their source tables and attachment folders are already retained
- Inventory domain DNS and mail records before cancelling any IONOS product
- Configure the read-only NAS gallery service and Cloudflare DNS/tunnel after the owner accepts any required NAS application terms and authenticates the DNS account

## Cutover rule

Do not cancel the current IONOS hosting, mailbox or DNS service until all of the following have passed:

- database and media archives open successfully from the local copy;
- migrated albums match the expected event list and representative image counts;
- contact and newsletter forms have been tested end to end;
- the domain mailbox has been copied and DNS mail records verified;
- the new website has been checked on mobile and desktop;
- a rollback copy exists outside both IONOS and the UGREEN NAS.

## Final media architecture

The public website will keep lightweight archive pages and event covers. Full galleries will load from `media.bachataexplosion.com`, routed through a Cloudflare Tunnel to a read-only public folder on the UGREEN NAS. Originals, the NAS administration interface and incoming photographer folders will never be exposed publicly.

This keeps normal pages and ticket links fast even when the NAS is unavailable. An album page will show a clear temporary-unavailable state rather than breaking the rest of the website.

The static replacement now preserves all 85 exported public WordPress pages and builds 108 static routes. Its automated site audit and WordPress content-parity audit pass, including preservation of 12,061 public-page media references. Internet-facing NAS gallery serving is deliberately not enabled yet; the verified files are private migration/recovery data, not a public web root.
