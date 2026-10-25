// "The Voyage" (Home 03, DESIGN.md §7). Desktop: the section pins while an SVG route draws through
// eight stage nodes and a vessel follows it; each node activates as the vessel reaches it.
// Mobile: a vertical route line draws as you scroll and each stage lights up mid-screen.

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

/** Below this scale the pinned route's text would be too small to read; use the vertical voyage. */
const MIN_SCALE = 0.75;

export function initVoyage(isDesktop: boolean) {
  if (!isDesktop) return mobile();
  const cleanup = desktop();
  if (cleanup) return cleanup;
  // Short desktop screens: the pinned frame can't fit legibly, so stack it like on phones.
  const voyage = document.querySelector<HTMLElement>('[data-voyage]');
  voyage?.classList.add('voyage--stacked');
  const stacked = mobile();
  return () => {
    voyage?.classList.remove('voyage--stacked');
    stacked?.();
  };
}

const scaleFor = (desk: HTMLElement, frame: HTMLElement, section: HTMLElement) => {
  frame.style.transform = 'none';
  const natural = frame.offsetHeight;
  const offset = desk.getBoundingClientRect().top - section.getBoundingClientRect().top;
  const room = window.innerHeight - offset - 24;
  return { natural, scale: Math.min(1, desk.clientWidth / 1160, room / natural) };
};

function desktop() {
  const section = document.getElementById('process');
  const desk = document.querySelector<HTMLElement>('[data-voyage-desk]');
  const frame = document.querySelector<HTMLElement>('[data-voyage-frame]');
  const route = document.querySelector<SVGPathElement>('[data-voyage-route]');
  const vessel = document.querySelector<SVGGElement>('[data-voyage-vessel]');
  const nodes = [...document.querySelectorAll<HTMLElement>('[data-voyage-node]')];
  const phases = [...document.querySelectorAll<HTMLElement>('[data-voyage-phase]')];
  if (!section || !desk || !frame || !route || !vessel) return;

  // Too small to read once scaled to fit? Let initVoyage() fall back to the stacked layout.
  if (scaleFor(desk, frame, section).scale < MIN_SCALE) return;

  // Scale the 1160px frame so heading + route + note fit one screen while pinned (and the column width).
  const fit = () => {
    const { natural, scale } = scaleFor(desk, frame, section);
    frame.style.transform = `scale(${scale})`;
    frame.style.marginLeft = `${Math.max(0, (desk.clientWidth - 1160 * scale) / 2)}px`;
    desk.style.height = `${Math.ceil(natural * scale)}px`;
  };
  fit();
  ScrollTrigger.addEventListener('refreshInit', fit);

  const length = route.getTotalLength();
  // Where each node sits along the route (0–1). The route always moves left to right, so search by x.
  const fractions = nodes.map((node) => {
    const x = Number(node.dataset.x);
    let lo = 0;
    let hi = length;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (route.getPointAtLength(mid).x < x) lo = mid;
      else hi = mid;
    }
    return lo / length;
  });
  // Phase ranges: from its first node until the next phase's first node.
  const phaseOf: number[] = nodes.map((_, i) => (i < 3 ? 0 : i < 6 ? 1 : 2));
  const phaseStart = [0, 1, 2].map((p) => fractions[phaseOf.indexOf(p)]);

  const update = (p: number) => {
    nodes.forEach((node, i) => node.classList.toggle('is-on', p >= fractions[i] - 0.004));
    phases.forEach((el, pi) => {
      const from = phaseStart[pi] - 0.04;
      const to = pi < 2 ? phaseStart[pi + 1] - 0.04 : 2;
      el.classList.toggle('is-lit', p >= from && p < to);
    });
  };

  gsap.set(route, { strokeDasharray: length, strokeDashoffset: length });
  gsap.set(vessel, { opacity: 1 });

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: section, start: 'top top', end: '+=250%', pin: true, scrub: 0.6, anticipatePin: 1 },
    onUpdate: () => update(tl.progress()),
  });
  tl.to(route, { strokeDashoffset: 0, duration: 1 }, 0).to(
    vessel,
    { motionPath: { path: route, align: route, alignOrigin: [0.5, 0.5], autoRotate: true }, duration: 1 },
    0,
  );
  update(0);

  return () => {
    ScrollTrigger.removeEventListener('refreshInit', fit);
    frame.style.transform = '';
    frame.style.marginLeft = '';
    desk.style.height = '';
    nodes.forEach((n) => n.classList.remove('is-on'));
    phases.forEach((n) => n.classList.remove('is-lit'));
  };
}

function mobile() {
  const wrap = document.querySelector<HTMLElement>('[data-voyage-mob]');
  const fill = document.querySelector<HTMLElement>('[data-voyage-fill]');
  const steps = [...document.querySelectorAll<HTMLElement>('[data-voyage-step]')];
  if (!wrap || !fill) return;

  gsap.fromTo(
    fill,
    { scaleY: 0 },
    { scaleY: 1, ease: 'none', scrollTrigger: { trigger: wrap, start: 'top 50%', end: 'bottom 60%', scrub: true } },
  );
  steps.forEach((step) =>
    ScrollTrigger.create({
      trigger: step,
      start: 'top 50%',
      onEnter: () => step.classList.add('is-on'),
      onLeaveBack: () => step.classList.remove('is-on'),
    }),
  );
  return () => steps.forEach((s) => s.classList.remove('is-on'));
}
