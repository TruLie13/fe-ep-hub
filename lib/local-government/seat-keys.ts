export const CITY_SEAT_KEYS = [
  "mayor",
  "district1",
  "district2",
  "district3",
  "district4",
  "district5",
  "district6",
  "district7",
  "district8",
] as const;

export const COUNTY_SEAT_KEYS = [
  "countyJudge",
  "precinct1",
  "precinct2",
  "precinct3",
  "precinct4",
] as const;

export type CitySeatKey = (typeof CITY_SEAT_KEYS)[number];
export type CountySeatKey = (typeof COUNTY_SEAT_KEYS)[number];
