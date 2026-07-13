import type { SerializedEvent } from "@/components/city-meetings/meeting-utils";
import {
  denverYmdAtLocalTime,
  getEventYmdFromLegistar,
} from "@/lib/city-meetings/elPasoCalendar";

export type MeetingDayGroup = {
  ymd: string;
  label: string;
  events: SerializedEvent[];
};

function formatDayHeader(ymd: string): string {
  const d = denverYmdAtLocalTime(ymd, 12, 0);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Denver",
  });
}

/** Sort City Council ahead of other bodies on the same day. */
function bodySortKey(event: SerializedEvent): number {
  return event.EventBodyName === "City Council" ? 0 : 1;
}

/** Chronological day groups for agenda-style lists (Denver calendar dates). */
export function groupMeetingsByDay(events: SerializedEvent[]): MeetingDayGroup[] {
  const sorted = [...events].sort((a, b) => {
    const ymdCmp = getEventYmdFromLegistar(a.EventDate).localeCompare(
      getEventYmdFromLegistar(b.EventDate),
    );
    if (ymdCmp !== 0) return ymdCmp;
    return bodySortKey(a) - bodySortKey(b);
  });

  const map = new Map<string, SerializedEvent[]>();
  for (const event of sorted) {
    const ymd = getEventYmdFromLegistar(event.EventDate);
    const list = map.get(ymd);
    if (list) list.push(event);
    else map.set(ymd, [event]);
  }

  return [...map.entries()].map(([ymd, dayEvents]) => ({
    ymd,
    label: formatDayHeader(ymd),
    events: dayEvents,
  }));
}

/** Soonest upcoming meeting; prefers City Council when present. */
export function pickNextUpMeeting(upcoming: SerializedEvent[]): SerializedEvent | null {
  if (upcoming.length === 0) return null;
  const byDate = [...upcoming].sort((a, b) =>
    getEventYmdFromLegistar(a.EventDate).localeCompare(getEventYmdFromLegistar(b.EventDate)),
  );
  return byDate.find((e) => e.EventBodyName === "City Council") ?? byDate[0] ?? null;
}
