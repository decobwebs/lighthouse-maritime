// Builds what the visitor sends: a reference, a short plain-text summary, and the mailto: and
// WhatsApp links. Pure functions, no DOM.

import { lagosToday } from './pda-rules';
import { enquiryLabel } from './contact-rules';

/** Messages stay under this many characters so every email app and WhatsApp accepts them. */
export const SUMMARY_LIMIT = 1500;
const CONTINUED = '… (continued in reply)';

// No 0/O or 1/I, so a reference read out over the phone is unambiguous.
const REF_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** e.g. LMA-PDA-20261025-K7QX (date in Lagos time). */
export function makeRef(kind: 'PDA' | 'ENQ', now: Date = new Date()): string {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const suffix = [...bytes].map((b) => REF_ALPHABET[b % REF_ALPHABET.length]).join('');
  return `LMA-${kind}-${lagosToday(now).replace(/-/g, '')}-${suffix}`;
}

/** 2026-11-04 → "4 Nov 2026". */
export function formatDate(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(`${iso}T00:00:00Z`));
}

type Values = Partial<Record<string, string>>;

/** "Label: value" lines, skipping anything left empty. */
function lines(pairs: [string, string | undefined][]): string {
  return pairs
    .filter(([, v]) => v && v.trim())
    .map(([k, v]) => `${k}: ${v!.trim()}`)
    .join('\n');
}

/** Joins the fixed part and the notes, trimming the notes so the whole stays under the limit. */
function withNotes(head: string, label: string, notes: string | undefined, limit = SUMMARY_LIMIT): string {
  const text = (notes ?? '').trim().replace(/\r\n/g, '\n');
  if (!text) return head;
  const prefix = `${head}\n\n${label}:\n`;
  if ((prefix + text).length <= limit) return prefix + text;
  const room = Math.max(0, limit - prefix.length - CONTINUED.length);
  return prefix + text.slice(0, room).trimEnd() + CONTINUED;
}

export function pdaSummary(v: Values, purposes: string[], ref: string): string {
  const quantity = [v.quantity, v.quantity?.trim() && v.unit !== 'Not applicable' ? v.unit : ''].filter(Boolean).join(' ');
  const head = [
    `PDA request · ${ref}`,
    '',
    lines([
      ['Vessel', v.vessel],
      ['IMO', v.imo],
      ['Type', v.vesselType],
      ['Flag', v.flag],
      ['Port', v.port],
      ['ETA', v.eta ? formatDate(v.eta) : ''],
      ['ETD', v.etd ? formatDate(v.etd) : ''],
      ['Purpose', purposes.join(', ')],
      ['Cargo', v.cargoType],
      ['Quantity', quantity],
    ]),
    '',
    lines([
      ['Name', v.name],
      ['Company', v.company],
      ['Role', v.role],
      ['Email', v.email],
      ['Phone', v.phone],
    ]),
  ].join('\n');
  return withNotes(head, 'Notes', v.notes);
}

export function pdaSubject(v: Values, ref: string): string {
  return `PDA request · ${v.vessel?.trim()} · ${v.port} · ETA ${formatDate(v.eta ?? '')} · ${ref}`;
}

export function contactSummary(v: Values, ref: string): string {
  const head = [
    `Enquiry · ${ref}`,
    '',
    lines([
      ['Type', enquiryLabel(v.enquiry ?? '')],
      ['Name', v.name],
      ['Company', v.company],
      ['Email', v.email],
      ['Phone', v.phone],
    ]),
  ].join('\n');
  return withNotes(head, 'Message', v.message);
}

export function contactSubject(v: Values, ref: string): string {
  return ['Enquiry', enquiryLabel(v.enquiry ?? ''), v.company?.trim(), ref].filter(Boolean).join(' · ');
}

/** mailto: link with cc, subject and body, each percent-encoded; line breaks become CRLF. */
export function mailtoHref(opts: { to: string; cc?: string; subject: string; body: string }): string {
  const enc = (s: string) => encodeURIComponent(s.replace(/\r?\n/g, '\r\n'));
  const params = [opts.cc && `cc=${enc(opts.cc)}`, `subject=${enc(opts.subject)}`, `body=${enc(opts.body)}`];
  return `mailto:${opts.to}?${params.filter(Boolean).join('&')}`;
}

/** https://wa.me/<digits>?text=… */
export function whatsappTextHref(digits: string, text: string): string {
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
