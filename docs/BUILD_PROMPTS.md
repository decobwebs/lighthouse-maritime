# BUILD_PROMPTS.md: paste these into Claude Code, one at a time

Run them in order. After each stage, review the result in the browser (`npm run dev`) at full width and at phone width (390px) before moving on. If something looks off, tell Claude Code what is wrong before starting the next stage.

---

## Stage 0: Set up the project
```
Read CLAUDE.md, docs/DESIGN.md and docs/CONTENT.md fully before doing anything.

Set up the project in this folder (it already contains docs/, public/, src/assets/images/ and src/styles/tokens.css; keep them):
- Astro (latest stable) with TypeScript strict, @astrojs/vercel adapter, @astrojs/sitemap.
- @fontsource/manrope (500,600,700,800) and @fontsource/inter (400,500,600).
- src/styles/global.css: a modern reset, base typography using the tokens, and utility classes for every type style in DESIGN.md §3 (.t-display, .t-h1, .t-h2, .t-h3, .t-quote, .t-h4, .t-h5, .t-stat, .t-lead, .t-body, .t-small, .t-eyebrow, .t-micro) including the phone sizes, plus .container, .section and .dim (two-tone headings).
- Create PLACEHOLDERS.md listing every [bracketed] placeholder found in docs/CONTENT.md.
- Set `site` in astro.config to https://lighthousemaritimeltd.com.
Do not build any pages yet. Run npm run check and npm run build, then summarise.
```

## Stage 1: Layout, header, footer and mobile action bar
```
Build src/layouts/BaseLayout.astro and these components exactly as DESIGN.md §6 describes and as shown in docs/design-reference/01-home-desktop.html and 02-home-phone.html:
- Header: utility bar + logo (public/logo-mark-white.svg) + nav + Call 24/7 + Request a PDA. Two variants: "overlay" (transparent, sits on a photo hero) and "solid" (on .bg-rings). Active-page underline. Phone: 44px menu button opening an accessible full-screen menu (focus trap, Esc to close, no layout shift).
- Footer on .bg-rings with the four columns and bottom line from CONTENT.md.
- MobileActionBar (phones only), with body padding so it never covers content.
- SEO head: title, description, canonical, Open Graph, favicon, LocalBusiness JSON-LD (no ratings).
Create a temporary test page that shows the header in both variants and the footer. Verify keyboard navigation and contrast. Then stop and summarise.
```

## Stage 2: Home page
```
Build src/pages/index.astro to match docs/design-reference/01-home-desktop.html (desktop) and 02-home-phone.html (phone), using copy from CONTENT.md "Home".
Make reusable components: Hero (photo + three overlays), QuickPdaPanel (real tabs; the form submits to /request-a-pda with vessel, port and eta as query params), StatBar, CertifiedStrip, SectionHeading (eyebrow + two-tone h2 + optional side text), PromiseRows, ServiceBento + ServiceCard, PhaseTimeline, PortColumns, AudienceCards, CertifiedList, CtaBanner.
Use astro:assets for every photo with the alt text and object-position from DESIGN.md §8. The hero image is eager with fetchpriority=high; everything else is lazy.
Add the TODO(brand-photo) comments. Check: 1440, 1024, 768 and 390px widths; JS disabled (the tabs fall back to showing the PDA form); prefers-reduced-motion. Report the Lighthouse scores from a production build.
```

## Stage 3: Services
```
Create a content collection src/content/services with one Markdown file per service (5) using the copy in CONTENT.md "Service pages". Schema: title, slug, code (S—01…), eyebrow, h1, h1Dim, lead, heroImage, included[{title,text}], whoFor[{title,text}], weNeed[], related[slugs], meta{title,description}.
Build src/pages/services/[slug].astro to match docs/design-reference/04-service-page-port-agency.html, and src/pages/services/index.astro (the hero + the same bento as Home + CTA).
Link every service card on Home to its page. Stop and summarise.
```

## Stage 4: Port call guide, ports, about, contact, legal, 404
```
Build:
- /port-call-guide to match docs/design-reference/05-port-call-guide.html (the stage list links to anchors; on phones it becomes a horizontal scrollable chip row above the content).
- /ports from the Home port section + service-page patterns (CONTENT.md "Port coverage").
- /about to match 06-about.html. The team section is behind SHOW_TEAM=false.
- /contact to match 07-contact.html. The map loads only after the user clicks "Show map".
- /privacy, /terms (draft text from CONTENT.md "Legal", clearly marked "draft for legal review"), and a 404.
Stop and summarise.
```

## Stage 5: Request a PDA (front end)
```
Build /request-a-pda to match docs/design-reference/03-request-pda.html and CONTENT.md.
- Prefill vessel, port and eta from query params (coming from the Home quick panel).
- Purpose-of-call chips are toggle buttons with aria-pressed, progressively enhanced from a group of checkboxes (works without JS).
- Client validation that mirrors the server rules: required fields, IMO = exactly 7 digits, ETA not in the past, valid email. Errors as described in DESIGN.md §6 Forms, with an aria-live summary.
- Hidden honeypot field + Cloudflare Turnstile widget (site key from env PUBLIC_TURNSTILE_SITE_KEY).
- On success, redirect to /request-a-pda/thank-you?ref=LMA-PDA-XXXX.
Do not build the API yet; post to /api/pda and show a friendly error if it fails. Stop and summarise.
```

## Stage 6: Form back end (PDA + contact)
```
Build src/pages/api/pda.ts and src/pages/api/contact.ts (prerender = false):
1. Reject when the honeypot is filled; verify the Turnstile token server-side (TURNSTILE_SECRET_KEY).
2. Validate with zod using the same rules as the client.
3. Generate a reference: LMA-PDA-YYYYMMDD-XXXX (or LMA-ENQ-… for contact).
4. Insert into Supabase (tables pda_requests and enquiries; give me the SQL migration in supabase/migrations/). Use SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY server-side only.
5. Send via Resend: (a) an internal email to operations@lighthousemaritimeltd.com (PDA) or admin@lighthousemaritimeltd.com (contact) with every field in a clean table; (b) a confirmation email to the sender with the reference and the "what happens next" steps. From address: no-reply@lighthousemaritimeltd.com (RESEND_API_KEY).
6. If email fails but the database insert worked, still return success and log the error; if both fail, return a 500 with a friendly message.
7. Contact attachments: max 10 MB; PDF, DOCX, JPG or PNG only; stored in Supabase Storage with a signed link in the email.
Write .env.example with every variable. Add basic rate limiting (5 requests per IP per 10 minutes). Test both forms end to end locally with test keys, then summarise.
```

## Stage 7: Quality pass
```
Run a full quality pass and fix what you find:
- Visual: compare every page with its docs/design-reference file at 1440 and 390px; fix spacing, type and colour differences.
- Accessibility: axe on every page; keyboard-only run through the nav, quick panel, PDA form and mobile menu; check focus order and visible focus.
- Performance: production build; Lighthouse mobile ≥ 90 on every metric, LCP ≤ 2.5s, CLS ≤ 0.1; check image sizes and that fonts are preloaded.
- SEO: unique titles and descriptions, sitemap.xml, robots.txt, canonical URLs, OG image, JSON-LD valid.
- Content: grep for invented facts; every [placeholder] is listed in PLACEHOLDERS.md; no registration numbers except the CAC RC.
Give me a short report with before/after scores.
```

## Stage 8: Deploy
```
Prepare deployment to Vercel:
- vercel.json if needed, security headers (CSP allowing Turnstile, Resend not needed client-side, HSTS, X-Content-Type-Options, Referrer-Policy).
- A step-by-step checklist for me: create the Vercel project, add the env variables, connect lighthousemaritimeltd.com (DNS records), verify the domain in Resend (SPF, DKIM, DMARC), create the Supabase project and run the migration, create the Turnstile site, submit the sitemap in Google Search Console, and create a Google Business Profile for the Apapa office.
- A launch test script: submit one PDA and one contact form on production and confirm both emails and both database rows arrive.
```
