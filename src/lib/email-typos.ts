// Suggests a fix for common email domain typos ("Did you mean name@gmail.com?").
// A suggestion only: forms never block on it.

const PROVIDER_FIXES: Record<string, string> = {
  gmial: 'gmail',
  gmai: 'gmail',
  gamil: 'gmail',
  yahooo: 'yahoo',
  yaho: 'yahoo',
  hotmial: 'hotmail',
  outlok: 'outlook',
};

const TLD_FIXES: Record<string, string> = {
  con: 'com',
  cmo: 'com',
};

/** Returns the corrected address, or null when nothing looks wrong. */
export function suggestEmail(value: string): string | null {
  const email = value.trim();
  const at = email.lastIndexOf('@');
  if (at < 1 || at === email.length - 1) return null;

  const local = email.slice(0, at);
  const parts = email.slice(at + 1).toLowerCase().split('.');

  // Provider name typo: fix the first label; a bare "gmai" gets ".com".
  const provider = PROVIDER_FIXES[parts[0]];
  if (provider) {
    parts[0] = provider;
    if (parts.length === 1) parts.push('com');
  }

  // Top-level domain typo: ".con" / ".cmo" → ".com".
  const last = parts.length - 1;
  if (last > 0 && TLD_FIXES[parts[last]]) parts[last] = TLD_FIXES[parts[last]];

  const fixed = `${local}@${parts.join('.')}`;
  return fixed.toLowerCase() === email.toLowerCase() ? null : fixed;
}
