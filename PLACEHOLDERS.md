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

## Files and assets still needed

| Item | Where it is used | Status |
|---|---|---|
| Port call checklist PDF | Port call guide "Download PDF" and "Download checklist" buttons | Waiting |
| Team photos (3) | About, "03 — Our team" | Waiting |
| Lawyer's review of the privacy policy | `/privacy` (must be reviewed before launch) | Waiting |
| Optional: replacement for `svc-port-agency.jpg` (shows MSC branding) | Port agency card and service hero; marked `TODO(brand-photo)` | Optional |
| Optional: replacement for `cta-night.jpg` (shows EVERGREEN branding) | Home CTA banner; marked `TODO(brand-photo)` | Optional |
