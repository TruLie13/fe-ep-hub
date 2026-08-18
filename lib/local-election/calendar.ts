export type AllDayCalendarEvent = {
  title: string;
  /** Inclusive start (YYYY-MM-DD). */
  startDate: string;
  /** Inclusive end for multi-day events (YYYY-MM-DD). Defaults to startDate. */
  endDate?: string;
  description?: string;
  /** Download filename without extension. */
  filename: string;
};

function toIcsDate(iso: string): string {
  return iso.replace(/-/g, "");
}

function exclusiveEndDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + 1);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}

function escapeIcsText(value: string): string {
  return value.replace(/[\\;,]/g, (char) => `\\${char}`).replace(/\n/g, "\\n");
}

/** All-day event ICS (Apple Calendar, Google Calendar import, Outlook). */
export function buildAllDayIcs(event: AllDayCalendarEvent): string {
  const endInclusive = event.endDate ?? event.startDate;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//El Paso Hub//Election//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `DTSTART;VALUE=DATE:${toIcsDate(event.startDate)}`,
    `DTEND;VALUE=DATE:${exclusiveEndDate(endInclusive)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    event.description ? `DESCRIPTION:${escapeIcsText(event.description)}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}

export function downloadIcsFile(ics: string, filename: string) {
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${filename}.ics`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
