import { type SerializedEvent } from "@/components/city-meetings/meeting-utils";
import { LEGISTAR_EL_PASO_EVENTS } from "@/lib/legistar/el-paso-web-api";
import { addDaysYmd, getTodayYmdDenver } from "./elPasoCalendar";

const LEGISTAR_EVENTS_TOP = 500;

/**
 * OData query for Legistar events in a rolling window (past 30 days through next 90 days, Denver calendar dates).
 * Used by the city meetings page.
 */
export async function fetchLegistarEvents(): Promise<SerializedEvent[]> {
  const todayYmd = getTodayYmdDenver();
  const pastYmd = addDaysYmd(todayYmd, -30);
  const futureYmd = addDaysYmd(todayYmd, 90);

  const filter = `EventDate ge datetime'${pastYmd}' and EventDate lt datetime'${futureYmd}'`;
  const url = `${LEGISTAR_EL_PASO_EVENTS}?$filter=${encodeURIComponent(filter)}&$orderby=EventDate asc&$top=${LEGISTAR_EVENTS_TOP}`;

  const res = await fetch(url, { next: { revalidate: 900 } });

  if (!res.ok) return [];

  const data = await res.json();
  return data as SerializedEvent[];
}
