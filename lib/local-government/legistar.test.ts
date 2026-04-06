import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fetchCityLegistarOfficeData,
  findMember,
  type LegistarMember,
} from "./legistar";

describe("fetchCityLegistarOfficeData", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns members and mayor from Legistar office records", async () => {
    const payload = [
      {
        OfficeRecordFullName: "Jane Doe",
        OfficeRecordTitle: "Representative",
        OfficeRecordStartDate: "2024-01-01T00:00:00",
        OfficeRecordEndDate: "2026-12-31T00:00:00",
        OfficeRecordBodyName: "City Council",
      },
      {
        OfficeRecordFullName: "Alex Rivera",
        OfficeRecordTitle: "Mayor",
        OfficeRecordStartDate: "2022-01-01T00:00:00",
        OfficeRecordEndDate: "2026-12-31T00:00:00",
        OfficeRecordBodyName: "City Council",
      },
    ];

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(payload), { status: 200 }),
    );

    const result = await fetchCityLegistarOfficeData();

    expect(result.members.size).toBe(2);
    expect(result.mayor).not.toBeNull();
    expect(result.mayor?.fullName).toBe("Alex Rivera");
    expect(result.mayor?.title).toBe("Mayor");
  });

  it("returns empty data when HTTP is not ok", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 503 }),
    );

    const result = await fetchCityLegistarOfficeData();

    expect(result.members.size).toBe(0);
    expect(result.mayor).toBeNull();
  });

  it("returns empty data when fetch throws", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network"));

    const result = await fetchCityLegistarOfficeData();

    expect(result.members.size).toBe(0);
    expect(result.mayor).toBeNull();
  });
});

describe("findMember", () => {
  const rep: LegistarMember = {
    fullName: "Maria García",
    title: "Representative",
    startDate: "2024-01-01",
    endDate: "2026-12-31",
  };

  it("matches exact normalized key", () => {
    const members = new Map<string, LegistarMember>([
      ["maria garcia", rep],
    ]);
    expect(findMember(members, "Maria García")?.fullName).toBe("Maria García");
  });

  it("matches when honorifics differ from stored name", () => {
    const members = new Map<string, LegistarMember>([
      ["maria garcia", rep],
    ]);
    expect(findMember(members, "Dr. Maria Garcia")?.fullName).toBe(
      "Maria García",
    );
  });

  it("returns undefined when no fuzzy match", () => {
    const members = new Map<string, LegistarMember>([["maria garcia", rep]]);
    expect(findMember(members, "Totally Different Person")).toBeUndefined();
  });
});
