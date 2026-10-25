// Certifying authorities (CONTENT.md "Certified by" / Compliance). Registration numbers stay
// confidential: only "Certified" is shown. Logos are monochrome #5E6E84 PNGs made from the files the
// client supplied; set `logo: null` to fall back to the text name in the same slot.
import type { ImageMetadata } from 'astro';
import npa from '../assets/logos/npa.png';
import nimasa from '../assets/logos/nimasa.png';
import ncdmb from '../assets/logos/ncdmb.png';

export interface Authority {
  name: string;
  /** Short label used in the logo strip when there is no logo. */
  short: string;
  role: string;
  logo: ImageMetadata | null;
  logoAlt: string;
}

export const AUTHORITIES: Authority[] = [
  { name: 'Nigerian Ports Authority', short: 'Nigerian Ports Authority', role: 'Shipping agent', logo: npa, logoAlt: 'Nigerian Ports Authority logo' },
  { name: 'NIMASA', short: 'NIMASA', role: 'Maritime services', logo: nimasa, logoAlt: 'NIMASA logo' },
  { name: 'NCDMB · NOGIC JQS', short: 'NCDMB · NOGIC JQS', role: 'Oil and gas vendor', logo: ncdmb, logoAlt: 'NCDMB logo' },
];
