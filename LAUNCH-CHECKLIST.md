# LAUNCH-CHECKLIST.md

Things that must be done before the site goes live. Tick each one off when it is done.

## Clean-up
- [ ] Delete `/test-layout` and `/test-layout/solid` (`src/pages/test-layout/`), and remove their lines from `astro.config.mjs` (sitemap filter) and `public/robots.txt` (Disallow)

## Content
- [ ] Every placeholder in `PLACEHOLDERS.md` is filled or deliberately kept
- [ ] Port call checklist PDF added to `public/` and `CHECKLIST_PDF` set in `src/data/site.ts` (the download buttons stay disabled until then)
- [ ] `/privacy` and `/terms` reviewed by a lawyer; then remove the "Draft for legal review" notice in `src/components/LegalPage.astro`
- [ ] Team names and photos supplied, then build with `SHOW_TEAM=true` (About "03 — Our team")

## Forms (sent from the visitor's email app or WhatsApp; there is no server)
- [x] WhatsApp number set in `src/data/site.ts` (2348061189106, the single desk number) (until then "Send on WhatsApp" is hidden and WhatsApp buttons go to /contact)
- [ ] operations@ and admin@lighthousemaritimeltd.com both receive mail, and someone watches each inbox
- [ ] On the live site, send one PDA request and one contact message **by email** from a desktop mail app and from a phone; check they arrive at the right inbox (PDA → operations@ cc admin@, Contact → admin@ cc operations@) with the right subject and reference
- [ ] Send one of each **by WhatsApp** once the number is set, and test **Copy details** once
- [ ] Confirm no test WhatsApp number is left in `src/data/site.ts`

## Quality (added in Stage 7)
- [ ] Run PageSpeed Insights (mobile) on the live Home page and on one inner page; target performance 90+, LCP ≤ 2.5 s, CLS < 0.1. The build machine is too slow for reliable local scores (Lighthouse CPU benchmark 620–880), so the live run is the one that counts
- [ ] Decide on the large decorative numbers (service pages "who" columns, port call guide stages, colour #C9D3DF): axe flags their contrast. They are `aria-hidden` decoration, which WCAG exempts; darken them only if the client wants a clean automated report
- [ ] On a real phone (iOS Safari and Android Chrome): open the menu, use the skip link, and send one PDA by email and by WhatsApp using only the keyboard / screen reader
- [ ] After deleting `/test-layout`, run axe once more on every page (it should then report only the decorative numbers above)
