// Home hero motion (DESIGN.md §7): entrance, lighthouse beam, ambient drift (desktop) and scroll-out.
// Runs inside a gsap.matchMedia() context, so everything here is reverted if the media query changes.

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initHero(hero: HTMLElement, isDesktop: boolean) {
  const q = <T extends Element = HTMLElement>(sel: string) => hero.querySelector<T>(sel as never) as T | null;
  const qa = <T extends Element = HTMLElement>(sel: string) => [...hero.querySelectorAll<T>(sel as never)] as T[];

  const picture = q('.hero__picture');
  const img = q('.hero__img');
  const dim = q('[data-hero-dim]');
  const dimScroll = q('[data-hero-dim-scroll]');
  const body = q('[data-hero-body]');
  const title = q('[data-hero-title]');
  const items = qa('[data-hero-item]');
  const panel = q('[data-hero-panel] .qp');
  const cells = qa('[data-desk-cell]');
  const ticks = qa('[data-tick]');
  const rings = qa('.hero__ring');
  const cta = q('[data-hero-cta]');
  const cone = q('[data-hero-cone]');

  /* ---------- Entrance (once) ---------- */
  const intro = gsap.timeline();
  intro
    .fromTo(img, { scale: 1.08, filter: 'brightness(0.8)' }, { scale: 1, filter: 'brightness(1)', duration: 1.8, ease: 'expo.out' }, 0)
    .fromTo(dim, { opacity: 0.35 }, { opacity: 0, duration: 1.8, ease: 'expo.out' }, 0);

  if (title) {
    // Split only once the web fonts are in, so the masked lines match the final line breaks (no shift).
    intro.pause();
    document.fonts.ready.then(() => {
      const split = splitWordsByLine(title);
      gsap.set(title, { visibility: 'visible' });
      split.lines.forEach((words, i) => {
        intro.from(words, { yPercent: 110, duration: 0.9, ease: 'power3.out' }, 0.3 + i * 0.1);
      });
      intro.call(split.revert, [], 0.3 + (split.lines.length - 1) * 0.1 + 0.9); // plain text again once in place
      intro.play(0);
    });
  }

  // Badge, lead, buttons, then the PDA panel and the desk board, 0.12s apart.
  intro
    .to(items, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12 }, 0.75)
    .to(panel, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 0.75 + items.length * 0.12)
    .to(cells, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08 }, '<0.12')
    .to(ticks, { y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.08 }, '<0.2')
    // One soft pulse around Request a PDA: two rings, then stop.
    .fromTo(rings, { opacity: 0.6, scale: 1 }, { opacity: 0, scale: 1.45, duration: 1.2, ease: 'power2.out', stagger: 0.3 });

  /* ---------- Lighthouse beam ---------- */
  const angles = { start: 0, end: 0 };
  const placeBeam = () => {
    if (!cone) return;
    const w = hero.offsetWidth;
    const h = hero.offsetHeight;
    const ox = w + 24; // just off the right edge
    const oy = h * 0.3;
    const size = 2 * Math.hypot(w, h);
    gsap.set(cone, { width: size, height: size, left: ox - size / 2, top: oy - size / 2 });
    const angleTo = (x: number, y: number) => (Math.atan2(x - ox, -(y - oy)) * 180) / Math.PI;
    angles.start = angleTo(w * 0.62, h * 0.04); // upper right
    if (cta) {
      const heroBox = hero.getBoundingClientRect();
      const b = cta.getBoundingClientRect();
      angles.end = angleTo(b.left - heroBox.left + b.width / 2, b.top - heroBox.top + b.height / 2);
    } else {
      angles.end = angleTo(w * 0.15, h * 0.45);
    }
  };
  placeBeam();

  const sweep = (peak: number, shine: boolean) => {
    const tl = gsap.timeline();
    tl.set(cone, { rotation: () => angles.start })
      .to(cone, { opacity: peak, duration: 0.5, ease: 'power1.out' }, 0)
      .to(cone, { rotation: () => angles.end, duration: 2.4, ease: 'power2.inOut' }, 0)
      .to(cone, { opacity: 0, duration: 0.8, ease: 'power1.in' }, 2.3);
    if (shine && cta) {
      tl.call(() => {
        cta.classList.remove('is-shining');
        void cta.offsetWidth; // restart the CSS shine
        cta.classList.add('is-shining');
      }, [], 2.0);
    }
    return tl;
  };

  const gap = isDesktop ? 14 : 20;
  const first = sweep(1, true).delay(1.0);
  const repeat = gsap.timeline({ repeat: -1, repeatDelay: gap, paused: true });
  repeat.add(sweep(0.5, false));
  first.eventCallback('onComplete', () => {
    gsap.delayedCall(gap, () => {
      if (heroVisible && !document.hidden) repeat.play();
    });
  });

  // Pause the beam when the hero is off screen or the tab is hidden.
  let heroVisible = true;
  const syncBeam = () => {
    if (heroVisible && !document.hidden) {
      if (first.progress() === 1) repeat.resume();
    } else {
      repeat.pause();
    }
  };
  ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: 'bottom top',
    onLeave: () => {
      heroVisible = false;
      syncBeam();
    },
    onEnterBack: () => {
      heroVisible = true;
      syncBeam();
    },
  });
  document.addEventListener('visibilitychange', syncBeam);
  const onRefresh = () => {
    placeBeam();
    repeat.invalidate();
  };
  ScrollTrigger.addEventListener('refresh', onRefresh);

  /* ---------- Ambient drift (desktop): translate only, after the entrance ---------- */
  if (isDesktop) {
    gsap.to(picture, { xPercent: -1.5, duration: 30, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.8 });
  }

  /* ---------- Scroll-out (scrub, reversible) ---------- */
  const scrub = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true };
  // The photo moves at about 60% of scroll speed: it slides down 40% of the hero height as the hero leaves.
  gsap.to(picture, { y: () => hero.offsetHeight * 0.4, ease: 'none', scrollTrigger: scrub });
  gsap.to(body, { y: -80, opacity: 0.2, ease: 'none', scrollTrigger: { ...scrub } });
  gsap.fromTo(dimScroll, { opacity: 0 }, { opacity: 0.25, ease: 'none', scrollTrigger: { ...scrub } });

  return () => {
    document.removeEventListener('visibilitychange', syncBeam);
    ScrollTrigger.removeEventListener('refresh', onRefresh);
    cta?.classList.remove('is-shining');
  };
}

/** Lightweight line reveal for the hero headline (instead of loading SplitText before first paint):
 *  each word sits in its own clipping mask, and words are grouped by the line they fall on, so whole
 *  lines rise together exactly like masked lines. `revert` restores the original markup. */
function splitWordsByLine(el: HTMLElement) {
  const original = el.innerHTML;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const texts: Text[] = [];
  while (walker.nextNode()) texts.push(walker.currentNode as Text);

  const words: HTMLElement[] = [];
  for (const text of texts) {
    const frag = document.createDocumentFragment();
    for (const part of text.data.split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        frag.append(' ');
        continue;
      }
      const mask = document.createElement('span');
      mask.className = 'word-mask';
      const word = document.createElement('span');
      word.className = 'word-mask__word';
      word.textContent = part;
      mask.append(word);
      frag.append(mask);
      words.push(word);
    }
    text.replaceWith(frag);
  }

  const lines: HTMLElement[][] = [];
  let lineTop = -Infinity;
  for (const word of words) {
    const top = word.parentElement!.getBoundingClientRect().top;
    if (top > lineTop + 2) {
      lines.push([]);
      lineTop = top;
    }
    lines[lines.length - 1].push(word);
  }
  return { lines, revert: () => void (el.innerHTML = original) };
}
