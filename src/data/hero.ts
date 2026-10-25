import { getImage } from 'astro:assets';
import heroHarbour from '../assets/images/hero-harbour.jpg';
import { photoWidths, PHOTO_QUALITY } from './images';

/** Home hero widths: the standard photo steps (640–2560), never wider than the 2576px original. */
export const HERO_WIDTHS = photoWidths(heroHarbour);
export const HERO_QUALITY = PHOTO_QUALITY;

/** AVIF srcset for the <link rel="preload"> in the Home <head>; same URLs the <Picture> uses. */
export async function heroPreloadSrcset(): Promise<string> {
  const img = await getImage({ src: heroHarbour, widths: HERO_WIDTHS, format: 'avif', quality: HERO_QUALITY });
  return img.srcSet.attribute;
}
