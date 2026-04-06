import { afterEach, describe, expect, it, vi } from "vitest";
import type { SerializedEvent } from "@/components/city-meetings/meeting-utils";
import { LEGISTAR_EL_PASO_EVENTS } from "@/lib/legistar/el-paso-web-api";
import { fetchLegistarEvents } from "./fetch-legistar-events";

describe("fetchLegistarEvents", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("requests events OData URL with date filter and returns parsed JSON", async () => {
    const event: SerializedEvent = {
      EventId: 1,
      EventBodyName: "City Council",
      EventDate: "2026-04-01T00:00:00",
      EventTime: "9:00 AM",
      EventLocation: "City Hall",
      EventAgendaFile: null,
      EventMinutesFile: null,
      EventVideoPath: null,
      EventInSiteURL: "https://example.com",
      EventAgendaStatusName: null,
      EventComment: null,
    };

    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify([event]), { status: 200 }),
    );

    const result = await fetchLegistarEvents();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const calledUrl = String(fetchMock.mock.calls[0]?.[0]);
    expect(calledUrl.startsWith(`${LEGISTAR_EL_PASO_EVENTS}?$filter=`)).toBe(
      true,
    );
    expect(calledUrl).toMatch(/\$orderby=EventDate\sasc/);
    expect(calledUrl).toContain("$top=500");
    expect(result).toEqual([event]);
  });

  it("returns empty array when response is not ok", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 502 }),
    );

    const result = await fetchLegistarEvents();

    expect(result).toEqual([]);
  });
});
