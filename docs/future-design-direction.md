# Bachata Explosion future design direction

Date: 24 August 2026

Status: proposal only. No visible design or source-content replacement is authorized by this document.

## Recommendation

Use **Explosion After Dark** as the main direction: an editorial festival site that feels like a living event poster, using the original black, fire-gold, red, pink and violet identity, real dance-floor photography, controlled motion and strong typographic sections.

It should feel recognizably Bachata Explosion—not like a generic conference template and not like a reduced copy of another festival.

## What must remain

- the complete 85-page WordPress content baseline until every replacement is approved;
- the current primary menu hierarchy and the same destinations;
- Berlin Bachata Festival, Role Rotation and Elite Dance as distinct event formats;
- “By dancers, for dancers” as the core promise;
- the team/community story, artists, DJs, venue, schedule, ticket information, FAQs, ambassadors, volunteers, history and legal pages;
- all historical editions and day/session photo pages;
- Ticket Tailor as the current official checkout destination;
- the original Explosion logo and recognizable poster artwork;
- long-form information for dancers who need details before buying.

Improvement means reorganizing and clarifying this material, not deleting it.

## Why the current material feels inconsistent

The content is rich, but WordPress/Elementor allowed each section and edition to become its own visual implementation. That creates several problems:

- repeated facts can drift between pages;
- schedules and artist information are sometimes embedded in posters instead of accessible page content;
- very large videos and images are loaded in contexts where they are not essential;
- important ticket, venue and timing information competes with decorative effects;
- gallery pages exist, but there is no consistent archive journey across years, editions and days;
- custom CSS is duplicated inside Elementor data, making future updates fragile.

The new system should keep the expressive artwork while making the structure predictable.

## Proposed changes—review before implementation

| Proposed change | Why | What stays unchanged | Tradeoff / approval point |
| --- | --- | --- | --- |
| Keep the original menu hierarchy, but add a small event-specific sub-navigation on event pages | A dancer can move between Overview, Artists, Schedule, Venue, Tickets and FAQ without searching a long page | All existing menu groups and destinations | Adds a second navigation layer only on event pages; approve its labels first |
| Retain the orange/gold header motion on the homepage and major event landings, but use the poster fallback on galleries, legal pages and low-power/mobile contexts | Preserves the signature entrance while avoiding a 10–14 MB video on every page | Same particle visual, logo and black/gold character | Less motion on utility pages; approve whether desktop event pages should all use motion |
| Optimize the header loop from the recovered master | The current file is 13.6 MB at approximately 10.8 Mbps, which is excessive for navigation | The visible animation and ten-second rhythm | The optimized loop will lose invisible detail; compare original and optimized versions before selection |
| Make the homepage an “Explosion headquarters” | Instagram visitors need the next event immediately, while returning dancers still need access to every format and the archive | Current event cards, story, team, ticket and newsletter content | Ordering changes, but no section is silently removed |
| Give each event family its own accent palette inside one layout system | Gold BBF, neon Role Rotation and electric Elite artwork are already recognizable | Existing posters, names and atmosphere | The shared typography/grid must be strong enough to keep the brand coherent |
| Replace poster-only facts with real text next to the poster | Text remains readable on phones, can be corrected quickly and is accessible | The poster is still shown as campaign artwork | Requires confirming the canonical date, venue, lineup and price fields for every live event |
| Convert artist grids into consistent role-aware profiles | Visitors can distinguish instructors, DJs, photographers, MCs and performers | Every artist and existing artwork remains | Bios and roles need an owner-approved data sheet to prevent assumptions |
| Convert schedules into structured day/room/time data, with the original poster available as a download/image | Easier to read and update, especially on mobile | All schedule content and artwork | Needs one authoritative schedule source; no automatic rewriting from an image |
| Turn History into an edition index and each photo page into a consistent album route | Makes the archive usable without reducing it | All old pages, photos, dates and credits | Old slugs should redirect to the new route only after route-by-route verification |
| Move full albums and long video to the NAS media hostname | Keeps GitHub/site hosting light while preserving the archive | Visitors remain on Bachata Explosion pages | Galleries may be temporarily unavailable if the home NAS or internet is down; core event pages and ticket links must not depend on the NAS |
| Consolidate forms behind one protected endpoint and keep dedicated application flows | Removes Elementor dependence and improves spam/privacy handling | Contact, volunteer, ambassador and other form purposes | Field lists, recipients and retention periods require approval before live submission is enabled |
| Use a dedicated double-opt-in newsletter provider | Reliable consent, unsubscribe and campaign delivery | Newsletter signup and the current audience relationship | Provider selection and subscriber migration must happen before connecting the form |

## Homepage presentation

Recommended order:

1. **Signature entrance:** original logo, controlled particle motion, next-event date/location and one ticket action.
2. **Choose your Explosion:** BBF, Role Rotation and Elite Dance, each with its real current poster and a short distinction.
3. **Next event essentials:** artists, program status, venue, passes and any urgent announcement.
4. **Why dancers return:** real event photography and specific community/value statements, not generic claims.
5. **Latest archive chapter:** three recent albums plus a clear route to all years.
6. **People behind Explosion:** retain the current team material in a tighter editorial presentation.
7. **Newsletter and contact:** one clear invitation, with consent and privacy language.

This supports both visitor types: the Instagram visitor who wants the date and ticket in seconds, and the committed dancer who wants detailed proof before purchasing.

## Event-page presentation

Each live event should use the same information architecture:

```text
Event identity / date / city / ticket
  ├── event promise and main poster
  ├── artists and roles
  ├── program / schedule
  ├── venue and travel
  ├── pass options
  ├── competition or special concept
  ├── FAQ
  ├── related albums / past edition proof
  └── final ticket action
```

The visual skin changes by event family, but the location of important information does not.

## Archive presentation

The archive should feel like a festival journal rather than a file browser:

- first select year or event family;
- show one strong cover, edition name, city/date and number of albums;
- enter an edition page with Friday/Saturday/Sunday or Workshop/Party albums;
- preserve photographer credits and any existing page copy;
- use responsive NAS images and load full-resolution views only on demand;
- show a friendly “archive temporarily unavailable” state if the NAS is offline;
- never make ticket sales, current event information or contact dependent on the NAS.

## Content-improvement method

No WordPress paragraph should be silently replaced. Before copy changes, create a content ledger with:

| Route | Current text/fact | Proposed version | Reason | Owner status |
| --- | --- | --- | --- | --- |
| `/BBF-2026/` | exact current content | edited content | clarity, accuracy, duplication or grammar | keep / approve / revise |

Editing priorities:

1. factual accuracy: dates, venue, pass inclusion, rules and deadlines;
2. clarity: short first sentence, then complete details;
3. consistency: the same fact should come from one canonical event record;
4. tone: direct, warm, dancer-led and specific;
5. grammar and formatting;
6. search metadata only after the human-facing content is correct.

## Three viable visual directions

### 1. Explosion After Dark — recommended

Near-black background, recovered fire-particle motion, metallic gold type, live pink/violet lighting, large editorial crops, narrow rules and “event chapter” labels inspired by wristbands/backstage passes.

Why it fits: it protects the existing identity and poster energy while creating a more controlled, premium system.

### 2. Berlin Festival Magazine

More negative space, large documentary photography, condensed display type, schedule-led layouts and subtle Berlin architectural references.

Why it fits: strongest for readability and an international audience, but it would feel calmer and less explosive.

### 3. Live Floor

Video-first entrances, moving light textures, oversized lineup reveals and highly immersive transitions.

Why it fits: strongest emotional impact, but it is heavier, harder to maintain and more likely to distract from practical information.

Recommendation: build the core with direction 1, borrow the schedule clarity of direction 2, and use direction 3 only for selected hero moments.

## What to learn from Bachata Geneva Festival—without copying it

The current Geneva site succeeds because it gives its festival one clear narrative, then separates program, artists, tickets, venue, hotel/community and FAQ into predictable destinations. Its ticket page also makes price phases and inclusions explicit.

Useful patterns for Bachata Explosion:

- one strong sentence explaining the event;
- date, venue and action visible immediately;
- program and ticket information as structured content;
- venue/travel proof for international guests;
- FAQ near the buying decision;
- community continuity between editions.

What not to copy: its “Festival of Nations” positioning, visual identity or exact layouts. Bachata Explosion already has a stronger Berlin/fire/explosion language and multiple event formats that require its own system.

References:

- <https://bachatagenevafestival.com/>
- <https://bachatagenevafestival.com/program>
- <https://bachatagenevafestival.com/tickets>

## Approval sequence

1. Approve one visual direction and the event-family palette logic.
2. Approve the header-motion rule before any visible header change.
3. Review a content ledger for Home and BBF 2026.
4. Build two local alternatives for the homepage hero and one complete BBF section—without changing the baseline routes.
5. Choose one, then apply the system to Role Rotation and Elite Dance.
6. Pilot one historical album through the NAS.
7. Connect forms, newsletter and email only after providers, consent wording and retention are confirmed.
8. Run route/content/media parity checks before replacing the baseline preview.
