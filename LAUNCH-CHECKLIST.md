# LAUNCH-CHECKLIST.md

Things that must be done before the site goes live. Tick each one off when it is done.

## Clean-up
- [ ] Delete `/test-layout` and `/test-layout/solid` (`src/pages/test-layout/`), and remove their lines from `astro.config.mjs` (sitemap filter) and `public/robots.txt` (Disallow)

## Content
- [ ] Every placeholder in `PLACEHOLDERS.md` is filled or deliberately kept
- [ ] Port call checklist PDF added to `public/` and `CHECKLIST_PDF` set in `src/data/site.ts` (the download buttons stay disabled until then)
- [ ] `/privacy` and `/terms` reviewed by a lawyer; then remove the "Draft for legal review" notice in `src/components/LegalPage.astro`
- [ ] Team names and photos supplied, then build with `SHOW_TEAM=true` (About "03 — Our team")
