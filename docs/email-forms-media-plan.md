# Bachata Explosion — email, forms and media operating plan

## Recommended system boundary

The website, business email, newsletter and photo archive should work together, but they should not depend on one another to stay online.

```text
Public website
  ├── ticket buttons      → Ticket Tailor
  ├── newsletter signup   → dedicated newsletter provider
  ├── contact form        → protected form endpoint → info@bachataexplosion.com
  └── historical gallery  → media.bachataexplosion.com → Cloudflare Tunnel → UGREEN NAS

Domain email
  └── independent mailbox provider
```

This separation means a NAS outage does not break ticket sales or email, and changing the website host does not cancel the company mailbox or subscriber list.

## 1. Domain email

### Current dependency

`bachataexplosion.com` currently uses IONOS nameservers and IONOS mail routing. Cancelling the wrong IONOS product before moving the mailbox could stop `info@bachataexplosion.com`, even if the website has already moved.

### Recommended approach

1. Keep the existing IONOS mailbox active during the website rebuild.
2. Decide whether the mailbox will remain as a standalone IONOS mail product or move to a dedicated provider.
3. Create the new mailbox and aliases before changing DNS.
4. Copy historic mail via IMAP, then test sending and receiving.
5. Recreate and verify MX, SPF, DKIM, DMARC and autodiscovery records.
6. Cancel the old mail product only after several days of successful delivery.

Suggested address structure:

- `info@bachataexplosion.com` — main public inbox
- `tickets@bachataexplosion.com` — alias routed to the person handling ticket questions
- `partners@bachataexplosion.com` — alias for ambassadors and collaborations
- `privacy@bachataexplosion.com` — privacy requests and deletion requests

Aliases can initially arrive in one mailbox, so separate paid accounts are not required.

## 2. Contact forms

### Form types for launch

- general contact
- ticket support
- group discount
- ambassador application
- volunteer application
- media/photographer inquiry
- partnership inquiry

The first release can use one contact form with a required topic selector. Dedicated application forms should be added only when their questions and owners are confirmed.

### Required behavior

- HTTPS submission to a server-side endpoint; never place an email-provider API key in browser code
- honeypot and rate limiting, with Turnstile or another challenge only if spam becomes a problem
- server-side validation and a maximum message length
- notification to the responsible mailbox or alias
- clear success and failure messages
- minimal storage; define a deletion period before retaining submissions in a database
- consent wording and privacy policy matching the providers actually used

The local build already supports `PUBLIC_CONTACT_FORM_ENDPOINT`. If it is empty, the form does not transmit personal data and explains that it is still in preview. Once a provider is chosen, the endpoint can be connected without redesigning the page.

## 3. Newsletter

Use a dedicated newsletter provider rather than sending campaigns through the normal company mailbox.

Launch requirements:

- export the current WordPress newsletter list with email, name, status, groups, consent source and consent date
- preserve unsubscribed and bounced states; never re-import them as active
- use double opt-in for new subscriptions
- authenticate the sending domain with SPF/DKIM and publish DMARC
- use an unsubscribe link in every campaign
- separate operational ticket emails from marketing consent
- create simple tags such as `BBF`, `Role Rotation`, `Local Berlin`, `Ambassador` only when the team will actually use them

The local build already supports `PUBLIC_NEWSLETTER_FORM_ENDPOINT` and displays a double-opt-in confirmation message after a successful submission.

## 4. Media and the UGREEN NAS

### Public experience

Visitors remain on routes such as:

```text
bachataexplosion.com/archive/role-rotation-2026/
```

The gallery page loads a small manifest and optimized photographs from:

```text
media.bachataexplosion.com/
```

That media hostname connects through Cloudflare Tunnel to a read-only web folder on the NAS. The NAS administration interface, SMB, incoming uploads and originals are never published.

### One NAS for three websites

The UGREEN NAS can serve the public image libraries for all three websites without mixing their files or placing them in GitHub. Each website receives its own public media hostname and read-only folder:

```text
media.bachataexplosion.com  → UGREEN/Public/BachataExplosion/
media.elitedancestudio.de   → UGREEN/Public/EliteDanceStudio/
media.third-site.example    → UGREEN/Public/ThirdSite/
```

One Cloudflare Tunnel can route these hostnames to separate read-only web roots on the NAS. Each website repository stores only its page code, album information, small cover images and the hostname it should use. It does not store the galleries.

The public folders must remain isolated. A gallery manifest for one brand may reference only files inside that brand's media origin, and the NAS web service should allow read-only HTTP access to `Public/`—never to masters, incoming deliveries, backups or the NAS administration interface.

### NAS folder structure

```text
UGREEN/
  BachataExplosion/
    00_Incoming/{event}/{photographer}/
    01_Masters/{year}/{event}/{album}/
    02_WebExports/{year}/{event}/{album}/{480,960,1600}/
    03_Manifests/
    Public/
      manifests/
      events/
    99_Quarantine/
  EliteDanceStudio/
    Public/
  ThirdSite/
    Public/
```

### Publishing workflow

1. Receive the photographer delivery into `00_Incoming`.
2. Scan files, calculate checksums and remove exact duplicates.
3. Preserve the best original in `01_Masters`.
4. Generate 480, 960 and 1,600-pixel WebP files in `02_WebExports`.
5. Add event, date, credit and alt text to the manifest.
6. Copy only approved derivatives and the public manifest into `Public/`.
7. Verify one album on phone and desktop before marking it migrated.

### Backup rule

RAID is not a backup. Keep an independent copy of the master archive outside the NAS—at minimum a rotated external drive stored separately, with an off-site/versioned copy preferred for irreplaceable events.

## 5. What belongs in GitHub

Include:

- website code and structured event information
- normal brand assets, posters and one small event cover per archive collection
- public configuration examples and documentation

Exclude:

- full historical galleries and photographer originals
- WordPress database/uploads exports
- subscriber and form-submission exports
- environment files, API keys, tunnel tokens and NAS credentials
- generated build output

## Decisions needed before connection

1. Where should `info@bachataexplosion.com` live after IONOS hosting is cancelled?
2. Which newsletter account currently holds the list, and how many active subscribers are there?
3. What is the exact UGREEN NAS model, installed RAM, usable storage and backup arrangement?
