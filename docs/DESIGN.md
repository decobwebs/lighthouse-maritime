# DESIGN.md: Lighthouse Maritime design system

Approved visual direction: **clean maritime editorial**. Photo-led dark heroes, white content sections divided by straight hairlines, generous spacing, a clear type hierarchy, one signal red reserved for action, and a lighthouse-beam ring pattern as the brand texture on dark surfaces.

Reference screens: `docs/design-reference/` (01 home desktop, 02 home phone, 03 request a PDA, 04 service page, 05 port-call guide, 06 about, 07 contact). All tokens live in `src/styles/tokens.css`.

---

## 1. Principles
1. **Clean and well spaced.** Sections have 128px vertical padding on desktop and 64px on phone. Content is capped at 1240px.
2. **Lines, not boxes.** Sections divide with a full-width 1px `--line` rule. Lists and tables divide with 1px rules; a 2px `--navy` rule marks the top of an important list.
3. **Hierarchy through type.** 13 distinct type styles. Section headings are two-tone: a bold first clause in ink and a lighter (weight 500) second clause in `--label` (on light) or `--on-dark-grey` (on dark).
4. **Red means act.** `--red` is used for the primary button (Request a PDA), section eyebrows on light, and stage 01 and 08 markers. Nothing decorative is red.
5. **Never plain, never busy.** Every dark section uses `.bg-rings`; some light sections use `.bg-glow`, `.bg-lines` or `.bg-dots`. No generic square grids.

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
| `--surface-alt` | #F6F8FB | Base of `.bg-lines` |
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
| stat | Manrope 700 | clamp(44, 4.6vw, 64) | 1 | -0.035em | Stats bar numbers |
| lead | Inter 400 | 20 | 1.6 | 0 | Hero and intro paragraphs |
| body | Inter 400 | 17 | 1.7 | 0 | Paragraphs |
| small | Inter 400 | 15 | 1.6 | 0 | Card text, captions |
| eyebrow | Inter 600, uppercase | 13 | 1.4 | 0.14em | Section labels ("02 — Services") |
| micro | Inter 500 | 12.5 | 1.4 | 0.02em | Meta, badges, breadcrumbs |

Phone sizes: display 40, h2 31, h3 24, h4 19, stat 40, lead 17, body 15.5.

**Two-tone headings:** `<h2>Everything your vessel needs <span class="dim">in a Nigerian port.</span></h2>`, where `.dim { color: var(--label); font-weight: 500 }` (on dark: `--on-dark-grey`).

**Eyebrows** are numbered on Home: `01 — About Lighthouse`, `02 — Services`, `03 — How a port call works`, `04 — Port coverage`, `05 — Who we work with`, `06 — Compliance`.

## 4. Layout
- Container: `max-width: 1240px; margin-inline: auto; padding-inline: var(--gutter)`.
- Section: `padding-block: var(--section-y)`; full-width `border-bottom: 1px solid var(--line)`.
- Section header pattern: left = eyebrow + h2 (max 640px); right = body paragraph (max 400px) or a link, bottom-aligned; wraps on phone.
- Breakpoints: ≥ 1200 desktop, 960 to 1199 compact desktop, 600 to 959 tablet (bento → single column), < 600 phone.
- Column dividers: multi-column rows (stats, ports, phases, contact) use vertical 1px rules between columns, not gaps or boxes. On phone, they become horizontal rules.

## 5. Backgrounds
Defined in `tokens.css`:
- `.bg-rings`: dark. Concentric 1px rings every 56px from the top-right corner, a red glow top-right and a blue glow bottom-left. Used on: How a port call works, the dark service card, inner-page heroes without photos, CTA bands, the footer and the urgent-contact card.
- `.bg-glow`: white with faint navy (bottom-left) and red (top-right) corner tints. Used on: About, Compliance, What's included.
- `.bg-lines`: #F6F8FB with vertical hairlines every 96px. Used on: Who we work with, What we need from you, guide CTA, map strip, team.
- `.bg-dots`: a 420px-tall dot field fading downwards behind the Services header.
- **Photo heroes:** the photo uses `object-fit: cover`, with three overlays: left-to-right `rgba(6,18,36,.92 → .68 → .30 → .20)`, a top fade of 200px at `.72` (keeps the white nav readable) and a bottom fade of 360px at `.92`.

## 6. Components

### Buttons (min-height 48, radius 6, 16px semibold, padding 17×30)
- **Primary:** `--red` background, white text; hover `--red-hover`. Optional trailing arrow icon.
- **Secondary on dark:** transparent, 1px `rgba(255,255,255,.35)` border; hover `rgba(255,255,255,.16)` fill.
- **Secondary on light:** 1px `--navy` border, navy text; hover fills navy with white text.
- **Dark solid:** `--navy` background (Contact form submit, Back to home).
- Focus: `outline: 3px solid` navy (on light) or white (on dark), offset 3px.

### Header
Utility bar (micro text): address on the left; operations email and "● 24/7 Operations · +234 806 118 9106" on the right; bottom border `--on-dark-line`. Then logo (white mark 34×40 + "Lighthouse" Manrope 800 19px + "MARITIME AGENCY" 11px, 0.2em tracking), nav (Services, How we work, Ports, About, Contact, 15px/500), "Call 24/7" ghost button and "Request a PDA" red button. Active page: a 2px red underline. On phone: logo + 44px menu button opening a full-screen navy menu.

### Quick PDA panel (Home hero)
Glass panel: `rgba(10,26,50,.58)`, `backdrop-filter: blur(16px)`, 1px `rgba(255,255,255,.14)` border, radius 14. Left: three tabs (Request a PDA, Port coverage, 24/7 desk), each with an icon tile and a two-line label; the active tab has a 2px white underline and a white icon tile. Below: inline fields (Vessel name or IMO, Port select, ETA date) + red "Get PDA" button. Submitting carries the values to `/request-a-pda` as query params. Right column: "Vessel arriving soon?" + call button + faint line-art ship. Tabs are real `role="tab"` buttons; Port coverage shows a compact port list; 24/7 desk shows the phone numbers.

### Stats bar
Four columns divided by vertical lines, 44px vertical padding, stat number in navy (accent `+` in red), small caption below.

### Certified strip
Eyebrow "Certified by" + the authority names in Manrope 700, 21px, `--label`. Text only, no logos.

### Service bento (Home)
12-column grid, 20px gap. Port agency spans 7 columns × 2 rows (min-height 620); Husbandry and Clearance span 5 columns each (300); Supply, Logistics and the dark "Tell us what your vessel needs" card span 4 columns each (380). Below 960px everything spans 12.
Card: radius 18, photo `object-fit: cover`, gradient `transparent 30% → rgba(6,18,36,.88~.92)`, content bottom-left (eyebrow `S—01`, title h3 or h4, one line of small text), round arrow button bottom-right (52px on the feature card, 44px on the others; white with navy arrow). Feature card also has a frosted "Core service" pill top-left.
Hover: the image scales to 1.06 over 600ms `--ease-out`; the arrow button turns red with a white arrow and moves 3px right.

### Promise rows (About)
A grid of `56px | 1fr`, red number, h4 title, small muted text, 1px rule below each row.

### Phase timeline (How a port call works, on `.bg-rings`)
Three columns (Before arrival, In port, Departure) divided by vertical `--on-dark-line`, top rule. Each column: "Phase N" eyebrow + "Stages 01–03" micro on one line, h3 title, then an ordered list of steps. Step: a 44px circle (outline; stages 01 and 08 filled red) joined by a dashed vertical line, h5 title, small description, and a green "● You receive: …" micro line. The last column ends with a bordered note: "Cost and updates, in writing".

### Port columns
2px navy top rule; four columns (Lagos / Delta / Rivers / Cross River & offshore) divided by vertical lines. Each: eyebrow region, micro sub-label (Lagos = "Head office" in red), then a list of ports in h5, separated by 1px rules.

### Audience cards (Who we work with)
White card, 1px border, a 3px navy top border (red for Oil and gas), radius `4 4 14 14`, a 52px icon tile, h4 title, small text.

### Certified list
2px navy top rule; rows of `48px icon | name + sub-label | badge`; green tick circle; "Certified" pill (`--ok` on `--ok-bg`). CAC row says "Registered".

### CTA banner
Photo with a dark left-to-right overlay, radius 20, padding up to 96, eyebrow + h2 + lead on the left, buttons on the right.

### Forms (Request a PDA, Contact)
- Labels above fields, 14px/500. Inputs 16px, padding 14×16, radius 8, 1px `--line-strong`; focus 3px `rgba(11,42,82,.18)` ring + navy border.
- Hints in 13px `--label` beneath the field.
- PDA form: four `<fieldset>`s with legends styled as "01 The vessel" (red number + h3), separated by 1px rules.
- Purpose of call: toggle chips (radius pill, 1px border; selected = navy fill, white text, `aria-pressed`). Without JS they fall back to checkboxes.
- Sidebar: "What happens next" three-step list (dashed connector) and a `.bg-rings` urgent card with phones and a WhatsApp button.
- Success: a dedicated thank-you page with a green tick, "Request received · Ref LMA-PDA-XXXX", h2, lead and two buttons.
- Errors: red 2px border plus a message below the field in `--red-hover`; the summary is announced with `aria-live`.

### Mobile action bar (phones only, < 600px)
Fixed to the bottom: Call 24/7 | WhatsApp | Request a PDA (red, wider). White background, top border and a soft shadow, plus safe-area padding. Add bottom padding to `<body>` so the bar never covers content.

## 7. Motion
- Allowed: button colour transitions (200ms), card image zoom and arrow nudge on hover, mobile menu fade (200ms).
- Not allowed: scroll-reveal on every block, counters, parallax, carousels and auto-playing sliders.
- All motion is off under `prefers-reduced-motion: reduce`.

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
