import type {
  CouncilVoteDisposition,
  CouncilVoteEvent,
  LocalGovernmentBundle,
  OfficialStanceTopicKey,
  Source,
  Stance,
  StancePosition,
} from "@/content/schema";

export type ResolvedCouncilVote = {
  event: CouncilVoteEvent;
  disposition: CouncilVoteDisposition;
};

/** Ordered topic slots shown on each official card. */
export const OFFICIAL_STANCE_TOPIC_KEYS: OfficialStanceTopicKey[] = [
  "data-center-efficiency",
  "increase-taxes",
  "flock-cameras",
];

/** Roster/contact bibliography IDs — not shown as stance evidence links. */
export const STANCE_PLACEHOLDER_SOURCE_IDS = new Set([
  "el-paso-city-gov",
  "el-paso-county-gov",
]);

const GENERIC_STANCE_SUMMARIES = new Set([
  "Supports data center development in El Paso.",
  "Opposes data center development in El Paso.",
  "Supports continued use of Flock cameras in El Paso.",
  "Opposes continued use of Flock cameras in El Paso.",
  "Supports increasing property taxes for FY 2026-2027.",
  "Opposes increasing property taxes for FY 2026-2027.",
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

export function votesForTopic(
  votes: ResolvedCouncilVote[],
  topicKey: string,
): ResolvedCouncilVote[] {
  return votes.filter((vote) => vote.event.topicKey === topicKey);
}

export function stanceForTopic(stances: Stance[], topicKey: string): Stance | undefined {
  return stances.find((stance) => stance.topicKey === topicKey);
}

export type OfficialStanceTopicPanel = {
  topicKey: OfficialStanceTopicKey;
  stance: Stance | undefined;
  /** Known public position, or `unknown` when undocumented. */
  position: StancePosition;
  votes: ResolvedCouncilVote[];
  summary: string | null;
  sources: Source[];
  /** Whether the row should expand to show votes / reasoning / sources. */
  hasDetails: boolean;
};

export function buildOfficialStanceTopicPanels(
  stances: Stance[],
  votes: ResolvedCouncilVote[],
  sourceById: Map<string, Source>,
): OfficialStanceTopicPanel[] {
  return OFFICIAL_STANCE_TOPIC_KEYS.map((topicKey) => {
    const stance = stanceForTopic(stances, topicKey);
    const topicVotes = votesForTopic(votes, topicKey);
    const knownPosition = Boolean(stance && stance.position !== "unknown");
    const summary = knownPosition && stance ? clarifyingStanceSummary(stance) : null;
    const sources =
      knownPosition && stance ? meaningfulStanceSources(stance.sourceIds, sourceById) : [];
    const position: StancePosition = knownPosition && stance ? stance.position : "unknown";

    return {
      topicKey,
      stance,
      position,
      votes: topicVotes,
      summary,
      sources,
      hasDetails: topicVotes.length > 0 || Boolean(summary) || sources.length > 0,
    };
  });
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
