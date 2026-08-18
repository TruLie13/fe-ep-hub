import type {
  CouncilVoteDisposition,
  CouncilVoteEvent,
  LocalGovernmentBundle,
  Source,
  Stance,
} from "@/content/schema";

export type ResolvedCouncilVote = {
  event: CouncilVoteEvent;
  disposition: CouncilVoteDisposition;
};

/** Roster/contact bibliography IDs — not shown as stance evidence links. */
export const STANCE_PLACEHOLDER_SOURCE_IDS = new Set([
  "el-paso-city-gov",
  "el-paso-county-gov",
]);

const GENERIC_STANCE_SUMMARIES = new Set([
  "Supports data center development in El Paso.",
  "Opposes data center development in El Paso.",
]);

export function officialCouncilVotes(
  bundle: LocalGovernmentBundle,
  officialId: string,
): ResolvedCouncilVote[] {
  const eventsById = new Map(bundle.councilVoteEvents.map((event) => [event.id, event]));

  return bundle.councilVotes
    .filter((record) => record.officialId === officialId)
    .map((record) => {
      const event = eventsById.get(record.voteEventId);
      if (!event) return null;
      return { event, disposition: record.disposition };
    })
    .filter((row): row is ResolvedCouncilVote => row !== null)
    .sort((a, b) => a.event.meetingDate.localeCompare(b.event.meetingDate));
}

export function isGenericStanceSummary(summary: string): boolean {
  return GENERIC_STANCE_SUMMARIES.has(summary.trim());
}

export function meaningfulStanceSources(
  sourceIds: string[] | undefined,
  sourceById: Map<string, Source>,
): Source[] {
  return (sourceIds ?? [])
    .filter((id) => !STANCE_PLACEHOLDER_SOURCE_IDS.has(id))
    .map((id) => sourceById.get(id))
    .filter((source): source is Source => Boolean(source));
}

export function clarifyingStanceSummary(stance: Stance): string | null {
  const summary = stance.summary.trim();
  if (!summary || isGenericStanceSummary(summary)) return null;
  return summary;
}

export function formatCouncilVoteMeetingDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function councilVoteTooltipText(event: CouncilVoteEvent): string {
  const items =
    event.agendaItemNumbers?.length ?
      `Agenda item${event.agendaItemNumbers.length > 1 ? "s" : ""} ${event.agendaItemNumbers.join(", ")}:\n\n`
    : "";
  return `${items}${event.agendaText}`;
}
