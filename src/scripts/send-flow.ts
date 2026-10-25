// Browser side of both forms (Request a PDA, Contact). The site has no server: a valid form opens
// a "Check your details" dialog, then a "Send your request" panel that hands the message to the
// visitor's own email app (mailto:) or WhatsApp, or copies it.

import { suggestEmail } from '../lib/email-typos';
import { makeRef, mailtoHref, whatsappTextHref } from '../lib/send';

type Values = Record<string, string>;
type Errors = Partial<Record<string, string>>;

export interface DialogRow {
  label: string;
  value: string;
  /** Contact details are shown large so typos stand out. */
  big?: boolean;
}

export interface SendFlowConfig {
  form: HTMLFormElement;
  kind: 'PDA' | 'ENQ';
  /** sessionStorage key for saved progress; the ref and sent summary use derived keys. */
  storageKey: string;
  fieldLabels: Record<string, string>;
  validate(values: Values): Errors;
  dialogRows(values: Values): DialogRow[];
  summary(values: Values, multi: Record<string, string[]>, ref: string): string;
  subject(values: Values, ref: string): string;
  to: string;
  cc: string;
  whatsappDigits: string | null;
  thankYouPath: string;
}

/* ---------- Saved progress ---------- */

export function draftKeys(storageKey: string) {
  return { draft: storageKey, ref: `${storageKey}-ref`, sent: `${storageKey}-sent` };
}

function storageGet(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}
function storageSet(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* private mode or storage blocked: the form still works, it just won't remember */
  }
}
export function storageClear(...keys: string[]) {
  try {
    keys.forEach((k) => sessionStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}

/** Copies text, falling back to a hidden textarea where the Clipboard API is unavailable. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.append(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    area.remove();
    return ok;
  }
}

/* ---------- Main ---------- */

export function setupSendFlow(cfg: SendFlowConfig) {
  const { form } = cfg;
  const keys = draftKeys(cfg.storageKey);
  const field = (name: string) =>
    form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
  const multiNames = new Set(
    [...form.querySelectorAll<HTMLInputElement>('input[type="checkbox"][name]')].map((b) => b.name),
  );
  let attempted = false;

  form.noValidate = true;

  function read(): { values: Values; multi: Record<string, string[]> } {
    const values: Values = {};
    const multi: Record<string, string[]> = {};
    new FormData(form).forEach((v, k) => {
      if (typeof v !== 'string') return;
      if (multiNames.has(k)) (multi[k] ??= []).push(v);
      else values[k] = v;
    });
    return { values, multi };
  }

  /* Saved progress */
  function save() {
    const { values, multi } = read();
    storageSet(keys.draft, JSON.stringify({ ...values, ...multi }));
  }
  function restore() {
    let data: Record<string, string | string[]> | null = null;
    try {
      data = JSON.parse(storageGet(keys.draft) ?? 'null');
    } catch {
      data = null;
    }
    if (!data) return;
    for (const [key, value] of Object.entries(data)) {
      if (Array.isArray(value)) {
        form.querySelectorAll<HTMLInputElement>(`input[name="${CSS.escape(key)}"]`).forEach((box) => {
          box.checked = value.includes(box.value);
        });
      } else {
        const el = field(key);
        if (el && !(el instanceof RadioNodeList)) el.value = value;
      }
    }
  }
  form.addEventListener('input', save);
  form.addEventListener('change', save);

  /* Errors */
  const summary = form.querySelector<HTMLElement>('[data-summary]')!;

  function setFieldError(name: string, message?: string) {
    const input = field(name);
    if (!input) return;
    const wrap = input.closest('.fld') as HTMLElement;
    const errId = `${input.id}-error`;
    let err = document.getElementById(errId);
    const described = (input.getAttribute('aria-describedby') ?? '').split(' ').filter((id) => id && id !== errId);
    if (message) {
      if (!err) {
        err = document.createElement('p');
        err.id = errId;
        err.className = 'fld__error';
        wrap.append(err);
      }
      err.textContent = message;
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', [...described, errId].join(' '));
      wrap.classList.add('fld--error');
    } else {
      err?.remove();
      input.removeAttribute('aria-invalid');
      if (described.length) input.setAttribute('aria-describedby', described.join(' '));
      else input.removeAttribute('aria-describedby');
      wrap.classList.remove('fld--error');
    }
  }

  function showErrors(errors: Errors) {
    Object.keys(cfg.fieldLabels).forEach((name) => setFieldError(name, errors[name]));
    const entries = Object.entries(errors).filter(([, m]) => m) as [string, string][];
    if (!entries.length) {
      summary.hidden = true;
      summary.replaceChildren();
      return;
    }
    const heading = document.createElement('p');
    heading.className = 'summary__title';
    heading.textContent =
      entries.length === 1 ? 'Please fix 1 problem before sending:' : `Please fix ${entries.length} problems before sending:`;
    const list = document.createElement('ul');
    for (const [name, message] of entries) {
      const a = document.createElement('a');
      a.href = `#${field(name)?.id}`;
      a.textContent = `${cfg.fieldLabels[name]}: ${message}`;
      a.addEventListener('click', (event) => {
        event.preventDefault();
        field(name)?.focus();
      });
      const li = document.createElement('li');
      li.append(a);
      list.append(li);
    }
    summary.replaceChildren(heading, list);
    summary.hidden = false;
  }

  const recheck = () => {
    if (attempted) showErrors(cfg.validate(read().values));
  };
  form.addEventListener('input', recheck);
  form.addEventListener('change', recheck);

  /* Email typo help: a suggestion with a one-tap fix, never a block */
  const email = field('email') as HTMLInputElement | null;
  if (email) {
    const wrap = email.closest('.fld') as HTMLElement;
    const hint = document.createElement('p');
    hint.className = 'fld__suggest';
    hint.setAttribute('aria-live', 'polite');
    wrap.append(hint);
    const clear = () => hint.replaceChildren();
    email.addEventListener('blur', () => {
      const fix = suggestEmail(email.value);
      if (!fix) return clear();
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'fld__suggest-btn';
      btn.textContent = fix;
      btn.addEventListener('click', () => {
        email.value = fix;
        clear();
        email.dispatchEvent(new Event('input', { bubbles: true }));
        email.focus();
      });
      hint.replaceChildren('Did you mean ', btn, '?');
    });
    email.addEventListener('input', () => {
      if (!suggestEmail(email.value)) clear();
    });
  }

  /* Check-your-details dialog */
  const dialog = document.querySelector<HTMLDialogElement>('[data-check-dialog]')!;
  const rows = dialog.querySelector<HTMLElement>('[data-check-rows]')!;
  const okBtn = dialog.querySelector<HTMLButtonElement>('[data-check-ok]')!;
  const editBtn = dialog.querySelector<HTMLButtonElement>('[data-check-edit]')!;
  let confirmed = false;

  function openDialog(values: Values) {
    rows.replaceChildren(
      ...cfg.dialogRows(values).map((row) => {
        const div = document.createElement('div');
        div.className = row.big ? 'check__row check__row--big' : 'check__row';
        const dt = document.createElement('dt');
        dt.textContent = row.label;
        const dd = document.createElement('dd');
        dd.textContent = row.value;
        div.append(dt, dd);
        return div;
      }),
    );
    confirmed = false;
    dialog.showModal();
    okBtn.focus();
  }

  // Keep Tab inside the dialog.
  dialog.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const items = [...dialog.querySelectorAll<HTMLElement>('button, a[href]')];
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  editBtn.addEventListener('click', () => dialog.close());
  okBtn.addEventListener('click', () => {
    confirmed = true;
    dialog.close();
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close(); // backdrop click = Edit
  });
  // Esc fires "cancel" then "close"; both it and Edit return to the form, focus on the email field.
  dialog.addEventListener('close', () => {
    if (confirmed) showSendPanel();
    else (email ?? field('phone'))?.focus();
  });

  /* Send panel */
  const panel = document.querySelector<HTMLElement>('[data-send-panel]')!;
  const refOut = panel.querySelector<HTMLElement>('[data-send-ref]')!;
  const emailLink = panel.querySelector<HTMLAnchorElement>('[data-send-email]')!;
  const waLink = panel.querySelector<HTMLAnchorElement>('[data-send-wa]')!;
  const copyBtn = panel.querySelector<HTMLButtonElement>('[data-send-copy]')!;
  const status = panel.querySelector<HTMLElement>('[data-send-status]')!;
  const backBtn = panel.querySelector<HTMLButtonElement>('[data-send-back]')!;
  let current = { ref: '', text: '' };

  function showSendPanel() {
    const { values, multi } = read();
    // One reference per request: reuse it if the visitor goes back to edit.
    const ref = storageGet(keys.ref) ?? makeRef(cfg.kind);
    storageSet(keys.ref, ref);
    const text = cfg.summary(values, multi, ref);
    current = { ref, text };
    storageSet(keys.sent, JSON.stringify({ ref, text }));

    refOut.textContent = ref;
    emailLink.href = mailtoHref({ to: cfg.to, cc: cfg.cc, subject: cfg.subject(values, ref), body: text });
    if (cfg.whatsappDigits) {
      waLink.href = whatsappTextHref(cfg.whatsappDigits, text);
      waLink.hidden = false;
    } else {
      waLink.hidden = true;
    }
    status.textContent = '';
    form.hidden = true;
    panel.hidden = false;
    panel.querySelector<HTMLElement>('[data-send-title]')?.focus();
  }

  const goToThanks = () =>
    window.setTimeout(() => window.location.assign(`${cfg.thankYouPath}?ref=${encodeURIComponent(current.ref)}`), 800);
  emailLink.addEventListener('click', goToThanks); // the mailto: opens the email app; then we move on
  waLink.addEventListener('click', goToThanks); // WhatsApp opens in a new tab

  copyBtn.addEventListener('click', async () => {
    const ok = await copyText(current.text);
    status.textContent = ok
      ? `Copied. Paste it into an email to ${cfg.to}`
      : `Copying didn't work here. Please email ${cfg.to} instead.`;
  });

  backBtn.addEventListener('click', () => {
    panel.hidden = true;
    form.hidden = false;
    (email ?? field('phone'))?.focus();
  });

  /* Submit: validate, then check */
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    attempted = true;
    const { values } = read();
    const errors = cfg.validate(values);
    showErrors(errors);
    if (Object.keys(errors).length) {
      summary.focus();
      return;
    }
    openDialog(values);
  });

  return { restore, save, read };
}
