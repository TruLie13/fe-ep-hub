const LEGISTAR_CALENDAR_URL = "https://elpasotexas.legistar.com/Calendar.aspx";

export type CityCouncilCalendarHint = {
  dateLabel: string;
  timeLabel: string;
};

function decodeHtml(input: string): string {
  return input
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();
}

function formatDateLabel(rawMdy: string): string {
  const [m, d, y] = rawMdy.split("/").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d, 18, 0, 0));
  return dt.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Denver",
  });
}

export function parseNextCityCouncilHint(
  html: string,
): CityCouncilCalendarHint | null {
  // Legacy Legistar markup includes an "Upcoming Meetings" table row with:
  // body link text, meeting date in M/D/YYYY, and a labeled time span.
  const rowRegex =
    /<tr[^>]*>\s*<td[^>]*>[\s\S]*?<a[^>]+DepartmentDetail\.aspx[^>]*>\s*<font[^>]*>\s*(City Council)\s*<\/font>\s*<\/a>[\s\S]*?<td[^>]*>\s*<font[^>]*>\s*(\d{1,2}\/\d{1,2}\/\d{4})\s*<\/font>\s*<\/td>[\s\S]*?<span[^>]+lblTime[^>]*>\s*<font[^>]*>\s*([^<]+)\s*<\/font>\s*<\/span>[\s\S]*?<\/tr>/i;
  const match = html.match(rowRegex);
  if (!match) return null;

  const rawDate = decodeHtml(match[2]);
  const rawTime = decodeHtml(match[3]);
  if (!rawDate || !rawTime) return null;

  return {
    dateLabel: formatDateLabel(rawDate),
    timeLabel: rawTime,
  };
}

export async function fetchNextCityCouncilCalendarHint(): Promise<CityCouncilCalendarHint | null> {
  try {
    const res = await fetch(LEGISTAR_CALENDAR_URL, { next: { revalidate: 900 } });
    if (!res.ok) return null;
    const html = await res.text();
    return parseNextCityCouncilHint(html);
  } catch {
    return null;
  }
}
