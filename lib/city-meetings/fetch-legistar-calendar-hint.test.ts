import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fetchNextCityCouncilCalendarHint,
  parseNextCityCouncilHint,
} from "./fetch-legistar-calendar-hint";

describe("parseNextCityCouncilHint", () => {
  it("extracts next City Council date and time from calendar row HTML", () => {
    const html = `
      <table>
        <tr>
          <td>
            <a href="DepartmentDetail.aspx?ID=41025&amp;GUID=ABC">
              <font>City Council</font>
            </a>
          </td>
          <td><font>4/14/2026</font></td>
          <td>
            <span id="ctl00_ContentPlaceHolder1_gridUpcomingMeetings_ctl00_ctl06_lblTime">
              <font>9:00 AM</font>
            </span>
          </td>
        </tr>
      </table>
    `;

    const hint = parseNextCityCouncilHint(html);

    expect(hint).toEqual({
      dateLabel: "Tuesday, April 14, 2026",
      timeLabel: "9:00 AM",
    });
  });

  it("returns null when City Council row is not present", () => {
    const html = `
      <table>
        <tr>
          <td><a href="DepartmentDetail.aspx?ID=1&amp;GUID=ABC"><font>Public Art Committee</font></a></td>
          <td><font>4/14/2026</font></td>
          <td><span id="x_lblTime"><font>2:00 PM</font></span></td>
        </tr>
      </table>
    `;

    expect(parseNextCityCouncilHint(html)).toBeNull();
  });
});

describe("fetchNextCityCouncilCalendarHint", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns parsed hint from fetched calendar HTML", async () => {
    const html = `
      <tr>
        <td>
          <a href="DepartmentDetail.aspx?ID=41025&amp;GUID=ABC">
            <font>City Council</font>
          </a>
        </td>
        <td><font>4/14/2026</font></td>
        <td>
          <span id="ctl00_ContentPlaceHolder1_gridUpcomingMeetings_ctl00_ctl06_lblTime">
            <font>9:00 AM</font>
          </span>
        </td>
      </tr>
    `;

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(html, { status: 200 }),
    );

    const result = await fetchNextCityCouncilCalendarHint();

    expect(result).toEqual({
      dateLabel: "Tuesday, April 14, 2026",
      timeLabel: "9:00 AM",
    });
  });

  it("returns null when HTTP is not ok", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 502 }),
    );

    const result = await fetchNextCityCouncilCalendarHint();
    expect(result).toBeNull();
  });

  it("returns null when fetch throws", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network"));

    const result = await fetchNextCityCouncilCalendarHint();
    expect(result).toBeNull();
  });
});
