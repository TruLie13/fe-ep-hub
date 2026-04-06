export type SerializedEvent = {
  EventId: number;
  EventBodyName: string;
  EventDate: string;
  EventTime: string | null;
  EventLocation: string | null;
  EventAgendaFile: string | null;
  EventMinutesFile: string | null;
  EventVideoPath: string | null;
  EventInSiteURL: string;
  EventAgendaStatusName: string | null;
  EventComment: string | null;
};

/** True when the location text describes a remote session, not a street address for maps. */
export function isVirtualMeetingLocation(location: string): boolean {
  const n = location.trim().toLowerCase();
  if (!n) return false;
  return (
    /\bvirtual\b/.test(n) ||
    /\bremote\b/.test(n) ||
    /\bwebinar\b/.test(n) ||
    /\bteleconference\b/.test(n) ||
    /\bzoom\b/.test(n) ||
    /\bwebex\b/.test(n) ||
    /\b(google meet|microsoft teams|ms teams)\b/.test(n) ||
    /\bonline\s+(meeting|session|hearing)\b/.test(n)
  );
}

export function buildIcs(event: SerializedEvent): string {
  const pad = (n: number) => String(n).padStart(2, "0");

  const d = new Date(event.EventDate);
  let startHour = 9;
  let startMin = 0;
  if (event.EventTime) {
    const m = event.EventTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (m) {
      startHour = parseInt(m[1], 10);
      startMin = parseInt(m[2], 10);
      if (m[3].toUpperCase() === "PM" && startHour !== 12) startHour += 12;
      if (m[3].toUpperCase() === "AM" && startHour === 12) startHour = 0;
    }
  }

  const start = `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(startHour)}${pad(startMin)}00`;
  const endHour = startHour + 2;
  const end = `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(endHour)}${pad(startMin)}00`;

  const esc = (s: string) => s.replace(/[\\;,]/g, (c) => `\\${c}`);

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//EPTruth//Meetings//EN",
    "BEGIN:VEVENT",
    `DTSTART;TZID=America/Denver:${start}`,
    `DTEND;TZID=America/Denver:${end}`,
    `SUMMARY:${esc(event.EventBodyName)}`,
    event.EventLocation ? `LOCATION:${esc(event.EventLocation)}` : "",
    `URL:${event.EventInSiteURL}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}
