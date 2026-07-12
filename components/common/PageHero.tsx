import { Box, Container, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

export type PageHeroProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Tertiary content: source links, captions, print actions, etc. */
  meta?: ReactNode;
  maxWidth?: "lg" | "md";
};

/**
 * Full-width page header band: paper background, bottom border,
 * h1, subtitle, and optional meta row. Hierarchy via type, not accent bars.
 */
export default function PageHero({
  title,
  subtitle,
  meta,
  maxWidth = "lg",
}: PageHeroProps) {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Container maxWidth={maxWidth} sx={{ py: { xs: 6, md: 9 } }}>
        <Stack spacing={2} className="ep-motion-hero">
          <Typography component="h1" variant="h2">
            {title}
          </Typography>
          {subtitle != null ? (
            <Typography
              variant="body1"
              color="text.secondary"
              maxWidth="70ch"
              className="ep-motion-hero-delay"
              sx={{ whiteSpace: "pre-line" }}
            >
              {subtitle}
            </Typography>
          ) : null}
          {meta != null ? meta : null}
        </Stack>
      </Container>
    </Box>
  );
}
