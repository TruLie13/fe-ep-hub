"use client";

import { alpha, useTheme } from "@mui/material/styles";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";

export type FactCardProps = {
  label: string;
  title: string;
  description: string;
  tone?: "default" | "primary" | "warning";
};

/** Flat fact card: label as a simple tag, no heavy filled chips. */
export default function FactCard({ label, title, description, tone = "default" }: FactCardProps) {
  const theme = useTheme();
  const main =
    tone === "warning"
      ? theme.palette.warning.main
      : tone === "primary"
        ? theme.palette.primary.main
        : theme.palette.text.secondary;

  return (
    <Card variant="outlined" sx={{ height: "100%", overflow: "visible" }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Box
            component="span"
            sx={{
              alignSelf: "flex-start",
              px: 1.25,
              py: 0.5,
              borderRadius: 9999,
              typography: "caption",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: main,
              bgcolor: tone === "default" ? theme.palette.action.hover : alpha(main, 0.12),
            }}
          >
            {label}
          </Box>
          <Typography component="h3" variant="h6">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
