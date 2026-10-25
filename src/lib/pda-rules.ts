// Shared validation rules for the PDA request form.
// Used by the browser (src/pages/request-a-pda.astro) and by the server (/api/pda, Stage 6),
// so both always apply exactly the same checks and messages.

import { PORT_OPTIONS } from '../data/site';

export const VESSEL_TYPES = ['Container', 'Tanker', 'Bulk carrier', 'General cargo', 'Offshore support', 'Other'] as const;
export const PURPOSES = ['Discharge', 'Load', 'Bunkers', 'Crew change', 'Husbandry only', 'Repairs / survey'] as const;
export const UNITS = ['Metric tonnes', 'TEU', 'Cubic metres', 'Barrels', 'Not applicable'] as const;
export const ROLES = ['Owner', 'Operator / manager', 'Charterer', 'Broker', 'Other'] as const;
export const PORTS = PORT_OPTIONS;

export const LAGOS_TZ = 'Africa/Lagos';

/**
 * IMO ship number check: exactly 7 digits, and the 7th is the check digit.
 * Multiply digits 1–6 by 7, 6, 5, 4, 3, 2 and add them up; the last digit of the sum must equal digit 7.
 * Accepts an optional "IMO" prefix and spaces (e.g. "IMO 9876543").
 */
export function normaliseImo(value: string): string {
  return value.trim().replace(/^imo\s*/i, '').replace(/\s+/g, '');
}

export function isSevenDigits(value: string): boolean {
  return /^\d{7}$/.test(normaliseImo(value));
}

export function isValidImo(value: string): boolean {
  const imo = normaliseImo(value);
  if (!/^\d{7}$/.test(imo)) return false;
  const digits = [...imo].map(Number);
  const sum = digits.slice(0, 6).reduce((total, d, i) => total + d * (7 - i), 0);
  return sum % 10 === digits[6];
}

/** Today's date in Lagos as YYYY-MM-DD, whatever the visitor's own time zone. */
export function lagosToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: LAGOS_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

export function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

/** ETA must be today or later, judged in Lagos time. ISO dates compare correctly as strings. */
export function isEtaNotPast(value: string, now: Date = new Date()): boolean {
  return isIsoDate(value) && value >= lagosToday(now);
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

/** Error messages, keyed by field name then rule. */
export const MESSAGES = {
  vessel: { required: 'Please enter the vessel name.' },
  imo: {
    required: "Please enter the vessel's IMO number.",
    format: 'The IMO number is 7 digits, for example 9876543.',
    checkDigit: "This doesn't look like a valid IMO number. Please check it.",
  },
  port: { required: 'Please choose a port.' },
  eta: {
    required: 'Please enter the ETA.',
    format: 'Please enter the ETA as a date.',
    past: 'The ETA cannot be in the past (Lagos time).',
  },
  name: { required: 'Please enter your full name.' },
  company: { required: 'Please enter your company.' },
  email: {
    required: 'Please enter your work email.',
    format: 'Please enter a valid email address, for example name@company.com.',
  },
} as const;

export type PdaField = keyof typeof MESSAGES;

/** Field values as plain strings (what both a FormData and a parsed body give us). */
export type PdaValues = Partial<Record<string, string>>;

/** Returns { field: message } for every problem; an empty object means the request is valid. */
export function validatePda(values: PdaValues, now: Date = new Date()): Partial<Record<PdaField, string>> {
  const errors: Partial<Record<PdaField, string>> = {};
  const get = (key: string) => (values[key] ?? '').trim();

  if (!get('vessel')) errors.vessel = MESSAGES.vessel.required;

  const imo = get('imo');
  if (!imo) errors.imo = MESSAGES.imo.required;
  else if (!isSevenDigits(imo)) errors.imo = MESSAGES.imo.format;
  else if (!isValidImo(imo)) errors.imo = MESSAGES.imo.checkDigit;

  if (!get('port') || !(PORTS as readonly string[]).includes(get('port'))) errors.port = MESSAGES.port.required;

  const eta = get('eta');
  if (!eta) errors.eta = MESSAGES.eta.required;
  else if (!isIsoDate(eta)) errors.eta = MESSAGES.eta.format;
  else if (!isEtaNotPast(eta, now)) errors.eta = MESSAGES.eta.past;

  if (!get('name')) errors.name = MESSAGES.name.required;
  if (!get('company')) errors.company = MESSAGES.company.required;

  const email = get('email');
  if (!email) errors.email = MESSAGES.email.required;
  else if (!isValidEmail(email)) errors.email = MESSAGES.email.format;

  return errors;
}
