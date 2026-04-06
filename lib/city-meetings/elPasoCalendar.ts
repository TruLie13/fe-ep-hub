/** El Paso Hub calendar uses Mountain Time (America/Denver). */

export const EL_PASO_IANA = "America/Denver";

/** Legistar body name for City Council sign-up rules on the city meetings page. */
export const CITY_COUNCIL_BODY_NAME = "City Council";

export type CouncilSignUpWindowState =
  | { kind: "unknown" }
  | {
      kind: "closed_before";
      meetingYmd: string;
      opensWednesdayYmd: string;
      opensAt: Date;
    }
  | { kind: "open"; meetingYmd: string; closesAt: Date }
  | { kind: "closed_after"; meetingYmd: string };

/**
 * Today's calendar date in America/Denver (YYYY-MM-DD).
 * Use for Legistar filters and "upcoming vs past" buckets so server UTC does not shift days.
 */
export function getTodayYmdDenver(now: Date = new Date()): string {
  return now.toLocaleDateString("en-CA", { timeZone: EL_PASO_IANA });
}

/**
 * Legistar EventDate is typically `YYYY-MM-DDT00:00:00` with no zone; the date prefix is the civic meeting date.
 */
export function getEventYmdFromLegistar(eventDateIso: string): string {
  const m = eventDateIso.match(/^(\d{4}-\d{2}-\d{2})/);
  if (m) return m[1];
  const d = new Date(eventDateIso);
  if (Number.isNaN(d.getTime())) return getTodayYmdDenver();
  return d.toLocaleDateString("en-CA", { timeZone: EL_PASO_IANA });
}

/** Calendar add for YYYY-MM-DD using UTC date math (no DST ambiguity on the date string). */
export function addDaysYmd(ymd: string, deltaDays: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + deltaDays));
  return dt.toISOString().slice(0, 10);
}

export function isMeetingDateOnOrAfterTodayDenver(eventDateIso: string): boolean {
  return getEventYmdFromLegistar(eventDateIso) >= getTodayYmdDenver();
}

function getDenverWeekdayIndex(ymd: string): number {
  const [y, mo, d] = ymd.split("-").map(Number);
  for (let hourUtc = 0; hourUtc < 24; hourUtc++) {
    const t = new Date(Date.UTC(y, mo - 1, d, hourUtc, 0, 0));
    const den = t.toLocaleDateString("en-CA", { timeZone: EL_PASO_IANA });
    if (den !== ymd) continue;
    const w = t.toLocaleDateString("en-US", {
      timeZone: EL_PASO_IANA,
      weekday: "short",
    });
    const map: Record<string, number> = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
    };
    return map[w] ?? 0;
  }
  return 0;
}

/**
 * The Wednesday strictly before the meeting calendar date (in Denver).
 * If the meeting is on a Wednesday, returns the previous Wednesday.
 */
export function getWednesdayBeforeMeetingYmd(meetingYmd: string): string {
  let cursor = addDaysYmd(meetingYmd, -1);
  for (let i = 0; i < 14; i++) {
    if (getDenverWeekdayIndex(cursor) === 3) return cursor;
    cursor = addDaysYmd(cursor, -1);
  }
  return addDaysYmd(meetingYmd, -7);
}

/**
 * Instant when `ymd` at `hour`:`minute` local time occurs in America/Denver.
 */
export function denverYmdAtLocalTime(
  ymd: string,
  hour: number,
  minute: number,
): Date {
  const [y, mo, d] = ymd.split("-").map(Number);
  const start = Date.UTC(y, mo - 1, d - 1, 0, 0, 0);
  const end = Date.UTC(y, mo - 1, d + 2, 0, 0, 0);
  for (let ms = start; ms < end; ms += 60_000) {
    const t = new Date(ms);
    const cal = t.toLocaleDateString("en-CA", { timeZone: EL_PASO_IANA });
    if (cal !== ymd) continue;
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: EL_PASO_IANA,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(t);
    const h = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0", 10);
    const m = parseInt(parts.find((p) => p.type === "minute")?.value ?? "0", 10);
    if (h === hour && m === minute) return t;
  }
  throw new Error(`No local ${hour}:${minute} on ${ymd} in ${EL_PASO_IANA}`);
}

/** Long weekday + date in America/Denver for a YYYY-MM-DD civic date. */
export function formatYmdLongDenver(ymd: string): string {
  const d = denverYmdAtLocalTime(ymd, 12, 0);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: EL_PASO_IANA,
  });
}

type CouncilEventLike = {
  EventBodyName: string;
  EventDate: string;
};

/**
 * City Council sign-up window: opens noon Wednesday before the meeting;
 * closes 9:00 a.m. on the meeting day (America/Denver), per City Clerk practice on this page.
 */
export function getCouncilSignUpWindow(
  upcomingEvents: CouncilEventLike[],
  now: Date = new Date(),
): CouncilSignUpWindowState {
  const councils = upcomingEvents
    .filter((e) => e.EventBodyName === CITY_COUNCIL_BODY_NAME)
    .sort((a, b) =>
      getEventYmdFromLegistar(a.EventDate).localeCompare(
        getEventYmdFromLegistar(b.EventDate),
      ),
    );

  if (councils.length === 0) return { kind: "unknown" };

  for (const e of councils) {
    const meetingYmd = getEventYmdFromLegistar(e.EventDate);
    const wedYmd = getWednesdayBeforeMeetingYmd(meetingYmd);
    const opensAt = denverYmdAtLocalTime(wedYmd, 12, 0);
    const closesAt = denverYmdAtLocalTime(meetingYmd, 9, 0);

    if (now < opensAt) {
      return {
        kind: "closed_before",
        meetingYmd,
        opensWednesdayYmd: wedYmd,
        opensAt,
      };
    }
    if (now < closesAt) {
      return { kind: "open", meetingYmd, closesAt };
    }
  }

  const last = councils[councils.length - 1];
  return {
    kind: "closed_after",
    meetingYmd: getEventYmdFromLegistar(last.EventDate),
  };
}
