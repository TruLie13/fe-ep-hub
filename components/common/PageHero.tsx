import { Box, Container, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

export type PageHeroProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Tertiary content: source links, captions, print actions, etc. */
  meta?: ReactNode;
  maxWidth?: "lg" | "md";
  showAccent?: boolean;
};

/**
 * Full-width page header band: paper background, bottom border, optional accent bar,
 * h1, subtitle, and optional meta row. Matches the city meetings page hero treatment.
 */
export default function PageHero({
  title,
  subtitle,
  meta,
  maxWidth = "lg",
  showAccent = true,
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
        <Stack spacing={2}>
          {showAccent ? (
            <Box
              sx={{
                width: 48,
                height: 4,
                borderRadius: 1,
                bgcolor: "primary.main",
              }}
              aria-hidden
            />
          ) : null}
          <Typography component="h1" variant="h2">
            {title}
          </Typography>
          {subtitle != null ? (
            <Typography
              variant="body1"
              color="text.secondary"
              maxWidth="70ch"
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
