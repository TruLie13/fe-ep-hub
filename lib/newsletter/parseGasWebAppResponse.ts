/**
 * Google Apps Script web apps sometimes return JSON with a BOM, extra whitespace,
 * or wrapped inside HTML. Plain "Success" text is also common for older scripts.
 */
export type ParsedGasResult =
  | { kind: "ok" }
  | { kind: "duplicate" }
  | { kind: "unknown"; parsed: { ok?: unknown; error?: unknown } | null; rawSnippet: string };

export function parseGasWebAppResponse(raw: string): ParsedGasResult {
  const trimmed = raw.replace(/^\uFEFF/, "").trim();
  if (/^success$/i.test(trimmed)) {
    return { kind: "ok" };
  }

  let obj: { ok?: unknown; error?: unknown } | null = null;
  try {
    obj = JSON.parse(trimmed) as { ok?: unknown; error?: unknown };
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        obj = JSON.parse(match[0]) as { ok?: unknown; error?: unknown };
      } catch {
        obj = null;
      }
    }
  }

  if (obj && typeof obj === "object" && obj.error === "duplicate") {
    return { kind: "duplicate" };
  }

  if (obj && typeof obj === "object" && obj.ok === true) {
    return { kind: "ok" };
  }
  if (obj && typeof obj === "object" && obj.ok === "true") {
    return { kind: "ok" };
  }

  if (/['"]error['"]\s*:\s*['"]duplicate['"]/.test(trimmed)) {
    return { kind: "duplicate" };
  }
  if (/['"]ok['"]\s*:\s*true/.test(trimmed)) {
    return { kind: "ok" };
  }

  const snippet = trimmed.length > 280 ? `${trimmed.slice(0, 280)}…` : trimmed;
  return { kind: "unknown", parsed: obj, rawSnippet: snippet };
}
