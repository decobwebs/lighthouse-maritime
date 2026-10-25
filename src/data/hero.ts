import { getImage } from 'astro:assets';
import heroHarbour from '../assets/images/hero-harbour.jpg';

/** Home hero widths. 800 is the phone size (390px screens at 2× density). */
export const HERO_WIDTHS = [640, 800, 1280, 1600, 1920];

/** AVIF srcset for the <link rel="preload"> in the Home <head>; same URLs the <Picture> uses. */
export async function heroPreloadSrcset(): Promise<string> {
  const img = await getImage({ src: heroHarbour, widths: HERO_WIDTHS, format: 'avif' });
  return img.srcSet.attribute;
}
