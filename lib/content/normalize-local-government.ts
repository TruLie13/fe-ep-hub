import type {
  Candidate,
  LocalGovernmentBundle,
  LocalGovernmentBundleJson,
  Official,
} from "@/content/schema";

import { CITY_SEAT_KEYS, COUNTY_SEAT_KEYS } from "@/lib/local-government/seat-keys";

function collectFromSeats(json: LocalGovernmentBundleJson): {
  officials: Official[];
  running: Candidate[];
} {
  const officials: Official[] = [];
  const running: Candidate[] = [];
  for (const key of CITY_SEAT_KEYS) {
    const seat = json.city[key];
    if (seat.sitting) officials.push(seat.sitting);
    running.push(...seat.running);
  }
  for (const key of COUNTY_SEAT_KEYS) {
    const seat = json.county[key];
    if (seat.sitting) officials.push(seat.sitting);
    running.push(...seat.running);
  }
  return { officials, running };
}

export function normalizeLocalGovernment(raw: unknown): LocalGovernmentBundle {
  const json = raw as LocalGovernmentBundleJson;
  if (json.schemaVersion !== 2) {
    throw new Error(
      `local-government.json: expected schemaVersion 2, got ${String((raw as { schemaVersion?: unknown }).schemaVersion)}`
    );
  }
  const { officials, running } = collectFromSeats(json);
  return {
    ...json,
    officials,
    candidates: [...(json.candidates ?? []), ...running],
  };
}
