# DESIGN.md: Lighthouse Maritime design system

Approved visual direction: **clean maritime editorial**. Photo-led dark heroes, sections separated by background rhythm (white, mist, deep navy with a nautical-chart line pattern), generous spacing, a clear type hierarchy, one signal red reserved for action, and soft contained cards.

Reference screens: `docs/design-reference/`. **`01-home-desktop-v4.html` is the source of truth** wherever it differs from the older screens (02 home phone, 03 request a PDA, 04 service page, 05 port-call guide, 06 about, 07 contact), which still define those pages' content and layout. All tokens live in `src/styles/tokens.css`.

---

## 1. Principles
1. **Clean and well spaced.** Sections have 128px vertical padding on desktop and 64px on phone. Content is capped at 1240px.
2. **Rhythm, not rules.** There are **no full-width section dividers**. Sections are separated only by background: white, mist (`--mist` #F3F6F9) and deep navy with the chart pattern. Rules stay *inside* components (list rows, table rows, form groups); a 2px `--navy` rule still marks the top of an important list.
3. **Hierarchy through type.** 13 distinct type styles. Section headings are two-tone: a bold first clause in ink and a lighter (weight 500) second clause in `--label` (on light) or `--on-dark-grey` (on dark).
4. **Red means act.** `--red` is used for the primary button (Request a PDA), section eyebrows on light, and stage 01 and 08 markers. Nothing decorative is red.
5. **Never plain, never busy.** Every dark section uses `.bg-chart-dark` (chart lines + a soft red glow top-right and blue glow bottom-left); the Ports section uses `.bg-chart-light`. No rings, dots or generic square grids.

## 2. Colour
| Token | Hex | Use |
|---|---|---|
| `--navy` | #0B2A52 | Brand, dark buttons, 2px list rules |
| `--deep` | #071A33 | Dark section and footer base |
| `--red` | #C2342B | Primary action, eyebrows on light (5.5:1 on white) |
| `--red-hover` | #A82A22 | Button hover |
| `--red-soft` | #F08A80 | Eyebrows on dark |
| `--ink` | #0F1B2D | Body text |
| `--muted` | #52637A | Secondary text (6.1:1 on white) |
| `--label` | #5E6E84 | Labels, grey heading halves (4.9:1) |
| `--line` | #E2E7EE | Dividers, card borders |
| `--line-strong` | #C9D3DF | Inputs, chips |
| `--mist` | #F3F6F9 | Mist sections and soft cards |
| `--surface-alt` | #F6F8FB | Subtle fills (no-JS notes, team photo placeholder) |
| `--panel` | #0A2242 | Operations desk board cells |
| `--on-dark-label` | #8FA3BC | Labels on dark panels (6.6:1 on `--panel`) |
| `--on-dark-soft` | #C5D0DD | Body on dark |
| `--on-dark-muted` | #A9B8CA | Captions on dark |
| `--ok` / `--ok-bg` | #1E7A53 / #E7F6EF | "Certified" badges |
| `--ok-dot` | #34C38F | "Desk open" live dot |
| `--ok-on-dark` | #7FD3B0 | "You receive" lines on dark |

Never put `#8796AA` or lighter greys as text on white; they fail contrast.

## 3. Typography
Fonts: **Manrope** for headings and numbers; **Inter** for everything else. Self-host both.

| Style | Font / weight | Size | Line height | Tracking | Used for |
|---|---|---|---|---|---|
| display | Manrope 700 | clamp(44, 6vw, 80) | 1.02 | -0.035em | Home hero H1 |
| h1 | Manrope 700 | clamp(42, 5.4vw, 72) | 1.03 | -0.033em | Inner page hero H1 |
| h2 | Manrope 700 | clamp(34, 4vw, 54) | 1.08 | -0.025em | Section titles |
| h3 | Manrope 700 | clamp(26, 2.4vw, 34) | 1.15 | -0.02em | Feature card, phase titles, form groups |
| quote | Manrope 600 | clamp(26, 2.8vw, 36) | 1.3 | -0.02em | About story, vision and mission |
| h4 | Manrope 600 | 22 | 1.3 | -0.01em | Card titles, list titles |
| h5 | Manrope 600 | 18 | 1.35 | 0 | Steps, ports, small titles |
| stat | Manrope 700 | clamp(44, 4.6vw, 64) | 1 | -0.035em | About facts bar numbers |
| lead | Inter 400 | 20 | 1.6 | 0 | Hero and intro paragraphs |
| body | Inter 400 | 17 | 1.7 | 0 | Paragraphs |
| small | Inter 400 | 15 | 1.6 | 0 | Card text, captions |
| eyebrow | Inter 600, uppercase | 13 | 1.4 | 0.14em | Section labels ("02 — Services") |
| micro | Inter 500 | 12.5 | 1.4 | 0.02em | Meta, badges, breadcrumbs |

Phone sizes: display 40, h2 31, h3 24, h4 19, stat 40, lead 17, body 15.5.

**Two-tone headings:** `<h2>Everything your vessel needs <span class="dim">in a Nigerian port.</span></h2>`, where `.dim { color: var(--label); font-weight: 500 }` (on dark: `--on-dark-grey`).

**Eyebrows** on numbered sections use the **draft mark**: three short bars (18px, 11px, 18px wide, 2px tall, 9px apart, in the eyebrow colour) + the number in Manrope 800 15px + the label in the eyebrow style, 12px gaps. Written in content as `01 — About Lighthouse` and rendered as `[≡] 01 ABOUT LIGHTHOUSE`. Home: 01 About Lighthouse, 02 Services, 03 How a port call works, 04 Port coverage, 05 Who we work with, 06 Compliance. About: 01 Our story, 02 How we work, 03 Our team, 04 Compliance.

## 4. Layout
- Container: `max-width: 1240px; margin-inline: auto; padding-inline: var(--gutter)`.
- Section: `padding-block: var(--section-y)` (128px; 64px on phone). **No borders between sections.**
- Section rhythm on Home: hero + desk board (navy) → certified logos (white) → About (white) → Services (mist) → Port call (navy chart) → Ports (white chart-light) → Who we work with (mist) → Compliance (white) → CTA (white) → footer (navy chart). Inner pages alternate white and mist below a navy hero; CTA bands are a navy chart card inside a white section, so they never merge with the navy footer.
- Section header pattern: left = eyebrow + h2 (max 640px); right = body paragraph (max 400px) or a link, bottom-aligned; wraps on phone.
- Breakpoints: ≥ 1200 desktop, 960 to 1199 compact desktop, 600 to 959 tablet (bento → single column), < 600 phone.
- Multi-column groups (ports, phases, audiences, compliance) are separate soft cards with 20px gaps. Rows inside a single component (About facts bar, guide stages, contact desks) may keep internal 1px rules.
- Fixed header: `html { scroll-padding-top: 88px }` so anchor jumps land below it.

## 5. Backgrounds
Defined in `tokens.css`:
- `.bg-chart-dark`: `--deep` with `public/patterns/chart-dark.svg` (white chart lines at 8%, `background-size: cover`), plus a red glow top-right (`rgba(194,52,43,.16)`) and a blue glow bottom-left (`rgba(46,96,160,.22)`). Used on: inner-page heroes without photos, How a port call works, About vision and mission, the dark service card, CTA cards, the urgent-contact card, the mobile menu and the footer.
- `.bg-chart-light`: white with `public/patterns/chart-light.svg` (navy chart lines at 7%). Used on: Ports (Home and /ports).
- `.bg-mist`: `--mist`. Used on alternate light sections.
- `.bg-white`: `--surface`.
- **Photo heroes:** the photo uses `object-fit: cover`, with three overlays: left-to-right `rgba(6,18,36,.92 → .66 → .28 → .18)`, a top fade of 180px at `.70` (keeps the white nav readable) and, on Home, a bottom fade of 520px into solid `--deep` behind the quick panel and desk board.

## 6. Components

### Buttons (min-height 48, radius 6, 16px semibold, padding 17×30)
- **Primary:** `--red` background, white text; hover `--red-hover`. Optional trailing arrow icon.
- **Secondary on dark:** transparent, 1px `rgba(255,255,255,.35)` border; hover `rgba(255,255,255,.16)` fill.
- **Secondary on light:** 1px `--navy` border, navy text; hover fills navy with white text.
- **Dark solid:** `--navy` background (Contact form submit, Back to home).
- Focus: `outline: 3px solid` navy (on light) or white (on dark), offset 3px.

### Header (fixed, all pages)
No utility bar. Logo (white mark 32×37 + "Lighthouse" Manrope 800 18px + "MARITIME AGENCY" 10.5px, 0.2em tracking), nav (Services, How we work, Ports, About, Contact, 15px/500, 2px red underline on hover and on the active page), a "Call" ghost button with a phone icon and the "Request a PDA" red button.
- **Fixed** to the top, 88px tall. On pages with a photo hero it starts **transparent**; after 40px of scroll it becomes **solid** `--deep` with a soft shadow (`0 10px 30px rgba(4,14,30,.28)`) and **shrinks to 70px**. Pages without a photo hero use the solid state from the start.
- **Hides** when scrolling down past 120px and **slides back** on scroll up (4px threshold), 320ms `--ease-out`. Never hidden while the mobile menu is open or focus is inside the header.
- Shrinking and hiding use transforms only, so the header never causes layout shift.
- On phone: logo + 44px menu button opening a full-screen navy menu.

### Quick PDA panel (Home hero)
Glass panel: `rgba(10,26,50,.6)`, `backdrop-filter: blur(16px)`, 1px `rgba(255,255,255,.14)` border, radius 14. A single PDA starter, **no tabs**: title "Request a PDA" (h5, 17px) + "Itemised port cost estimate before arrival" (14px, `--on-dark-muted`), then inline fields (Vessel name or IMO, Port select, ETA date) + red **"Continue"** button. Submitting carries vessel, port and eta to `/request-a-pda` as query params. Right column: "Vessel arriving soon?" + "Speak to our operations desk, day or night." + call button.

### Operations desk board (Home hero, below the quick panel)
Four cells in one rounded block (radius 14, cells `--panel`, 1px gaps showing `rgba(255,255,255,.10)`), 24×26 padding each. Labels: 11.5px uppercase, 0.12em, `--on-dark-label`.
1. **Apapa operations desk**: live Lagos time `HH:MM` (Manrope 700, 40px, tabular numbers) + "WAT", then "06°27′N 003°22′E · Lagos local time". Uses `Intl` with `Africa/Lagos`, 24-hour, updates every 30 seconds, not announced to screen readers. Without JS the time reads "Lagos (WAT)".
2. **Desk status**: green dot with a soft ring + "Open now" (Manrope 700, 24px) + "Answering 24 hours a day, every day."
3. **Coverage**: "9 ports + offshore" + "Lagos, Delta, Rivers and Cross River."
4. **PDA turnaround**: "Within [X] hours" + "After a complete request."
On phones the board is a 2×2 grid. It replaces the old stats bar on Home.

### Certified strip (white)
Centred: "Certified by" eyebrow + three equal logo slots (NPA, NIMASA, NCDMB · NOGIC JQS). Logos are monochrome `--label` (#5E6E84) at an equal visual height of about 48px. No CAC/RC in the strip. A slot without a logo file shows the authority's name in Manrope 700, `--label`.

### Service bento (Home)
12-column grid, 20px gap. Port agency spans 7 columns × 2 rows (min-height 620); Husbandry and Clearance span 5 columns each (300); Supply, Logistics and the dark "Tell us what your vessel needs" card span 4 columns each (380). Below 960px everything spans 12.
Card: radius 18, photo `object-fit: cover`, gradient `transparent 30% → rgba(6,18,36,.88~.92)`, content bottom-left (eyebrow `S—01`, title h3 or h4, one line of small text), round arrow button bottom-right (52px on the feature card, 44px on the others; white with navy arrow). Feature card also has a frosted "Core service" pill top-left.
Hover: the image scales to 1.06 over 600ms `--ease-out`; the arrow button turns red with a white arrow and moves 3px right.

### Promise tiles (Home About)
Stacked tiles with 14px gaps: `--mist` background, radius 12, padding 20×22, grid `52px | 1fr`; a 40px white square (radius 10) holding the red number (Manrope 800, 14px), then an h4 (20px) title and small muted text. The floating head-office card reads "HEAD OFFICE / 5 Bornu Crescent, Apapa, Lagos / Incorporated 2024".

### Phase panels (How a port call works, on `.bg-chart-dark`)
Three contained panels with 20px gaps: radius 16, padding 32, `rgba(255,255,255,.04)` fill, 1px `rgba(255,255,255,.10)` border. Each: "Phase N" eyebrow + "Stages 01–03" micro, h3 (28px), then the steps: a 44px circle (outline; stages 01 and 08 filled red) joined by a dashed line, h5 title, small description and a green "● You receive: …" line. The third panel ends (pushed to the bottom) with a soft note box: "Cost and updates, in writing".

### Port cards (Ports, on `.bg-chart-light`)
Four white cards, radius 16, padding 28, shadow `0 12px 32px rgba(11,42,82,.08)`. Header row: region eyebrow in navy (Lagos, Delta, Rivers, Cross River) + note on the right (Lagos: "Head office" in red; others: Western ports, Eastern ports, and offshore). Ports as h5 rows with a 9px marker: filled red for Apapa (head office), navy rings for the rest.

### Audience cards (Who we work with, on mist)
White cards, radius 16, no borders, a 52px icon tile (`--red-tint` for Oil and gas), h4 title, small text.

### Compliance cards (Home and About)
Cards on `--mist` (or white on a mist section), radius 16, padding 26. A 48px white logo area at the top (the authority's monochrome logo, or its name), then the name (h5), the role (small muted) and a "✓ Certified" pill (`--ok` on `--ok-bg`). On About a fourth card for the Corporate Affairs Commission (RC 7964161 · Incorporated 2024, "✓ Registered") has no logo area.

### CTA banner (Home) and CTA card (inner pages)
Home: photo with a dark left-to-right overlay, radius 20, padding up to 96, eyebrow + h2 + lead left, buttons right, inside a white section. Inner pages: the same card on `.bg-chart-dark` without a photo.

### Footer (`.bg-chart-dark`)
Logo, tagline and a red "Request a PDA" button; then the Services, Company and Contact columns; bottom line with © and the legal links.

### Section rail (Home, screens ≥ 1180px)
A fixed capsule on the right edge, vertically centred: white at 90% with a blur and a soft shadow, radius pill, padding 10×8. Six links 01–06 (About, Services, Port call, Ports, Clients, Compliance), each a number (Manrope 700, 11px) and a tick (2px). The current section is red with a 22px tick (others `--label`, 10px tick) and `aria-current="true"`. The label slides out on hover or keyboard focus.

### Forms (Request a PDA, Contact)
- Labels above fields, 14px/500. Inputs 16px, padding 14×16, radius 8, 1px `--line-strong`; focus 3px `rgba(11,42,82,.18)` ring + navy border.
- Hints in 13px `--label` beneath the field.
- PDA form: four `<fieldset>`s with legends styled as "01 The vessel" (red number + h3), separated by 1px rules.
- Purpose of call: toggle chips (radius pill, 1px border; selected = navy fill, white text, `aria-pressed`). Without JS they fall back to checkboxes.
- Sidebar: "What happens next" three-step list (dashed connector) and a `.bg-chart-dark` urgent card with phones and a WhatsApp button.
- Email typo help: on leaving the email field, a muted line "Did you mean name@gmail.com?" with the fix as an underlined navy button (one tap applies it). Never blocks.
- Check dialog (native `<dialog>`, radius 16, `--shadow-float`, dimmed navy backdrop): "Check your details" (Manrope 700, 26px), rows under a 2px navy rule (label in `--label`, value; email and phone in Manrope 700, 22px), buttons Edit (navy outline) and Looks right (red). Esc = Edit. On phones the buttons stack full width.
- Send panel (replaces the form after "Looks right"): 2px navy top rule, h3-size "Send your request", green reference line, buttons Send by email (red), Send on WhatsApp (navy, hidden until the number is set), Copy details (navy outline), a live status line, and an "Edit details" text link.
- Thank-you: green tick, "Your reference · LMA-PDA-…", h2 "One last step: press Send.", lead, buttons Copy details, Start a new request, Back to home.
- Errors: red 2px border plus a message below the field in `--red-hover`; the summary is announced with `aria-live`.
- No server: forms are sent from the visitor's email app (mailto:) or WhatsApp. Contact has no file upload; it says "Need to send documents? Attach them in your email app before sending."

### Mobile action bar (phones only, < 600px)
Fixed to the bottom: Call 24/7 | WhatsApp | Request a PDA (red, wider). White background, top border and a soft shadow, plus safe-area padding. Add bottom padding to `<body>` so the bar never covers content.

## 7. Motion
- Allowed: button colour transitions (200ms), card image zoom and arrow nudge on hover, mobile menu fade (200ms), the header's solid/shrink/hide transitions (320ms), the section rail's label slide.
- **Scroll reveal** (all pages): section headings, text and cards fade up 28px over 600ms `--ease-out` when about 15% visible, once only, with an 80ms stagger between siblings (headings, then text, then cards). Driven by IntersectionObserver and a class added only when JS runs, so everything is visible without JS. Never on the hero, the header or form fields.
- Not allowed: counters, parallax, carousels and auto-playing sliders.
- All motion is off under `prefers-reduced-motion: reduce` (reveal disabled entirely; header changes instantly).

## 8. Images
| File | Where | Alt text | object-position |
|---|---|---|---|
| hero-harbour.jpg | Home hero | A cargo vessel entering harbour at dusk past a quayside crane | 60% 55% |
| about-tug.jpg | Home About, phone About | A harbour tug under way | 48% 50% |
| svc-port-agency.jpg | Port agency card and service hero | A container vessel approaching port | center (TODO(brand-photo): MSC branding) |
| svc-husbandry.jpg | Husbandry card | A ship's officer inspecting anchor chain on the forecastle | 60% 40% |
| svc-clearance.jpg | Clearance card and hero; "What we need" on Port agency, Supply and Logistics | Calculator and pen on port cost documents | center |
| svc-supply.jpg | Supply card, About hero | A product tanker at sea at dawn | 55% 50% |
| svc-logistics.jpg | Logistics card | Container terminal cranes lit at night | 50% 45% |
| about-tug.jpg (again) | Husbandry page "What we need" | A harbour tug under way | 48% 50% |
| svc-husbandry.jpg (again) | Clearance page "What we need" | A ship's officer inspecting anchor chain on the forecastle | 60% 40% |
| cta-night.jpg | Home CTA banner | A container ship alongside under quay cranes at night | 50% 40% (TODO(brand-photo): EVERGREEN branding) |

## 9. SEO and meta
Each page: a unique `<title>` ("Port agency in Nigeria | Lighthouse Maritime Agency"), a meta description (≤ 155 characters, in CONTENT.md), canonical URL, Open Graph image (hero crop 1200×630), `LocalBusiness` JSON-LD on Home and Contact (name, address, phones, email, url; no ratings), `sitemap.xml` via `@astrojs/sitemap`, and `robots.txt`.
