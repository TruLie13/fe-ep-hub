/**
 * Display line for a calendar date (YYYY-MM-DD): localized date plus relative phrase.
 */
export function formatPublishedLine(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(d.getTime())) return isoDate;

  const full = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const now = new Date();
  const rel = relativeFromPublished(d, now);
  return rel ? `${full} · ${rel}` : full;
}

function relativeFromPublished(d: Date, now: Date): string | null {
  const dayMs = 86_400_000;
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / dayMs);

  if (diffMs < 0) return null;

  if (diffDays === 0) return "today";

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (diffDays < 7) {
    return rtf.format(-diffDays, "day");
  }
  if (diffDays < 60) {
    const weeks = Math.round(diffDays / 7);
    return rtf.format(-weeks, "week");
  }
  if (diffDays < 365) {
    const months = Math.round(diffDays / 30);
    return rtf.format(-months, "month");
  }
  const years = Math.round(diffDays / 365);
  return rtf.format(-years, "year");
}
