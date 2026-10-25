// Validation rules for the Contact form (src/pages/contact.astro). Runs in the browser before the
// visitor sends the enquiry from their own email app or WhatsApp.

import { isValidEmail, isValidPhone } from './pda-rules';

export const ENQUIRY_TYPES = [
  { value: 'general', label: 'General question' },
  { value: 'tender', label: 'Tender or vendor registration' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'company-profile', label: 'Request company profile' },
  { value: 'careers', label: 'Careers' },
] as const;

export const CONTACT_MESSAGES = {
  name: { required: 'Please enter your full name.' },
  email: { format: 'Please enter a valid email address, for example name@company.com.' },
  phone: { format: 'Please enter a valid phone number, for example +234 806 118 9106.' },
  message: { required: 'Please write your message.' },
} as const;

export type ContactField = keyof typeof CONTACT_MESSAGES;

export function validateContact(values: Partial<Record<string, string>>): Partial<Record<ContactField, string>> {
  const errors: Partial<Record<ContactField, string>> = {};
  const get = (key: string) => (values[key] ?? '').trim();

  if (!get('name')) errors.name = CONTACT_MESSAGES.name.required;
  // Email and phone are optional: the reply goes to the sender's own address.
  if (get('email') && !isValidEmail(get('email'))) errors.email = CONTACT_MESSAGES.email.format;
  if (get('phone') && !isValidPhone(get('phone'))) errors.phone = CONTACT_MESSAGES.phone.format;
  if (!get('message')) errors.message = CONTACT_MESSAGES.message.required;

  return errors;
}

export function enquiryLabel(value: string): string {
  return ENQUIRY_TYPES.find((t) => t.value === value)?.label ?? ENQUIRY_TYPES[0].label;
}
