import { getImage } from 'astro:assets';
import heroHarbour from '../assets/images/hero-harbour.jpg';

/** Home hero widths: 800 for phones (390px at 2x) up to the original's full 2000px. Never enlarged. */
export const HERO_WIDTHS = [800, 1280, 1600, 2000];
/** Higher quality keeps the photo sharp (and a real LCP image rather than a low-detail background). */
export const HERO_QUALITY = 85;

/** AVIF srcset for the <link rel="preload"> in the Home <head>; same URLs the <Picture> uses. */
export async function heroPreloadSrcset(): Promise<string> {
  const img = await getImage({ src: heroHarbour, widths: HERO_WIDTHS, format: 'avif', quality: HERO_QUALITY });
  return img.srcSet.attribute;
}
