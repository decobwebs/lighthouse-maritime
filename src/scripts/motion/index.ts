// Site motion (DESIGN.md §7). Loaded by BaseLayout as a separate module after first paint, and only
// when <html> has `motion-on` (JS running, reduced motion off). Everything it hides was hidden by CSS
// under `motion-on`, so without this module (or without JS) the page is simply static.

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SplitText as SplitTextType } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// SplitText is only needed once the first section heading nears the screen, so it loads then.
let splitTextLoad: Promise<typeof SplitTextType> | null = null;
const loadSplitText = () =>
  (splitTextLoad ??= import('gsap/SplitText').then(({ SplitText }) => {
    gsap.registerPlugin(SplitText);
    return SplitText;
  }));

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

// Lenis handles in-page links itself, so the browser no longer moves focus to the target (e.g. the
// skip link). Move it there, without a second scroll, so keyboard users continue from the right place.
function focusTarget(target: HTMLElement) {
  if (!target.matches('a[href], button, input, select, textarea, [tabindex]')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}
document.addEventListener('click', (e) => {
  const link = (e.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href^="#"]:not([role="button"])');
  const hash = link?.getAttribute('href');
  const target = hash && hash !== '#' ? document.querySelector<HTMLElement>(hash) : null;
  if (target) requestAnimationFrame(() => focusTarget(target));
});

// Anything that takes keyboard focus before its reveal has run (or finished) is shown at once, so a
// focused link or card is never invisible.
document.addEventListener('focusin', (e) => {
  const hidden = (e.target as Element | null)?.closest?.<HTMLElement>('[data-card], [data-reveal]');
  if (hidden && !hidden.dataset.shown) {
    hidden.dataset.shown = '1'; // the scroll reveal below skips it
    gsap.to(hidden, { opacity: 1, y: 0, scale: 1, duration: 0.2, overwrite: true });
  }
});

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

    const hero = document.querySelector<HTMLElement>('[data-hero]');
    if (hero) {
      import('./hero').then(({ initHero }) => ctx.add(() => initHero(hero, isDesktop)));
    }

    // Each set-up step runs in its own task, so start-up never blocks the main thread for long.
    let reverted = false;
    const voyage = document.getElementById('process');
    const steps = [headings, fades, cards, wipes, () => voyage && document.querySelector('[data-voyage]') && lazyVoyage(voyage, isDesktop, ctx)];
    const runNext = () => {
      const step = steps.shift();
      if (!step || reverted) return;
      ctx.add(step);
      setTimeout(runNext, 0);
    };
    setTimeout(runNext, 0);
    return () => {
      reverted = true;
    };
  },
);

/** The Voyage (Home 03) loads only when its section is within a screen of the viewport. Its desktop pin
 *  adds 250% of the viewport height to the page, so: in-page links wait for it before scrolling, and if
 *  the reader is already below the section, the scroll position moves with the added height. */
function lazyVoyage(section: HTMLElement, isDesktop: boolean, ctx: gsap.Context) {
  let started: Promise<void> | null = null;
  const start = () =>
    (started ??= import('./voyage')
      .then(({ initVoyage }) => {
        // The section after the Voyage shows how far the pin pushes the rest of the page down.
        const next = section.nextElementSibling ?? document.getElementById('site-footer');
        const below = section.getBoundingClientRect().bottom <= 0;
        const scrollBefore = window.scrollY;
        const before = next ? next.getBoundingClientRect().top + window.scrollY : 0;
        ctx.add(() => initVoyage(isDesktop));
        ScrollTrigger.sort(); // the pin sits above triggers created earlier: recalculate in page order
        ScrollTrigger.refresh();
        const added = next ? next.getBoundingClientRect().top + window.scrollY - before : 0;
        if (below && Math.abs(added) > 1) {
          lenis.resize(); // let Lenis see the new page height before it clamps the target
          lenis.scrollTo(scrollBefore + added, { immediate: true, force: true });
          ScrollTrigger.update();
        }
      })
      .catch(() => section.classList.add('voyage-failed'))); // show the static phases instead

  ctx.add(() => {
    ScrollTrigger.create({ trigger: section, start: 'top bottom+=100%', once: true, onEnter: () => void start() });
    const onClick = (e: MouseEvent) => {
      if (started) return;
      // Plain in-page links only (not the menu button, whose #site-footer href is its no-JS fallback).
      const link = (e.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href^="#"]:not([role="button"])');
      const hash = link?.getAttribute('href');
      const target = hash && hash !== '#' ? document.querySelector<HTMLElement>(hash) : null;
      // Only targets below the Voyage move when its pin is added.
      if (!target || section.contains(target) || !(section.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING)) return;
      e.preventDefault();
      e.stopImmediatePropagation(); // Lenis would scroll to where the target is before the pin exists
      void start().then(() => {
        lenis.scrollTo(target);
        focusTarget(target);
      });
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  });
}

/** Headings: lines slide up from behind a mask, once, when the heading reaches 80% of the viewport.
 *  Each heading is split only as it approaches the screen, to keep start-up work small. */
function headings() {
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    ScrollTrigger.create({ trigger: el, start: 'top bottom+=300', once: true, onEnter: () => splitHeading(el) });
  });
}

function splitHeading(el: HTMLElement) {
  loadSplitText()
    .then((SplitText) => splitHeadingWith(SplitText, el))
    .catch(() => gsap.set(el, { visibility: 'visible' }));
}

function splitHeadingWith(SplitText: typeof SplitTextType, el: HTMLElement) {
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

/** Elements not already shown because they took keyboard focus first. */
const notShown = (els: Element[]) => els.filter((el) => !(el as HTMLElement).dataset.shown);

/** Eyebrows and lead text: fade up 28px just after their heading. */
function fades() {
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 85%',
    once: true,
    onEnter: (els) =>
      gsap.to(notShown(els), { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08, delay: 0.15, overwrite: true }),
  });
}

/** Cards: rise 48px and settle from 0.96 to 1. */
function cards() {
  ScrollTrigger.batch('[data-card]', {
    start: 'top 88%',
    once: true,
    onEnter: (els) =>
      gsap.to(notShown(els), { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out', stagger: 0.1, overwrite: true }),
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
