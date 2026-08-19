import { describe, expect, it } from "vitest";
import {
  CITY_DISTRICT_NUMBERS,
  cityDistrictSectionId,
  districtFillColorExpression,
  parseCityDistrictNumber,
} from "./city-districts";

describe("parseCityDistrictNumber", () => {
  it("accepts integers 1 through 8 as numbers or strings", () => {
    expect(parseCityDistrictNumber(1)).toBe(1);
    expect(parseCityDistrictNumber("8")).toBe(8);
  });

  it("rejects values outside the eight city districts", () => {
    expect(parseCityDistrictNumber(0)).toBeNull();
    expect(parseCityDistrictNumber(9)).toBeNull();
    expect(parseCityDistrictNumber("west")).toBeNull();
    expect(parseCityDistrictNumber(undefined)).toBeNull();
  });
});

describe("cityDistrictSectionId", () => {
  it("matches election page section ids", () => {
    expect(cityDistrictSectionId(5)).toBe("district-5");
  });
});

describe("districtFillColorExpression", () => {
  it("covers every city district", () => {
    const expr = districtFillColorExpression();
    for (const district of CITY_DISTRICT_NUMBERS) {
      expect(expr).toContain(district);
    }
  });
});
