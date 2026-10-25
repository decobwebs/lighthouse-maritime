# Lighthouse Maritime Agency: website handoff pack

Everything Claude Code needs to build the approved design, with nothing left to guess.

## How to use
1. Unzip this folder somewhere on your computer, e.g. `Documents/lighthouse-maritime`.
2. Open the folder in VS Code.
3. Start Claude Code in that folder. It reads `CLAUDE.md` automatically.
4. Open `docs/BUILD_PROMPTS.md` and paste **Stage 0** into Claude Code. When it finishes, check the result, then paste **Stage 1**, and so on through Stage 8.
5. To see the approved design at any time, open the files in `docs/design-reference/` in your browser.

## What's inside
| Path | What it is |
|---|---|
| `CLAUDE.md` | Standing instructions for Claude Code: stack, structure, rules (no invented facts, confidential numbers) |
| `docs/DESIGN.md` | The design system: colours, 13 type styles, layout, backgrounds, every component, motion, images, SEO |
| `docs/CONTENT.md` | Final copy for every page and all 5 service pages, plus meta titles and descriptions |
| `docs/BUILD_PROMPTS.md` | 9 ready-to-paste prompts, one per build stage |
| `docs/design-reference/` | The 7 approved screens as HTML (visual reference only) |
| `src/styles/tokens.css` | Design tokens and the four signature backgrounds |
| `src/assets/images/` | The 8 photos, compressed |
| `public/` | Redrawn logo mark (navy and white versions) and favicon |

## Still needed from Lighthouse
- PDA turnaround time, to replace `[X hours]` everywhere
- The operations WhatsApp number
- Team names, roles and photos (the team section stays hidden until then)
- The guide's review month and the port call checklist PDF
- Data retention period for the privacy policy, and a lawyer's review of it
- Optional: two replacement photos without other shipping lines' branding (MSC, EVERGREEN)

## Accounts you will need (all have free tiers)
Vercel (hosting), Resend (email), Supabase (form records), Cloudflare Turnstile (spam protection), Google Search Console, Google Business Profile.
