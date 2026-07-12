import {
  CITY_MEETINGS_REVALIDATE_AGENDA_DAY_SECONDS,
  CITY_MEETINGS_REVALIDATE_AGENDA_POSTED_SECONDS,
  CITY_MEETINGS_REVALIDATE_AGENDA_WINDOW_SECONDS,
  CITY_MEETINGS_REVALIDATE_DEFAULT_SECONDS,
} from "@/lib/constants/city-meetings";
import {
  getDenverLocalHour,
  getDenverWeekdayIndex,
  getTodayYmdDenver,
  getWednesdayBeforeMeetingYmd,
} from "@/lib/city-meetings/elPasoCalendar";

/** Denver local hours when the clerk typically posts (and often slips past noon). */
const AGENDA_WINDOW_START_HOUR = 10;
const AGENDA_WINDOW_END_HOUR = 20;

export type CityMeetingsRevalidateOptions = {
  /**
   * Next City Council meeting calendar date (YYYY-MM-DD) when known.
   * When set, only that meeting's Wednesday-before is treated as hot — not every Wednesday.
   */
  nextCouncilMeetingYmd?: string | null;
  /**
   * When true on an agenda Wednesday, the PDF/link is already on the event —
   * no need to poll as aggressively.
   */
  agendaFilePresent?: boolean;
};

/**
 * Adaptive ISR TTL for city meetings Legistar data.
 *
 * Shortens on the Wednesday before City Council (when the clerk posts the agenda),
 * especially late morning through evening Denver time. Falls back to "any Wednesday"
 * when the next council date is not yet known (e.g. inside the events fetch itself).
 */
export function getCityMeetingsRevalidateSeconds(
  now: Date = new Date(),
  options: CityMeetingsRevalidateOptions = {},
): number {
  const todayYmd = getTodayYmdDenver(now);

  const isAgendaWednesday =
    options.nextCouncilMeetingYmd != null && options.nextCouncilMeetingYmd !== ""
      ? getWednesdayBeforeMeetingYmd(options.nextCouncilMeetingYmd) === todayYmd
      : getDenverWeekdayIndex(todayYmd) === 3;

  if (!isAgendaWednesday) {
    return CITY_MEETINGS_REVALIDATE_DEFAULT_SECONDS;
  }

  if (options.agendaFilePresent) {
    return CITY_MEETINGS_REVALIDATE_AGENDA_POSTED_SECONDS;
  }

  const hour = getDenverLocalHour(now);
  if (hour >= AGENDA_WINDOW_START_HOUR && hour < AGENDA_WINDOW_END_HOUR) {
    return CITY_MEETINGS_REVALIDATE_AGENDA_WINDOW_SECONDS;
  }

  return CITY_MEETINGS_REVALIDATE_AGENDA_DAY_SECONDS;
}
