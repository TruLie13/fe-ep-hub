/** First or last name: ASCII letters only (no spaces or punctuation). */
const NAME_LETTERS_ONLY = /^[a-zA-Z]+$/;

export function isValidSignupName(value: string): boolean {
  return NAME_LETTERS_ONLY.test(value);
}

/**
 * Practical email check: single @, non-empty local and domain, domain contains a dot, TLD at least 2 letters.
 */
export function isValidSignupEmail(value: string): boolean {
  const v = value.trim();
  if (v.length < 5) return false;
  const parts = v.split("@");
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (!local || !domain) return false;
  if (/\s/.test(v)) return false;
  if (!domain.includes(".")) return false;
  const tld = domain.split(".").pop() ?? "";
  if (tld.length < 2 || !/^[a-zA-Z]+$/.test(tld)) return false;
  if (!/^[a-zA-Z0-9._%+-]+$/.test(local)) return false;
  if (!/^[a-zA-Z0-9.-]+$/.test(domain)) return false;
  return true;
}

/**
 * Keeps digits only, caps at 10 for US NANP.
 * Strips a leading country code `1` when autofill yields 11 digits (e.g. +1 555 123 4567).
 */
export function sanitizePhoneDigits(input: string): string {
  let d = input.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("1")) {
    d = d.slice(1);
  }
  return d.slice(0, 10);
}

/** US display: (555) 555-5555 */
export function formatUsPhone(digits: string): string {
  const d = digits.slice(0, 10);
  if (d.length === 0) return "";
  if (d.length <= 3) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}
