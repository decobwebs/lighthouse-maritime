# PLACEHOLDERS.md

Information the client has not supplied yet. Each placeholder stays visible on the site, in square brackets, until Lighthouse provides the real value. **Never replace one with a guess.**

When a value arrives: search the codebase for the placeholder text, replace every occurrence, and tick it off here.

Square brackets in `docs/CONTENT.md` around button and badge labels (for example `[Request a PDA]`, `[Get PDA]`, `[Certified]`, `[Download PDF]`) mark UI elements, not missing content, so they are not listed here.

## Text placeholders

| Placeholder | What it is | Where it appears (CONTENT.md) | Status |
|---|---|---|---|
| `[X hours]` | PDA turnaround time after a complete request | Global facts; Home promise row 01; Home CTA banner; Request a PDA meta description, lead, sidebar step 3 and thank-you page; Port agency CTA; About principle 02 (Reliability) | Waiting |
| `[X]hrs` | Same turnaround, shown as a stat | Home stats bar, 4th column | Waiting |
| `[WhatsApp number]` | Operations WhatsApp number | Global facts; used by the mobile action bar WhatsApp button, "Message on WhatsApp" buttons on the Request a PDA sidebar and urgent cards | Waiting |
| `[Month 2026]` | Month the port call guide was last reviewed | Port call guide side card ("Last reviewed") | Waiting |
| `[Name]` ×3 | Team members: Managing Director, Head of Operations, Client Relations | About, "03 — Our team" (section hidden with `SHOW_TEAM=false` until supplied) | Waiting |
| `[retention period]` | How long form data is kept | Privacy policy | Waiting |

## Copy not supplied: four service pages

CONTENT.md gives full copy for **Port agency** only. For Husbandry and crew changes, Clearance and coordination, Ship supply and procurement, and Logistics and project support, the pages use the same template, but these parts are missing. Until they arrive, the pages show the plain section name as the heading and leave the rest out (nothing is invented). Add them to the service's file in `src/content/services/` (fields shown in brackets).

| Missing for each of the 4 pages | Port agency example | Status |
|---|---|---|
| "What's included" two-tone heading + intro sentence (`includedHeading`) | "Everything a port call needs, *handled for you.*" | Waiting |
| One-line description under each of the 6 included items (`included[].text`) | "Itemised estimate before arrival; reconciled final account after sailing." | Waiting |
| "Who it's for" two-tone heading (`whoForHeading`) | "Built for the people *who appoint agents.*" | Waiting |
| One-line description under each of the 3 audiences (`whoFor[].text`) | "Full agency with costs agreed before the vessel arrives." | Waiting |
| Intro sentence for "What we need from you" (`weNeedHeading.body`) | "Send these with your nomination and we can file everything before the vessel arrives." | Waiting |
| Meta title and description (`meta`) | currently "{Service} \| Lighthouse Maritime Agency" + the page lead | Waiting |

Also not separately specified, so chosen from approved material (confirm or change):
- **Related services** for the four pages: Port agency plus two neighbouring services.
- **"What we need" photo**: `svc-clearance.jpg` on every service page, as DESIGN.md §8 assigns it; on the Clearance page it repeats the hero photo.
- **/services overview** hero: reuses the Home "02 — Services" heading and text.

## Files and assets still needed

| Item | Where it is used | Status |
|---|---|---|
| Port call checklist PDF | Port call guide "Download PDF" and "Download checklist" buttons | Waiting |
| Team photos (3) | About, "03 — Our team" | Waiting |
| Lawyer's review of the privacy policy | `/privacy` (must be reviewed before launch) | Waiting |
| Optional: replacement for `svc-port-agency.jpg` (shows MSC branding) | Port agency card and service hero; marked `TODO(brand-photo)` | Optional |
| Optional: replacement for `cta-night.jpg` (shows EVERGREEN branding) | Home CTA banner; marked `TODO(brand-photo)` | Optional |
