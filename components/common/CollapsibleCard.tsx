"use client";

import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
} from "@mui/material";

export type CollapsibleCardProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
};

/**
 * Outlined page card that can fold closed. Starts open unless defaultExpanded is false.
 */
export default function CollapsibleCard({
  id,
  eyebrow,
  title,
  defaultExpanded = true,
  children,
}: CollapsibleCardProps) {
  return (
    <Accordion
      id={id}
      defaultExpanded={defaultExpanded}
      disableGutters
      elevation={0}
      slotProps={{
        transition: {
          onEntered: () => {
            window.dispatchEvent(new Event("resize"));
          },
        },
      }}
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        bgcolor: "background.paper",
        mb: { xs: 5, md: 7 },
        "&:before": { display: "none" },
        overflow: "hidden",
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreRoundedIcon aria-hidden />}
        sx={{
          px: { xs: 2.5, md: 3.5 },
          py: { xs: 2, md: 2.5 },
          "& .MuiAccordionSummary-content": { my: 0, overflow: "hidden" },
        }}
      >
        <Stack spacing={title && eyebrow ? 1 : 0} sx={{ minWidth: 0, pr: 1 }}>
          {eyebrow ? (
            <Typography
              component={title ? "p" : "h2"}
              variant="overline"
              sx={{
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: "text.secondary",
              }}
            >
              {eyebrow}
            </Typography>
          ) : null}
          {title ? (
            <Typography component="h2" variant="h3">
              {title}
            </Typography>
          ) : null}
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ px: { xs: 2.5, md: 3.5 }, pb: { xs: 2.5, md: 3.5 }, pt: 0 }}>
        <Stack spacing={2.5}>{children}</Stack>
      </AccordionDetails>
    </Accordion>
  );
}
