export const CITY_DISTRICT_COUNT = 8;

export const CITY_DISTRICT_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export type CityDistrictNumber = (typeof CITY_DISTRICT_NUMBERS)[number];

/** Snapshot served from /public. Retrieved from City of El Paso GIS RepDistricts. */
export const CITY_DISTRICT_GEOJSON_HREF = "/geo/el-paso-city-representative-districts.geojson";

/** Large polygon with holes for the eight districts, used to hide streets outside the city. */
export const CITY_OUTSIDE_MASK_GEOJSON_HREF = "/geo/el-paso-outside-city-mask.geojson";

export const CITY_DISTRICT_SOURCE_URL =
  "https://gis.elpasotexas.gov/dev/rest/services/OpenData/RepDistricts/FeatureServer";

export const CITY_DISTRICT_SOURCE_RETRIEVED_AT = "2026-08-18";

/** [west, south], [east, north] from the official district polygons. */
export const CITY_DISTRICT_BOUNDS: [[number, number], [number, number]] = [
  [-106.63592, 31.62248],
  [-106.19921, 32.00149],
];

export const CITY_DISTRICT_CENTER: [number, number] = [-106.41756, 31.81199];

/**
 * Distinct fills for dark basemaps. Keep these in one place so later maps
 * (local government, district pages) can reuse the same colors.
 */
export const CITY_DISTRICT_COLORS: Record<CityDistrictNumber, string> = {
  1: "#5B9FD6",
  2: "#3CBFA0",
  3: "#E0B44A",
  4: "#D978C0",
  5: "#8B7AE0",
  6: "#E07A4A",
  7: "#5EC4E0",
  8: "#E06B6B",
};

export function cityDistrictSectionId(district: number): string {
  return `district-${district}`;
}

export function parseCityDistrictNumber(value: unknown): CityDistrictNumber | null {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(n) || n < 1 || n > CITY_DISTRICT_COUNT) {
    return null;
  }
  return n as CityDistrictNumber;
}

export function districtFillColorExpression(): unknown[] {
  const expr: unknown[] = ["match", ["get", "DISTRICT"]];
  for (const district of CITY_DISTRICT_NUMBERS) {
    expr.push(district, CITY_DISTRICT_COLORS[district]);
  }
  expr.push("#64748B");
  return expr;
}
