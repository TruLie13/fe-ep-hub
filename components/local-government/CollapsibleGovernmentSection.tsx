"use client";

import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

export type CollapsibleGovernmentSectionProps = {
  /** Stable key used to persist expanded state across navigations. */
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  /** @default false */
  defaultExpanded?: boolean;
  children: React.ReactNode;
};

const STORAGE_PREFIX = "gov-section-";

/**
 * City / county blocks on the local government page: expand/collapse without losing the section header.
 */
export default function CollapsibleGovernmentSection({
  id,
  eyebrow,
  title,
  description,
  defaultExpanded = false,
  children,
}: CollapsibleGovernmentSectionProps) {
  // Initial render must match SSR: never read sessionStorage in useState (hydration mismatch).
  const [expanded, setExpanded] = useState(defaultExpanded);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(`${STORAGE_PREFIX}${id}`);
      if (raw !== null) {
        const next = raw === "1";
        queueMicrotask(() => {
          setExpanded(next);
        });
      }
    } catch {
      /* unavailable */
    }
  }, [id]);

  const handleChange = useCallback(
    (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded);
      try {
        sessionStorage.setItem(`${STORAGE_PREFIX}${id}`, isExpanded ? "1" : "0");
      } catch {
        /* storage full or unavailable */
      }
    },
    [id],
  );

  return (
    <Accordion
      expanded={expanded}
      onChange={handleChange}
      disableGutters
      elevation={0}
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: "background.paper",
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreRoundedIcon aria-hidden />}
        sx={{
          px: { xs: 2, sm: 2.5 },
          py: { xs: 2, md: 2.5 },
          "& .MuiAccordionSummary-content": { my: 0, overflow: "hidden" },
        }}
      >
        <Stack spacing={eyebrow ? 1 : 0} sx={{ minWidth: 0, pr: 1 }}>
          {eyebrow ? (
            <Typography
              variant="overline"
              sx={{
                fontWeight: 700,
                letterSpacing: "0.16em",
                color: "text.secondary",
              }}
            >
              {eyebrow}
            </Typography>
          ) : null}
          <Typography component="h2" variant="h2" sx={{ maxWidth: "min(22ch, 100%)" }}>
            {title}
          </Typography>
          {description ? (
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: "min(72ch, 100%)" }}>
              {description}
            </Typography>
          ) : null}
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ px: { xs: 2, sm: 2.5 }, pb: { xs: 3, md: 4 }, pt: 0 }}>
        <Box>{children}</Box>
      </AccordionDetails>
    </Accordion>
  );
}
