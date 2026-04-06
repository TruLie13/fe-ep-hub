import { LEGISTAR_EL_PASO_V1 } from "@/lib/legistar/el-paso-web-api";

export type LegistarMember = {
  fullName: string;
  title: string;
  startDate: string;
  endDate: string;
};

type OfficeRecord = {
  OfficeRecordFullName: string;
  OfficeRecordTitle: string;
  OfficeRecordStartDate: string | null;
  OfficeRecordEndDate: string | null;
  OfficeRecordBodyName: string;
};

function normalizeForMatch(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[""'']/g, "")
    .replace(/\b(dr\.?|jr\.?|sr\.?|iii?|iv)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export type CityLegistarOfficeData = {
  /** All current City Council office rows (mayor + representatives), keyed by normalized name. */
  members: Map<string, LegistarMember>;
  /** Mayor row when Legistar marks `OfficeRecordTitle` as Mayor under City Council. */
  mayor: LegistarMember | null;
};

/**
 * Fetch current City Council office holders from Legistar (same body includes the mayor).
 * In El Paso, the mayor appears with `OfficeRecordTitle` "Mayor"; representatives use "Representative".
 * Returns everyone keyed by normalized name, plus the mayor row explicitly for the mayor card.
 * Static contact data in the repo still drives email, phone, and URLs; this enriches names and terms.
 * On failure, returns empty map and null mayor.
 */
export async function fetchCityLegistarOfficeData(): Promise<CityLegistarOfficeData> {
  const empty: CityLegistarOfficeData = {
    members: new Map(),
    mayor: null,
  };

  try {
    const now = new Date().toISOString().split("T")[0];
    const filter = `OfficeRecordBodyName eq 'City Council' and OfficeRecordEndDate ge datetime'${now}'`;
    const url = `${LEGISTAR_EL_PASO_V1}/officerecords?$filter=${encodeURIComponent(filter)}`;

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return empty;

    const records: OfficeRecord[] = await res.json();
    const members = new Map<string, LegistarMember>();
    let mayor: LegistarMember | null = null;

    for (const r of records) {
      const row: LegistarMember = {
        fullName: r.OfficeRecordFullName,
        title: r.OfficeRecordTitle,
        startDate: r.OfficeRecordStartDate?.split("T")[0] ?? "",
        endDate: r.OfficeRecordEndDate?.split("T")[0] ?? "",
      };

      const key = normalizeForMatch(r.OfficeRecordFullName);
      members.set(key, row);

      const title = (r.OfficeRecordTitle ?? "").trim().toLowerCase();
      if (title === "mayor") {
        mayor = row;
      }
    }

    return { members, mayor };
  } catch {
    return empty;
  }
}

/**
 * Try to find a Legistar record that matches a given display name.
 * Strips accents, honorifics, and casing for fuzzy comparison.
 */
export function findMember(
  members: Map<string, LegistarMember>,
  displayName: string,
): LegistarMember | undefined {
  const key = normalizeForMatch(displayName);

  const exact = members.get(key);
  if (exact) return exact;

  for (const [k, v] of members) {
    if (k.includes(key) || key.includes(k)) return v;
  }

  return undefined;
}
