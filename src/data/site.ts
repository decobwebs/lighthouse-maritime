// Site-wide facts from docs/CONTENT.md "Global facts". Use these instead of retyping them.

export const SITE = {
  name: 'Lighthouse Maritime Agency',
  legalName: 'Lighthouse Maritime Agency Ltd',
  url: 'https://lighthousemaritimeltd.com',
  rc: 'RC 7964161',
  incorporated: '27 September 2024',
  address: {
    street: '5 Bornu Crescent',
    area: 'Apapa',
    city: 'Lagos',
    country: 'Nigeria',
    short: '5 Bornu Crescent, Apapa, Lagos',
  },
  ops: {
    phone: '+234 806 118 9106',
    tel: 'tel:+2348061189106',
    email: 'operations@lighthousemaritimeltd.com',
  },
  admin: {
    phone: '+234 908 622 3063',
    tel: 'tel:+2349086223063',
    email: 'admin@lighthousemaritimeltd.com',
  },
  // Placeholder until the client supplies it (see PLACEHOLDERS.md).
  whatsapp: '[WhatsApp number]',
} as const;

/** Port call checklist PDF (in /public). null until the client supplies it: the download buttons render disabled. */
export const CHECKLIST_PDF: string | null = null;

/** About "Our team" section. Off until real names and photos are supplied (set SHOW_TEAM=true at build). */
export const SHOW_TEAM = import.meta.env.SHOW_TEAM === 'true';

/** WhatsApp link, or the Contact page while the number is still a placeholder. */
export function whatsappHref(): string {
  // TODO(whatsapp): the number is not supplied yet; this falls back to /contact.
  const digits = SITE.whatsapp.replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}` : '/contact';
}

/** Port coverage by region (CONTENT.md "04 — Port coverage"). */
export const PORT_REGIONS = [
  { region: 'Lagos', note: 'Head office', ports: ['Apapa', 'Tin Can Island', 'Lekki Deep Sea Port'] },
  { region: 'Delta', note: 'Western ports', ports: ['Warri', 'Escravos'] },
  { region: 'Rivers', note: 'Eastern ports', ports: ['Port Harcourt', 'Onne', 'Bonny'] },
  { region: 'Cross River & offshore', note: 'South-east and at sea', ports: ['Calabar', 'Offshore terminals and FPSOs'] },
] as const;

/** Port choices for the PDA forms: every named port, plus offshore. */
export const PORT_OPTIONS = [
  'Apapa',
  'Tin Can Island',
  'Lekki Deep Sea Port',
  'Warri',
  'Escravos',
  'Port Harcourt',
  'Onne',
  'Bonny',
  'Calabar',
  'Offshore terminal',
] as const;

export const NAV = [
  { label: 'Services', href: '/services' },
  { label: 'How we work', href: '/port-call-guide' },
  { label: 'Ports', href: '/ports' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

export const SERVICE_LINKS = [
  { label: 'Port agency', href: '/services/port-agency' },
  { label: 'Husbandry and crew', href: '/services/husbandry-and-crew-changes' },
  { label: 'Clearance', href: '/services/clearance-and-coordination' },
  { label: 'Ship supply', href: '/services/ship-supply-and-procurement' },
  { label: 'Logistics', href: '/services/logistics-and-project-support' },
] as const;

export const COMPANY_LINKS = [
  { label: 'About us', href: '/about' },
  { label: 'Port coverage', href: '/ports' },
  { label: 'Port call guide', href: '/port-call-guide' },
  { label: 'Compliance', href: '/about#compliance' },
  { label: 'Contact', href: '/contact' },
] as const;
