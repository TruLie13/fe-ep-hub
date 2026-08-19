import { describe, expect, it } from "vitest";
import {
  CITY_DISTRICT_COLORS,
  CITY_DISTRICT_MUTED_COLORS,
  CITY_DISTRICT_NUMBERS,
  cityDistrictSectionId,
  districtFillColorExpression,
  isInteractiveCityDistrict,
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

describe("isInteractiveCityDistrict", () => {
  it("treats every district as interactive when no list is passed", () => {
    expect(isInteractiveCityDistrict(2)).toBe(true);
  });

  it("limits interaction to the provided districts", () => {
    expect(isInteractiveCityDistrict(1, [1, 5, 6, 8])).toBe(true);
    expect(isInteractiveCityDistrict(2, [1, 5, 6, 8])).toBe(false);
  });
});

describe("districtFillColorExpression", () => {
  it("covers every city district", () => {
    const expr = districtFillColorExpression();
    for (const district of CITY_DISTRICT_NUMBERS) {
      expect(expr).toContain(district);
    }
  });

  it("uses muted colors for districts left off the interactive list", () => {
    const expr = districtFillColorExpression([1, 5, 6, 8]);
    const colorAt = (district: number) => expr[expr.indexOf(district) + 1];
    expect(colorAt(1)).toBe(CITY_DISTRICT_COLORS[1]);
    expect(colorAt(2)).toBe(CITY_DISTRICT_MUTED_COLORS[2]);
  });
});
