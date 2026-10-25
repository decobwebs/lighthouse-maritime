// Responsive photo settings (DESIGN.md §8). Every photo in src/assets/images/ is generated as AVIF + WebP
// at these widths, but never wider than its source file.
import type { ImageMetadata } from 'astro';

const PHOTO_STEPS = [640, 960, 1280, 1920, 2560];

/** Output quality for all photos (AVIF and WebP). */
export const PHOTO_QUALITY = 80;

/** The standard widths that fit inside this source image. */
export function photoWidths(image: ImageMetadata): number[] {
  const widths = PHOTO_STEPS.filter((w) => w <= image.width);
  return widths.length ? widths : [image.width];
}
