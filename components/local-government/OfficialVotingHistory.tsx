import { Stack, Typography } from "@mui/material";

import CollapsibleStanceTopic from "@/components/local-government/CollapsibleStanceTopic";
import type { OfficialStanceTopicKey, StancePosition } from "@/content/schema";
import type { OfficialStanceTopicPanel } from "@/lib/local-government/council-votes";

export type OfficialVotingHistoryLabels = {
  votingHistory: string;
  stanceTopicDataCenters: string;
  stanceTopicIncreaseTaxes: string;
  stanceTopicFlockCameras: string;
  stanceSupports: string;
  stanceOpposes: string;
  stanceUnknown: string;
  voteFor: string;
  voteAgainst: string;
};

function stanceColor(
  position: StancePosition,
): "default" | "primary" | "secondary" | "success" | "warning" | "error" {
  switch (position) {
    case "support":
      return "error";
    case "oppose":
      return "success";
    case "neutral":
      return "default";
    default:
      return "default";
  }
}

function stanceLabel(position: StancePosition, labels: OfficialVotingHistoryLabels): string {
  switch (position) {
    case "support":
      return labels.stanceSupports;
    case "oppose":
      return labels.stanceOpposes;
    case "unknown":
      return labels.stanceUnknown;
    default:
      return position;
  }
}

function topicLabel(topicKey: OfficialStanceTopicKey, labels: OfficialVotingHistoryLabels): string {
  switch (topicKey) {
    case "data-center-efficiency":
      return labels.stanceTopicDataCenters;
    case "increase-taxes":
      return labels.stanceTopicIncreaseTaxes;
    case "flock-cameras":
      return labels.stanceTopicFlockCameras;
    default:
      return topicKey;
  }
}

export function isDocumentedStanceTopicPanel(panel: OfficialStanceTopicPanel): boolean {
  return panel.position !== "unknown" || panel.hasDetails;
}

type OfficialVotingHistoryProps = {
  panels: OfficialStanceTopicPanel[];
  labels: OfficialVotingHistoryLabels;
  /** Shown when no documented topics exist (e.g. ask-for-stance CTA). */
  emptyState?: React.ReactNode;
  /** @default true */
  showTitle?: boolean;
  /** Match election challenger stance labels (`text.secondary`). @default "text.primary" */
  topicLabelColor?: "text.primary" | "text.secondary";
};

/**
 * Shared Voting History block for official cards and incumbent election rows.
 * Topic panels should come from `buildOfficialStanceTopicPanels` (local-government data).
 */
export default function OfficialVotingHistory({
  panels,
  labels,
  emptyState,
  showTitle = true,
  topicLabelColor = "text.primary",
}: OfficialVotingHistoryProps) {
  const documented = panels.filter(isDocumentedStanceTopicPanel);

  if (documented.length === 0) {
    return emptyState ? <>{emptyState}</> : null;
  }

  return (
    <Stack spacing={0}>
      {showTitle ? (
        <Typography
          variant="overline"
          sx={{
            display: "block",
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "text.secondary",
            mb: 0.75,
          }}
        >
          {labels.votingHistory}
        </Typography>
      ) : null}
      <Stack spacing={0}>
        {documented.map((panel) => (
          <CollapsibleStanceTopic
            key={panel.topicKey}
            topicLabel={topicLabel(panel.topicKey, labels)}
            chipLabel={stanceLabel(panel.position, labels)}
            chipColor={stanceColor(panel.position)}
            chipVariant={panel.position === "unknown" ? "outlined" : "filled"}
            topicLabelColor={topicLabelColor}
            votes={panel.votes}
            summary={panel.summary}
            sources={panel.sources.map((source) => ({
              id: source.id,
              url: source.url,
              label: source.publisher ?? source.title,
            }))}
            voteForLabel={labels.voteFor}
            voteAgainstLabel={labels.voteAgainst}
            expandable={panel.hasDetails}
          />
        ))}
      </Stack>
    </Stack>
  );
}
