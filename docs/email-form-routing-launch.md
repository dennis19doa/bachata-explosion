# Bachata Explosion email and form routing — launch map

Updated: 29 August 2026

## Mailbox model

Use one real Bachata Explosion mailbox and role addresses around it.

### Paid mailbox

- `info@bachataexplosion.com` — primary mailbox and login

### Mailbox aliases

- `tickets@bachataexplosion.com` — ticket, payment, confirmation and name-change questions
- `groups@bachataexplosion.com` — group discounts and community bookings
- `partners@bachataexplosion.com` — studios, brands and collaboration requests
- `ambassadors@bachataexplosion.com` — ambassador applications and onboarding
- `volunteers@bachataexplosion.com` — volunteer applications and team coordination
- `media@bachataexplosion.com` — photographers, press and video/content requests
- `privacy@bachataexplosion.com` — privacy, deletion and data-access requests
- `news@bachataexplosion.com` — newsletter/admin identity; marketing delivery should still use a dedicated newsletter platform

Zoho aliases deliver into the same mailbox and can also be selected as the From address. That gives public departments without paying for a mailbox for every role.

### Group / distribution list

Create `team@bachataexplosion.com` as a Zoho Distribution List named **Bachata Explosion Team**.

Recommended members at launch:

- the Bachata Explosion mailbox user (`info@bachataexplosion.com`)
- any additional internal Zoho user who should receive team-wide operational mail

Set the group so organization members can send by default. Make it public only if there is a clear reason for external people to email the whole team.

## Form routing

The website keeps the form UI on Bachata Explosion. Provider endpoint URLs are configuration, never hard-coded credentials.

| Website form/topic | Public role address | Endpoint variable | Notification subject |
| --- | --- | --- | --- |
| Ticket question | `tickets@bachataexplosion.com` | `PUBLIC_TICKETS_FORM_ENDPOINT` | `[Bachata Explosion] Ticket question` |
| Group discount | `groups@bachataexplosion.com` | `PUBLIC_GROUPS_FORM_ENDPOINT` | `[Bachata Explosion] Group discount` |
| Partnership / collaboration | `partners@bachataexplosion.com` | `PUBLIC_PARTNERS_FORM_ENDPOINT` | `[Bachata Explosion] Partnership` |
| Media / photographer | `media@bachataexplosion.com` | `PUBLIC_MEDIA_FORM_ENDPOINT` | `[Bachata Explosion] Media request` |
| General contact | `info@bachataexplosion.com` | `PUBLIC_CONTACT_FORM_ENDPOINT` | `[Bachata Explosion] General contact` |
| Ambassador application | `ambassadors@bachataexplosion.com` | `PUBLIC_AMBASSADOR_FORM_ENDPOINT` | `[Bachata Explosion] Ambassador application` |
| Volunteer application | `volunteers@bachataexplosion.com` | `PUBLIC_VOLUNTEER_FORM_ENDPOINT` | `[Bachata Explosion] Volunteer application` |
| Jack & Jill | registration owner | `PUBLIC_JJ_FORM_ENDPOINT` | `[Bachata Explosion] Jack & Jill registration` |
| Newsletter | newsletter provider | `PUBLIC_NEWSLETTER_FORM_ENDPOINT` | provider-managed double opt-in |

If the dedicated topic endpoints are not configured yet, contact topics fall back to `PUBLIC_CONTACT_FORM_ENDPOINT`. This allows launch with one general endpoint and later separation without redesigning the page.

## Provider-side setup

### Zoho Mail

1. Add and verify `bachataexplosion.com` in the Zoho Mail organization.
2. Create the `info@bachataexplosion.com` mailbox.
3. Add the aliases listed above to that mailbox.
4. Create the `team@bachataexplosion.com` Distribution List.
5. Add filters in `info@` based on the form subject prefix or the receiving alias, for example folders named Tickets, Groups, Partners, Ambassadors, Volunteers and Media.
6. Copy historic IONOS mail by IMAP before changing MX records.
7. Publish the Zoho MX, SPF and DKIM records in Cloudflare DNS and add DMARC.
8. Test sending and receiving from `info@`, `tickets@`, `partners@`, `ambassadors@`, `volunteers@`, `media@` and `privacy@` before cancelling IONOS mail.

### Forms

The static-site form provider should have separate endpoints where useful. Formspark remains a good fit for standard no-file forms. Its notification subject can be controlled with the hidden `_email.subject` field used by the site.

Do not place SMTP passwords, Zoho API keys or provider secret keys in public Astro variables.

Jack & Jill remains a special case because of its photo upload. Use a dedicated upload-compatible flow rather than sending the file to the generic contact endpoint.

## Cutover rule

Website hosting can move to Cloudflare before mail does. Keep the current IONOS mailbox active until Zoho receiving, sending, aliases, group delivery, IMAP history and DNS authentication have all been tested.
