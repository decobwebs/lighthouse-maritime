# Lighthouse Maritime Agency — website

You are building the public website for **Lighthouse Maritime Agency Ltd**, a ship agency headquartered at 5 Bornu Crescent, Apapa, Lagos (CAC RC 7964161, incorporated 27 September 2024). The site's job is to win port-call work: its primary conversion is a **PDA request** (proforma disbursement account, the agent's itemised estimate of port costs before a vessel arrives).

The design is **finished and approved**. Your job is to implement it faithfully, not to redesign it.

## Read these first, every session
1. `docs/DESIGN.md`: the design system (type scale, colours, spacing, backgrounds, components, motion, responsive rules).
2. `docs/CONTENT.md`: the exact copy for every page. Use it word for word.
3. `docs/design-reference/*.html`: the approved screens. Open them in a browser to see the target. They are static mock-ups written with inline styles; **match their look, but do not copy their inline-style markup**. Rebuild them as clean components that use `src/styles/tokens.css`.
4. `docs/BUILD_PROMPTS.md`: the build is done in stages; do only the stage you are asked for.

## Stack (decided, do not change without asking)
- **Astro** (latest stable) + **TypeScript** (strict). Static output by default; only the form API routes render on demand (`export const prerender = false`).
- **Plain CSS** with the variables in `src/styles/tokens.css`, plus scoped `<style>` in components. **No Tailwind, no UI kit, no CSS-in-JS.**
- Fonts: **Manrope** (headings, numbers, 500–800) and **Inter** (body, 400–600), self-hosted with `@fontsource/manrope` and `@fontsource/inter` (no Google Fonts request at runtime).
- Images: `astro:assets` `<Image>` / `<Picture>` from `src/assets/images/`, AVIF + WebP, explicit width/height, `loading="eager"` + `fetchpriority="high"` for the hero only.
- Hosting: **Vercel** with `@astrojs/vercel`.
- Forms: Astro API routes → **Resend** (email to the right inbox) + **Supabase** table as a backup log. Spam protection: **Cloudflare Turnstile** + a hidden honeypot field.
- JavaScript: only where needed (mobile menu, hero tab switcher, PDA purpose chips, form enhancement). Everything else must work with JS disabled.

## Project structure
```
src/
  assets/images/        photos (already supplied, already compressed)
  components/           Header, Footer, Button, Eyebrow, SectionHeading, ServiceCard, StatBar,
                        PhaseTimeline, CertifiedList, PortColumns, QuickPdaPanel, MobileActionBar, ...
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
    privacy.astro  terms.astro  404.astro
    api/pda.ts  api/contact.ts
  styles/tokens.css  styles/global.css
public/  favicon.svg  logo-mark.svg  logo-mark-white.svg  robots.txt
```

## Non-negotiable rules
- **Never invent facts.** No client names, testimonials, vessel counts, years of experience, certifications or statistics beyond what `docs/CONTENT.md` contains. Placeholders are written in square brackets, e.g. `[X hours]`. Keep them visible and list them in `PLACEHOLDERS.md` at the project root; never fill them with guesses.
- **Registration numbers are confidential.** Show "Certified" for NPA, NIMASA and NCDMB NOGIC JQS. Only the CAC RC number (7964161) is shown.
- Domain: **lighthousemaritimeltd.com**. Emails: `operations@lighthousemaritimeltd.com` (24/7 desk, PDA requests) and `admin@lighthousemaritimeltd.com` (general, tenders). Phones: +234 806 118 9106 (operations, 24/7), +234 908 622 3063 (administration).
- Red (`--red`) is for the primary action only. One red button per view, plus the header button.
- Sections divide with straight 1px lines (`--line`). No drop shadows except the one floating card on Home/About (`--shadow-float`).
- Accessibility: WCAG 2.2 AA. Real `<button>`/`<a>`/`<label>`, visible focus (3px outline), alt text from `docs/CONTENT.md`, `prefers-reduced-motion` respected, 44px minimum touch targets.
- Performance budget (mobile, 4G): LCP ≤ 2.5s, CLS ≤ 0.1, total JS ≤ 30 KB gzipped on content pages.
- Two photos show other shipping lines' names (MSC on the Port agency image, EVERGREEN on the night CTA image). Keep them for now, but leave a `TODO(brand-photo)` comment wherever they are used. The client may swap them.

## Commands
- `npm run dev`: local dev server
- `npm run build && npm run preview`: production check
- `npm run check`: `astro check` (types); must pass before finishing any stage

## How to work
- Do one stage from `docs/BUILD_PROMPTS.md` at a time, then stop and summarise what changed and what the user should look at.
- After each stage, compare your pages against the matching `docs/design-reference/*.html` at 1440px and 390px widths and fix visible differences before reporting.
- If something in the design is ambiguous, follow `docs/DESIGN.md`; if it is still unclear, ask instead of guessing.
