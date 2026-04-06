import type { Candidate, LocalGovernmentBundle, Stance } from "@/content/schema";

import {
  CITY_SEAT_KEYS,
  COUNTY_SEAT_KEYS,
  type CitySeatKey,
  type CountySeatKey,
} from "@/lib/local-government/seat-keys";

export const JURISDICTION_CITY = "City of El Paso";
export const JURISDICTION_COUNTY = "El Paso County";

export { CITY_SEAT_KEYS, COUNTY_SEAT_KEYS };
export type { CitySeatKey, CountySeatKey };

const CITY_LABELS: Record<CitySeatKey, string> = {
  mayor: "Mayor",
  district1: "District 1",
  district2: "District 2",
  district3: "District 3",
  district4: "District 4",
  district5: "District 5",
  district6: "District 6",
  district7: "District 7",
  district8: "District 8",
};

const COUNTY_LABELS: Record<CountySeatKey, string> = {
  countyJudge: "County Judge",
  precinct1: "Precinct 1",
  precinct2: "Precinct 2",
  precinct3: "Precinct 3",
  precinct4: "Precinct 4",
};

export function citySeatLabel(key: CitySeatKey): string {
  return CITY_LABELS[key];
}

export function countySeatLabel(key: CountySeatKey): string {
  return COUNTY_LABELS[key];
}

/**
 * Derive the election year from a term end date.
 * El Paso terms end in January; the election is the prior November.
 * E.g. term ending 2029-01-06 → election Nov 2028.
 */
export function electionYearFromTermEnd(isoEndDate: string): number {
  const d = new Date(isoEndDate + "T00:00:00");
  return d.getMonth() <= 1 ? d.getFullYear() - 1 : d.getFullYear();
}

/**
 * Compute the U.S. general election date for a given year:
 * first Tuesday after the first Monday in November.
 */
export function electionDateForYear(year: number): Date {
  const nov1 = new Date(year, 10, 1);
  const dow = nov1.getDay();
  const firstMonday = dow <= 1 ? 1 + ((1 - dow + 7) % 7) : 1 + (8 - dow);
  return new Date(year, 10, firstMonday + 1);
}

/**
 * Derive the full election date (ISO string) from a term end date.
 * Returns null when no term end date is available.
 */
export function nextElectionDateFromTermEnd(
  termEndDate: string | undefined,
): string | null {
  if (!termEndDate) return null;
  const year = electionYearFromTermEnd(termEndDate);
  const d = electionDateForYear(year);
  return d.toISOString().split("T")[0];
}

/**
 * Show "Election this year" when either:
 * 1. A Legistar term end date is available and its derived election year is the current year, or
 * 2. The static `nextElectionDate` calendar year matches the current year (fallback).
 * This reflects the seat’s election cycle, not whether the officeholder has filed to run.
 */
export function isReelectionBadgeYear(
  nextElectionDate: string | undefined,
  termEndDate?: string,
): boolean {
  const thisYear = new Date().getFullYear();

  if (termEndDate) {
    return electionYearFromTermEnd(termEndDate) === thisYear;
  }

  if (!nextElectionDate) return false;
  const y = Number(nextElectionDate.slice(0, 4));
  if (!Number.isFinite(y)) return false;
  return y === thisYear;
}

export function officialStances(bundle: LocalGovernmentBundle, officialId: string): Stance[] {
  return bundle.stances.filter(
    (s) => s.subject.type === "official" && s.subject.officialId === officialId
  );
}

export function candidateStances(bundle: LocalGovernmentBundle, candidateId: string): Stance[] {
  return bundle.stances.filter(
    (s) => s.subject.type === "candidate" && s.subject.candidateId === candidateId
  );
}

export function activeCandidates(bundle: LocalGovernmentBundle): Candidate[] {
  const active = new Set(bundle.activeElectionCycleIds);
  return bundle.candidates.filter((c) => active.has(c.electionCycleId));
}
