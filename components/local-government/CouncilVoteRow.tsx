"use client";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, Chip, Stack, Tooltip, Typography } from "@mui/material";

import type { CouncilVoteDisposition } from "@/content/schema";
import {
  councilVoteTooltipText,
  formatCouncilVoteMeetingDate,
} from "@/lib/local-government/council-votes";
import type { ResolvedCouncilVote } from "@/lib/local-government/council-votes";

const voteChipSx = {
  flexShrink: 0,
  "& .MuiChip-label": {
    display: "inline-flex",
    alignItems: "center",
    lineHeight: 1,
    py: 0,
    transform: "translateY(-1px)",
  },
} as const;

type CouncilVoteRowProps = {
  vote: ResolvedCouncilVote;
  voteForLabel: string;
  voteAgainstLabel: string;
};

function voteLabel(disposition: CouncilVoteDisposition, labels: CouncilVoteRowProps): string {
  return disposition === "for" ? labels.voteForLabel : labels.voteAgainstLabel;
}

export default function CouncilVoteRow({ vote, voteForLabel, voteAgainstLabel }: CouncilVoteRowProps) {
  const { event, disposition } = vote;
  const tooltip = councilVoteTooltipText(event);

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      justifyContent="space-between"
      sx={{ gap: 1 }}
    >
      <Tooltip title={tooltip} arrow placement="top-start">
        <Stack
          direction="row"
          spacing={0.75}
          alignItems="flex-start"
          sx={{ minWidth: 0, cursor: "help" }}
        >
          <InfoOutlinedIcon
            sx={{ fontSize: 16, color: "text.secondary", mt: 0.25, flexShrink: 0 }}
            aria-hidden
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
              {formatCouncilVoteMeetingDate(event.meetingDate)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
              {event.shortLabel}
            </Typography>
          </Box>
        </Stack>
      </Tooltip>
      <Chip
        size="small"
        variant="outlined"
        label={voteLabel(disposition, { vote, voteForLabel, voteAgainstLabel })}
        sx={voteChipSx}
      />
    </Stack>
  );
}
