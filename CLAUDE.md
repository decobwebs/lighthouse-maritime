# Lighthouse Maritime Agency — website

You are building the public website for **Lighthouse Maritime Agency Ltd**, a ship agency headquartered at 5 Bornu Crescent, Apapa, Lagos (CAC RC 7964161, incorporated 27 September 2024). The site's job is to win port-call work: its primary conversion is a **PDA request** (proforma disbursement account, the agent's itemised estimate of port costs before a vessel arrives).

The design is **finished and approved**. Your job is to implement it faithfully, not to redesign it.

## Read these first, every session
1. `docs/DESIGN.md`: the design system (type scale, colours, spacing, backgrounds, components, motion, responsive rules).
2. `docs/CONTENT.md`: the exact copy for every page. Use it word for word.
3. `docs/design-reference/*.html`: the approved screens. **`01-home-desktop-v4.html` is the source of truth** where it differs from the older screens. Open them in a browser to see the target. They are static mock-ups written with inline styles; **match their look, but do not copy their inline-style markup**. Rebuild them as clean components that use `src/styles/tokens.css`.
4. `docs/BUILD_PROMPTS.md`: the build is done in stages; do only the stage you are asked for.

## Stack (decided, do not change without asking)
- **Astro** + **TypeScript** (strict). **Fully static output: no server code, no API routes, no adapter.** (Astro 6.4.8, the newest that runs on this machine's Node 22.18; `@astrojs/sitemap` pinned to 3.7.3.)
- **Plain CSS** with the variables in `src/styles/tokens.css`, plus scoped `<style>` in components. **No Tailwind, no UI kit, no CSS-in-JS.**
- Fonts: **Manrope** (headings, numbers, 500–800) and **Inter** (body, 400–600), self-hosted as variable fonts with `@fontsource-variable/manrope` and `@fontsource-variable/inter` (one Latin file each, both preloaded; no Google Fonts request at runtime).
- Images: `astro:assets` `<Image>` / `<Picture>` from `src/assets/images/`, AVIF + WebP, explicit width/height, `loading="eager"` + `fetchpriority="high"` for the hero only.
- Hosting: **Vercel**, serving the static `dist/` folder (no adapter needed).
- Forms: **no server.** Request a PDA and Contact are checked in the browser (`src/lib/pda-rules.ts`, `src/lib/contact-rules.ts`), confirmed in a "Check your details" dialog, then sent by the visitor from their own email app (`mailto:`) or WhatsApp, or copied (`src/lib/send.ts`, `src/scripts/send-flow.ts`). PDA → operations@ (cc admin@); Contact → admin@ (cc operations@). No Resend, Supabase or Turnstile.
- Email addresses never appear whole in page HTML or scripts: use `<Email mailbox="…" />` in pages and `emailAddress()` in scripts (the one exception is the no-JS fallback link on Request a PDA).
- JavaScript: header scroll states, mobile menu, Lagos desk clock, Home section rail, PDA purpose chips, the form check-and-send flow, email links, and motion (DESIGN.md §7).
- Motion: **GSAP** (ScrollTrigger, SplitText; MotionPathPlugin on Home only) + **Lenis**, loaded as a deferred module after first paint (`src/scripts/motion/`). Hidden start states only under `html.motion-on`. Everything must work with JS disabled or with reduced motion; without JS the forms show a plain email/phone fallback.

## Project structure
```
src/
  assets/images/        photos (already supplied, already compressed)
  components/           Header, Footer, Button, Eyebrow, SectionHeading, ServiceCard, DeskBoard, SectionRail,
                        PhaseTimeline, CertifiedList, CertifiedStrip, PortColumns, QuickPdaPanel, MobileActionBar, ...
  assets/logos/         monochrome authority logos (NPA, NIMASA, NCDMB); see src/data/authorities.ts
  layouts/BaseLayout.astro   <head>, SEO meta, fonts, tokens, Header, Footer, MobileActionBar
  content/              services as content collection (one .md per service)
  pages/
    index.astro
    services/index.astro
    services/[slug].astro        built from the content collection
    port-call-guide.astro
    ports.astro
    about.astro
    contact.astro
    request-a-pda.astro
    request-a-pda/thank-you.astro
    contact/thank-you.astro
    privacy.astro  terms.astro  404.astro
  lib/                  pda-rules.ts, contact-rules.ts, email-typos.ts, send.ts (pure, shared)
  scripts/send-flow.ts  browser side of both forms
  styles/tokens.css  styles/global.css
public/  favicon.svg  logo-mark.svg  logo-mark-white.svg  robots.txt  patterns/chart-dark.svg  patterns/chart-light.svg
```

## Non-negotiable rules
- **Never invent facts.** No client names, testimonials, vessel counts, years of experience, certifications or statistics beyond what `docs/CONTENT.md` contains. Placeholders are written in square brackets, e.g. `[X hours]`. Keep them visible and list them in `PLACEHOLDERS.md` at the project root; never fill them with guesses.
- **Registration numbers are confidential.** Show "Certified" for NPA, NIMASA and NCDMB NOGIC JQS. Only the CAC RC number (7964161) is shown.
- Domain: **lighthousemaritimeltd.com**. Emails (render with `<Email>`, never as plain text): `operations@lighthousemaritimeltd.com` (24/7 desk, PDA requests) and `admin@lighthousemaritimeltd.com` (general, tenders). Phones: +234 806 118 9106 (operations, 24/7), +234 908 622 3063 (administration).
- Red (`--red`) is for the primary action only. One red button per view, plus the header button.
- Sections are separated by **background rhythm only** (white, mist, navy chart; see DESIGN.md §4): no full-width dividers. Rules stay inside components. Shadows only where DESIGN.md specifies them (floating head-office card, port cards, solid header, section rail, dialogs).
- Accessibility: WCAG 2.2 AA. Real `<button>`/`<a>`/`<label>`, visible focus (3px outline), alt text from `docs/CONTENT.md`, `prefers-reduced-motion` = no motion at all, 44px minimum touch targets.
- Performance budget (mobile, 4G): LCP ≤ 2.5s, CLS < 0.1, total JS ≤ **70 KB compressed per page** (including GSAP and Lenis). No long tasks over 200ms while scrolling (Chrome 4× CPU throttle).
- Two photos show other shipping lines' names (MSC on the Port agency image, EVERGREEN on the night CTA image). Keep them for now, but leave a `TODO(brand-photo)` comment wherever they are used. The client may swap them.

## Commands
- `npm run dev`: local dev server
- `npm run build && npm run preview`: production check (static files in `dist/`)
- `npm run check`: `astro check` (types); must pass before finishing any stage

## How to work
- Do one stage from `docs/BUILD_PROMPTS.md` at a time, then stop and summarise what changed and what the user should look at.
- After each stage, compare your pages against the matching `docs/design-reference/*.html` at 1440px and 390px widths and fix visible differences before reporting.
- If something in the design is ambiguous, follow `docs/DESIGN.md`; if it is still unclear, ask instead of guessing.
