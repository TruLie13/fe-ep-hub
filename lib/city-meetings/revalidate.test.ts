import { describe, expect, it } from "vitest";
import {
  CITY_MEETINGS_REVALIDATE_AGENDA_DAY_SECONDS,
  CITY_MEETINGS_REVALIDATE_AGENDA_POSTED_SECONDS,
  CITY_MEETINGS_REVALIDATE_AGENDA_WINDOW_SECONDS,
  CITY_MEETINGS_REVALIDATE_DEFAULT_SECONDS,
} from "@/lib/constants/city-meetings";
import { denverYmdAtLocalTime } from "./elPasoCalendar";
import { getCityMeetingsRevalidateSeconds } from "./revalidate";

describe("getCityMeetingsRevalidateSeconds", () => {
  it("uses default TTL on a non-Wednesday", () => {
    // 2026-07-14 is a Tuesday in Denver
    const now = denverYmdAtLocalTime("2026-07-14", 14, 0);
    expect(getCityMeetingsRevalidateSeconds(now)).toBe(
      CITY_MEETINGS_REVALIDATE_DEFAULT_SECONDS,
    );
  });

  it("uses agenda-day TTL on Wednesday outside the publish window", () => {
    // 2026-07-15 is a Wednesday; 8am is before the 10–20 window
    const now = denverYmdAtLocalTime("2026-07-15", 8, 0);
    expect(getCityMeetingsRevalidateSeconds(now)).toBe(
      CITY_MEETINGS_REVALIDATE_AGENDA_DAY_SECONDS,
    );
  });

  it("uses short TTL on Wednesday during the publish window", () => {
    const now = denverYmdAtLocalTime("2026-07-15", 12, 30);
    expect(getCityMeetingsRevalidateSeconds(now)).toBe(
      CITY_MEETINGS_REVALIDATE_AGENDA_WINDOW_SECONDS,
    );
  });

  it("only treats the Wednesday before a known council meeting as hot", () => {
    // Meeting Tuesday 2026-07-21 → agenda Wednesday is 2026-07-15
    const agendaWed = denverYmdAtLocalTime("2026-07-15", 13, 0);
    expect(
      getCityMeetingsRevalidateSeconds(agendaWed, {
        nextCouncilMeetingYmd: "2026-07-21",
      }),
    ).toBe(CITY_MEETINGS_REVALIDATE_AGENDA_WINDOW_SECONDS);

    // Some other Wednesday is not hot when the next meeting date is known
    const otherWed = denverYmdAtLocalTime("2026-07-08", 13, 0);
    expect(
      getCityMeetingsRevalidateSeconds(otherWed, {
        nextCouncilMeetingYmd: "2026-07-21",
      }),
    ).toBe(CITY_MEETINGS_REVALIDATE_DEFAULT_SECONDS);
  });

  it("relaxes TTL on agenda Wednesday once the agenda file is present", () => {
    const now = denverYmdAtLocalTime("2026-07-15", 13, 0);
    expect(
      getCityMeetingsRevalidateSeconds(now, {
        nextCouncilMeetingYmd: "2026-07-21",
        agendaFilePresent: true,
      }),
    ).toBe(CITY_MEETINGS_REVALIDATE_AGENDA_POSTED_SECONDS);
  });
});
