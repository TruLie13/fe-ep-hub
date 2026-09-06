"use client";

import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";

import CouncilVoteRow from "@/components/local-government/CouncilVoteRow";
import type { ResolvedCouncilVote } from "@/lib/local-government/council-votes";

const stanceChipSx = {
  "& .MuiChip-label": {
    display: "inline-flex",
    alignItems: "center",
    lineHeight: 1,
    py: 0,
    transform: "translateY(-1px)",
  },
} as const;

export type CollapsibleStanceTopicSource = {
  id: string;
  url: string;
  label: string;
};

export type CollapsibleStanceTopicProps = {
  topicLabel: string;
  chipLabel: string;
  chipColor: "default" | "primary" | "secondary" | "success" | "warning" | "error";
  chipVariant?: "filled" | "outlined";
  /** @default "text.primary" */
  topicLabelColor?: "text.primary" | "text.secondary";
  votes: ResolvedCouncilVote[];
  summary: string | null;
  sources: CollapsibleStanceTopicSource[];
  voteForLabel: string;
  voteAgainstLabel: string;
  /** When false, render a static header row (empty topic slot). */
  expandable: boolean;
  /** @default false */
  defaultExpanded?: boolean;
};

function StanceTopicHeader({
  topicLabel,
  chipLabel,
  chipColor,
  chipVariant,
  topicLabelColor = "text.primary",
}: Pick<
  CollapsibleStanceTopicProps,
  "topicLabel" | "chipLabel" | "chipColor" | "chipVariant" | "topicLabelColor"
>) {
  return (
    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
      <Typography variant="body2" component="span" color={topicLabelColor} sx={{ fontWeight: 600 }}>
        {topicLabel}
      </Typography>
      <Chip
        size="small"
        color={chipColor}
        label={chipLabel}
        variant={chipVariant ?? "filled"}
        sx={stanceChipSx}
      />
    </Stack>
  );
}

function StanceTopicDetails({
  votes,
  summary,
  sources,
  voteForLabel,
  voteAgainstLabel,
}: Pick<
  CollapsibleStanceTopicProps,
  "votes" | "summary" | "sources" | "voteForLabel" | "voteAgainstLabel"
>) {
  return (
    <Stack spacing={1}>
      {votes.length > 0 ? (
        <Stack spacing={1}>
          {votes.map((vote) => (
            <CouncilVoteRow
              key={vote.event.id}
              vote={vote}
              voteForLabel={voteForLabel}
              voteAgainstLabel={voteAgainstLabel}
            />
          ))}
        </Stack>
      ) : null}
      {summary ? (
        <Typography variant="body2" color="text.secondary">
          {summary}
        </Typography>
      ) : null}
      {sources.length > 0 ? (
        <Typography variant="caption" color="text.secondary">
          Source:{" "}
          {sources.slice(0, 1).map((source) => (
            <Link
              key={source.id}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
            >
              {source.label}
              <OpenInNewRoundedIcon sx={{ fontSize: 12 }} />
            </Link>
          ))}
        </Typography>
      ) : null}
    </Stack>
  );
}

/**
 * One issue row on an official card: stance badge always visible; votes/reasoning expand.
 */
export default function CollapsibleStanceTopic({
  topicLabel,
  chipLabel,
  chipColor,
  chipVariant = "filled",
  topicLabelColor = "text.primary",
  votes,
  summary,
  sources,
  voteForLabel,
  voteAgainstLabel,
  expandable,
  defaultExpanded = false,
}: CollapsibleStanceTopicProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  if (!expandable) {
    return (
      <Box sx={{ py: 0.25, minHeight: 36, display: "flex", alignItems: "center" }}>
        <StanceTopicHeader
          topicLabel={topicLabel}
          chipLabel={chipLabel}
          chipColor={chipColor}
          chipVariant={chipVariant}
          topicLabelColor={topicLabelColor}
        />
      </Box>
    );
  }

  return (
    <Accordion
      expanded={expanded}
      onChange={(_, next) => setExpanded(next)}
      disableGutters
      elevation={0}
      sx={{
        bgcolor: "transparent",
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreRoundedIcon sx={{ fontSize: 20 }} aria-hidden />}
        sx={{
          minHeight: 36,
          minWidth: 0,
          px: 0,
          py: 0,
          "&.Mui-expanded": { minHeight: 36 },
          "& .MuiAccordionSummary-content": { my: 0, mr: 1 },
          "& .MuiAccordionSummary-content.Mui-expanded": { my: 0 },
          "& .MuiAccordionSummary-expandIconWrapper": { color: "text.secondary" },
        }}
        aria-label={`${topicLabel}: ${chipLabel}`}
      >
        <StanceTopicHeader
          topicLabel={topicLabel}
          chipLabel={chipLabel}
          chipColor={chipColor}
          chipVariant={chipVariant}
          topicLabelColor={topicLabelColor}
        />
      </AccordionSummary>
      <AccordionDetails sx={{ px: 0, pt: 0.5, pb: 1 }}>
        <StanceTopicDetails
          votes={votes}
          summary={summary}
          sources={sources}
          voteForLabel={voteForLabel}
          voteAgainstLabel={voteAgainstLabel}
        />
      </AccordionDetails>
    </Accordion>
  );
}
