export const CITY_DISTRICT_COUNT = 8;

export const CITY_DISTRICT_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export type CityDistrictNumber = (typeof CITY_DISTRICT_NUMBERS)[number];

/** Snapshot served from /public. Retrieved from City of El Paso GIS RepDistricts. */
export const CITY_DISTRICT_GEOJSON_HREF = "/geo/el-paso-city-representative-districts.geojson?v=2";

/** Mexico land in the El Paso viewport, used to hide Juárez streets. */
export const CITY_MEXICO_MASK_GEOJSON_HREF = "/geo/el-paso-mexico-mask.geojson?v=2";

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

/** Quieter fills for districts that should stay visible but not invite a click. */
export const CITY_DISTRICT_MUTED_COLORS: Record<CityDistrictNumber, string> = {
  1: "#3D4F63",
  2: "#355550",
  3: "#5A5340",
  4: "#54485A",
  5: "#4A4766",
  6: "#5A4A42",
  7: "#3A5560",
  8: "#5A4448",
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

export function isInteractiveCityDistrict(
  district: number,
  interactiveDistricts?: Iterable<number>,
): boolean {
  if (!interactiveDistricts) {
    return true;
  }
  return new Set(interactiveDistricts).has(district);
}

export function districtFillColorExpression(interactiveDistricts?: Iterable<number>): unknown[] {
  const interactive = interactiveDistricts ? new Set(interactiveDistricts) : null;
  const expr: unknown[] = ["match", ["get", "DISTRICT"]];
  for (const district of CITY_DISTRICT_NUMBERS) {
    const onBallot = interactive === null || interactive.has(district);
    expr.push(district, onBallot ? CITY_DISTRICT_COLORS[district] : CITY_DISTRICT_MUTED_COLORS[district]);
  }
  expr.push("#64748B");
  return expr;
}

export function districtFillOpacityExpression(interactiveDistricts?: Iterable<number>): unknown[] {
  const interactive = interactiveDistricts ? new Set(interactiveDistricts) : null;
  const restOpacity = (onBallot: boolean, hovered: boolean): number => {
    if (onBallot) {
      return hovered ? 0.55 : 0.36;
    }
    return hovered ? 0.28 : 0.16;
  };
  const idle: unknown[] = ["match", ["get", "DISTRICT"]];
  const hover: unknown[] = ["match", ["get", "DISTRICT"]];
  for (const district of CITY_DISTRICT_NUMBERS) {
    const onBallot = interactive === null || interactive.has(district);
    idle.push(district, restOpacity(onBallot, false));
    hover.push(district, restOpacity(onBallot, true));
  }
  idle.push(0.16);
  hover.push(0.28);
  return ["case", ["boolean", ["feature-state", "hover"], false], hover, idle];
}
