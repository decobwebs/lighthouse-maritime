// Site motion (DESIGN.md §7). Loaded by BaseLayout as a separate module after first paint, and only
// when <html> has `motion-on` (JS running, reduced motion off). Everything it hides was hidden by CSS
// under `motion-on`, so without this module (or without JS) the page is simply static.

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

const html = document.documentElement;
// If the 4s fallback already showed everything (very slow connection), stay static: no flicker.
const enabled = html.classList.contains('motion-on');
(window as unknown as { __motionReady: boolean }).__motionReady = true;

/* ---------- Smooth scroll: Lenis synced with ScrollTrigger ---------- */
const lenis = new Lenis({
  lerp: 0.1,
  syncTouch: false, // native touch scrolling on phones and tablets
  anchors: true, // in-page links scroll smoothly; the CSS scroll-padding-top keeps them clear of the header
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// Pause smooth scrolling while the mobile menu or any dialog is open.
const dialogs = [...document.querySelectorAll('dialog')];
const syncLenis = () => (dialogs.some((d) => d.open) ? lenis.stop() : lenis.start());
const dialogWatcher = new MutationObserver(syncLenis);
dialogs.forEach((d) => dialogWatcher.observe(d, { attributes: true, attributeFilter: ['open'] }));

/* ---------- Effects, by media query ---------- */
const mm = gsap.matchMedia();

// Reduced motion switched on mid-visit: drop to the static page.
mm.add('(prefers-reduced-motion: reduce)', () => {
  html.classList.remove('motion-on');
  lenis.stop();
  return () => lenis.start();
});

mm.add(
  {
    isDesktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
    isMobile: '(max-width: 1023px) and (prefers-reduced-motion: no-preference)',
  },
  (ctx) => {
    const { isDesktop, isMobile } = ctx.conditions as { isDesktop: boolean; isMobile: boolean };
    if (!enabled || !html.classList.contains('motion-on') || (!isDesktop && !isMobile)) return;

    headings();
    fades();
    cards();
    wipes();

    const hero = document.querySelector<HTMLElement>('[data-hero]');
    if (hero) {
      import('./hero').then(({ initHero }) => ctx.add(() => initHero(hero, isDesktop)));
    }
    if (document.querySelector('[data-voyage]')) {
      import('./voyage').then(({ initVoyage }) => ctx.add(() => initVoyage(isDesktop)));
    }
  },
);

/** Headings: lines slide up from behind a mask, once, when the heading reaches 80% of the viewport.
 *  Each heading is split only as it approaches the screen, to keep start-up work small. */
function headings() {
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    ScrollTrigger.create({ trigger: el, start: 'top bottom+=300', once: true, onEnter: () => splitHeading(el) });
  });
}

function splitHeading(el: HTMLElement) {
  SplitText.create(el, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'split-line',
    aria: 'none', // keep the text itself (no aria-label, which isn't allowed on <p>)
    autoSplit: true, // re-split on resize and when fonts finish loading
    onSplit(self) {
      gsap.set(el, { visibility: 'visible' });
      // Once revealed, put the plain text back so masks can never clip descenders.
      if (el.dataset.revealed) {
        self.revert();
        return;
      }
      return gsap.from(self.lines, {
        yPercent: 110,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
        onComplete: () => {
          el.dataset.revealed = '1';
          self.revert();
        },
      });
    },
  });
}

/** Eyebrows and lead text: fade up 28px just after their heading. */
function fades() {
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 85%',
    once: true,
    onEnter: (els) =>
      gsap.to(els, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08, delay: 0.15, overwrite: true }),
  });
}

/** Cards: rise 48px and settle from 0.96 to 1. */
function cards() {
  ScrollTrigger.batch('[data-card]', {
    start: 'top 88%',
    once: true,
    onEnter: (els) =>
      gsap.to(els, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out', stagger: 0.1, overwrite: true }),
  });
}

/** Images: clip-path wipe while the image settles from 1.08 to 1; then a gentle parallax. */
function wipes() {
  document.querySelectorAll<HTMLElement>('[data-wipe]').forEach((el) => {
    const media = el.querySelector<HTMLElement>(':scope > picture');
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 82%', once: true } });
    tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power3.inOut' });
    if (!media) return;
    tl.fromTo(media, { scale: 1.08 }, { scale: 1, duration: 1.1, ease: 'power3.inOut' }, 0);
    gsap.fromTo(
      media,
      { yPercent: -3 },
      { yPercent: 3, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
    );
  });
}
