/**
 * Reddit Atom / HTML often double-encodes query separators (`&amp;amp;` → `&amp;`).
 * Literal `&amp;` in the request URL makes `*.redd.it` return 403.
 */
export function sanitizeThumbnailUrl(url: string): string {
  let out = url.trim();
  for (let i = 0; i < 5 && out.includes("&amp;"); i += 1) {
    out = out.replaceAll("&amp;", "&");
  }
  return out.replaceAll("&quot;", '"');
}
