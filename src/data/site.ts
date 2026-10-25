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

/** WhatsApp link, or the Contact page while the number is still a placeholder. */
export function whatsappHref(): string {
  // TODO(whatsapp): the number is not supplied yet; this falls back to /contact.
  const digits = SITE.whatsapp.replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}` : '/contact';
}

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
