import { Box, Chip, Stack, Typography } from "@mui/material";
import NextLink from "next/link";
import OutboundProfileLink, {
  instagramHandleFromUrl,
  type OutboundProfileLinkItem,
} from "@/components/common/OutboundProfileLink";
import type { LocalElection2026Candidate, StancePosition } from "@/content/schema";

const stanceChipSx = {
  "& .MuiChip-label": {
    display: "inline-flex",
    alignItems: "center",
    lineHeight: 1,
    py: 0,
    transform: "translateY(-1px)",
  },
} as const;

function stanceColor(position: StancePosition): "default" | "primary" | "secondary" | "success" | "warning" | "error" {
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

function stanceLabel(position: StancePosition, labels: ElectionCandidateRowLabels): string {
  switch (position) {
    case "support":
      return labels.stanceSupports;
    case "oppose":
      return labels.stanceOpposes;
    case "neutral":
      return labels.stanceNeutral;
    default:
      return labels.stanceUnknown;
  }
}

export type ElectionCandidateRowLabels = {
  dataCenterStance: string;
  stanceSupports: string;
  stanceOpposes: string;
  stanceNeutral: string;
  stanceUnknown: string;
  campaignSite: string;
  opensNewTab: string;
  incumbent: string;
  incumbentAria: string;
  removedFromBallot: string;
  removedFromBallotAria: string;
};

type ElectionCandidateRowProps = {
  candidate: LocalElection2026Candidate;
  labels: ElectionCandidateRowLabels;
  isIncumbent?: boolean;
};

export default function ElectionCandidateRow({
  candidate,
  labels,
  isIncumbent = false,
}: ElectionCandidateRowProps) {
  const { dataCenterStance } = candidate;
  const links: OutboundProfileLinkItem[] = [];

  if (candidate.campaignWebsiteUrl) {
    links.push({
      kind: "website",
      href: candidate.campaignWebsiteUrl,
      ariaLabel: `${labels.campaignSite}: ${candidate.displayName} (${labels.opensNewTab})`,
    });
  }

  if (candidate.instagramUrl) {
    const handle = candidate.instagramHandle ?? instagramHandleFromUrl(candidate.instagramUrl);
    links.push({
      kind: "instagram",
      href: candidate.instagramUrl,
      handle,
      ariaLabel: `Instagram: ${candidate.displayName} ${handle} (${labels.opensNewTab})`,
    });
  }

  return (
    <Box
      component="article"
      sx={{
        py: 2.5,
        borderBottom: 1,
        borderColor: "divider",
        "&:last-child": { borderBottom: 0, pb: 0 },
      }}
    >
      <Stack spacing={1.25}>
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ alignItems: "center" }}>
          <Typography component="h3" variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.01em" }}>
            {candidate.displayName}
          </Typography>
          {isIncumbent ? (
            <NextLink
              href="/local-government#city-council"
              aria-label={labels.incumbentAria.replace("{name}", candidate.displayName)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                minHeight: 44,
                textDecoration: "none",
              }}
            >
              <Chip
                component="span"
                size="small"
                label={labels.incumbent}
                sx={{
                  fontWeight: 700,
                  pointerEvents: "none",
                  "& .MuiChip-label": {
                    display: "inline-flex",
                    alignItems: "center",
                    lineHeight: 1,
                    py: 0,
                    transform: "translateY(-1px)",
                  },
                }}
              />
            </NextLink>
          ) : null}
          {candidate.removedFromBallot ? (
            <Chip
              size="small"
              label={labels.removedFromBallot}
              aria-label={labels.removedFromBallotAria.replace("{name}", candidate.displayName)}
              sx={{
                fontWeight: 700,
                "& .MuiChip-label": {
                  display: "inline-flex",
                  alignItems: "center",
                  lineHeight: 1,
                  py: 0,
                  transform: "translateY(-1px)",
                },
              }}
            />
          ) : null}
        </Stack>

        {links.length > 0 ? (
          <Stack direction="row" spacing={1.5} useFlexGap flexWrap="wrap" sx={{ alignItems: "center" }}>
            {links.map((item) => (
              <OutboundProfileLink key={`${item.kind}-${item.href}`} item={item} />
            ))}
          </Stack>
        ) : null}

        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ alignItems: "center" }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            {labels.dataCenterStance}
          </Typography>
          <Chip
            size="small"
            label={stanceLabel(dataCenterStance.position, labels)}
            color={stanceColor(dataCenterStance.position)}
            variant={dataCenterStance.position === "unknown" ? "outlined" : "filled"}
            sx={stanceChipSx}
          />
        </Stack>

        {dataCenterStance.summary ? (
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: "72ch" }}>
            {dataCenterStance.summary}
          </Typography>
        ) : null}
      </Stack>
    </Box>
  );
}
